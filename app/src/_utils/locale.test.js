import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getLocale, localeEventName, normalizeLocale, setLocale, translate } from './locale';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = 'en';
  setLocale('en');
});

describe('local PiHub translation runtime', () => {
  it('normalizes supported locales and falls back to English', () => {
    expect(normalizeLocale('de-DE')).toBe('de');
    expect(normalizeLocale('fr-FR')).toBe('en');
  });

  it('translates nested English and German dictionary keys', () => {
    setLocale('en');
    expect(translate('column.category')).toBe('Category');
    setLocale('de');
    expect(translate('column.category')).toBe('Kategorie');
  });

  it('falls back to the key for unknown or unsafe prototype paths', () => {
    expect(translate('missing.translation.key')).toBe('missing.translation.key');
    expect(translate('__proto__.polluted')).toBe('__proto__.polluted');
    expect(translate('constructor.prototype.polluted')).toBe('constructor.prototype.polluted');
  });

  it('persists locale, updates document language, and emits the canonical event', () => {
    const listener = vi.fn();
    window.addEventListener(localeEventName, listener);
    setLocale('de');
    expect(getLocale()).toBe('de');
    expect(localStorage.getItem('pihub-locale')).toBe('de');
    expect(document.documentElement.lang).toBe('de');
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(localeEventName, listener);
  });
});
