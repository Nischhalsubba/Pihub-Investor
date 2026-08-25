import { test, expect } from '@playwright/test';

test('access gateway uses Investor visual language and never invents origins', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Choose your workspace' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Investor / Lender' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Borrower / Origination' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Advisory / Structuring' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin / Compliance' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Not connected' })).toHaveCount(4);
  await expect(page.locator('a[href^="/borrower"], a[href^="/advisory"], a[href^="/admin"]')).toHaveCount(0);

  const design = await page.evaluate(() => {
    const css = node => getComputedStyle(node);
    return {
      font: css(document.body).fontFamily,
      bodySize: css(document.body).fontSize,
      sideBg: document.querySelector('.access-side') ? css(document.querySelector('.access-side')).backgroundColor : null,
      cardRadius: css(document.querySelector('.access-card')).borderRadius,
      cardBorder: css(document.querySelector('.access-card')).borderTopColor,
      controlHeight: css(document.querySelector('.ph-button')).minHeight,
    };
  });
  expect(design.font).toContain('IBM Plex Sans');
  expect(design.bodySize).toBe('15px');
  expect(design.cardRadius).toBe('12px');
  expect(design.cardBorder).toBe('rgb(226, 232, 240)');
  expect(design.controlHeight).toBe('44px');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});