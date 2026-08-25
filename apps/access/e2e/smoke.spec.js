import { test, expect } from '@playwright/test';

test('access gateway lists separated workspaces and never invents origins', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Choose your workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Investor / Lender' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Borrower / Origination' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Advisory / Structuring' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin / Compliance' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Not connected' })).toHaveCount(4);
  await expect(page.locator('a[href^="/borrower"], a[href^="/advisory"], a[href^="/admin"]')).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
