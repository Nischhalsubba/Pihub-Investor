const VERSION = 3;
const keyFor = scope => `pihub-saved-views-v3:${scope}`;
const legacyKeys = scope => scope === 'opportunities'
  ? ['pihub-opportunity-saved-views-v2', 'pihub-opportunity-saved-views-v1']
  : [];

const canStore = () => typeof window !== 'undefined' && window.localStorage;
const now = () => new Date().toISOString();
const makeId = name => `${String(name || 'view').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'view'}-${Date.now().toString(36)}`;

const parse = (value, fallback) => {
  try { return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
};

const normalizeItem = item => {
  if (!item || typeof item !== 'object') return null;
  const name = String(item.name || '').trim();
  if (!name) return null;
  const createdAt = item.createdAt || now();
  return {
    id: String(item.id || makeId(name)),
    name,
    view: item.view && typeof item.view === 'object' ? { ...item.view } : {},
    visibleColumns: Array.isArray(item.visibleColumns) ? item.visibleColumns.filter(Boolean) : [],
    density: item.density === 'compact' ? 'compact' : 'comfortable',
    createdAt,
    updatedAt: item.updatedAt || createdAt
  };
};

const emptyStore = () => ({ version: VERSION, scope: 'browser', defaultId: null, items: [] });

const migrateLegacy = scope => {
  if (!canStore()) return emptyStore();
  for (const key of legacyKeys(scope)) {
    const legacy = parse(window.localStorage.getItem(key), null);
    if (Array.isArray(legacy) && legacy.length) {
      const items = legacy.map(normalizeItem).filter(Boolean);
      const store = { ...emptyStore(), items };
      window.localStorage.setItem(keyFor(scope), JSON.stringify(store));
      legacyKeys(scope).forEach(oldKey => window.localStorage.removeItem(oldKey));
      return store;
    }
  }
  return emptyStore();
};

export const readSavedViewStore = scope => {
  if (!canStore()) return emptyStore();
  const stored = parse(window.localStorage.getItem(keyFor(scope)), null);
  if (!stored || Number(stored.version) !== VERSION || !Array.isArray(stored.items)) return migrateLegacy(scope);
  const items = stored.items.map(normalizeItem).filter(Boolean).slice(-24);
  const defaultId = items.some(item => item.id === stored.defaultId) ? stored.defaultId : null;
  return { version: VERSION, scope: 'browser', defaultId, items };
};

const write = (scope, store) => {
  const safe = { version: VERSION, scope: 'browser', defaultId: store.defaultId || null, items: (store.items || []).map(normalizeItem).filter(Boolean).slice(-24) };
  if (canStore()) window.localStorage.setItem(keyFor(scope), JSON.stringify(safe));
  return safe;
};

export const listSavedViews = scope => readSavedViewStore(scope).items;
export const getDefaultSavedView = scope => {
  const store = readSavedViewStore(scope);
  return store.items.find(item => item.id === store.defaultId) || null;
};

export const saveSavedView = (scope, payload) => {
  const store = readSavedViewStore(scope);
  const normalized = normalizeItem(payload);
  if (!normalized) return store;
  const existing = store.items.find(item => item.id === normalized.id || item.name.toLowerCase() === normalized.name.toLowerCase());
  const item = existing
    ? { ...existing, ...normalized, id: existing.id, createdAt: existing.createdAt, updatedAt: now() }
    : { ...normalized, updatedAt: now() };
  const items = [...store.items.filter(entry => entry.id !== item.id && entry.name.toLowerCase() !== item.name.toLowerCase()), item];
  return write(scope, { ...store, items });
};

export const renameSavedView = (scope, id, name) => {
  const store = readSavedViewStore(scope);
  const clean = String(name || '').trim();
  if (!clean) return store;
  return write(scope, { ...store, items: store.items.map(item => item.id === id ? { ...item, name: clean, updatedAt: now() } : item) });
};

export const deleteSavedView = (scope, id) => {
  const store = readSavedViewStore(scope);
  return write(scope, { ...store, defaultId: store.defaultId === id ? null : store.defaultId, items: store.items.filter(item => item.id !== id) });
};

export const setDefaultSavedView = (scope, id) => {
  const store = readSavedViewStore(scope);
  return write(scope, { ...store, defaultId: store.items.some(item => item.id === id) ? id : null });
};

export const exportSavedViews = scope => JSON.stringify(readSavedViewStore(scope), null, 2);
export const importSavedViews = (scope, raw) => {
  const payload = typeof raw === 'string' ? parse(raw, null) : raw;
  if (!payload || !Array.isArray(payload.items)) throw new Error('Saved view file is not valid PiHub view data.');
  const incoming = payload.items.map(normalizeItem).filter(Boolean);
  const store = readSavedViewStore(scope);
  const byName = new Map(store.items.map(item => [item.name.toLowerCase(), item]));
  incoming.forEach(item => byName.set(item.name.toLowerCase(), item));
  return write(scope, { ...store, items: Array.from(byName.values()) });
};

export const savedViewShareUrl = (view, location = window.location) => {
  const base = new URL(location.href);
  const params = new URLSearchParams();
  const source = view && view.view ? view.view : view || {};
  if (source.status) params.set('status', source.status);
  if (source.product_title) params.set('q', source.product_title);
  if (source.sort && source.sort !== 'title') params.set('sort', source.sort);
  if (source.dir === 'desc') params.set('dir', 'desc');
  base.pathname = '/products';
  base.search = params.toString();
  base.hash = '';
  return base.toString();
};
