const MAX_ERROR_MESSAGE_LENGTH = 240;

const normalizeUserSafeMessage = value => {
  if (typeof value !== 'string') return null;
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.length > MAX_ERROR_MESSAGE_LENGTH) return null;
  return normalized;
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const response = error && error.response;
  const status = response && Number(response.status);
  const responseData = response && response.data;

  // Authentication, authorization and server failures should never surface raw
  // backend messages. Those often contain implementation details that are not
  // useful to end users and may disclose internal state.
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (Number.isFinite(status) && status >= 500) return fallback;

  // Validation and other expected 4xx responses may contain useful user-facing
  // guidance, but only accept short first-level strings. Do not render arbitrary
  // nested objects, arrays, stack traces or transport error messages.
  const candidates = [
    responseData && responseData.message,
    responseData && responseData.detail,
    responseData && responseData.error
  ];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = normalizeUserSafeMessage(candidates[index]);
    if (candidate) return candidate;
  }

  return fallback;
};

export const normalizePagedCollection = (payload, collectionKeys = []) => {
  const root = payload && typeof payload === 'object' ? payload : {};
  const nested = root.data && typeof root.data === 'object' ? root.data : null;
  const candidates = [];

  if (Array.isArray(payload)) candidates.push(payload);
  if (Array.isArray(root.data)) candidates.push(root.data);
  if (nested && Array.isArray(nested.data)) candidates.push(nested.data);

  collectionKeys.forEach(key => {
    if (Array.isArray(root[key])) candidates.push(root[key]);
    if (nested && Array.isArray(nested[key])) candidates.push(nested[key]);
  });

  const data = (candidates[0] || []).filter(Boolean);
  const meta = (nested && nested.meta && typeof nested.meta === 'object' ? nested.meta : null)
    || (root.meta && typeof root.meta === 'object' ? root.meta : null)
    || {};

  return { data, meta };
};
