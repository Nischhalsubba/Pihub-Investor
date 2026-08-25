import { test, expect } from '@playwright/test';

test('advisory login exposes isolated transaction execution workflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Advisory' }).click();
  await expect(page.getByRole('heading', { name: /transaction/i }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Transactions', exact: true }).first().click();
  await expect(page).toHaveURL(/\/transactions$/);
  await expect(page.getByRole('heading', { name: /PH-2026-0147/ })).toBeVisible();
  await page.getByRole('link', { name: 'Due diligence', exact: true }).first().click();
  await expect(page).toHaveURL(/\/due-diligence$/);
  await expect(page.getByRole('heading', { name: 'Due diligence' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
