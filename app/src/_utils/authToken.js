const TOKEN_KEY = 'token';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

export function normalizeToken(token) {
  if (typeof token !== 'string') return null;
  const value = token.trim();
  if (!value || value === 'undefined' || value === 'null') return null;
  return value;
}

export function decodeJwtPayload(token) {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) return null;

  try {
    const payload = normalizedToken.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(character => `%${('00' + character.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) return true;

  const payload = decodeJwtPayload(normalizedToken);
  if (!payload || payload.exp === undefined || payload.exp === null) {
    // Opaque bearer tokens cannot be expiry-checked in the browser. The API's
    // 401 response remains authoritative and clears the local session.
    return false;
  }

  const expiresAt = Number(payload.exp) * 1000;
  return Number.isFinite(expiresAt) ? expiresAt <= Date.now() : false;
}

export function setStoredToken(token) {
  const normalizedToken = normalizeToken(token);
  const storage = getStorage();
  if (!storage || !normalizedToken) return false;
  storage.setItem(TOKEN_KEY, normalizedToken);
  // Remove the old persistent token if a user is upgrading from a previous UI.
  window.localStorage.removeItem(TOKEN_KEY);
  return true;
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;

  // One-time migration from the legacy persistent token. It is moved rather
  // than copied so a browser restart no longer keeps the bearer credential.
  const storage = getStorage();
  let token = normalizeToken(storage && storage.getItem(TOKEN_KEY));
  if (!token) {
    token = normalizeToken(window.localStorage.getItem(TOKEN_KEY));
    if (token && storage) storage.setItem(TOKEN_KEY, token);
    window.localStorage.removeItem(TOKEN_KEY);
  }

  if (!token || isTokenExpired(token)) {
    clearStoredToken();
    return null;
  }

  return token;
}
