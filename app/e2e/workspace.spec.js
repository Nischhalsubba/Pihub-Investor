import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const attachBrowserDiagnostics = page => {
  page.on('pageerror', error => console.error(`[browser:pageerror] ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      console.error(`[browser:${message.type()}] ${message.text()}`);
    }
  });
};

const dumpLoginState = async page => {
  const state = await page.evaluate(() => ({
    href: window.location.href,
    hasSessionToken: Boolean(window.sessionStorage.getItem('token')),
    hasLegacyToken: Boolean(window.localStorage.getItem('token')),
    body: (document.body && document.body.innerText ? document.body.innerText : '').slice(0, 3000)
  }));
  console.error(`[login:diagnostic] ${JSON.stringify(state)}`);
};

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');

  try {
    await Promise.all([
      page.waitForURL(url => url.pathname === '/dashboard', { timeout: 10000 }),
      page.getByRole('button', { name: /login/i }).click()
    ]);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
  } catch (error) {
    await dumpLoginState(page);
    throw error;
  }
};

const expectNoCrash = async page => {
  await expect(page.getByText('We could not open the investor workspace.')).toHaveCount(0);
};

const expectNoSeriousA11y = async page => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const blocking = results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  expect(blocking, blocking.map(item => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  attachBrowserDiagnostics(page);
});

test('demo login creates a refresh-safe authenticated session', async ({ page }) => {
  await login(page);
  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator('main#main-content')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible();
});

test('critical workspace routes survive navigation and refresh', async ({ page }) => {
  await login(page);
  for (const route of ['/products', '/credit-request', '/products-invested', '/user/profile', '/opportunities/DEMO-001']) {
    await page.goto(route);
    await expectNoCrash(page);
    await page.reload();
    await expectNoCrash(page);
    await expect(page.locator('main#main-content')).toBeVisible();
  }
});

test('unknown authenticated routes render a recoverable 404', async ({ page }) => {
  await login(page);
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByText('This workspace page does not exist.')).toBeVisible();
  await expectNoCrash(page);
});

test('login and dashboard have no serious WCAG A/AA violations', async ({ page }) => {
  await page.goto('/login');
  await expectNoSeriousA11y(page);
  await login(page);
  await expectNoSeriousA11y(page);
});

test('workspace does not create page-level horizontal overflow', async ({ page }) => {
  await login(page);
  for (const route of ['/dashboard', '/products', '/credit-request', '/products-invested', '/user/profile', '/opportunities/new']) {
    await page.goto(route);
    await expectNoCrash(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  }
});
