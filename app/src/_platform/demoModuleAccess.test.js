import { describe, expect, it } from 'vitest';
import { getDemoModuleAccount, getDemoModuleLaunchHref } from './demoModuleAccess';

describe('PiHub unified demo workspace access', () => {
  it('provides one documented demo account for each accessible application', () => {
    expect(getDemoModuleAccount('investor')?.email).toBe('investor.demo@pihub.local');
    expect(getDemoModuleAccount('borrower')?.email).toBe('borrower.demo@pihub.local');
    expect(getDemoModuleAccount('advisory')?.email).toBe('advisory.demo@pihub.local');
    expect(getDemoModuleAccount('admin')?.email).toBe('admin.demo@pihub.local');
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

  it('supports Admin handoff without turning Admin into a business module', () => {
    const href = getDemoModuleLaunchHref('admin', 'https://admin.example.test/');
    expect(new URL(href).searchParams.get('pihub_demo_access')).toBe('admin');
  });

  it('refuses relative or unsafe launch targets', () => {
    expect(getDemoModuleLaunchHref('borrower', '/borrower')).toBe('');
    expect(getDemoModuleLaunchHref('advisory', 'javascript:alert(1)')).toBe('');
    expect(getDemoModuleLaunchHref('admin', 'https://user:pass@admin.example.test')).toBe('');
  });
});
