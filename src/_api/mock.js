const rawDemoFlag = (process.env.REACT_APP_DEMO || '').toLowerCase();
const demoEnabled = ['1', 'true', 'yes', 'on'].includes(rawDemoFlag);
const demoDelayMs = Number(process.env.REACT_APP_DEMO_DELAY_MS || 150);

const publicUrl = process.env.PUBLIC_URL || '';
const assetUrl = (path) => `${publicUrl}${path.startsWith('/') ? '' : '/'}${path}`;

const base64UrlEncode = (value) => {
  const json = JSON.stringify(value);
  const base64 =
    typeof btoa === 'function'
      ? btoa(json)
      : typeof Buffer !== 'undefined'
      ? Buffer.from(json, 'utf8').toString('base64')
      : '';
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const createDemoToken = () => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
  const payload = { exp, scopes: ['approved_scope'] };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.demo`;
};

const demoToken = createDemoToken();

const demoServices = [
  { id: 1, name: { en: 'Working Capital', de: 'Betriebsmittel' } },
  { id: 2, name: { en: 'Equipment Loan', de: 'Ausrustungskredit' } }
];

const demoIndustries = [
  { id: 1, name: { en: 'Technology', de: 'Technologie' } },
  { id: 2, name: { en: 'Healthcare', de: 'Gesundheitswesen' } },
  { id: 3, name: { en: 'Manufacturing', de: 'Fertigung' } }
];

const demoProducts = [
  {
    id: 101,
    product_title: 'Growth Loan A',
    service: demoServices[0],
    industries: [demoIndustries[0], demoIndustries[2]],
    min_time_duration: 6,
    max_time_duration: 24,
    min_credit_amount: 50000,
    max_credit_amount: 250000,
    status: 'open',
    min_sales_creditor: 500000,
    collatoral: true,
    product_code: 'CT-101',
    investor: { name: 'Pihub Capital' },
    states: [{ name: 'Berlin' }],
    counties: [{ name: 'Mitte' }],
    ratings: [{ name: 'S&P', value: 'A' }],
    documents: [
      {
        file_name: 'financials.pdf',
        file_type: 'pdf',
        path: '/mock/financials.pdf'
      }
    ]
  },
  {
    id: 102,
    product_title: 'Expansion Note B',
    service: demoServices[1],
    industries: [demoIndustries[1]],
    min_time_duration: 12,
    max_time_duration: 36,
    min_credit_amount: 75000,
    max_credit_amount: 500000,
    status: 'approved',
    min_sales_creditor: 750000,
    collatoral: false,
    product_code: 'CT-102',
    investor: { name: 'Pihub Capital' },
    states: [{ name: 'Hamburg' }],
    counties: [{ name: 'Altona' }],
    ratings: [{ name: 'Moodys', value: 'A1' }],
    documents: []
  }
];

const demoApplicationsByProduct = {
  101: [
    {
      id: 9001,
      requested_by: 'Meyer GmbH',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      duration: 12,
      requested_amount: 120000,
      status: 'open'
    },
    {
      id: 9002,
      requested_by: 'Kraft AG',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      duration: 18,
      requested_amount: 200000,
      status: 'invested'
    }
  ],
  102: [
    {
      id: 9003,
      requested_by: 'Nordic Labs',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
      duration: 9,
      requested_amount: 85000,
      status: 'open'
    }
  ]
};

const demoApplicationDetails = {
  '101-9001': {
    requested_by: 'Meyer GmbH',
    requested_on: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    amount: 120000,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    description: 'Working capital to expand production capacity.',
    duration: 12,
    payment_after: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    sales: 1250000,
    status: 'open',
    application_files: [
      {
        file_name: 'application.pdf',
        file_type: 'pdf',
        path: '/mock/application.pdf'
      }
    ],
    investor_files: [
      {
        file_name: 'investor-notes.pdf',
        file_type: 'pdf',
        path: '/mock/investor-notes.pdf'
      }
    ],
    time_duration: 12,
    collaterals: [
      { name: 'Inventory', value: 'EUR 200,000' },
      { name: 'Equipment', value: 'EUR 150,000' }
    ],
    state: { name: 'Berlin' },
    county: { name: 'Mitte' },
    nda_requirement: false,
    service: demoServices[0],
    industries: [demoIndustries[0]],
    rating_for_credit: true,
    ratings: [
      { name: 'S&P', value: 'A' },
      { name: 'Moody`s', value: 'A2' }
    ]
  }
};

