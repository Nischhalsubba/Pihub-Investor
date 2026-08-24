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

test('core workspace remains visually stable across canonical breakpoints', async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'chromium-desktop', 'Pixel baselines are captured once in Chromium; other engines run functional QA.');
  await login(page);

  await capture(page, '/dashboard', 'overview-1440.png', 1440, 900);
  await capture(page, '/products', 'opportunities-1440.png', 1440, 900);
  await capture(page, '/credit-request', 'credit-1440.png', 1440, 900);
  await capture(page, '/products-invested', 'positions-1440.png', 1440, 900);
  await capture(page, '/user/profile', 'profile-1440.png', 1440, 900);
  await capture(page, '/products', 'opportunities-1024.png', 1024, 820);
  await capture(page, '/products', 'opportunities-768.png', 768, 900);
  await capture(page, '/dashboard', 'overview-1920.png', 1920, 1080);
});
