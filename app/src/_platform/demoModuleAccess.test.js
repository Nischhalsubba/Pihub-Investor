import { describe, expect, it } from 'vitest';
import { getDemoModuleAccount, getDemoModuleLaunchHref } from './demoModuleAccess';

describe('PiHub unified demo workspace access', () => {
  it('provides the public demo account for each external business workspace', () => {
    expect(getDemoModuleAccount('borrower')?.email).toBe('borrower.demo@pihub.local');
    expect(getDemoModuleAccount('advisory')?.email).toBe('advisory.demo@pihub.local');
    expect(getDemoModuleAccount('investor')).toBeNull();
  });

  it('adds only a non-secret demo handoff marker to an absolute application origin', () => {
    const href = getDemoModuleLaunchHref('borrower', 'https://borrower.example.test/');
    const url = new URL(href);
    expect(url.origin).toBe('https://borrower.example.test');
    expect(url.searchParams.get('pihub_demo_access')).toBe('borrower');
    expect(url.searchParams.get('source')).toBe('investor-access');
    expect(url.search).not.toContain('password');
    expect(url.search).not.toContain('email');
    expect(url.search).not.toContain('token');
  });

  it('refuses relative or unsafe launch targets', () => {
    expect(getDemoModuleLaunchHref('borrower', '/borrower')).toBe('');
    expect(getDemoModuleLaunchHref('advisory', 'javascript:alert(1)')).toBe('');
  });
});
