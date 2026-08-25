import { test, expect } from '@playwright/test';

const loginInvestor = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('routing.qa@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('shared access selector keeps Investor login functional and future modules non-interactive until deployed', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('link', { name: /Investor/i }).first()).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#login-email')).toBeVisible();
  await expect(page.locator('#login-password')).toBeVisible();

  await page.getByRole('link', { name: /Borrower/i }).click();
  await expect(page).toHaveURL(/\/login\/borrower$/);
  await expect(page.getByText('Borrower workspace', { exact: true })).toBeVisible();
  await expect(page.getByText(/not available for sign-in yet/i)).toBeVisible();
  await expect(page.locator('#login-email')).toHaveCount(0);
  await expect(page.locator('#login-password')).toHaveCount(0);

  await page.getByRole('link', { name: /Advisory/i }).click();
  await expect(page).toHaveURL(/\/login\/advisory$/);
  await expect(page.getByText('Advisory workspace', { exact: true })).toBeVisible();
  await expect(page.locator('#login-email')).toHaveCount(0);

  await page.getByRole('link', { name: /Investor/i }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.locator('#login-email')).toBeVisible();
});

test('module aliases and invalid access routes canonicalize safely', async ({ page }) => {
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
