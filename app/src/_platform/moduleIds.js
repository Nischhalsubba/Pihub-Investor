export const PLATFORM_MODULE_IDS = Object.freeze(['investor', 'borrower', 'advisory']);
export const PLATFORM_APPLICATION_IDS = Object.freeze(['investor', 'borrower', 'advisory', 'admin', 'access']);

const APPLICATION_ALIASES = Object.freeze({
  investor: 'investor',
  lender: 'investor',
  borrower: 'borrower',
  origination: 'borrower',
  advisory: 'advisory',
  structuring: 'advisory',
  admin: 'admin',
  compliance: 'admin',
  access: 'access',
  auth: 'access',
  authentication: 'access'
});

export const normalizeApplicationId = value => APPLICATION_ALIASES[String(value || '').trim().toLowerCase()] || null;

export const normalizeModuleId = value => {
  const id = normalizeApplicationId(value);
  return id && PLATFORM_MODULE_IDS.includes(id) ? id : null;
};

export const isPlatformModuleId = value => Boolean(normalizeModuleId(value));
export const isPlatformApplicationId = value => Boolean(normalizeApplicationId(value));
