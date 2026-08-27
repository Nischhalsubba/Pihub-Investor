import { test, expect } from '@playwright/test';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('visual.qa@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

const stabilize = async page => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important} .route-transition-veil{display:none!important}' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(120);
};

const capture = async (page, route, name, width, height) => {
  await page.setViewportSize({ width, height });
  await page.goto(route);
  await stabilize(page);
  await expect(page).toHaveScreenshot(name, { fullPage: true, animations: 'disabled' });
};

const assertOverviewContract = async (page, width, height) => {
  await page.setViewportSize({ width, height });
  await page.goto('/dashboard');
  await stabilize(page);
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  // Investor is now an application-owned repository. The former demo journey
  // composed Borrower/Advisory/Admin state and must not leak back into Investor.
  await expect(page.getByText('Cross-module deal journey')).toHaveCount(0);
  const geometry = await page.evaluate(() => {
    const main = document.querySelector('#main-content');
    const header = document.querySelector('.site-header');
    const rect = main?.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      mainLeft: rect?.left || 0,
      mainRight: rect?.right || 0,
      viewport: window.innerWidth,
      headerWidth: header?.getBoundingClientRect().width || 0,
    };
  });
  expect(geometry.overflow).toBeLessThanOrEqual(2);
  expect(geometry.mainLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.mainRight).toBeLessThanOrEqual(geometry.viewport + 2);
  expect(Math.abs(geometry.headerWidth - geometry.viewport)).toBeLessThanOrEqual(2);
};

test('core workspace remains visually stable across canonical breakpoints', async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'chromium-desktop', 'Pixel baselines are captured once in Chromium; other engines run functional QA.');
  await login(page);

  // Overview is data/state driven. Guard the standalone Investor ownership
  // boundary and geometry rather than pinning its full-page height to a snapshot.
  await assertOverviewContract(page, 1440, 900);
  await capture(page, '/products', 'opportunities-1440.png', 1440, 900);
  await capture(page, '/credit-request', 'credit-1440.png', 1440, 900);
  await capture(page, '/products-invested', 'positions-1440.png', 1440, 900);
  await capture(page, '/user/profile', 'profile-1440.png', 1440, 900);
  await capture(page, '/products', 'opportunities-1024.png', 1024, 820);
  await capture(page, '/products', 'opportunities-768.png', 768, 900);
  await assertOverviewContract(page, 1920, 1080);
});
