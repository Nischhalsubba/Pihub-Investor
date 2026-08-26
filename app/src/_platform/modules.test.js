import { describe, expect, it } from 'vitest';
import { getNavigableModules, PLATFORM_ACCESS_APPLICATIONS, PLATFORM_MODULES, readDeclaredModuleIds } from './modules';

describe('PiHub platform module registry', () => {
  it('keeps three business modules and exposes Admin only on central access', () => {
    expect(PLATFORM_MODULES.map(item => item.id)).toEqual(['investor', 'borrower', 'advisory']);
    expect(PLATFORM_ACCESS_APPLICATIONS.map(item => item.id)).toEqual(['investor', 'borrower', 'advisory', 'admin']);
    expect(PLATFORM_ACCESS_APPLICATIONS.find(item => item.id === 'admin')?.support).toBe(true);
  });

  it('keeps the current Investor app as the safe navigation default', () => {
    expect(getNavigableModules(undefined).map(module => module.id)).toEqual(['investor']);
  });

  it('normalizes business-module aliases from an explicit permission contract', () => {
    const profile = { permissions: { modules: [{ id: 'lender' }, { module: 'origination' }, { name: 'structuring' }] } };
    expect([...readDeclaredModuleIds(profile)].sort()).toEqual(['advisory', 'borrower', 'investor']);
  });

  it('does not expose a permitted module when its independent origin is unavailable', () => {
    const profile = { available_modules: ['investor', 'borrower', 'advisory'] };
    expect(getNavigableModules(profile, { borrower: '', advisory: '' }).map(module => module.id)).toEqual(['investor']);
  });

  it('exposes permitted modules through independent application origins', () => {
    const profile = { module_access: { investor: true, borrower: true, advisory: true } };
    const modules = getNavigableModules(profile);
    expect(modules.map(module => module.id)).toEqual(['investor', 'borrower', 'advisory']);
    expect(modules.find(module => module.id === 'borrower')?.href).toBe('https://pihub-borrower-nischhalsubbas-projects.vercel.app/');
    expect(modules.find(module => module.id === 'advisory')?.href).toBe('https://pihub-advisory-nischhalsubbas-projects.vercel.app/');
  });

  it('supports explicit origin overrides and rejects relative or executable targets', () => {
    const profile = { available_modules: ['investor', 'borrower', 'advisory'] };
    expect(getNavigableModules(profile, { borrower: 'https://borrower.example.test', advisory: 'https://advisory.example.test' }).find(item => item.id === 'borrower')?.href).toBe('https://borrower.example.test/');
    expect(getNavigableModules(profile, { borrower: '/borrower', advisory: 'javascript:alert(1)' }).map(item => item.id)).toEqual(['investor']);
  });
});
