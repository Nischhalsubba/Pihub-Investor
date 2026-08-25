import { test, expect } from '@playwright/test';

const loginInvestor = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('routing.qa@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('shared access selector keeps all workspace choices on one login surface', async ({ page }) => {
  await page.goto('/login');
  const workspaceNav = page.getByRole('navigation', { name: 'PiHub workspace access' });

  const investor = workspaceNav.getByRole('link', { name: 'Investor', exact: true });
  const borrower = workspaceNav.getByRole('link', { name: 'Borrower', exact: true });
  const advisory = workspaceNav.getByRole('link', { name: 'Advisory', exact: true });

  await expect(investor).toHaveAttribute('aria-current', 'page');
  await expect(investor).toHaveAttribute('href', '/login');
  await expect(borrower).toHaveAttribute('href', '/login/borrower');
  await expect(advisory).toHaveAttribute('href', '/login/advisory');

  await borrower.click();
  await expect(page).toHaveURL(/\/login\/borrower$/);
  await expect(page.locator('#login-email')).toHaveValue('borrower.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoBorrower1!');
  await expect(page.getByRole('button', { name: 'Open Borrower' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Borrower', exact: true })).toHaveAttribute('aria-current', 'page');

  await page.getByRole('link', { name: 'Advisory', exact: true }).click();
  await expect(page).toHaveURL(/\/login\/advisory$/);
  await expect(page.locator('#login-email')).toHaveValue('advisory.demo@pihub.local');
  await expect(page.locator('#login-password')).toHaveValue('DemoAdvisory1!');
  await expect(page.getByRole('button', { name: 'Open Advisory' })).toBeVisible();
});

test('module aliases and invalid access routes canonicalize safely inside Investor', async ({ page }) => {
  await page.goto('/login/origination');
  await expect(page).toHaveURL(/\/login\/borrower$/);
  await expect(page.locator('#login-email')).toBeVisible();

  await page.goto('/login/structuring');
  await expect(page).toHaveURL(/\/login\/advisory$/);
  await expect(page.locator('#login-email')).toBeVisible();

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
