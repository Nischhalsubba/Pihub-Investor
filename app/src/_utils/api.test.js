import { getApiErrorMessage, normalizePagedCollection } from './api';

describe('API utilities', () => {
  test('masks authentication, authorization and server implementation details', () => {
    expect(getApiErrorMessage({ response: { status: 401, data: { message: 'token parser stack trace' } } }))
      .toBe('Your session has expired. Please sign in again.');
    expect(getApiErrorMessage({ response: { status: 403, data: { message: 'internal policy object id=42' } } }))
      .toBe('You do not have permission to perform this action.');
    expect(getApiErrorMessage(
      { response: { status: 500, data: { message: 'SQLSTATE connection details' } } },
      'Unable to complete the request.'
    )).toBe('Unable to complete the request.');
  });

  test('uses a stable throttling message for 429 responses', () => {
    expect(getApiErrorMessage({ response: { status: 429, data: { message: 'redis key details' } } }))
      .toBe('Too many requests. Please wait a moment and try again.');
  });

  test('allows concise first-level validation messages', () => {
    expect(getApiErrorMessage({ response: { status: 422, data: { message: 'Product title is required.' } } }))
      .toBe('Product title is required.');
  });

  test('does not render nested or oversized backend error payloads', () => {
    const fallback = 'Please review the form and try again.';
    expect(getApiErrorMessage({ response: { status: 422, data: { errors: { email: ['invalid'] } } } }, fallback))
      .toBe(fallback);
    expect(getApiErrorMessage({ response: { status: 422, data: { message: 'x'.repeat(241) } } }, fallback))
      .toBe(fallback);
  });

  test('normalizes common paginated response shapes without changing behavior', () => {
    expect(normalizePagedCollection({ data: { products: [{ id: 1 }], meta: { current_page: 1 } } }, ['products']))
      .toEqual({ data: [{ id: 1 }], meta: { current_page: 1 } });
  });
});
