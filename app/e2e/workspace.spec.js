import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();

  try {
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  } catch (error) {
    const diagnostic = await page.evaluate(() => ({
      href: window.location.href,
      hasSessionToken: Boolean(window.sessionStorage.getItem('token')),
      text: document.body ? document.body.innerText.slice(0, 1800) : '',
      rootHtml: document.getElementById('root') ? document.getElementById('root').innerHTML.slice(0, 1800) : ''
    }));
    throw new Error(`Demo login did not reach the Overview workspace. Runtime diagnostic: ${JSON.stringify(diagnostic)}\n${error.message}`);
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

const getOverflowDiagnostic = async page => page.evaluate(() => {
  const viewportWidth = document.documentElement.clientWidth;
  const overflow = document.documentElement.scrollWidth - viewportWidth;
  const offenders = Array.from(document.querySelectorAll('body *')).map(element => {
    const rect = element.getBoundingClientRect();
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || '',
      className: typeof element.className === 'string' ? element.className : '',
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      width: Math.round(rect.width)
    };
  }).filter(item => item.right > viewportWidth + 2 || item.left < -2).sort((a, b) => (b.right - viewportWidth) - (a.right - viewportWidth)).slice(0, 8);
  return { overflow, viewportWidth, offenders };
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

test('institution profile is complete, readable and accessible', async ({ page }) => {
  await login(page);
  await page.goto('/user/profile');
  await expect(page.getByRole('heading', { name: 'Institution profile' })).toBeVisible();
  await expect(page.locator('.institution-profile-v3')).toBeVisible();
  await expect(page.locator('.profile-v3-person')).toHaveCount(3);
  await expect(page.getByText('Not supplied', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Verification complete', { exact: true }).first()).toBeVisible();

  const shellGeometry = await page.evaluate(() => {
    const header = document.querySelector('.ap-topbar-v4');
    const sidebar = document.querySelector('.ap-sidebar');
    const headerRect = header.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    return {
      viewportWidth: document.documentElement.clientWidth,
      header: { left: headerRect.left, right: headerRect.right, width: headerRect.width, bottom: headerRect.bottom },
      sidebar: { top: sidebarRect.top }
    };
  });
  expect(Math.abs(shellGeometry.header.left), `Header should start at viewport left: ${JSON.stringify(shellGeometry)}`).toBeLessThanOrEqual(1);
  expect(Math.abs(shellGeometry.header.right - shellGeometry.viewportWidth), `Header should reach viewport right: ${JSON.stringify(shellGeometry)}`).toBeLessThanOrEqual(2);
  expect(Math.abs(shellGeometry.header.width - shellGeometry.viewportWidth), `Header should span viewport width: ${JSON.stringify(shellGeometry)}`).toBeLessThanOrEqual(2);
  expect(shellGeometry.sidebar.top, `Sidebar should begin below the global header: ${JSON.stringify(shellGeometry)}`).toBeGreaterThanOrEqual(shellGeometry.header.bottom - 1);

  const navBox = await page.locator('.ap-topbar-v4').boundingBox();
  expect(navBox, 'Global workspace header should have measurable layout').not.toBeNull();
  expect(navBox.height, `Unexpected global header height: ${navBox && navBox.height}`).toBeLessThanOrEqual(96);

  await expect(page.locator('.ap-language-v4')).toBeVisible();
  await expect(page.locator('.ap-language-v4 img')).toHaveCount(0);
  const english = page.getByRole('button', { name: 'Use English' });
  const german = page.getByRole('button', { name: 'Deutsch verwenden' });
  await expect(english).toBeVisible();
  await expect(german).toBeVisible();
  await german.click();
  await expect(german).toHaveAttribute('aria-pressed', 'true');
  await english.click();
  await expect(english).toHaveAttribute('aria-pressed', 'true');

  const contactBoxes = await page.locator('.profile-v3-person').evaluateAll(nodes => nodes.map(node => Math.round(node.getBoundingClientRect().width)));
  expect(Math.min(...contactBoxes), `Relationship cards are collapsing: ${JSON.stringify(contactBoxes)}`).toBeGreaterThan(220);

  await expectNoSeriousA11y(page);
});

test('workspace does not create page-level horizontal overflow', async ({ page }) => {
  await login(page);
  for (const route of ['/dashboard', '/products', '/credit-request', '/products-invested', '/user/profile', '/opportunities/new']) {
    await page.goto(route);
    await expectNoCrash(page);
    const diagnostic = await getOverflowDiagnostic(page);
    expect(diagnostic.overflow, `${route} overflow diagnostic: ${JSON.stringify(diagnostic)}`).toBeLessThanOrEqual(2);
  }
});
