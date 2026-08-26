import { test, expect } from '@playwright/test';

const ORIGINS = {
  borrower: 'https://pihub-borrower-nischhalsubbas-projects.vercel.app',
  advisory: 'https://pihub-advisory-nischhalsubbas-projects.vercel.app',
  admin: 'https://pihub-admin-nischhalsubbas-projects.vercel.app',
};

const loginInvestor = async page => {
  await page.goto('/login');
  await expect(page.locator('#login-email')).toHaveValue('investor.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoInvestor1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('one access surface pre-fills every demo application consistently', async ({ page }) => {
  await page.goto('/login');
  const workspaceNav = page.getByRole('navigation', { name: 'PiHub workspace access' });
  const investor = workspaceNav.getByRole('link', { name: 'Investor', exact: true });
  const borrower = workspaceNav.getByRole('link', { name: 'Borrower', exact: true });
  const advisory = workspaceNav.getByRole('link', { name: 'Advisory', exact: true });
  const admin = workspaceNav.getByRole('link', { name: 'Admin', exact: true });

  await expect(investor).toHaveAttribute('aria-current', 'page');
  await expect(investor).toHaveAttribute('href', '/login');
  await expect(borrower).toHaveAttribute('href', '/login/borrower');
  await expect(advisory).toHaveAttribute('href', '/login/advisory');
  await expect(admin).toHaveAttribute('href', '/login?next=admin');
  await expect(page.locator('#login-email')).toHaveValue('investor.demo@pihub.local');

  await borrower.click();
  await expect(page.locator('#login-email')).toHaveValue('borrower.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoBorrower1!');

  await advisory.click();
  await expect(page.locator('#login-email')).toHaveValue('advisory.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoAdvisory1!');

  await admin.click();
  await expect(page).toHaveURL(/\/login\?next=admin$/);
  await expect(page.locator('#login-email')).toHaveValue('admin.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoAdmin1!');
  await expect(page.getByRole('button', { name: 'Open Admin' })).toBeVisible();
});

test('workspace launches cross origins without credentials or tokens in URLs', async ({ page }) => {
  const cases = [
    { id: 'borrower', route: '/login/borrower', origin: ORIGINS.borrower, button: 'Open Borrower' },
    { id: 'advisory', route: '/login/advisory', origin: ORIGINS.advisory, button: 'Open Advisory' },
    { id: 'admin', route: '/login?next=admin', origin: ORIGINS.admin, button: 'Open Admin' },
  ];

  for (const item of cases) {
    await page.route(`${item.origin}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>PiHub handoff test</title>' }));
    await page.goto(item.route);
    await page.getByRole('button', { name: item.button }).click();
    await expect(page).toHaveURL(new RegExp(`^${item.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\?`));
    const launched = new URL(page.url());
    expect(launched.searchParams.get('pihub_demo_access')).toBe(item.id);
    expect(launched.searchParams.get('source')).toBe('investor-access');
    expect(launched.search).not.toMatch(/password|email|token/i);
    await page.unroute(`${item.origin}/**`);
  }
});

test('module aliases and invalid access routes canonicalize safely', async ({ page }) => {
  await page.goto('/login/origination');
  await expect(page).toHaveURL(/\/login\/borrower$/);
  await page.goto('/login/structuring');
  await expect(page).toHaveURL(/\/login\/advisory$/);
  await page.goto('/login/not-a-module');
  await expect(page).toHaveURL(/\/login$/);
});

test('Investor SPA never claims independent application namespaces', async ({ page }) => {
  await loginInvestor(page);
  for (const route of ['/borrower', '/advisory', '/admin', '/access']) {
    await page.goto(route);
    await expect(page.getByText('This workspace page does not exist.')).toBeVisible();
  }
});
