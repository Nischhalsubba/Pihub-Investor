const DEMO_PROFILE_KEY = 'pihub-demo-profile';
const DEMO_PRODUCTS_KEY = 'pihub-demo-products';

const DEMO_PRODUCTS = [
  {
    id: 'DEMO-001',
    product_title: { en: 'Growth Loan A', de: 'Wachstumskredit A' },
    service: { id: 1, name: { en: 'Working Capital', de: 'Betriebskapital' } },
    industries: [{ id: 1, name: { en: 'Technology', de: 'Technologie' } }],
    states: [],
    counties: [],
    min_time_duration: 6,
    max_time_duration: 24,
    min_credit_amount: 50000,
    max_credit_amount: 250000,
    status: 'approved'
  },
  {
    id: 'DEMO-002',
    product_title: { en: 'Expansion Note B', de: 'Expansionsdarlehen B' },
    service: { id: 2, name: { en: 'Equipment Loan', de: 'Anlagenfinanzierung' } },
    industries: [{ id: 2, name: { en: 'Healthcare', de: 'Gesundheitswesen' } }],
    states: [],
    counties: [],
    min_time_duration: 12,
    max_time_duration: 36,
    min_credit_amount: 75000,
    max_credit_amount: 500000,
    status: 'requested'
  },
  {
    id: 'DEMO-003',
    product_title: { en: 'Portfolio Facility C', de: 'Portfoliofazilitaet C' },
    service: { id: 3, name: { en: 'Growth Finance', de: 'Wachstumsfinanzierung' } },
    industries: [{ id: 3, name: { en: 'Manufacturing', de: 'Produktion' } }],
    states: [],
    counties: [],
    min_time_duration: 18,
    max_time_duration: 48,
    min_credit_amount: 100000,
    max_credit_amount: 750000,
    status: 'invested'
  }
];

const parseBoolean = value => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on';
};

export const isDemoMode = () => parseBoolean(process.env.REACT_APP_DEMO);

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const cleanText = value => (typeof value === 'string' ? value.trim() : '');

export const getDemoProfile = () => {
  const stored = safeParse(localStorage.getItem(DEMO_PROFILE_KEY), {});
  return stored && typeof stored === 'object' ? stored : {};
};

