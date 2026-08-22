export function normalizeToken(token) {
  if (typeof token !== 'string') {
    return null;
  }

  const value = token.trim();
  if (!value || value === 'undefined' || value === 'null') {
    return null;
  }

  return value;
}

export function decodeJwtPayload(token) {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) {
    return null;
  }

  try {
    const payload = normalizedToken.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(character =>
          `%${('00' + character.charCodeAt(0).toString(16)).slice(-2)}`
        )
        .join('')
    );

    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const normalizedToken = normalizeToken(token);
  if (!normalizedToken) {
    return true;
  }

  const payload = decodeJwtPayload(normalizedToken);
  if (!payload || payload.exp === undefined || payload.exp === null) {
    // Some API deployments return opaque tokens. In that case the server,
    // rather than the browser, is the source of truth for session validity.
    return false;
  }

  const expiresAt = Number(payload.exp) * 1000;
  return isFinite(expiresAt) ? expiresAt <= Date.now() : false;
}

export function getStoredToken() {
  const token = normalizeToken(localStorage.getItem('token'));

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return null;
  }

  return token;
}
