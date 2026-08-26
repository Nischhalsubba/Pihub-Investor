import { normalizeModuleId } from './moduleIds';
import { getModuleHomeHref, isAbsoluteNavigationHref, sanitizeNavigationHref } from './runtime';

export { normalizeModuleId } from './moduleIds';

export const PLATFORM_MODULES = Object.freeze([
  Object.freeze({ id: 'investor', label: 'Investor', eyebrow: 'Capital provider workspace', description: 'Review, underwrite, decide and monitor private-credit investments.', icon: 'bx bx-line-chart' }),
  Object.freeze({ id: 'borrower', label: 'Borrower', eyebrow: 'Origination workspace', description: 'Request financing, provide information and follow transaction progress.', icon: 'bx bx-building-house' }),
  Object.freeze({ id: 'advisory', label: 'Advisory', eyebrow: 'Structuring workspace', description: 'Manage mandates, structure transactions and coordinate execution.', icon: 'bx bx-briefcase-alt-2' })
]);

export const PLATFORM_ACCESS_APPLICATIONS = Object.freeze([
  ...PLATFORM_MODULES,
  Object.freeze({ id: 'admin', label: 'Admin', eyebrow: 'Governance control plane', description: 'Manage organizations, roles, compliance, policy and audit context.', icon: 'bx bx-shield-quarter', support: true })
]);

const declarationValues = value => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(/[\s,]+/).filter(Boolean);
  if (typeof value === 'object') return Object.entries(value).filter(([, enabled]) => enabled !== false && enabled !== null && enabled !== undefined).map(([key]) => key);
  return [];
};

const moduleIdFromEntry = entry => {
  if (typeof entry === 'string') return normalizeModuleId(entry);
  if (!entry || typeof entry !== 'object' || entry.enabled === false) return null;
  return normalizeModuleId(entry.id || entry.module || entry.key || entry.name);
};

export const readDeclaredModuleIds = profile => {
  if (!profile || typeof profile !== 'object') return new Set();
  const declarations = [profile.modules, profile.available_modules, profile.module_access, profile.permissions && !Array.isArray(profile.permissions) ? profile.permissions.modules : undefined];
  const declaration = declarations.find(value => value !== undefined && value !== null);
  if (declaration === undefined) return new Set();
  return new Set(declarationValues(declaration).map(moduleIdFromEntry).filter(Boolean));
};

export const getNavigableModules = (profile, locationOverrides = {}, currentModuleId = 'investor') => {
  const currentId = normalizeModuleId(currentModuleId) || 'investor';
  const allowed = readDeclaredModuleIds(profile);
  allowed.add(currentId);

  return PLATFORM_MODULES.flatMap(module => {
    if (!allowed.has(module.id)) return [];
    const hasOverride = Object.prototype.hasOwnProperty.call(locationOverrides || {}, module.id);
    let href = hasOverride ? sanitizeNavigationHref(locationOverrides[module.id]) : getModuleHomeHref(module.id, { currentModuleId: currentId });
    if (module.id !== currentId && !isAbsoluteNavigationHref(href)) href = '';
    return href ? [{ ...module, href }] : [];
  });
};