export const saveDemoProfile = values => {
  const source = values && typeof values === 'object' ? values : {};
  const existing = getDemoProfile();
  const profile = {
    ...existing,
    fname: cleanText(source.fname) || existing.fname || 'Demo',
    lname: cleanText(source.lname) || existing.lname || 'Investor',
    company_name: cleanText(source.company_name) || existing.company_name || 'PiHub Demo',
    email: cleanText(source.email).toLowerCase() || existing.email || 'investor@example.com',
    phone_number: cleanText(source.phone_number) || existing.phone_number || ''
  };

  // Passwords are intentionally never stored in demo mode.
  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

export const createDemoToken = () =>
  `pihub-demo-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

const readDemoProducts = () => {
  const stored = safeParse(localStorage.getItem(DEMO_PRODUCTS_KEY), null);
  if (Array.isArray(stored) && stored.length) {
    return stored;
  }

  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(DEMO_PRODUCTS));
  return DEMO_PRODUCTS.slice();
};

const makeResponse = (config, data, status = 200) =>
  Promise.resolve({
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config,
    request: null
  });

const makeError = (config, message, code = 'DEMO_AUTH_ERROR', status = 422) => {
  const error = new Error(message);
  error.config = config;
  error.response = {
    data: { error: { code, message } },
    status,
    statusText: 'Error',
    headers: { 'content-type': 'application/json' },
    config,
    request: null
  };
  return Promise.reject(error);
};

const parseJsonBody = data => {
  if (!data) return {};
  if (typeof data === 'object' && !(typeof FormData !== 'undefined' && data instanceof FormData)) {
    return data;
  }
  if (typeof data === 'string') {
    return safeParse(data, {});
  }
  return {};
};

const getPath = url => String(url || '').split('?')[0].replace(/\/$/, '');

const getQuery = url => {
  const query = String(url || '').split('?')[1] || '';
  return query.split('&').reduce((result, pair) => {
    if (!pair) return result;
    const parts = pair.split('=');
    const key = decodeURIComponent(parts[0] || '');
    const value = decodeURIComponent(parts.slice(1).join('=') || '');
    if (key) result[key] = value;
    return result;
  }, {});
};

const localizedTitle = product => {
  const title = product && product.product_title;
  if (typeof title === 'string') return title;
  if (title && typeof title === 'object') return title.en || title.de || '';
  return '';
};

const getFilteredProducts = url => {
  const query = getQuery(url);
  const status = cleanText(query.status);
  const search = cleanText(query.product_title).toLowerCase();
  return readDemoProducts().filter(product => {
    if (status && product.status !== status) return false;
    if (search && localizedTitle(product).toLowerCase().indexOf(search) === -1) return false;
    return true;
  });
};

export const demoAxiosAdapter = config => {
  const method = String(config.method || 'get').toLowerCase();
  const path = getPath(config.url);

  if (method === 'post' && /\/login$/.test(path)) {
    const body = parseJsonBody(config.data);
    const email = cleanText(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || email.indexOf('@') === -1 || !password) {
      return makeError(config, 'Enter a valid email address and password.');
    }

    saveDemoProfile({ email });
    return makeResponse(config, {
      message: {
        token: createDemoToken(),
        mode: 'demo'
      }
    });
  }

  if (method === 'post' && /\/register$/.test(path)) {
    const body = parseJsonBody(config.data);
    const email = cleanText(body.email).toLowerCase();
    if (!email || email.indexOf('@') === -1) {
      return makeError(config, 'Enter a valid email address before creating the demo account.');
    }

    const profile = saveDemoProfile(body);
    return makeResponse(config, {
      data: profile,
      message: 'Demo account created successfully.'
    }, 201);
  }

  if (method === 'get' && /\/me\/notification\/count-new$/.test(path)) {
    return makeResponse(config, { count: 0 });
  }

  if (method === 'get' && /\/me\/notifications$/.test(path)) {
    return makeResponse(config, { data: [], meta: { totalPage: 1 } });
  }

  if (method === 'post' && /\/me\/notification\/read$/.test(path)) {
    return makeResponse(config, { message: 'Notification marked as read.' });
  }

  if (method === 'get' && /\/investor\/invested-products$/.test(path)) {
    const data = readDemoProducts().filter(product => product.status === 'invested');
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/credit-requested-products$/.test(path)) {
    const data = readDemoProducts().filter(product => product.status === 'requested');
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/products$/.test(path)) {
    const data = getFilteredProducts(config.url);
    return makeResponse(config, { data, meta: { totalPage: 1, currentPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/product\/[^/]+$/.test(path)) {
    const id = decodeURIComponent(path.split('/').pop());
    const product = readDemoProducts().find(item => String(item.id) === String(id));
    return product
      ? makeResponse(config, { data: product })
      : makeError(config, 'Demo product not found.', 'DEMO_NOT_FOUND', 404);
  }

  if (method === 'get' && /\/me$/.test(path)) {
    return makeResponse(config, { data: getDemoProfile() });
  }

  if (method === 'get' && /\/services$/.test(path)) {
    return makeResponse(config, {
      data: [
        { id: 1, name: 'Working Capital' },
        { id: 2, name: 'Equipment Loan' },
        { id: 3, name: 'Growth Finance' }
      ]
    });
  }

  if (method === 'get' && /\/industries$/.test(path)) {
    return makeResponse(config, {
      data: [
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Healthcare' },
        { id: 3, name: 'Manufacturing' }
      ]
    });
  }

  if (method === 'get' && /\/states$/.test(path)) {
    return makeResponse(config, { data: [] });
  }

  if (method === 'post' && /\/investor\/product$/.test(path)) {
    return makeResponse(config, { data: { id: `DEMO-${Date.now()}` }, message: 'Demo product saved.' }, 201);
  }

  if ((method === 'post' || method === 'put' || method === 'delete') && /\/investor\//.test(path)) {
    return makeResponse(config, { message: 'Demo action completed.' });
  }

  if (method === 'post' && (/\/password-reset-token$/.test(path) || /\/change-password-with-token$/.test(path))) {
    return makeResponse(config, { message: 'Demo password action completed.' });
  }

  if (method === 'post' && /\/email-verification$/.test(path)) {
    return makeResponse(config, { message: 'Demo email verified.' });
  }

  // Demo mode must never fall through to the retired external API. Return a
  // harmless empty success shape for legacy read endpoints instead.
  if (method === 'get') {
    return makeResponse(config, { data: [], meta: { totalPage: 1 } });
  }

  return makeResponse(config, { message: 'Demo action completed.' });
};
