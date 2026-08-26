import { test, expect } from '@playwright/test';

const CENTRAL = 'https://pihub-investor.vercel.app';
const stubCentral = async page => page.route(`${CENTRAL}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Central PiHub sign in</h1>' }));
const open = page => page.goto('/?pihub_demo_access=admin&source=investor-access');
const routes = [
  ['Organizations', '/organizations', 'Organizations'],
  ['Users & roles', '/users', 'Users & roles'],
  ['Compliance', '/compliance', 'Compliance queue'],
  ['Access policies', '/access-policies', 'Access policies'],
  ['Audit log', '/audit', 'Audit log'],
  ['Platform', '/platform', 'Platform boundaries'],
];

test('admin is a first-class control plane with Investor-style utilities', async ({ page }) => {
  await open(page);
  await expect(page.locator('.ph-app[data-workspace="admin"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Platform governance' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open search and command menu/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /unread notifications/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open account menu' })).toBeVisible();
  if ((page.viewportSize()?.width || 0) > 820) {
    const design = await page.evaluate(() => {
      const computed = node => getComputedStyle(node);
      return { size: computed(document.body).fontSize, top: computed(document.querySelector('.ph-topbar')).height, side: computed(document.querySelector('.ph-sidebar')).width, bg: computed(document.querySelector('.ph-sidebar')).backgroundColor };
    });
    expect(design.size).toBe('15px');
    expect(design.top).toBe('68px');
    expect(design.side).toBe('232px');
    expect(design.bg).toBe('rgb(11, 18, 32)');
  }
  for (const [label, path, heading] of routes) {
    await page.getByRole('link', { name: label, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('admin governance mutations persist and have explicit controls', async ({ page }) => {
  await open(page);
  await page.goto('/users');
  await page.getByRole('button', { name: 'Add Borrower' }).first().click();
  await expect(page.getByRole('button', { name: 'Remove Borrower' }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Remove Borrower' }).first()).toBeVisible();
  await page.goto('/compliance');
  await page.getByRole('button', { name: 'Verify demo' }).first().click();
  await expect(page.getByText('Verified', { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText('Verified', { exact: true }).first()).toBeVisible();
});

test('admin command and notification utilities navigate to governance work', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: /Open search and command menu/i }).click();
  await page.getByRole('textbox', { name: 'Search workspace destinations' }).fill('Audit');
  await page.getByRole('button', { name: /Audit log/ }).click();
  await expect(page).toHaveURL(/\/audit$/);
  await page.getByRole('button', { name: /unread notifications/i }).click();
  await page.getByRole('button', { name: /KYB review requires action/ }).click();
  await expect(page).toHaveURL(/\/compliance$/);
});

test('admin account dropdown and one login surface', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await stubCentral(page);
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${CENTRAL}/login?next=admin`);
});

test('admin direct visit redirects centrally', async ({ page }) => {
  await stubCentral(page);
  await page.goto('/');
  await expect(page).toHaveURL(`${CENTRAL}/login?next=admin`);
});