const demoCreditRequests = [
  {
    creditor_name: 'Meyer GmbH',
    product_title: demoProducts[0].product_title,
    service: demoServices[0],
    created_on: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    status: 'open',
    product_id: 101,
    application_id: 9001,
    name: demoProducts[0].product_title
  }
];

const demoInvestedList = [
  {
    creditor_name: 'Kraft AG',
    product_title: demoProducts[0].product_title,
    invested_on: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    invested_amount: 180000,
    duration: 18,
    product_id: 101,
    application_id: 9002
  }
];

const demoNotifications = [
  { id: 1, notification: 'New credit request received.', is_read: 0 },
  { id: 2, notification: 'Your product was approved.', is_read: 1 }
];

const demoProfile = {
  fname: 'Alex',
  lname: 'Muller',
  company_name: 'Pihub Capital',
  email: 'investor@pihub-demo.com',
  phone_number: '+49 30 123456',
  status: 'approved',
  category: 'bank',
  company_logo_link: assetUrl('/assets/img/profile-picture.png'),
  contact_email_1: 'contact@pihub-demo.com',
  contact_email_2: 'ops@pihub-demo.com',
  contact_email_3: 'legal@pihub-demo.com',
  contact_phone_no_1: '+49 30 111111',
  contact_phone_no_2: '+49 30 222222',
  contact_phone_no_3: '+49 30 333333',
  document_link: '',
  contact_name_1: 'Lena Schwarz',
  contact_name_2: 'Jonas Weiss',
  contact_name_3: 'Mara Vogel',
  facebook_link: 'https://facebook.com',
  linked_in_link: 'https://linkedin.com',
  twitter_link: 'https://twitter.com',
  street_address: 'Unter den Linden 1',
  headquarter: 'Berlin',
  zip_code: '10117'
};

const demoStates = [
  { id: 1, name: 'Berlin' },
  { id: 2, name: 'Hamburg' },
  { id: 3, name: 'Bayern' }
];

const demoCountiesByState = {
  1: [{ id: 11, name: 'Mitte' }, { id: 12, name: 'Charlottenburg' }],
  2: [{ id: 21, name: 'Altona' }, { id: 22, name: 'Eimsbuttel' }],
  3: [{ id: 31, name: 'Munchen' }, { id: 32, name: 'Nurnberg' }]
};

const normalizePath = (url) => {
  try {
    const base =
      typeof window !== 'undefined' && window.location
        ? window.location.origin
        : 'http://localhost';
    return new URL(url, base).pathname;
  } catch (e) {
    return url || '';
  }
};

const respond = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: payload }), demoDelayMs);
  });

export const isDemo = () => demoEnabled;

