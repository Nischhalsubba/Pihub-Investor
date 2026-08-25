import { normalizeModuleId } from './moduleIds';

const ENV_APP_URLS = Object.freeze({
  investor: typeof __PIHUB_INVESTOR_APP_URL__ !== 'undefined' ? __PIHUB_INVESTOR_APP_URL__ : '',
  borrower: typeof __PIHUB_BORROWER_APP_URL__ !== 'undefined' ? __PIHUB_BORROWER_APP_URL__ : '',
  advisory: typeof __PIHUB_ADVISORY_APP_URL__ !== 'undefined' ? __PIHUB_ADVISORY_APP_URL__ : ''
});

const HOME_PATHS = Object.freeze({
  investor: '/dashboard',
  borrower: '/',
  advisory: '/'
});

const LOGIN_PATHS = Object.freeze({
  investor: '/login',
  borrower: '/login',
  advisory: '/login'
});

const BUILD_MODULE_ID = typeof __PIHUB_MODULE_ID__ !== 'undefined' ? __PIHUB_MODULE_ID__ : 'investor';
const DEFAULT_CURRENT_MODULE_ID = normalizeModuleId(BUILD_MODULE_ID) || 'investor';
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

const resolveConfiguredBase = (moduleId, appUrlOverrides = {}) => {
  const raw = owns(appUrlOverrides, moduleId) ? appUrlOverrides[moduleId] : ENV_APP_URLS[moduleId];
  return sanitizeAppBase(raw);
};

export const getCurrentModuleId = () => DEFAULT_CURRENT_MODULE_ID;

export const getModuleRuntime = (value, options = {}) => {
  const id = normalizeModuleId(value);
  if (!id) return null;

  const currentModuleId = normalizeModuleId(options.currentModuleId) || DEFAULT_CURRENT_MODULE_ID;
  const current = id === currentModuleId;
  const configuredBase = resolveConfiguredBase(id, options.appUrlOverrides);

  // The current app always owns its own local routes. Absolute origins are only
  // for crossing into another independently deployed PiHub application.
  const base = current ? '' : configuredBase;

  // A different PiHub application must have its own absolute origin. Relative
  // path mounting would let one SPA swallow another module's routes and defeats
  // the isolation contract this registry exists to enforce.
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

export const getModuleHomeHref = (value, options = {}) => getModuleRuntime(value, options)?.homeHref || '';

export const getModuleLoginHref = (value, options = {}) => getModuleRuntime(value, options)?.loginHref || '';

export const getModuleAccessHref = (value, options = {}) => {
  const runtime = getModuleRuntime(value, options);
  if (!runtime) return '/login';
  if (runtime.current) return runtime.id === 'investor' ? '/login' : `/login/${runtime.id}`;
  if (runtime.configured) return runtime.loginHref;
  return `/login/${runtime.id}`;
};

export const isAbsoluteNavigationHref = value => isAbsoluteHttpUrl(value);
