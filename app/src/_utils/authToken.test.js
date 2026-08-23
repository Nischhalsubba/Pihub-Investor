import {
  normalizeToken,
  decodeJwtPayload,
  isTokenExpired,
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

  test('recognizes expired JWTs', () => {
    expect(isTokenExpired(makeToken({ exp: 1 }))).toBe(true);
    expect(isTokenExpired(makeToken({ exp: 4102444800 }))).toBe(false);
  });

  test('stores a bearer token only for the current browser session', () => {
    const token = makeToken({ exp: 4102444800 });
    expect(setStoredToken(token)).toBe(true);
    expect(sessionStorage.getItem('token')).toBe(token);
    expect(sessionStorage.getItem('pihub-auth-session-v2')).toBe('2');
    expect(localStorage.getItem('token')).toBeNull();
    expect(getStoredToken()).toBe(token);
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
