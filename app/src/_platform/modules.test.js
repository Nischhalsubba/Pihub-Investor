import { describe, expect, it } from 'vitest';
import { getNavigableModules, readDeclaredModuleIds } from './modules';

describe('PiHub platform module registry', () => {
  it('keeps the current Investor app as the safe default', () => {
    expect(getNavigableModules(undefined).map(module => module.id)).toEqual(['investor']);
  });

  it('normalizes business-module aliases from an explicit permission contract', () => {
    const profile = {
      permissions: {
        modules: [{ id: 'lender' }, { module: 'origination' }, { name: 'structuring' }]
      }
    };

    expect([...readDeclaredModuleIds(profile)].sort()).toEqual(['advisory', 'borrower', 'investor']);
  });

  it('does not expose future modules before a real application location exists', () => {
    const profile = { available_modules: ['investor', 'borrower', 'advisory'] };
    expect(getNavigableModules(profile).map(module => module.id)).toEqual(['investor']);
  });

  it('exposes only permitted modules when independent application origins are configured', () => {
    const profile = { module_access: { investor: true, borrower: true, advisory: true } };
    const modules = getNavigableModules(profile, {
      borrower: 'https://borrower.example.test',
      advisory: 'https://advisory.example.test'
    });

    expect(modules.map(module => module.id)).toEqual(['investor', 'borrower', 'advisory']);
    expect(modules.find(module => module.id === 'borrower')?.href).toBe('https://borrower.example.test/');
  });

  it('rejects a relative cross-module override so Investor cannot own Borrower routes', () => {
    const profile = { available_modules: ['investor', 'borrower'] };
    const modules = getNavigableModules(profile, { borrower: '/borrower' });
    expect(modules.map(module => module.id)).toEqual(['investor']);
  });

  it('rejects unsafe cross-module destinations', () => {
    const profile = { available_modules: ['investor', 'advisory'] };
    const modules = getNavigableModules(profile, { advisory: 'javascript:alert(1)' });
    expect(modules.map(module => module.id)).toEqual(['investor']);
  });
});
