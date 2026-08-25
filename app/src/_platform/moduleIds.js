export const PLATFORM_MODULE_IDS = Object.freeze(['investor', 'borrower', 'advisory']);

const MODULE_ALIASES = Object.freeze({
  investor: 'investor',
  lender: 'investor',
  borrower: 'borrower',
  origination: 'borrower',
  advisory: 'advisory',
  structuring: 'advisory'
});

export const normalizeModuleId = value => MODULE_ALIASES[String(value || '').trim().toLowerCase()] || null;

export const isPlatformModuleId = value => Boolean(normalizeModuleId(value));
