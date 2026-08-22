export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const responseData = error && error.response && error.response.data;
  const candidates = [
    responseData && responseData.message,
    responseData && responseData.error,
    responseData && responseData.errors,
    error && error.message
  ];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    if (candidate && typeof candidate === 'object') {
      const nested = candidate.message || candidate.detail || candidate.error;
      if (typeof nested === 'string' && nested.trim()) return nested.trim();
    }
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
