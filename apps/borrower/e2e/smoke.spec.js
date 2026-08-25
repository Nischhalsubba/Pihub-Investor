import { test, expect } from '@playwright/test';

test('borrower login and financing workflow stay inside borrower routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Borrower' }).click();
  await expect(page.getByRole('heading', { name: /financing/i }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Financing request', exact: true }).first().click();
  await expect(page).toHaveURL(/\/financing$/);
  await expect(page.getByRole('heading', { name: 'Financing request' })).toBeVisible();
  await page.getByRole('link', { name: 'Documents', exact: true }).first().click();
  await expect(page).toHaveURL(/\/documents$/);
  await expect(page.getByText('FY2025 audited financial statements', { exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
