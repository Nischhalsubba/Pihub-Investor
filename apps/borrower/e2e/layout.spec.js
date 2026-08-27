import { test, expect } from '@playwright/test';

const open = page => page.goto('/?pihub_demo_access=borrower&source=investor-access');

test('borrower wide dashboard uses the exact Investor desktop canvas', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1053 });
  await open(page);
  await expect(page.getByRole('heading', { name: 'Financing overview' })).toBeVisible();

  const layout = await page.evaluate(() => {
    const main = document.querySelector('.ph-main');
    const stage = document.querySelector('.ph-route-stage');
    const priorityIcon = document.querySelector('.ph-priority-icon');
    const mainRect = main.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const priorityIconRect = priorityIcon.getBoundingClientRect();
    const mainStyle = getComputedStyle(main);
    return {
      mainWidth: mainRect.width,
      stageWidth: stageRect.width,
      paddingLeft: parseFloat(mainStyle.paddingLeft),
      paddingRight: parseFloat(mainStyle.paddingRight),
      leftGutter: stageRect.left - mainRect.left,
      rightGutter: mainRect.right - stageRect.right,
      priorityIconWidth: priorityIconRect.width,
      priorityIconHeight: priorityIconRect.height,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(layout.stageWidth).toBeGreaterThanOrEqual(1439);
  expect(layout.stageWidth).toBeLessThanOrEqual(1441);
  expect(layout.paddingLeft).toBe(40);
  expect(layout.paddingRight).toBe(40);
  expect(Math.abs(layout.leftGutter - ((layout.mainWidth - layout.stageWidth) / 2))).toBeLessThanOrEqual(2);
  expect(Math.abs(layout.leftGutter - layout.rightGutter)).toBeLessThanOrEqual(2);
  // The current Investor-derived priority treatment is a 36px framed icon,
  // not the older unframed 20–24px glyph the stale regression expected.
  expect(layout.priorityIconWidth).toBeGreaterThanOrEqual(35);
  expect(layout.priorityIconWidth).toBeLessThanOrEqual(37);
  expect(layout.priorityIconHeight).toBeGreaterThanOrEqual(35);
  expect(layout.priorityIconHeight).toBeLessThanOrEqual(37);
  expect(layout.overflow).toBeLessThanOrEqual(2);
});
