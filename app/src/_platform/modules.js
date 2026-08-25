const MODULE_ALIASES = Object.freeze({
  investor: 'investor',
  lender: 'investor',
  borrower: 'borrower',
  origination: 'borrower',
  advisory: 'advisory',
  structuring: 'advisory'
});

const DEFAULT_MODULE_LOCATIONS = Object.freeze({
  investor: '/dashboard',
  borrower: '',
  advisory: ''
});

export const PLATFORM_MODULES = Object.freeze([
  Object.freeze({
    id: 'investor',
    label: 'Investor',
    eyebrow: 'Capital provider workspace',
    description: 'Review, underwrite, decide and monitor private-credit investments.',
    icon: 'bx bx-line-chart'
  }),
  Object.freeze({
    id: 'borrower',
    label: 'Borrower',
    eyebrow: 'Origination workspace',
    description: 'Request financing, provide information and follow transaction progress.',
    icon: 'bx bx-building-house'
  }),
  Object.freeze({
    id: 'advisory',
    label: 'Advisory',
    eyebrow: 'Structuring workspace',
    description: 'Manage mandates, structure transactions and coordinate execution.',
    icon: 'bx bx-briefcase-alt-2'
  })
]);

export const normalizeModuleId = value => MODULE_ALIASES[String(value || '').trim().toLowerCase()] || null;

const declarationValues = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(/[\s,]+/).filter(Boolean);
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => enabled !== false && enabled !== null && enabled !== undefined)
      .map(([key]) => key);
  }
  return [];
};

const moduleIdFromEntry = entry => {
  if (typeof entry === 'string') return normalizeModuleId(entry);
  if (!entry || typeof entry !== 'object' || entry.enabled === false) return null;
  return normalizeModuleId(entry.id || entry.module || entry.key || entry.name);
};

export const readDeclaredModuleIds = profile => {
  if (!profile || typeof profile !== 'object') return new Set();
  const declarations = [
    profile.modules,
    profile.available_modules,
    profile.module_access,
    profile.permissions && !Array.isArray(profile.permissions) ? profile.permissions.modules : undefined
  ];
  const declaration = declarations.find(value => value !== undefined && value !== null);
  if (declaration === undefined) return new Set();
  return new Set(declarationValues(declaration).map(moduleIdFromEntry).filter(Boolean));
};

export const getNavigableModules = (profile, locationOverrides = {}, currentModuleId = 'investor') => {
  const currentId = normalizeModuleId(currentModuleId) || 'investor';
  const allowed = readDeclaredModuleIds(profile);

  // This application is currently the Investor entry point. Until shared server
  // authorization exists, the active module is the only safe fallback.
  allowed.add(currentId);

  const locations = { ...DEFAULT_MODULE_LOCATIONS, ...locationOverrides };
  return PLATFORM_MODULES
    .filter(module => allowed.has(module.id) && typeof locations[module.id] === 'string' && locations[module.id].trim())
    .map(module => ({ ...module, href: locations[module.id].trim() }));
};
