import { test, expect } from '@playwright/test';

const CENTRAL_LOGIN = 'https://pihub-investor.vercel.app';
const stubCentralLogin = async page => {
  await page.route(`${CENTRAL_LOGIN}/**`, route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><html><body><h1>Central PiHub sign in</h1></body></html>'
  }));
};

const seedAdminSession = async page => {
  await page.addInitScript(() => {
    localStorage.setItem('pihub:admin:demo-session:v1', JSON.stringify({
      applicationId: 'admin',
      user: {
        name: 'Alex Hoffmann',
        email: 'admin.demo@pihub.local',
        organization: 'PiHub Private Investments GmbH',
        role: 'Platform Admin'
      },
      issuedAt: '2026-08-25T00:00:00.000Z',
      demo: true
    }));
  });
};

test('admin uses Investor shell while remaining a governance control plane', async ({ page }) => {
  await seedAdminSession(page);
  await page.goto('/');
  await expect(page.locator('.ph-app[data-workspace="admin"]')).toBeVisible();
  await expect(page.locator('.ph-main .ph-demo')).toContainText(/supporting application, not a fourth business module/i);

  const viewport = page.viewportSize();
  if (viewport && viewport.width > 820) {
    const design = await page.evaluate(() => {
      const css = node => getComputedStyle(node);
      return {
        font: css(document.body).fontFamily,
        topbar: css(document.querySelector('.ph-topbar')).height,
        sidebar: css(document.querySelector('.ph-sidebar')).width,
        sidebarBg: css(document.querySelector('.ph-sidebar')).backgroundColor,
        canvasBg: css(document.querySelector('.ph-main')).backgroundColor,
        primary: css(document.querySelector('.ph-button.primary') || document.querySelector('.ph-nav-link.active')).backgroundColor,
      };
    });
    expect(design.font).toContain('IBM Plex Sans');
    expect(design.topbar).toBe('68px');
    expect(design.sidebar).toBe('232px');
    expect(design.sidebarBg).toBe('rgb(11, 18, 32)');
    expect(design.canvasBg).toBe('rgb(246, 248, 252)');
  }

  await page.getByRole('link', { name: 'Users & roles', exact: true }).first().click();
  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByRole('heading', { name: 'Users & roles' })).toBeVisible();
  await page.getByRole('link', { name: 'Compliance', exact: true }).first().click();
  await expect(page).toHaveURL(/\/compliance$/);
  await expect(page.getByRole('heading', { name: 'Compliance queue' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);

  await stubCentralLogin(page);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login?next=admin`);
});

test('admin direct unauthenticated visit has no fallback login', async ({ page }) => {
  await stubCentralLogin(page);
  await page.goto('/');
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login?next=admin`);
  await expect(page.getByRole('heading', { name: 'Central PiHub sign in' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open Admin' })).toHaveCount(0);
});
