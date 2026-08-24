import { demoAxiosAdapter as legacyDemoAxiosAdapter } from './demoMode';
import { withCompleteDemoProfile } from './demoProfileData';

const PRODUCTS_KEY = 'pihub-demo-products-v2';
const PROFILE_KEY = 'pihub-demo-profile';
const NOTIFICATIONS_KEY = 'pihub-demo-notifications-v1';
const pathOf = url => String(url || '').split('?')[0].replace(/\/$/, '');
const methodOf = config => String(config.method || 'get').toLowerCase();
const last = path => decodeURIComponent(String(path).split('/').filter(Boolean).pop() || '');

const readJson = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
};
const writeJson = (key, value) => { localStorage.setItem(key, JSON.stringify(value)); return value; };

const DEMO_NOTIFICATIONS = [
  { id: 'NTF-001', title: 'Credit request awaiting review', notification: 'Nordstern GmbH submitted Expansion Note B for review.', message: 'Decision deadline is 30 September 2026.', is_read: 0, icon: 'bx bx-receipt', link: '/credit-requests/DEMO-002/APP-002', time: 'Today · 09:12' },
  { id: 'NTF-002', title: 'Portfolio position funded', notification: 'Portfolio Facility C moved into the invested portfolio.', message: '€100,000 is now included in deployed capital.', is_read: 0, icon: 'bx bx-line-chart', link: '/positions/DEMO-003/APP-003', time: 'Yesterday · 16:40' },
  { id: 'NTF-003', title: 'Compliance review completed', notification: 'Institution compliance review completed successfully.', message: 'KYC and AML evidence remains current.', is_read: 0, icon: 'bx bx-shield-quarter', link: '/user/profile', time: '22 Aug · 14:08' },
  { id: 'NTF-004', title: 'Opportunity approved', notification: 'Growth Loan A is approved and available for decision workflows.', message: 'All screening facts are complete.', is_read: 1, icon: 'bx bx-check-circle', link: '/opportunities/DEMO-001', time: '20 Aug · 11:30' },
  { id: 'NTF-005', title: 'Security session recorded', notification: 'A new authenticated workspace session was recorded.', message: 'No action is required.', is_read: 1, icon: 'bx bx-lock-alt', link: '/user/profile', time: '19 Aug · 08:45' }
];

const CREDIT_META = {
  'DEMO-002': { application_id: 'APP-002', creditor: 'Nordstern GmbH', deadline: '2026-09-30T16:00:00Z', requested_on: '2026-08-18T09:10:00Z', amount: 280000, risk: 'BBB+' },
  'DEMO-003': { application_id: 'APP-003', creditor: 'Helios Medical AG', deadline: '2026-08-30T16:00:00Z', requested_on: '2026-07-20T08:35:00Z', amount: 100000, risk: 'Baa1' },
  'DEMO-005': { application_id: 'APP-005', creditor: 'RheinLogistik GmbH', deadline: '2026-08-27T16:00:00Z', requested_on: '2026-08-21T10:20:00Z', amount: 210000, risk: 'A2' },
  'DEMO-006': { application_id: 'APP-006', creditor: 'Vector Exporttechnik AG', deadline: '2026-09-15T16:00:00Z', requested_on: '2026-05-02T11:00:00Z', amount: 140000, risk: 'BBB' },
  'DEMO-007': { application_id: 'APP-007', creditor: 'Atlas Networks GmbH', deadline: '2026-10-12T16:00:00Z', requested_on: '2026-07-28T13:15:00Z', amount: 220000, risk: 'Baa2' },
  'DEMO-008': { application_id: 'APP-008', creditor: 'HanseCare Kliniken GmbH', deadline: '2026-08-24T16:00:00Z', requested_on: '2026-08-19T07:45:00Z', amount: 650000, risk: 'BBB+' }
};

const INVESTMENT_META = {
  'DEMO-003': { invested_on: '2026-03-12T09:00:00Z', invested_amount: 100000, duration: 48 },
  'DEMO-006': { invested_on: '2026-05-18T10:30:00Z', invested_amount: 140000, duration: 30 },
  'DEMO-007': { invested_on: '2026-08-12T14:20:00Z', invested_amount: 220000, duration: 42 }
};

