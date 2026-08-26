import { test, expect } from '@playwright/test';

const CENTRAL = 'https://pihub-investor.vercel.app';
const stubCentral = async page => page.route(`${CENTRAL}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Central PiHub sign in</h1>' }));
const open = page => page.goto('/?pihub_demo_access=advisory&source=investor-access');
const routes = [
  ['Mandates', '/mandates', 'Mandates'],
  ['Transactions', '/transactions', /PH-2026-0147/],
  ['Structuring', '/structuring', 'Financing structure'],
  ['Counterparties', '/counterparties', 'Counterparties'],
  ['Due diligence', '/due-diligence', 'Due diligence'],
  ['Execution', '/execution', 'Term sheet & execution'],
  ['Tasks', '/tasks', 'Execution tasks'],
];

test('advisory design contract, Investor-style utilities and every destination', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('heading', { name: 'Transaction overview' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open search and command menu/i })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Workspace language preference' })).toBeVisible();
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

test('advisory mutations persist', async ({ page }) => {
  await open(page);
  await page.goto('/mandates');
  const stage = page.getByLabel('Stage for MAN-2417');
  await stage.selectOption('Term sheet');
  await page.reload();
  await expect(stage).toHaveValue('Term sheet');
  await page.goto('/structuring');
  await page.getByLabel('Pricing').fill('EURIBOR + 450 bps');
  await page.getByRole('button', { name: 'Save structure' }).click();
  await page.reload();
  await expect(page.getByLabel('Pricing')).toHaveValue('EURIBOR + 450 bps');
  await page.goto('/due-diligence');
  await page.getByRole('button', { name: 'Mark complete' }).first().click();
  await expect(page.getByText('Complete', { exact: true }).first()).toBeVisible();
  await page.goto('/tasks');
  await page.getByRole('button', { name: 'Complete' }).first().click();
  await expect(page.getByText('Complete', { exact: true }).first()).toBeVisible();
});

test('advisory command palette and notifications navigate to real work', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: /Open search and command menu/i }).click();
  await page.getByRole('textbox', { name: 'Search workspace destinations' }).fill('Structuring');
  await page.getByRole('button', { name: /Structuring/ }).click();
  await expect(page).toHaveURL(/\/structuring$/);
  await page.getByRole('button', { name: /unread notifications/i }).click();
  await page.getByRole('button', { name: /Valuation sign-off pending/ }).click();
  await expect(page).toHaveURL(/\/due-diligence$/);
});

test('advisory account dropdown and one login surface', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await stubCentral(page);
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${CENTRAL}/login/advisory`);
});

test('advisory direct visit redirects centrally', async ({ page }) => {
  await stubCentral(page);
  await page.goto('/');
  await expect(page).toHaveURL(`${CENTRAL}/login/advisory`);
});
