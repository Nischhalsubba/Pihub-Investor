const SIDEBAR_KEY = 'pihub-sidebar-collapsed-v1';
const RECENT_KEY = 'pihub-recent-workspace-v1';
const DENSITY_KEY = 'pihub-table-density-v1';

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return value;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* preference writes are non-critical */ }
  return value;
};

export const getSidebarCollapsed = () => Boolean(readJson(SIDEBAR_KEY, false));
export const setSidebarCollapsed = value => writeJson(SIDEBAR_KEY, Boolean(value));

export const getTableDensity = (scope = 'workspace') => {
  const stored = readJson(DENSITY_KEY, {});
  const value = stored && stored[scope];
  return value === 'compact' ? 'compact' : 'comfortable';
};

export const setTableDensity = (scope, value) => {
  const nextValue = value === 'compact' ? 'compact' : 'comfortable';
  const stored = readJson(DENSITY_KEY, {});
  writeJson(DENSITY_KEY, { ...(stored && typeof stored === 'object' ? stored : {}), [scope || 'workspace']: nextValue });
  return nextValue;
};

const normalizeRecent = item => ({
  id: String(item && (item.id || item.path) || ''),
  type: String(item && item.type || 'page'),
  label: String(item && item.label || 'Workspace page'),
  meta: String(item && item.meta || ''),
  path: String(item && item.path || '/dashboard'),
  visitedAt: Number(item && item.visitedAt) || Date.now()
});

export const getRecentWorkspaceItems = () => {
  const stored = readJson(RECENT_KEY, []);
  return Array.isArray(stored) ? stored.filter(Boolean).map(normalizeRecent).slice(0, 8) : [];
};

export const rememberWorkspaceItem = item => {
  if (!item || !item.path) return getRecentWorkspaceItems();
  const normalized = normalizeRecent({ ...item, visitedAt: Date.now() });
  const current = getRecentWorkspaceItems();
  const next = [normalized, ...current.filter(existing => existing.path !== normalized.path)].slice(0, 8);
  writeJson(RECENT_KEY, next);
  return next;
};

export const clearRecentWorkspaceItems = () => writeJson(RECENT_KEY, []);
