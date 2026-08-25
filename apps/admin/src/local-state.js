const prefix = 'pihub:admin:demo:v1:';
export const readLocal = (key, fallback) => { try { const raw = localStorage.getItem(prefix + key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
export const writeLocal = (key, value) => { localStorage.setItem(prefix + key, JSON.stringify(value)); return value; };
export const resetLocal = key => localStorage.removeItem(prefix + key);