const readNotifications = () => {
  const stored = readJson(NOTIFICATIONS_KEY, null);
  if (Array.isArray(stored) && stored.length) return stored;
  return writeJson(NOTIFICATIONS_KEY, DEMO_NOTIFICATIONS.map(item => ({ ...item })));
};

const formObject = data => {
  const result = {};
  if (typeof FormData !== 'undefined' && data instanceof FormData) data.forEach((value, key) => { if (typeof File !== 'undefined' && value instanceof File) return; result[key] = value; });
  return result;
};

const bodyObject = data => {
  if (!data) return {};
  if (typeof data === 'object' && !(typeof FormData !== 'undefined' && data instanceof FormData)) return data;
  if (typeof data === 'string') { try { return JSON.parse(data); } catch (error) { return {}; } }
  return {};
};

const number = value => { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; };
const ids = value => String(value || '').split(',').map(item => number(item)).filter(Boolean);
const serviceName = id => ({ 1: 'Working Capital', 2: 'Equipment Loan', 3: 'Growth Finance' }[id] || `Facility ${id}`);
const industryName = id => ({ 1: 'Technology', 2: 'Healthcare', 3: 'Manufacturing', 4: 'Logistics', 5: 'Industrial Technology' }[id] || `Industry ${id}`);
const stateName = id => ({ 1: 'Berlin', 2: 'Hamburg', 3: 'Bavaria', 4: 'Hesse', 5: 'North Rhine-Westphalia' }[id] || `State ${id}`);
const countyName = id => ({ 11: 'Berlin Mitte', 21: 'Hamburg Mitte', 31: 'Munich', 41: 'Frankfurt', 51: 'Düsseldorf' }[id] || `County ${id}`);

const makeResponse = (config, data, status = 200) => Promise.resolve({ data, status, statusText: status >= 200 && status < 300 ? 'OK' : 'Error', headers: { 'content-type': 'application/json' }, config, request: null });
const makeError = (config, message, status = 501) => {
  const error = new Error(message);
  error.config = config;
  error.response = { data: { error: { code: 'DEMO_UNSUPPORTED', message } }, status, statusText: 'Error', headers: {}, config, request: null };
  return Promise.reject(error);
};

const productFromForm = (body, existing = {}) => {
  const serviceId = number(body.service_id) || (existing.service && existing.service.id) || 1;
  const stateIds = ids(body.state_ids);
  const countyIds = ids(body.county_ids);
  const industryIds = ids(body.industry_ids);
  let ratings = existing.ratings || [];
  try { if (body.ratings) ratings = JSON.parse(body.ratings); } catch (error) { /* keep existing */ }
  return {
    ...existing,
    product_title: body.product_title || existing.product_title || 'Demo opportunity',
    service: { id: serviceId, name: { en: serviceName(serviceId), de: serviceName(serviceId) } },
    industries: (industryIds.length ? industryIds : [1]).map(id => ({ id, name: { en: industryName(id), de: industryName(id) } })),
    states: (stateIds.length ? stateIds : [1]).map(id => ({ id, name: stateName(id) })),
    counties: (countyIds.length ? countyIds : [11]).map(id => ({ id, name: countyName(id) })),
    min_time_duration: number(body.min_time_duration) || existing.min_time_duration || 12,
    max_time_duration: number(body.max_time_duration) || existing.max_time_duration || 24,
    min_credit_amount: number(body.min_credit_amount) || existing.min_credit_amount || 250000,
    max_credit_amount: number(body.max_credit_amount) || existing.max_credit_amount || 500000,
    min_sales_creditor: number(body.min_sales_creditor),
    collatoral: String(body.collatoral) === '1' ? 1 : 0,
    ratings: Array.isArray(ratings) ? ratings : [],
    documents: existing.documents || [],
    status: existing.status || 'approved'
  };
};

