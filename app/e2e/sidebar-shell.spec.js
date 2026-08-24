import { test, expect } from '@playwright/test';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('desktop sidebar fills the viewport below the global header and stays fixed', async ({ page }) => {
  await login(page);

  const initial = await page.evaluate(() => {
    const sidebar = document.querySelector('.ap-sidebar');
    const header = document.querySelector('.ap-topbar-v4');
    const sidebarBox = sidebar && sidebar.getBoundingClientRect();
    const headerBox = header && header.getBoundingClientRect();
    const sidebarStyle = sidebar && window.getComputedStyle(sidebar);
    return {
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: window.innerHeight,
      position: sidebarStyle && sidebarStyle.position,
      top: sidebarBox && sidebarBox.top,
      bottom: sidebarBox && sidebarBox.bottom,
      height: sidebarBox && sidebarBox.height,
      headerBottom: headerBox && headerBox.bottom
    };
  });

  test.skip(initial.viewportWidth <= 820, 'Desktop fixed-sidebar contract only applies above 820px.');

  expect(initial.position, `Sidebar must be fixed: ${JSON.stringify(initial)}`).toBe('fixed');
  expect(Math.abs(initial.top - initial.headerBottom), `Sidebar must start directly below header: ${JSON.stringify(initial)}`).toBeLessThanOrEqual(2);
  expect(Math.abs(initial.bottom - initial.viewportHeight), `Sidebar must reach viewport bottom: ${JSON.stringify(initial)}`).toBeLessThanOrEqual(2);
  expect(Math.abs(initial.height - (initial.viewportHeight - initial.headerBottom)), `Sidebar height must fill remaining viewport: ${JSON.stringify(initial)}`).toBeLessThanOrEqual(3);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(120);

  const after = await page.locator('.ap-sidebar').boundingBox();
  expect(after, 'Sidebar disappeared after document scroll.').not.toBeNull();
  expect(Math.abs(after.y - initial.top), `Sidebar moved with page scroll: ${JSON.stringify({ initial, after })}`).toBeLessThanOrEqual(1);
  expect(Math.abs((after.y + after.height) - initial.viewportHeight), `Sidebar stopped filling viewport after scroll: ${JSON.stringify({ initial, after })}`).toBeLessThanOrEqual(2);
});
