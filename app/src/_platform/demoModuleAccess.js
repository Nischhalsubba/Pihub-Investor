import { normalizeModuleId } from './moduleIds';

const DEMO_MODULE_ACCOUNTS = Object.freeze({
  borrower: Object.freeze({
    email: 'borrower.demo@pihub.local',
    password: 'DemoBorrower1!'
  }),
  advisory: Object.freeze({
    email: 'advisory.demo@pihub.local',
    password: 'DemoAdvisory1!'
  })
});

export const getDemoModuleAccount = value => {
  const id = normalizeModuleId(value);
  return id ? DEMO_MODULE_ACCOUNTS[id] || null : null;
};

export const getDemoModuleLaunchHref = (value, homeHref) => {
  const id = normalizeModuleId(value);
  if (!id || !DEMO_MODULE_ACCOUNTS[id]) return '';

  try {
    const url = new URL(String(homeHref || '').trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    url.searchParams.set('pihub_demo_access', id);
    url.searchParams.set('source', 'investor-access');
    return url.toString();
  } catch (error) {
    return '';
  }
};