const demoCreditRequest = product => {
  const meta = CREDIT_META[String(product.id)] || {};
  const applicationId = meta.application_id || `APP-${String(product.id).replace(/\D/g, '').padStart(3, '0')}`;
  return {
    id: applicationId,
    application_id: applicationId,
    product_id: product.id,
    product_title: product.product_title,
    creditor_name: meta.creditor || 'Demo Creditor GmbH',
    requested_by: meta.creditor || 'Demo Creditor GmbH',
    requested_amount: meta.amount || product.min_credit_amount,
    amount: meta.amount || product.min_credit_amount,
    deadline: meta.deadline || '2026-09-30T16:00:00Z',
    requested_on: meta.requested_on || '2026-08-18T09:10:00Z',
    created_on: meta.requested_on || '2026-08-18T09:10:00Z',
    service: product.service,
    industries: product.industries,
    ratings: product.ratings,
    risk_rating: meta.risk || (product.ratings && product.ratings[0] && product.ratings[0].value) || 'Medium',
    status: product.status
  };
};

const demoInvestment = product => {
  const credit = demoCreditRequest(product);
  const meta = INVESTMENT_META[String(product.id)] || {};
  return {
    ...credit,
    status: 'invested',
    invested_on: meta.invested_on || '2026-08-12T14:20:00Z',
    invested_amount: meta.invested_amount || product.min_credit_amount,
    amount: meta.invested_amount || product.min_credit_amount,
    duration: meta.duration || product.max_time_duration
  };
};

const demoApplicationDetail = (product, applicationId) => {
  const request = demoCreditRequest(product);
  return {
    id: applicationId || request.application_id,
    product_id: product.id,
    requested_by: request.creditor_name,
    requested_on: request.requested_on,
    amount: request.requested_amount,
    deadline: request.deadline,
    description: `Financing request for ${product.product_title}.`,
    payment_after: '2026-10-31T16:00:00Z',
    sales: Math.max(Number(product.min_sales_creditor) || 0, (Number(request.requested_amount) || 0) * 4),
    status: product.status === 'invested' ? 'accepted' : product.status === 'rejected' ? 'rejected' : 'requested',
    application_files: [],
    time_duration: product.max_time_duration,
    collaterals: product.collatoral ? [{ name: 'Collateral requirement', value: 'Required' }] : [{ name: 'Collateral requirement', value: 'Not required' }],
    state: product.states && product.states[0] ? product.states[0] : { name: '—' },
    county: product.counties && product.counties[0] ? product.counties[0] : { name: '—' },
    nda_requirement: true,
    service: product.service,
    industries: product.industries,
    ratings: (product.ratings || []).map(rating => ({ name: rating.name || 'Rating', value: rating.value || '—' }))
  };
};

const supportedRead = path => [
  /\/me\/notification\/count-new$/,
  /\/me\/notifications$/,
  /\/investor\/invested-products$/,
  /\/investor\/credit-requested-products$/,
  /\/investor\/products\/[^/]+\/applications\/[^/]+$/,
  /\/investor\/products\/[^/]+\/applications$/,
  /\/investor\/products$/,
  /\/investor\/product\/[^/]+$/,
  /\/investor\/creditor-detail\/[^/]+$/,
  /\/me$/,
  /\/services$/,
  /\/industries$/,
  /\/states\/[^/]+\/counties$/,
  /\/states$/
].some(regex => regex.test(path));

