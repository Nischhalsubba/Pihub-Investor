import { normalizeApplicationId } from './moduleIds';

const ENV_APP_URLS = Object.freeze({
  investor: typeof __PIHUB_INVESTOR_APP_URL__ !== 'undefined' ? __PIHUB_INVESTOR_APP_URL__ : '',
  borrower: typeof __PIHUB_BORROWER_APP_URL__ !== 'undefined' ? __PIHUB_BORROWER_APP_URL__ : '',
  advisory: typeof __PIHUB_ADVISORY_APP_URL__ !== 'undefined' ? __PIHUB_ADVISORY_APP_URL__ : '',
  admin: typeof __PIHUB_ADMIN_APP_URL__ !== 'undefined' ? __PIHUB_ADMIN_APP_URL__ : '',
  access: typeof __PIHUB_ACCESS_APP_URL__ !== 'undefined' ? __PIHUB_ACCESS_APP_URL__ : ''
});

const HOME_PATHS = Object.freeze({
  investor: '/dashboard',
  borrower: '/',
  advisory: '/',
  admin: '/',
  access: '/'
});

const LOGIN_PATHS = Object.freeze({
  investor: '/login',
  borrower: '/login',
  advisory: '/login',
  admin: '/login',
  access: '/'
});

const BUILD_APPLICATION_ID = typeof __PIHUB_MODULE_ID__ !== 'undefined' ? __PIHUB_MODULE_ID__ : 'investor';
const DEFAULT_CURRENT_APPLICATION_ID = normalizeApplicationId(BUILD_APPLICATION_ID) || 'investor';
const owns = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
const isAbsoluteHttpUrl = value => /^https?:\/\//i.test(String(value || '').trim());

export const sanitizeNavigationHref = value => {
  const candidate = String(value || '').trim();
  if (!candidate || candidate.includes('\\')) return '';

  if (candidate.startsWith('/')) {
    if (candidate.startsWith('//')) return '';
    return candidate;
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    return url.toString();
  } catch (error) {
    return '';
  }
};

export const sanitizeAppBase = value => {
  const candidate = String(value || '').trim();
  if (!candidate || candidate.includes('\\')) return '';

  if (candidate.startsWith('/')) {
    if (candidate.startsWith('//')) return '';
    if (candidate === '/') return '';
    return candidate.replace(/\/+$/, '');
  }

  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/+$/, '');
  } catch (error) {
    return '';
  }
};

const joinAppPath = (base, path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!base) return cleanPath;
  if (base.startsWith('/')) return `${base}${cleanPath}`.replace(/\/{2,}/g, '/');
  return new URL(cleanPath.replace(/^\//, ''), `${base}/`).toString();
};

const resolveConfiguredBase = (applicationId, appUrlOverrides = {}) => {
  const raw = owns(appUrlOverrides, applicationId) ? appUrlOverrides[applicationId] : ENV_APP_URLS[applicationId];
  return sanitizeAppBase(raw);
};

export const getCurrentApplicationId = () => DEFAULT_CURRENT_APPLICATION_ID;

export const getApplicationRuntime = (value, options = {}) => {
  const id = normalizeApplicationId(value);
  if (!id) return null;

  const currentApplicationId = normalizeApplicationId(options.currentApplicationId || options.currentModuleId) || DEFAULT_CURRENT_APPLICATION_ID;
  const current = id === currentApplicationId;
  const configuredBase = resolveConfiguredBase(id, options.appUrlOverrides);

  // The current app always owns its own local routes. Absolute origins are only
  // for crossing into another independently deployed PiHub application.
  const base = current ? '' : configuredBase;

  // A different PiHub application must have its own absolute origin. Relative
  // path mounting would let one SPA swallow another application's routes.
  const configured = current || Boolean(base && isAbsoluteHttpUrl(base));

  return Object.freeze({
    id,
    current,
    configured,
    base,
    homeHref: configured ? joinAppPath(base, HOME_PATHS[id]) : '',
    loginHref: configured ? joinAppPath(base, LOGIN_PATHS[id]) : ''
  });
};

export const getApplicationHomeHref = (value, options = {}) => getApplicationRuntime(value, options)?.homeHref || '';
export const getApplicationLoginHref = (value, options = {}) => getApplicationRuntime(value, options)?.loginHref || '';

// Business-module aliases preserve the Phase 1 public API while the runtime
// itself now understands supporting Admin and Access applications as well.
export const getModuleRuntime = getApplicationRuntime;
export const getModuleHomeHref = getApplicationHomeHref;
export const getModuleLoginHref = getApplicationLoginHref;

export const getModuleAccessHref = (value, options = {}) => {
  const runtime = getApplicationRuntime(value, options);
  if (!runtime) return '/login';
  if (runtime.current) return '/login';
  if (runtime.configured) return runtime.loginHref;
  return `/login/${runtime.id}`;
};

export const isAbsoluteNavigationHref = value => isAbsoluteHttpUrl(value);
