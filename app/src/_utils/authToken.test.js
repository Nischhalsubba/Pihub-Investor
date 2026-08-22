import { normalizeToken, decodeJwtPayload, isTokenExpired, getStoredToken } from './authToken';

const makeToken = payload => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.signature`;
};

describe('authToken helpers', () => {
  beforeEach(() => localStorage.clear());

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

  test('removes an expired stored token', () => {
    localStorage.setItem('token', makeToken({ exp: 1 }));
    expect(getStoredToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