export const demoAxiosAdapter = config => {
  const path = pathOf(config.url);
  const method = methodOf(config);
  const products = () => readJson(PRODUCTS_KEY, []).filter(Boolean);

  if (method === 'get' && /\/me\/notification\/count-new$/.test(path)) {
    const unread = readNotifications().filter(item => Number(item.is_read) === 0).length;
    return makeResponse(config, { count: unread });
  }

  if (method === 'get' && /\/me\/notifications$/.test(path)) {
    const data = readNotifications();
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'post' && /\/me\/notification\/read$/.test(path)) {
    const body = bodyObject(config.data);
    const wanted = new Set((Array.isArray(body.notification_ids) ? body.notification_ids : []).map(String));
    const next = readNotifications().map(item => wanted.has(String(item.id)) ? { ...item, is_read: 1 } : item);
    writeJson(NOTIFICATIONS_KEY, next);
    return makeResponse(config, { message: 'Notification status updated locally.' });
  }

  if (method === 'get' && /\/investor\/credit-requested-products$/.test(path)) {
    const data = products().filter(product => ['requested', 'invested', 'rejected'].includes(product.status)).map(demoCreditRequest);
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/invested-products$/.test(path)) {
    const data = products().filter(product => product.status === 'invested').map(demoInvestment);
    return makeResponse(config, { data, meta: { totalPage: 1, total: data.length } });
  }

  if (method === 'get' && /\/investor\/products\/[^/]+\/applications\/[^/]+$/.test(path)) {
    const parts = path.split('/').filter(Boolean);
    const productId = decodeURIComponent(parts[parts.length - 3]);
    const applicationId = decodeURIComponent(parts[parts.length - 1]);
    const product = products().find(item => String(item.id) === String(productId));
    return product ? makeResponse(config, { data: demoApplicationDetail(product, applicationId) }) : makeError(config, 'Demo application not found.', 404);
  }

  if (method === 'get' && /\/me$/.test(path)) {
    const profile = withCompleteDemoProfile(readJson(PROFILE_KEY, {}));
    writeJson(PROFILE_KEY, profile);
    return makeResponse(config, { data: profile });
  }

  if (method === 'post' && /\/investor\/product$/.test(path)) {
    const body = formObject(config.data);
    const current = products();
    const id = `DEMO-${Date.now()}`;
    const product = productFromForm(body, { id, product_code: `PIH-${String(current.length + 1).padStart(3, '0')}` });
    writeJson(PRODUCTS_KEY, [...current, product]);
    return makeResponse(config, { data: { id }, message: 'Demo opportunity saved locally.' }, 201);
  }

  if (method === 'post' && /\/investor\/product\/[^/]+$/.test(path)) {
    const id = last(path);
    const body = formObject(config.data);
    const current = products();
    const index = current.findIndex(product => String(product.id) === String(id));
    if (index < 0) return makeError(config, 'Demo opportunity not found.', 404);
    const next = current.slice();
    next[index] = productFromForm(body, current[index]);
    writeJson(PRODUCTS_KEY, next);
    return makeResponse(config, { data: next[index], message: 'Demo opportunity updated locally.' });
  }

  if (method === 'post' && /\/me$/.test(path)) {
    const body = formObject(config.data);
    const existing = readJson(PROFILE_KEY, {});
    const next = withCompleteDemoProfile({ ...existing, ...body, status: 'approved' });
    delete next._method;
    writeJson(PROFILE_KEY, next);
    return makeResponse(config, { data: next, message: 'Demo profile updated locally.' });
  }

  if (method === 'put' && /\/investor\/products\/[^/]+\/status$/.test(path)) {
    const id = path.split('/').filter(Boolean).slice(-2)[0];
    const current = products();
    const action = config.data && config.data.action;
    const next = current.map(product => String(product.id) === String(id) ? { ...product, status: action === 'postpone' ? 'suspended' : action === 'undo_postpone' ? 'approved' : product.status } : product);
    writeJson(PRODUCTS_KEY, next);
    return makeResponse(config, { message: 'Demo status updated locally.' });
  }

  if (method === 'put' && /\/investor\/products\/[^/]+\/applications\/[^/]+$/.test(path)) {
    const parts = path.split('/').filter(Boolean);
    const productId = decodeURIComponent(parts[parts.length - 3]);
    const status = config.data && config.data.status;
    const current = products();
    const next = current.map(product => String(product.id) === String(productId) ? { ...product, status: status === 'accepted' ? 'invested' : status === 'rejected' ? 'rejected' : product.status } : product);
    writeJson(PRODUCTS_KEY, next);
    return makeResponse(config, { message: 'Demo decision updated locally.' });
  }

  const explicitlySupportedWrite =
    (method === 'post' && /\/(login|register|me\/notification\/read|password-reset-token|change-password-with-token|email-verification)$/.test(path)) ||
    (method === 'delete' && /\/investor\/product\/[^/]+$/.test(path)) ||
    (method === 'post' && /\/investor\/products\/[^/]+\/applications\/[^/]+\/files$/.test(path));

  if (method === 'get' && !supportedRead(path)) return makeError(config, `Demo mode does not implement GET ${path}.`);
  if (method !== 'get' && !explicitlySupportedWrite) return makeError(config, `Demo mode does not implement ${method.toUpperCase()} ${path}.`);
  return legacyDemoAxiosAdapter(config);
};
