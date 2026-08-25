import { test, expect } from '@playwright/test';

const CENTRAL_LOGIN = 'https://pihub-investor.vercel.app';
const stubCentralLogin = async page => {
  await page.route(`${CENTRAL_LOGIN}/**`, route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><html><body><h1>Central PiHub sign in</h1></body></html>'
  }));
};

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
      const root = css(document.documentElement);
      return {
        font: css(document.body).fontFamily,
        bodySize: css(document.body).fontSize,
        topbar: css(document.querySelector('.ph-topbar')).height,
        sidebar: css(document.querySelector('.ph-sidebar')).width,
        sidebarBg: css(document.querySelector('.ph-sidebar')).backgroundColor,
        canvasBg: css(document.querySelector('.ph-main')).backgroundColor,
        cardRadius: css(document.querySelector('.ph-kpi')).borderRadius,
        cardBorder: css(document.querySelector('.ph-kpi')).borderTopColor,
        primaryToken: root.getPropertyValue('--pi-primary').trim(),
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
    expect(design.primaryToken).toBe('#2457e6');
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

  await stubCentralLogin(page);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`);
});

test('borrower direct visit has no fallback login and returns to central PiHub access', async ({ page }) => {
  await stubCentralLogin(page);
  await page.goto('/');
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`);
  await expect(page.getByRole('heading', { name: 'Central PiHub sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Borrower' })).toHaveCount(0);
});
