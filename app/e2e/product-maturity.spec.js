import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('maturity.qa@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

const seriousA11y = async page => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
};

test('opportunity workspace uses one View control and mature saved views', async ({ page }) => {
  await login(page);
  await page.goto('/products?status=requested&sort=credit&dir=desc');
  await expect(page.locator('.ap-view-menu > summary')).toHaveText(/View/);
  await expect(page.locator('.data-toolbar > .data-toolbar-actions > .data-menu')).toHaveCount(0);
  await page.locator('.ap-view-menu > summary').click();

  await page.getByLabel('Saved view name').fill('Priority requested');
  await page.getByRole('button', { name: 'Save view' }).click();
  const priorityView = page.locator('.ap-saved-view-copy').filter({ hasText: 'Priority requested' }).first();
  await expect(priorityView).toBeVisible();

  await page.getByRole('button', { name: 'Set Priority requested as default' }).click();
  await expect(page.locator('.ap-saved-view-item.is-default')).toContainText('Priority requested');

  await page.getByRole('button', { name: 'Rename Priority requested' }).evaluate(button => {
    window.prompt = () => 'Credit priorities';
    button.click();
  });
  await expect(page.locator('.ap-saved-view-copy').filter({ hasText: 'Credit priorities' }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Delete Credit priorities' }).click();
  await expect(page.locator('.ap-saved-view-copy').filter({ hasText: 'Credit priorities' })).toHaveCount(0);
});

test('new workspace controls switch immediately between EN and DE', async ({ page }) => {
  await login(page);
  await page.goto('/products');
  await expect(page.locator('.ap-view-menu > summary')).toContainText('View');
  await page.getByRole('button', { name: /Deutsch/i }).click();
  await expect(page.locator('.ap-view-menu > summary')).toContainText('Ansicht');
  await page.locator('.ap-view-menu > summary').click();
  await expect(page.getByText('Gespeicherte Ansichten', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kompakt' })).toBeVisible();
  await page.getByRole('button', { name: /English/i }).click();
  await expect(page.locator('.ap-view-menu > summary')).toContainText('View');
});

test('decision surfaces expose owner risk review and yield context', async ({ page }) => {
  await login(page);
  await page.goto('/products');
  const inspector = page.locator('.ap-inspector');
  await expect(inspector.getByText('Risk / rating', { exact: true })).toBeVisible();
  await expect(inspector.getByText('Owner', { exact: true })).toBeVisible();
  await expect(inspector.getByText('Next review', { exact: true })).toBeVisible();
  await expect(inspector.getByText('Mara Klein', { exact: true })).toBeVisible();

  await page.goto('/credit-request');
  await expect(page.getByRole('columnheader', { name: 'Owner' })).toBeVisible();
  await expect(page.getByText('Jonas Weber', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Not supplied', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Unassigned', { exact: true })).toHaveCount(0);

  await page.goto('/products-invested');
  await expect(page.getByRole('columnheader', { name: 'Yield' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Risk' })).toBeVisible();
  await expect(page.getByText(/5\.35%|5\.60%|5\.75%/).first()).toBeVisible();
  expect(await seriousA11y(page)).toEqual([]);
});

test('canonical responsive widths have no page-level horizontal overflow', async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium' || testInfo.project.name !== 'chromium-desktop', 'Canonical breakpoint geometry is measured once in Chromium desktop.');
  await login(page);
  const widths = [375, 768, 1024, 1440, 1920];
  const routes = ['/dashboard', '/products', '/credit-request', '/products-invested', '/user/profile'];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width <= 768 ? 900 : 1000 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('.ap-main')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflowed at ${width}px`).toBeLessThanOrEqual(2);
    }
  }
});

test('reduced motion preserves content and suppresses spatial choreography', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await login(page);
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: /All Products/i })).toBeVisible();
  const stage = page.locator('.route-stage');
  await expect(stage).toHaveCSS('transform', 'none');
  await page.getByRole('button', { name: /Quick view Growth Loan A/i }).click();
  const drawer = page.locator('.ap-context-drawer');
  await expect(drawer).toBeVisible();
  const transform = await drawer.evaluate(element => getComputedStyle(element).transform);
  expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy();
});
