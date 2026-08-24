import counterpart from 'counterpart';
import en from '../_locale/en';
import de from '../_locale/de';

const STORAGE_KEY = 'pihub-locale';
const LEGACY_KEY = 'language';
const LOCALE_EVENT = 'pihub:locale-changed';
const SUPPORTED = ['en', 'de'];
let registered = false;

export const normalizeLocale = value => {
  const locale = String(value || '').toLowerCase().split('-')[0];
  return SUPPORTED.includes(locale) ? locale : 'en';
};

const register = () => {
  if (registered) return;
  counterpart.registerTranslations('en', en);
  counterpart.registerTranslations('de', de);
  registered = true;
};

export const getLocale = () => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_KEY);
  return normalizeLocale(stored || (typeof navigator !== 'undefined' ? navigator.language : 'en'));
};

export const setLocale = value => {
  register();
  const locale = normalizeLocale(value);
  const previous = counterpart.getLocale ? normalizeLocale(counterpart.getLocale()) : null;
  counterpart.setLocale(locale);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale);
    window.localStorage.removeItem(LEGACY_KEY);
    document.documentElement.lang = locale;
    if (previous !== locale) window.dispatchEvent(new CustomEvent(LOCALE_EVENT, { detail: { locale } }));
  }
  return locale;
};

export const initializeLocale = () => setLocale(getLocale());
export const translate = (key, options) => {
  register();
  return counterpart.translate(key, options);
};
export const localeEventName = LOCALE_EVENT;