export const mockRequest = (method, url, body) => {
  const path = normalizePath(url);
  const verb = (method || 'get').toLowerCase();

  if (verb === 'post' && /\/login$/.test(path)) {
    return respond({ message: { token: demoToken } });
  }

  if (verb === 'post' && /\/register$/.test(path)) {
    return respond({ message: 'registered' });
  }

  if (verb === 'post' && /\/password-reset-token$/.test(path)) {
    return respond({ token: 'demo-reset-token' });
  }

  if (verb === 'post' && /\/change-password-with-token$/.test(path)) {
    return respond({ message: 'password-updated' });
  }

  if (verb === 'post' && /\/email-verification$/.test(path)) {
    return respond({ message: 'verified' });
  }

  if (verb === 'get' && /\/industries$/.test(path)) {
    return respond({ data: demoIndustries });
  }

  if (verb === 'get' && /\/services$/.test(path)) {
    return respond({ data: demoServices });
  }

  if (verb === 'get' && /\/states\/?$/.test(path)) {
    return respond({ data: demoStates });
  }

  const countiesMatch = path.match(/\/states\/(\d+)\/counties$/);
  if (verb === 'get' && countiesMatch) {
    const stateId = Number(countiesMatch[1]);
    return respond({ data: demoCountiesByState[stateId] || [] });
  }

  if (verb === 'get' && /\/me\/notifications/.test(path)) {
    return respond({ data: demoNotifications });
  }

  if (verb === 'get' && /\/me\/notification\/count-new$/.test(path)) {
    const unreadCount = demoNotifications.filter((n) => n.is_read === 0).length;
    return respond(unreadCount);
  }

  if (verb === 'post' && /\/me\/notification\/read$/.test(path)) {
    return respond({ message: 'updated' });
  }

  if (verb === 'get' && /\/me$/.test(path)) {
    return respond({ data: demoProfile });
  }

  if (verb === 'post' && /\/download-token$/.test(path)) {
    return respond({ token: 'demo-download-token' });
  }

  if (verb === 'get' && /\/investor\/invested-products$/.test(path)) {
    return respond({ data: demoInvestedList });
  }

  if (verb === 'get' && /\/investor\/credit-requested-products$/.test(path)) {
    return respond({
      data: demoCreditRequests,
      meta: { current_page: 1, last_page: 1 }
    });
  }

  if (verb === 'get' && /\/investor\/products$/.test(path)) {
    return respond({
      data: demoProducts,
      meta: { current_page: 1, last_page: 1 }
    });
  }

  const productDetailMatch = path.match(/\/investor\/product\/(\d+)$/);
  if (verb === 'get' && productDetailMatch) {
    const id = Number(productDetailMatch[1]);
    const product = demoProducts.find((p) => p.id === id) || demoProducts[0];
    return respond({ data: product });
  }

  if (verb === 'post' && /\/investor\/product$/.test(path)) {
    return respond({ message: 'created' });
  }

  if (verb === 'post' && /\/investor\/product\/\d+$/.test(path)) {
    return respond({ message: 'updated' });
  }

  if (verb === 'delete' && /\/investor\/product\/\d+$/.test(path)) {
    return respond({ message: 'deleted' });
  }

  if (verb === 'put' && /\/investor\/products\/\d+\/status$/.test(path)) {
    return respond({ message: 'status-updated' });
  }

  const applicationListMatch = path.match(/\/investor\/products\/(\d+)\/applications$/);
  if (verb === 'get' && applicationListMatch) {
    const productId = Number(applicationListMatch[1]);
    return respond({ data: demoApplicationsByProduct[productId] || [] });
  }

  const applicationDetailMatch = path.match(/\/investor\/products\/(\d+)\/applications\/(\d+)/);
  if (verb === 'get' && applicationDetailMatch) {
    const productId = Number(applicationDetailMatch[1]);
    const applicationId = Number(applicationDetailMatch[2]);
    const key = `${productId}-${applicationId}`;
    return respond({ data: demoApplicationDetails[key] || demoApplicationDetails['101-9001'] });
  }

  if (verb === 'put' && /\/investor\/products\/\d+\/applications\/\d+$/.test(path)) {
    return respond({ message: 'application-status-updated' });
  }

  if (verb === 'post' && /\/investor\/products\/\d+\/applications\/\d+\/files$/.test(path)) {
    return respond({ message: 'files-uploaded' });
  }

  if (verb === 'get' && /\/investor\/creditor-detail\/\d+$/.test(path)) {
    return respond({ data: demoApplicationDetails['101-9001'] });
  }

  return respond({ data: [], meta: { current_page: 1, last_page: 1 } });
};
