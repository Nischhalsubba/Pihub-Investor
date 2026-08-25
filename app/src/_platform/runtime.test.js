import { describe, expect, it } from 'vitest';
import {
  getModuleAccessHref,
  getModuleHomeHref,
  getModuleLoginHref,
  getModuleRuntime,
  sanitizeAppBase,
  sanitizeNavigationHref
} from './runtime';

describe('PiHub platform runtime routing', () => {
  it('keeps Investor as the current application without requiring an external origin', () => {
    const runtime = getModuleRuntime('investor');
    expect(runtime?.current).toBe(true);
    expect(runtime?.configured).toBe(true);
    expect(runtime?.homeHref).toBe('/dashboard');
    expect(runtime?.loginHref).toBe('/login');
  });

  it('does not configure another module until it has its own absolute application origin', () => {
    expect(getModuleRuntime('borrower')?.configured).toBe(false);
    expect(getModuleRuntime('advisory')?.configured).toBe(false);
    expect(getModuleHomeHref('borrower')).toBe('');
    expect(getModuleLoginHref('advisory')).toBe('');
  });

  it('builds cross-application destinations from an absolute module origin', () => {
    const options = { appUrlOverrides: { borrower: 'https://borrower.example.test/' } };
    expect(getModuleHomeHref('borrower', options)).toBe('https://borrower.example.test/');
    expect(getModuleLoginHref('borrower', options)).toBe('https://borrower.example.test/login');
    expect(getModuleAccessHref('borrower', options)).toBe('https://borrower.example.test/login');
  });

  it('refuses to treat a relative future-module path as an independently configured application', () => {
    const runtime = getModuleRuntime('borrower', { appUrlOverrides: { borrower: '/borrower' } });
    expect(runtime?.configured).toBe(false);
    expect(runtime?.homeHref).toBe('');
    expect(getModuleAccessHref('borrower', { appUrlOverrides: { borrower: '/borrower' } })).toBe('/login/borrower');
  });

  it('uses local access-selection routes only as a safe pre-deployment fallback', () => {
    expect(getModuleAccessHref('investor')).toBe('/login');
    expect(getModuleAccessHref('borrower')).toBe('/login/borrower');
    expect(getModuleAccessHref('advisory')).toBe('/login/advisory');
  });

  it('rejects executable, protocol-relative and credential-bearing destinations', () => {
    expect(sanitizeNavigationHref('javascript:alert(1)')).toBe('');
    expect(sanitizeNavigationHref('//evil.example.test')).toBe('');
    expect(sanitizeAppBase('https://user:pass@borrower.example.test')).toBe('');
    expect(sanitizeAppBase('data:text/html,hello')).toBe('');
  });
});
