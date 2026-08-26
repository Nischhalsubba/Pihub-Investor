import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const open = page => page.goto('/?pihub_demo_access=advisory&source=investor-access');
const assertPage = async page => {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const blocking = result.violations.filter(item => ['serious', 'critical'].includes(item.impact));
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
};

test('Advisory overview and execution routes stay WCAG-clean and contained', async ({ page }) => {
  await open(page);
  await assertPage(page);
  await page.goto('/structuring');
  await assertPage(page);
  await page.goto('/due-diligence');
  await assertPage(page);
});
