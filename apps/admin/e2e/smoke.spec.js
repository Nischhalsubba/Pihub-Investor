import { test, expect } from '@playwright/test';

test('admin login exposes governance without becoming a business module', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Admin' }).click();
  await expect(page.getByText(/supporting application, not a fourth business module/i)).toBeVisible();
  await page.getByRole('link', { name: 'Users & roles', exact: true }).first().click();
  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByRole('heading', { name: 'Users & roles' })).toBeVisible();
  await page.getByRole('link', { name: 'Compliance', exact: true }).first().click();
  await expect(page).toHaveURL(/\/compliance$/);
  await expect(page.getByRole('heading', { name: 'Compliance' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
