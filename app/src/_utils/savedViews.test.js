import { beforeEach, describe, expect, it } from 'vitest';
import { deleteSavedView, exportSavedViews, getDefaultSavedView, importSavedViews, listSavedViews, readSavedViewStore, renameSavedView, saveSavedView, savedViewShareUrl, setDefaultSavedView } from './savedViews';

const scope = 'opportunities';

beforeEach(() => localStorage.clear());

describe('saved views v3', () => {
  it('saves renames defaults and deletes a view', () => {
    let store = saveSavedView(scope, { name: 'Due soon', view: { status: 'requested', sort: 'credit', dir: 'desc' }, visibleColumns: ['credit', 'status'], density: 'compact' });
    expect(store.items).toHaveLength(1);
    const id = store.items[0].id;
    renameSavedView(scope, id, 'Priority queue');
    setDefaultSavedView(scope, id);
    expect(getDefaultSavedView(scope)?.name).toBe('Priority queue');
    expect(listSavedViews(scope)[0].density).toBe('compact');
    deleteSavedView(scope, id);
    expect(readSavedViewStore(scope).items).toHaveLength(0);
    expect(getDefaultSavedView(scope)).toBeNull();
  });

  it('exports and imports portable view data', () => {
    saveSavedView(scope, { name: 'Technology', view: { product_title: 'tech' }, visibleColumns: ['facility'], density: 'comfortable' });
    const json = exportSavedViews(scope);
    localStorage.clear();
    importSavedViews(scope, json);
    expect(listSavedViews(scope).map(item => item.name)).toEqual(['Technology']);
  });

  it('creates a shareable URL from URL-safe view state', () => {
    const url = savedViewShareUrl({ view: { status: 'approved', product_title: 'growth', sort: 'credit', dir: 'desc' } }, { href: 'https://example.test/dashboard' });
    expect(url).toBe('https://example.test/products?status=approved&q=growth&sort=credit&dir=desc');
  });
});
