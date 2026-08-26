import { test, expect } from '@playwright/test';

const open = page => page.goto('/?pihub_demo_access=admin&source=investor-access');

test('admin wide dashboard uses the Investor desktop canvas', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1053 });
  await open(page);
  await expect(page.getByRole('heading', { name: 'Platform governance' })).toBeVisible();

  const layout = await page.evaluate(() => {
    const main = document.querySelector('.ph-main');
    const stage = document.querySelector('.ph-route-stage');
    const mainRect = main.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const mainStyle = getComputedStyle(main);
    return {
      stageWidth: stageRect.width,
      paddingLeft: parseFloat(mainStyle.paddingLeft),
      paddingRight: parseFloat(mainStyle.paddingRight),
      leftGutter: stageRect.left - mainRect.left,
      rightGutter: mainRect.right - stageRect.right,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(layout.stageWidth).toBeGreaterThanOrEqual(1599);
  expect(layout.stageWidth).toBeLessThanOrEqual(1601);
  expect(layout.paddingLeft).toBe(28);
  expect(layout.paddingRight).toBe(28);
  expect(layout.leftGutter).toBeLessThanOrEqual(120);
  expect(Math.abs(layout.leftGutter - layout.rightGutter)).toBeLessThanOrEqual(2);
  expect(layout.overflow).toBeLessThanOrEqual(2);
});
