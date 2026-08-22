const DEMO_PROFILE_KEY = 'pihub-demo-profile';
const DEMO_PRODUCTS_KEY = 'pihub-demo-products-v2';

const DEMO_PRODUCTS = [
  {
    id: 'DEMO-001',
    product_code: 'PIH-001',
    product_title: 'Growth Loan A',
    service: { id: 1, name: { en: 'Working Capital', de: 'Betriebskapital' } },
    industries: [{ id: 1, name: { en: 'Technology', de: 'Technologie' } }],
    states: [{ id: 1, name: 'Berlin' }],
    counties: [{ id: 11, name: 'Berlin Mitte' }],
    min_time_duration: 6,
    max_time_duration: 24,
    min_credit_amount: 50000,
    max_credit_amount: 250000,
    min_sales_creditor: 200000,
    collatoral: 1,
    ratings: [{ name: 'Creditreform', value: 'A' }],
    documents: [],
    status: 'approved'
  },
  {
    id: 'DEMO-002',
    product_code: 'PIH-002',
    product_title: 'Expansion Note B',
    service: { id: 2, name: { en: 'Equipment Loan', de: 'Anlagenfinanzierung' } },
    industries: [{ id: 2, name: { en: 'Healthcare', de: 'Gesundheitswesen' } }],
    states: [{ id: 2, name: 'Hamburg' }],
    counties: [{ id: 21, name: 'Hamburg Mitte' }],
    min_time_duration: 12,
    max_time_duration: 36,
    min_credit_amount: 75000,
    max_credit_amount: 500000,
    min_sales_creditor: 350000,
    collatoral: 1,
    ratings: [{ name: 'Fitch', value: 'BBB+' }],
    documents: [],
    status: 'requested'
  },
  {
    id: 'DEMO-003',
    product_code: 'PIH-003',
    product_title: 'Portfolio Facility C',
    service: { id: 3, name: { en: 'Growth Finance', de: 'Wachstumsfinanzierung' } },
    industries: [{ id: 3, name: { en: 'Manufacturing', de: 'Produktion' } }],
    states: [{ id: 3, name: 'Bavaria' }],
    counties: [{ id: 31, name: 'Munich' }],
    min_time_duration: 18,
    max_time_duration: 48,
    min_credit_amount: 100000,
    max_credit_amount: 750000,
    min_sales_creditor: 500000,
    collatoral: 0,
    ratings: [{ name: "Moody's", value: 'Baa1' }],
    documents: [],
    status: 'invested'
  }
];

const DEMO_CREDITORS = ['Nordstern GmbH', 'Helios Medical AG', 'Rheinwerk Industries'];

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

const valueText = (value, locale = 'en') => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return '';

  const candidates = [value[locale], value.en, value.de, value.label, value.title];
  for (let index = 0; index < candidates.length; index += 1) {
    if (typeof candidates[index] === 'string' || typeof candidates[index] === 'number') {
      return String(candidates[index]);
    }
  }
  return '';
};

const productTitle = product => valueText(product && product.product_title) || 'Demo product';

export const getDemoProfile = () => {
  const stored = safeParse(localStorage.getItem(DEMO_PROFILE_KEY), {});
  const source = stored && typeof stored === 'object' ? stored : {};
  return {
    fname: source.fname || 'Demo',
    lname: source.lname || 'Investor',
    company_name: source.company_name || 'PiHub Demo Investor',
    email: source.email || 'investor@example.com',
    phone_number: source.phone_number || '+49 30 5550100',
    status: 'approved',
    category: source.category || 'bank',
    street_address: source.street_address || 'Investorstrasse 10',
    headquarter: source.headquarter || 'Berlin',
    zip_code: source.zip_code || '10115',
    contact_name_1: source.contact_name_1 || 'Demo Relationship Manager',
    contact_email_1: source.contact_email_1 || 'relationship@example.com',
    contact_phone_no_1: source.contact_phone_no_1 || '+49 30 5550101',
    ...source
  };
};

