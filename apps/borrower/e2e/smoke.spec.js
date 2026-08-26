import { test, expect } from '@playwright/test';

const CENTRAL_LOGIN = 'https://pihub-investor.vercel.app';
const ADVISORY_ORIGIN = 'https://pihub-advisory-nischhalsubbas-projects.vercel.app';
const stubCentral = async page => page.route(`${CENTRAL_LOGIN}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Central PiHub sign in</h1>' }));
const open = page => page.goto('/?pihub_demo_access=borrower&source=investor-access');
const routes = [
  ['New application', '/applications/new', 'Start a financing application'],
  ['Financing request', '/financing', 'Financing request'],
  ['Company', '/company', 'Company information'],
  ['Project / Property', '/project', 'Project & property'],
  ['Financials', '/financials', 'Financial information'],
  ['Documents', '/documents', 'Document room'],
  ['PiHub requests', '/requests', 'Requests from PiHub'],
  ['Terms & closing', '/closing', 'Terms & closing'],
  ['Account', '/account', 'Organization account'],
];

test('borrower design contract, Investor-style utilities and every destination', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('heading', { name: 'Financing overview' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open search and command menu/i })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Workspace language preference' })).toBeVisible();
  await expect(page.getByRole('button', { name: /unread notifications/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open account menu' })).toBeVisible();

  if ((page.viewportSize()?.width || 0) > 820) {
    const design = await page.evaluate(() => {
      const computed = node => getComputedStyle(node);
      return {
        size: computed(document.body).fontSize,
        top: computed(document.querySelector('.ph-topbar')).height,
        side: computed(document.querySelector('.ph-sidebar')).width,
        bg: computed(document.querySelector('.ph-sidebar')).backgroundColor,
      };
    });
    expect(design.size).toBe('15px');
    expect(design.top).toBe('68px');
    expect(design.side).toBe('232px');
    expect(design.bg).toBe('rgb(11, 18, 32)');
  }

  for (const [label, path, heading] of routes) {
    await page.getByRole('link', { name: label, exact: true }).first().click();
    await expect(page).toHaveURL(new RegExp(`${path.replace('/', '\\/')}`));
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('create application starts a clean editable draft', async ({ page }) => {
  await open(page);
  await page.getByRole('link', { name: 'New application', exact: true }).first().click();
  await page.getByLabel('Borrowing company').fill('Neue Wohnbau GmbH');
  await page.getByLabel('Project / transaction').fill('Munich Housing Programme');
  await page.getByLabel('Requested amount (EUR)').fill('22500000');
  await page.getByLabel('Financing purpose').fill('Acquisition and refurbishment financing');
  await page.getByRole('button', { name: 'Create application' }).click();
  await expect(page).toHaveURL(/\/financing\?created=1$/);
  await expect(page.getByRole('heading', { name: 'Financing request' })).toBeVisible();
  await expect(page.getByLabel('Requested amount (EUR)')).toHaveValue('22500000');
  await expect(page.getByText('Application created.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Requested amount (EUR)')).toHaveValue('22500000');
});

test('borrower mutations persist', async ({ page }) => {
  await open(page);
  await page.goto('/financing');
  await page.getByLabel('Requested amount (EUR)').fill('19500000');
  await page.getByRole('button', { name: 'Save financing request' }).click();
  await page.reload();
  await expect(page.getByLabel('Requested amount (EUR)')).toHaveValue('19500000');
  await page.goto('/company');
  await page.getByLabel('Employees').fill('31');
  await page.getByRole('button', { name: 'Save company' }).click();
  await page.reload();
  await expect(page.getByLabel('Employees')).toHaveValue('31');
  await page.goto('/documents');
  await page.getByRole('button', { name: 'Mark demo upload' }).first().click();
  await expect(page.getByText('Uploaded', { exact: true }).first()).toBeVisible();
  await page.goto('/requests');
  await page.getByRole('button', { name: 'Mark complete' }).first().click();
  await expect(page.getByText('Complete', { exact: true }).first()).toBeVisible();
});

test('command palette and notification center are functional', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: /Open search and command menu/i }).click();
  await page.getByRole('textbox', { name: 'Search workspace destinations' }).fill('Documents');
  await page.getByRole('button', { name: /Documents/ }).click();
  await expect(page).toHaveURL(/\/documents$/);
  await page.getByRole('button', { name: /unread notifications/i }).click();
  await expect(page.getByRole('dialog', { name: 'Notification center' })).toBeVisible();
  await page.getByRole('button', { name: /Financial statements required/ }).click();
  await expect(page).toHaveURL(/\/documents$/);
});

test('borrower submission hands the canonical deal to Advisory without credentials in the URL', async ({ page }) => {
  await open(page);
  await page.goto('/financing');
  await page.route(`${ADVISORY_ORIGIN}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Advisory handoff</h1>' }));
  await page.getByRole('button', { name: 'Submit financing request' }).click();
  await expect(page).toHaveURL(new RegExp(`^${ADVISORY_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\?`));
  const url = new URL(page.url());
  expect(url.searchParams.get('pihub_workflow')).toBeTruthy();
  expect(url.search).not.toMatch(/password|email|token/i);
});

test('borrower account dropdown and one login surface', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Open account menu' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await stubCentral(page);
  await page.getByRole('menuitem', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`);
});

test('borrower direct visit redirects centrally', async ({ page }) => {
  await stubCentral(page);
  await page.goto('/');
  await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`);
});
