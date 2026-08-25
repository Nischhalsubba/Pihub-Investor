import { test, expect } from '@playwright/test';

test('borrower shared access handoff opens the workspace without a second login', async ({ page }) => {
  await page.goto('/?pihub_demo_access=borrower&source=investor-access');
  await expect(page.getByRole('heading', { name: /financing/i }).first()).toBeVisible();
  await expect(page).not.toHaveURL(/pihub_demo_access/);
  await expect(page.locator('.ph-topbar')).toBeVisible();
  await expect(page.locator('.ph-sidebar')).toBeVisible();
  await expect(page.locator('.ph-metric-card')).toHaveCount(4);

  await page.getByRole('link', { name: 'Financing request', exact: true }).first().click();
  await expect(page).toHaveURL(/\/financing$/);
  await expect(page.getByRole('heading', { name: 'Financing request' })).toBeVisible();
  await page.getByRole('link', { name: 'Documents', exact: true }).first().click();
  await expect(page).toHaveURL(/\/documents$/);
  await expect(page.getByText('FY2025 audited financial statements', { exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('borrower keeps a direct demo sign-in fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Borrower' })).toBeVisible();
});
