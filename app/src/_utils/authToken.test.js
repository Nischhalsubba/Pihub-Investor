import {
  normalizeToken,
  decodeJwtPayload,
  isTokenExpired,
  isTokenNotYetValid,
  isTokenUsable,
  getStoredToken,
  setStoredToken,
  clearStoredToken
} from './authToken';

const toBase64Url = value => Buffer.from(JSON.stringify(value)).toString('base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const makeToken = payload => `${toBase64Url({ alg: 'none', typ: 'JWT' })}.${toBase64Url(payload)}.signature`;

describe('authToken helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('rejects empty and placeholder token values', () => {
    expect(normalizeToken(null)).toBeNull();
    expect(normalizeToken('')).toBeNull();
    expect(normalizeToken('undefined')).toBeNull();
    expect(normalizeToken('null')).toBeNull();
  });

  test('decodes a valid JWT payload', () => {
    const token = makeToken({ sub: 'demo-investor', exp: 4102444800 });
    expect(decodeJwtPayload(token)).toMatchObject({ sub: 'demo-investor' });
  });

  test('recognizes expired and near-expiry JWTs', () => {
    const now = 2_000_000;
    expect(isTokenExpired(makeToken({ exp: 1 }), now)).toBe(true);
    expect(isTokenExpired(makeToken({ exp: 2040 }), now)).toBe(false);
    expect(isTokenExpired(makeToken({ exp: 2020 }), now)).toBe(true);
  });

  test('rejects a JWT that is not valid yet beyond clock skew', () => {
    const now = 2_000_000;
    expect(isTokenNotYetValid(makeToken({ nbf: 2100 }), now)).toBe(true);
    expect(isTokenNotYetValid(makeToken({ nbf: 2020 }), now)).toBe(false);
  });

  test('accepts opaque bearer tokens for server-side validation', () => {
    expect(isTokenUsable('opaque-session-token', 2_000_000)).toBe(true);
  });

  test('stores a bearer token only for the current browser session', () => {
    const token = makeToken({ exp: 4102444800 });
    expect(setStoredToken(token)).toBe(true);
    expect(sessionStorage.getItem('token')).toBe(token);
    expect(sessionStorage.getItem('pihub-auth-session-v2')).toBe('2');
    expect(localStorage.getItem('token')).toBeNull();
    expect(getStoredToken()).toBe(token);
  });

  test('does not store a token that is already expired or not active', () => {
    expect(setStoredToken(makeToken({ exp: 1 }))).toBe(false);
    expect(setStoredToken(makeToken({ nbf: 4102444800 }))).toBe(false);
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  test('does not resurrect a legacy persistent token', () => {
    const token = makeToken({ exp: 4102444800 });
    localStorage.setItem('token', token);
    expect(getStoredToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  test('rejects a session token when the session marker was cleared', () => {
    const token = makeToken({ exp: 4102444800 });
    sessionStorage.setItem('token', token);
    expect(getStoredToken()).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  test('removes an expired stored token and session marker', () => {
    sessionStorage.setItem('token', makeToken({ exp: 1 }));
    sessionStorage.setItem('pihub-auth-session-v2', '2');
    expect(getStoredToken()).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('pihub-auth-session-v2')).toBeNull();
  });

  test('clears legacy, session token and session marker stores', () => {
    sessionStorage.setItem('token', 'session');
    sessionStorage.setItem('pihub-auth-session-v2', '2');
    localStorage.setItem('token', 'legacy');
    clearStoredToken();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('pihub-auth-session-v2')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
