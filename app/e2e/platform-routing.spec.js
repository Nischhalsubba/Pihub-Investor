import { test, expect } from '@playwright/test';

const BORROWER_URL = 'https://pihub-borrower-nischhalsubbas-projects.vercel.app/login';
const ADVISORY_URL = 'https://pihub-advisory-nischhalsubbas-projects.vercel.app/login';

const loginInvestor = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('routing.qa@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('shared access selector keeps Investor local and points live modules at independent origins', async ({ page }) => {
  await page.goto('/login');
  const workspaceNav = page.getByRole('navigation', { name: 'PiHub workspace access' });

  const investor = workspaceNav.getByRole('link', { name: 'Investor', exact: true });
  const borrower = workspaceNav.getByRole('link', { name: /Borrower/i });
  const advisory = workspaceNav.getByRole('link', { name: /Advisory/i });

  await expect(investor).toHaveAttribute('aria-current', 'page');
  await expect(investor).toHaveAttribute('href', '/login');
  await expect(page.locator('#login-email')).toBeVisible();
  await expect(page.locator('#login-password')).toBeVisible();

  // Cross-app navigation must use independent absolute origins. We assert the
  // href instead of making CI depend on the availability of an external host.
  await expect(borrower).toHaveAttribute('href', BORROWER_URL);
  await expect(advisory).toHaveAttribute('href', ADVISORY_URL);
});

test('module aliases and invalid access routes canonicalize safely inside Investor', async ({ page }) => {
  await page.goto('/login/origination');
  await expect(page).toHaveURL(/\/login\/borrower$/);

  await page.goto('/login/structuring');
  await expect(page).toHaveURL(/\/login\/advisory$/);

  await page.goto('/login/not-a-module');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#login-email')).toBeVisible();
});

test('Investor SPA never treats module root namespaces as Investor product routes', async ({ page }) => {
  await loginInvestor(page);

  for (const route of ['/borrower', '/advisory', '/admin', '/access']) {
    await page.goto(route);
    await expect(page.getByText('This workspace page does not exist.')).toBeVisible();
  }
});
