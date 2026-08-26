import { normalizeApplicationId } from './moduleIds';

const DEMO_APPLICATION_ACCOUNTS = Object.freeze({
  investor: Object.freeze({
    email: 'investor.demo@pihub.local',
    password: 'DemoInvestor1!'
  }),
  borrower: Object.freeze({
    email: 'borrower.demo@pihub.local',
    password: 'DemoBorrower1!'
  }),
  advisory: Object.freeze({
    email: 'advisory.demo@pihub.local',
    password: 'DemoAdvisory1!'
  }),
  admin: Object.freeze({
    email: 'admin.demo@pihub.local',
    password: 'DemoAdmin1!'
  })
});

export const getDemoModuleAccount = value => {
  const id = normalizeApplicationId(value);
  return id ? DEMO_APPLICATION_ACCOUNTS[id] || null : null;
};

export const getDemoModuleLaunchHref = (value, homeHref) => {
  const id = normalizeApplicationId(value);
  if (!id || !DEMO_APPLICATION_ACCOUNTS[id]) return '';

  try {
    const url = new URL(String(homeHref || '').trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    url.searchParams.set('pihub_demo_access', id);
    url.searchParams.set('source', 'investor-access');
    return url.toString();
  } catch {
    return '';
  }
};
