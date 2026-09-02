import en from '../_locale/en';
import de from '../_locale/de';

const STORAGE_KEY = 'pihub-locale';
const LEGACY_KEY = 'language';
const LOCALE_EVENT = 'pihub:locale-changed';
const SUPPORTED = ['en', 'de'];
const BLOCKED_PATH_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor']);
const TRANSLATIONS = Object.freeze({ en, de });
let activeLocale = 'en';

export const normalizeLocale = value => {
  const locale = String(value || '').toLowerCase().split('-')[0];
  return SUPPORTED.includes(locale) ? locale : 'en';
};

const lookup = (dictionary, key) => {
  const segments = String(key || '').split('.').filter(Boolean);
  if (!segments.length || segments.some(segment => BLOCKED_PATH_SEGMENTS.has(segment))) return undefined;

  let value = dictionary;
  for (const segment of segments) {
    if (!value || typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, segment)) return undefined;
    value = value[segment];
  }
  return value;
};

const resolvePlural = (value, options = {}) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  if (typeof options.count !== 'number') return value;
  if (options.count === 0 && Object.prototype.hasOwnProperty.call(value, 'zero')) return value.zero;
  if (options.count === 1 && Object.prototype.hasOwnProperty.call(value, 'one')) return value.one;
  if (Object.prototype.hasOwnProperty.call(value, 'other')) return value.other;
  return value;
};

const interpolate = (value, options = {}) => String(value).replace(
  /%\{([A-Za-z0-9_]+)\}|\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g,
  (match, percentKey, braceKey) => {
    const key = percentKey || braceKey;
    return Object.prototype.hasOwnProperty.call(options, key) ? String(options[key]) : match;
  },
);

export const getLocale = () => {
  if (typeof window === 'undefined') return activeLocale;
  const stored = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_KEY);
  return normalizeLocale(stored || (typeof navigator !== 'undefined' ? navigator.language : activeLocale));
};

export const setLocale = value => {
  const locale = normalizeLocale(value);
  const previous = activeLocale;
  activeLocale = locale;

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale);
    window.localStorage.removeItem(LEGACY_KEY);
    document.documentElement.lang = locale;
    if (previous !== locale) window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: { locale } }));
  }
  return locale;
};

export const initializeLocale = () => setLocale(getLocale());

export const translate = (key, options = {}) => {
  const localeDictionary = TRANSLATIONS[activeLocale] || TRANSLATIONS.en;
  let value = resolvePlural(lookup(localeDictionary, key), options);
  if (value === undefined && activeLocale !== 'en') value = resolvePlural(lookup(TRANSLATIONS.en, key), options);
  if (typeof value !== 'string' && typeof value !== 'number') return String(key || '');
  return interpolate(value, options);
};

export const localeEventName = LOCALE_EVENT;