export const saveDemoProfile = values => {
  const source = values && typeof values === 'object' ? values : {};
  const existing = getDemoProfile();
  const profile = {
    ...existing,
    fname: cleanText(source.fname) || existing.fname,
    lname: cleanText(source.lname) || existing.lname,
    company_name: cleanText(source.company_name) || existing.company_name,
    email: cleanText(source.email).toLowerCase() || existing.email,
    phone_number: cleanText(source.phone_number) || existing.phone_number,
    status: 'approved'
  };

  localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

export const createDemoToken = () =>
  `pihub-demo-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

const normalizeStoredProduct = product => {
  const source = product && typeof product === 'object' ? product : {};
  return {
    ...source,
    product_title: productTitle(source),
    ratings: Array.isArray(source.ratings) ? source.ratings : [],
    documents: Array.isArray(source.documents) ? source.documents : [],
    states: Array.isArray(source.states) ? source.states : [],
    counties: Array.isArray(source.counties) ? source.counties : [],
    industries: Array.isArray(source.industries) ? source.industries : []
  };
};

const readDemoProducts = () => {
  const stored = safeParse(localStorage.getItem(DEMO_PRODUCTS_KEY), null);
  if (Array.isArray(stored) && stored.length) {
    return stored.filter(Boolean).map(normalizeStoredProduct);
  }

  const seeded = DEMO_PRODUCTS.map(product => ({ ...product }));
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(seeded));
  return seeded;
};

const writeDemoProducts = products => {
  const safeProducts = Array.isArray(products) ? products.filter(Boolean).map(normalizeStoredProduct) : [];
  localStorage.setItem(DEMO_PRODUCTS_KEY, JSON.stringify(safeProducts));
  return safeProducts;
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

const makeError = (config, message, code = 'DEMO_ERROR', status = 422) => {
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
  if (typeof data === 'object' && !(typeof FormData !== 'undefined' && data instanceof FormData)) return data;
  if (typeof data === 'string') return safeParse(data, {});
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

const getFilteredProducts = url => {
  const query = getQuery(url);
  const status = cleanText(query.status);
  const search = cleanText(query.product_title).toLowerCase();
  return readDemoProducts().filter(product => {
    if (status && product.status !== status) return false;
    if (search && productTitle(product).toLowerCase().indexOf(search) === -1) return false;
    return true;
  });
};

const getProductById = id => readDemoProducts().find(product => String(product.id) === String(id));

const applicationIdFor = product => `APP-${String(product.id || '').replace('DEMO-', '') || '001'}`;

const buildApplication = product => ({
  id: applicationIdFor(product),
  product_id: product.id,
  requested_by: DEMO_CREDITORS[Math.max(0, readDemoProducts().indexOf(product))] || 'Demo Creditor',
  requested_on: '2026-08-04T09:00:00Z',
  amount: product.min_credit_amount || 100000,
  requested_amount: product.min_credit_amount || 100000,
  deadline: '2026-09-30T00:00:00Z',
  description: 'Demo financing request for evaluating the investor workflow.',
  payment_after: '2026-10-31T00:00:00Z',
  sales: product.min_sales_creditor || 250000,
  status: product.status === 'invested' ? 'invested' : 'requested',
  application_files: [],
  investor_files: [],
  time_duration: product.max_time_duration || 24,
  duration: product.max_time_duration || 24,
  collaterals: [{ name: 'Receivables', value: 'Available' }],
  state: { name: product.states && product.states[0] ? product.states[0].name : 'Berlin' },
  county: { name: product.counties && product.counties[0] ? product.counties[0].name : 'Berlin Mitte' },
  nda_requirement: false,
  service: product.service,
  industries: product.industries,
  ratings: product.ratings
});

const buildCreditRequest = (product, index) => ({
  application_id: applicationIdFor(product),
  product_id: product.id,
  creditor_name: DEMO_CREDITORS[index] || 'Demo Creditor',
  product_title: productTitle(product),
  name: productTitle(product),
  service: product.service,
  created_on: '2026-08-04T09:00:00Z',
  deadline: '2026-09-30T00:00:00Z',
  status: product.status === 'invested' ? 'invested' : 'requested'
});

const buildInvestment = (product, index) => ({
  application_id: applicationIdFor(product),
  product_id: product.id,
  creditor_name: DEMO_CREDITORS[index] || 'Demo Creditor',
  product_title: productTitle(product),
  invested_on: '2026-08-12T10:30:00Z',
  invested_amount: product.min_credit_amount || 100000,
  duration: product.max_time_duration || 24,
  status: 'invested'
});

const extractIdFromPath = path => decodeURIComponent(String(path || '').split('/').filter(Boolean).pop() || '');

export const demoAxiosAdapter = config => {
  const method = String(config.method || 'get').toLowerCase();
  const path = getPath(config.url);

  if (method === 'post' && /\/login$/.test(path)) {
    const body = parseJsonBody(config.data);
    const email = cleanText(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || email.indexOf('@') === -1 || !password) return makeError(config, 'Enter a valid email address and password.');

    saveDemoProfile({ email });
    return makeResponse(config, { message: { token: createDemoToken(), mode: 'demo' } });
  }

  if (method === 'post' && /\/register$/.test(path)) {
    const body = parseJsonBody(config.data);
    const email = cleanText(body.email).toLowerCase();
    if (!email || email.indexOf('@') === -1) return makeError(config, 'Enter a valid email address before creating the demo account.');
    return makeResponse(config, { data: saveDemoProfile(body), message: 'Demo account created successfully.' }, 201);
  }

  if (method === 'get' && /\/me\/notification\/count-new$/.test(path)) return makeResponse(config, { count: 0 });
  if (method === 'get' && /\/me\/notifications$/.test(path)) return makeResponse(config, { data: [], meta: { totalPage: 1 } });
  if (method === 'post' && /\/me\/notification\/read$/.test(path)) return makeResponse(config, { message: 'Notification marked as read.' });

  if (method === 'get' && /\/investor\/invested-products$/.test(path)) {
    const data = readDemoProducts().filter(product => product.status === 'invested').map(buildInvestment);
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/credit-requested-products$/.test(path)) {
    const data = readDemoProducts().filter(product => product.status === 'requested' || product.status === 'invested').map(buildCreditRequest);
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/products\/[^/]+\/applications\/[^/]+$/.test(path)) {
    const parts = path.split('/').filter(Boolean);
    const productId = decodeURIComponent(parts[parts.length - 3]);
    const product = getProductById(productId);
    return product ? makeResponse(config, { data: buildApplication(product) }) : makeError(config, 'Demo application not found.', 'DEMO_NOT_FOUND', 404);
  }

  if (method === 'get' && /\/investor\/products\/[^/]+\/applications$/.test(path)) {
    const parts = path.split('/').filter(Boolean);
    const productId = decodeURIComponent(parts[parts.length - 2]);
    const product = getProductById(productId);
    const data = product ? [buildApplication(product)] : [];
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/products$/.test(path)) {
    const data = getFilteredProducts(config.url);
    return makeResponse(config, { data, meta: { totalPage: 1, currentPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/product\/[^/]+$/.test(path)) {
    const product = getProductById(extractIdFromPath(path));
    return product ? makeResponse(config, { data: product }) : makeError(config, 'Demo product not found.', 'DEMO_NOT_FOUND', 404);
  }

  if (method === 'get' && /\/investor\/creditor-detail\/[^/]+$/.test(path)) {
    const product = readDemoProducts()[0];
    return makeResponse(config, { data: buildApplication(product) });
  }

  if (method === 'get' && /\/me$/.test(path)) return makeResponse(config, { data: getDemoProfile() });

  if (method === 'get' && /\/services$/.test(path)) {
    return makeResponse(config, { data: DEMO_PRODUCTS.map(product => product.service) });
  }

  if (method === 'get' && /\/industries$/.test(path)) {
    return makeResponse(config, { data: DEMO_PRODUCTS.map(product => product.industries[0]) });
  }

  if (method === 'get' && /\/states\/[^/]+\/counties$/.test(path)) {
    const id = path.split('/').filter(Boolean).slice(-2)[0];
    const counties = id === '1' ? [{ id: 11, name: 'Berlin Mitte' }] : id === '2' ? [{ id: 21, name: 'Hamburg Mitte' }] : [{ id: 31, name: 'Munich' }];
    return makeResponse(config, { data: counties });
  }

  if (method === 'get' && /\/states$/.test(path)) {
    return makeResponse(config, { data: [{ id: 1, name: 'Berlin' }, { id: 2, name: 'Hamburg' }, { id: 3, name: 'Bavaria' }] });
  }

  if (method === 'post' && /\/investor\/product$/.test(path)) {
    const id = `DEMO-${Date.now()}`;
    return makeResponse(config, { data: { id }, message: 'Demo product saved.' }, 201);
  }

  if (method === 'delete' && /\/investor\/product\/[^/]+$/.test(path)) {
    const id = extractIdFromPath(path);
    writeDemoProducts(readDemoProducts().filter(product => String(product.id) !== String(id)));
    return makeResponse(config, { message: 'Demo product deleted.' });
  }

  if ((method === 'post' || method === 'put' || method === 'delete') && /\/investor\//.test(path)) {
    return makeResponse(config, { message: 'Demo action completed.' });
  }

  if (method === 'post' && /\/password-reset-token$/.test(path)) {
    return makeResponse(config, { data: { token: 'demo-password-token' }, token: 'demo-password-token', message: 'Demo password token created.' });
  }

  if (method === 'post' && /\/change-password-with-token$/.test(path)) return makeResponse(config, { message: 'Demo password updated.' });
  if (method === 'post' && /\/email-verification$/.test(path)) return makeResponse(config, { message: 'Demo email verified.' });

  if (method === 'get') return makeResponse(config, { data: [], meta: { totalPage: 1 } });
  return makeResponse(config, { message: 'Demo action completed.' });
};
