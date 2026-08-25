import { test, expect } from '@playwright/test';

test('borrower shared access handoff opens a borrower-specific Investor-design workspace', async ({ page }) => {
  await page.goto('/?pihub_demo_access=borrower&source=investor-access');
  await expect(page.getByRole('heading', { name: 'Financing overview' })).toBeVisible();
  await expect(page).not.toHaveURL(/pihub_demo_access/);
  await expect(page.locator('.ph-app[data-workspace="borrower"]')).toBeVisible();
  await expect(page.locator('.ph-kpi')).toHaveCount(4);
  await expect(page.getByText('Next actions', { exact: true })).toBeVisible();
  await expect(page.getByText('Application progress', { exact: true })).toBeVisible();
  await expect(page.getByText('Pipeline by stage', { exact: true })).toHaveCount(0);

  const viewport = page.viewportSize();
  if (viewport && viewport.width <= 820) {
    await expect(page.locator('.ph-sidebar')).toBeHidden();
    await expect(page.locator('.ph-mobile-nav')).toBeVisible();
  } else {
    await expect(page.locator('.ph-sidebar')).toBeVisible();
    const design = await page.evaluate(() => {
      const css = node => getComputedStyle(node);
      return {
        font: css(document.body).fontFamily,
        bodySize: css(document.body).fontSize,
        topbar: css(document.querySelector('.ph-topbar')).height,
        sidebar: css(document.querySelector('.ph-sidebar')).width,
        sidebarBg: css(document.querySelector('.ph-sidebar')).backgroundColor,
        canvasBg: css(document.querySelector('.ph-main')).backgroundColor,
        cardRadius: css(document.querySelector('.ph-kpi')).borderRadius,
        cardBorder: css(document.querySelector('.ph-kpi')).borderTopColor,
        primary: css(document.querySelector('.ph-button.primary')).backgroundColor,
        navHeight: css(document.querySelector('.ph-nav-link')).minHeight,
      };
    });
    expect(design.font).toContain('IBM Plex Sans');
    expect(design.bodySize).toBe('15px');
    expect(design.topbar).toBe('68px');
    expect(design.sidebar).toBe('232px');
    expect(design.sidebarBg).toBe('rgb(11, 18, 32)');
    expect(design.canvasBg).toBe('rgb(246, 248, 252)');
    expect(design.cardRadius).toBe('12px');
    expect(design.cardBorder).toBe('rgb(226, 232, 240)');
    expect(design.primary).toBe('rgb(36, 87, 230)');
    expect(design.navHeight).toBe('44px');
  }

  await page.getByRole('link', { name: 'Financing request', exact: true }).first().click();
  await expect(page).toHaveURL(/\/financing$/);
  await expect(page.getByRole('heading', { name: 'Financing request' })).toBeVisible();
  await page.getByRole('link', { name: 'Documents', exact: true }).first().click();
  await expect(page).toHaveURL(/\/documents$/);
  await expect(page.getByText('FY2025 audited financial statements', { exact: true })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('borrower direct fallback uses Investor auth geometry', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Borrower' })).toBeVisible();
  const auth = await page.evaluate(() => {
    const input = document.querySelector('.ph-field input');
    const button = document.querySelector('.ph-login .ph-button.primary');
    return {
      inputHeight: getComputedStyle(input).minHeight,
      inputRadius: getComputedStyle(input).borderRadius,
      buttonHeight: getComputedStyle(button).minHeight,
      buttonColor: getComputedStyle(button).backgroundColor,
    };
  });
  expect(auth.inputHeight).toBe('50px');
  expect(auth.inputRadius).toBe('10px');
  expect(auth.buttonHeight).toBe('48px');
  expect(auth.buttonColor).toBe('rgb(36, 87, 230)');
});