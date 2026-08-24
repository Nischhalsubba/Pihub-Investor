import { test, expect } from '@playwright/test';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

const centerY = box => box.y + box.height / 2;

test('desktop opportunity toolbar keeps filters and workspace actions on one baseline', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'Desktop alignment contract');
  await page.setViewportSize({ width: 1600, height: 900 });
  await login(page);
  await page.goto('/products');

  const queryLine = page.locator('.data-toolbar > .ap-query-line');
  const actions = page.locator('.data-toolbar > .data-toolbar-actions');
  await expect(queryLine).toHaveCSS('margin-bottom', '0px');
  await expect(actions).toHaveCSS('padding-top', '0px');

  const controls = [
    page.locator('#opportunity-search'),
    page.locator('.ap-filter-tabs'),
    page.locator('.ap-search-submit'),
    page.getByRole('button', { name: 'Export CSV' }),
    page.locator('.ap-view-menu > summary')
  ];

  const boxes = [];
  for (const control of controls) {
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box.height - 44)).toBeLessThanOrEqual(1);
    boxes.push(box);
  }

  const centers = boxes.map(centerY);
  // WebKit exposes native form-control baselines with fractional CSS-pixel
  // rounding even when their visible border boxes are aligned. Keep the core
  // engines at 2px and allow only this engine-specific rendering variance.
  const controlCenterTolerance = testInfo.project.name.includes('webkit') ? 6 : 2;
  expect(Math.max(...centers) - Math.min(...centers), 'Toolbar controls drifted off the shared centerline').toBeLessThanOrEqual(controlCenterTolerance);

  const queryBox = await queryLine.boundingBox();
  const actionsBox = await actions.boundingBox();
  expect(queryBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(Math.abs(centerY(queryBox) - centerY(actionsBox)), 'Filter and action rails are vertically misaligned').toBeLessThanOrEqual(2);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'Opportunity toolbar created page-level horizontal overflow').toBeLessThanOrEqual(2);
});

test('crowded desktop stacks opportunity toolbar rails before controls collide', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'Desktop responsive toolbar contract');
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page);
  await page.goto('/products');

  const toolbar = page.locator('.data-toolbar');
  const queryLine = toolbar.locator('> .ap-query-line');
  const actions = toolbar.locator('> .data-toolbar-actions');
  const queryBox = await queryLine.boundingBox();
  const actionsBox = await actions.boundingBox();
  expect(queryBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  expect(actionsBox.y, 'Workspace actions should move below filters before the toolbar becomes crowded').toBeGreaterThanOrEqual(queryBox.y + queryBox.height - 1);

  const view = page.locator('.ap-view-menu > summary');
  await expect(view).toBeVisible();
  await view.click();
  const compact = page.getByRole('button', { name: 'Compact' }).first();
  await expect(compact).toBeVisible();
  await compact.click();
  await expect(compact).toHaveAttribute('aria-pressed', 'true');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'Responsive opportunity toolbar created page-level horizontal overflow').toBeLessThanOrEqual(2);
});
