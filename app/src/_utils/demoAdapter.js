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
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch (error) { return {}; }
  }
  return {};
};

const number = value => { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; };
const ids = value => String(value || '').split(',').map(item => number(item)).filter(Boolean);
const serviceName = id => ({ 1: 'Working Capital', 2: 'Equipment Loan', 3: 'Growth Finance' }[id] || `Facility ${id}`);
const industryName = id => ({ 1: 'Technology', 2: 'Healthcare', 3: 'Manufacturing' }[id] || `Industry ${id}`);
const stateName = id => ({ 1: 'Berlin', 2: 'Hamburg', 3: 'Bavaria' }[id] || `State ${id}`);
const countyName = id => ({ 11: 'Berlin Mitte', 21: 'Hamburg Mitte', 31: 'Munich' }[id] || `County ${id}`);

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

  if (method === 'get' && /\/me$/.test(path)) {
    const profile = withCompleteDemoProfile(readJson(PROFILE_KEY, {}));
    writeJson(PROFILE_KEY, profile);
    return makeResponse(config, { data: profile });
  }

  if (method === 'post' && /\/investor\/product$/.test(path)) {
    const body = formObject(config.data);
    const products = readJson(PRODUCTS_KEY, []);
    const id = `DEMO-${Date.now()}`;
    const product = productFromForm(body, { id, product_code: `PIH-${String(products.length + 1).padStart(3, '0')}` });
    writeJson(PRODUCTS_KEY, [...products, product]);
    return makeResponse(config, { data: { id }, message: 'Demo opportunity saved locally.' }, 201);
  }

  if (method === 'post' && /\/investor\/product\/[^/]+$/.test(path)) {
    const id = last(path);
    const body = formObject(config.data);
    const products = readJson(PRODUCTS_KEY, []);
    const index = products.findIndex(product => String(product.id) === String(id));
    if (index < 0) return makeError(config, 'Demo opportunity not found.', 404);
    const next = products.slice();
    next[index] = productFromForm(body, products[index]);
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
    const products = readJson(PRODUCTS_KEY, []);
    const action = config.data && config.data.action;
    const next = products.map(product => String(product.id) === String(id) ? { ...product, status: action === 'postpone' ? 'suspended' : action === 'undo_postpone' ? 'approved' : product.status } : product);
    writeJson(PRODUCTS_KEY, next);
    return makeResponse(config, { message: 'Demo status updated locally.' });
  }

  if (method === 'put' && /\/investor\/products\/[^/]+\/applications\/[^/]+$/.test(path)) {
    const parts = path.split('/').filter(Boolean);
    const productId = decodeURIComponent(parts[parts.length - 3]);
    const status = config.data && config.data.status;
    const products = readJson(PRODUCTS_KEY, []);
    const next = products.map(product => String(product.id) === String(productId) ? { ...product, status: status === 'accepted' ? 'invested' : status === 'rejected' ? 'rejected' : product.status } : product);
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
