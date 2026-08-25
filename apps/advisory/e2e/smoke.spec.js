import { test, expect } from '@playwright/test';

test('advisory shared access handoff opens the workspace without a second login', async ({ page }) => {
  await page.goto('/?pihub_demo_access=advisory&source=investor-access');
  await expect(page.getByRole('heading', { name: /transaction/i }).first()).toBeVisible();
  await expect(page).not.toHaveURL(/pihub_demo_access/);
  await expect(page.locator('.ph-topbar')).toBeVisible();
  await expect(page.locator('.ph-metric-card')).toHaveCount(4);

  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 820) {
    await expect(page.locator('.ph-sidebar')).toBeHidden();
    await expect(page.locator('.ph-mobile-nav')).toBeVisible();
  } else {
    await expect(page.locator('.ph-sidebar')).toBeVisible();
    const geometry = await page.evaluate(() => ({
      font: getComputedStyle(document.body).fontFamily,
      topbar: getComputedStyle(document.querySelector('.ph-topbar')).minHeight,
      sidebar: getComputedStyle(document.querySelector('.ph-sidebar')).width,
      metricRadius: getComputedStyle(document.querySelector('.ph-metric-card')).borderRadius
    }));
    expect(geometry.font).toContain('IBM Plex Sans');
    expect(geometry.topbar).toBe('68px');
    expect(geometry.sidebar).toBe('248px');
    expect(geometry.metricRadius).toBe('8px');
  }

  await page.getByRole('link', { name: 'Transactions', exact: true }).first().click();
  await expect(page).toHaveURL(/\/transactions$/);
  await expect(page.getByRole('heading', { name: /PH-2026-0147/ })).toBeVisible();
  await page.getByRole('link', { name: 'Due diligence', exact: true }).first().click();
  await expect(page).toHaveURL(/\/due-diligence$/);
  await expect(page.getByRole('heading', { name: 'Due diligence' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('advisory keeps a direct demo sign-in fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Advisory' })).toBeVisible();
});
