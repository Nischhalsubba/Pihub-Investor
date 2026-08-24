import { test, expect } from '@playwright/test';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

test('desktop sidebar is anchored directly below the global header', async ({ page }) => {
  const width = page.viewportSize()?.width || 0;
  test.skip(width <= 820, 'Desktop shell assertion');

  await login(page);

  const geometry = await page.evaluate(() => {
    const rect = selector => {
      const element = document.querySelector(selector);
      const box = element?.getBoundingClientRect();
      return box ? {
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        height: Math.round(box.height)
      } : null;
    };

    return {
      viewportHeight: document.documentElement.clientHeight,
      header: rect('.ap-topbar-v4'),
      sidebar: rect('.ap-sidebar')
    };
  });

  expect(geometry.header).not.toBeNull();
  expect(geometry.sidebar).not.toBeNull();
  expect(Math.abs(geometry.sidebar.top - geometry.header.bottom), JSON.stringify(geometry)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.sidebar.bottom - geometry.viewportHeight), JSON.stringify(geometry)).toBeLessThanOrEqual(1);
  expect(geometry.sidebar.height, JSON.stringify(geometry)).toBeGreaterThan(300);

  const before = await page.locator('.ap-sidebar').boundingBox();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(100);
  const after = await page.locator('.ap-sidebar').boundingBox();

  expect(before && after && Math.abs(after.y - before.y), JSON.stringify({ before, after })).toBeLessThanOrEqual(1);
});
