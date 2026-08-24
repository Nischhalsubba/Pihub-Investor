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
    const diagnostic = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h1')).find(node => node.textContent.trim() === 'Overview');
      const visibilityChain = [];
      let node = heading;
      while (node && visibilityChain.length < 9) {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        visibilityChain.push({
          tag: node.tagName.toLowerCase(),
          id: node.id || '',
          className: typeof node.className === 'string' ? node.className : '',
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          overflow: style.overflow,
          position: style.position,
          transform: style.transform,
          clipPath: style.clipPath,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          top: Math.round(rect.top),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        });
        node = node.parentElement;
      }
      return {
        href: window.location.href,
        hasSessionToken: Boolean(window.sessionStorage.getItem('token')),
        hasSessionMarker: Boolean(window.sessionStorage.getItem('pihub-auth-session-v2')),
        viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
        visibilityChain,
        text: document.body ? document.body.innerText.slice(0, 1800) : '',
        rootHtml: document.getElementById('root') ? document.getElementById('root').innerHTML.slice(0, 1800) : ''
      };
    });
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

const getShellGeometry = async page => page.evaluate(() => {
  const rect = selector => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return {
      left: Math.round(box.left),
      top: Math.round(box.top),
      right: Math.round(box.right),
      bottom: Math.round(box.bottom),
      width: Math.round(box.width),
      height: Math.round(box.height)
    };
  };

  return {
    viewportWidth: document.documentElement.clientWidth,
    viewportHeight: document.documentElement.clientHeight,
    header: rect('.ap-topbar-v4'),
    brand: rect('.ap-global-brand'),
    headerMain: rect('.ap-global-header-main'),
    sidebar: rect('.ap-sidebar'),
    workspace: rect('.ap-workspace'),
    main: rect('main#main-content')
  };
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

test('clearing browser auth storage returns protected routes to login', async ({ page }) => {
  await login(page);
  await expect(page.locator('.ap-topbar-v4')).toBeVisible();

  await page.evaluate(() => {
    window.sessionStorage.clear();
    window.localStorage.removeItem('token');
  });
  await page.reload();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  await expect(page.locator('.ap-topbar-v4')).toHaveCount(0);
  await expect(page.locator('.ap-sidebar')).toHaveCount(0);
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

  const shell = await getShellGeometry(page);
  expect(shell.header, `Header missing: ${JSON.stringify(shell)}`).not.toBeNull();
  expect(shell.brand, `Brand rail missing: ${JSON.stringify(shell)}`).not.toBeNull();
  expect(shell.headerMain, `Header utility rail missing: ${JSON.stringify(shell)}`).not.toBeNull();
  expect(shell.sidebar, `Sidebar missing: ${JSON.stringify(shell)}`).not.toBeNull();
  expect(shell.workspace, `Workspace missing: ${JSON.stringify(shell)}`).not.toBeNull();
  expect(shell.main, `Main content missing: ${JSON.stringify(shell)}`).not.toBeNull();

  expect(Math.abs(shell.header.left), `Header should start at viewport left: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(1);
  expect(Math.abs(shell.header.right - shell.viewportWidth), `Header should reach viewport right: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(2);
  expect(Math.abs(shell.header.width - shell.viewportWidth), `Header should span viewport width: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(2);
  expect(shell.header.height, `Header must stay one row: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(72);

  expect(Math.abs(shell.brand.top - shell.header.top), `Brand and utility header split into separate rows: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(3);
  expect(Math.abs(shell.brand.bottom - shell.header.bottom), `Brand rail must remain in header row: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(3);
  expect(Math.abs(shell.headerMain.top - shell.header.top), `Header utilities must share the brand row: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(3);
  expect(Math.abs(shell.headerMain.bottom - shell.header.bottom), `Header utilities must remain in header row: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(3);
  expect(shell.sidebar.top, `Sidebar should begin below the global header: ${JSON.stringify(shell)}`).toBeGreaterThanOrEqual(shell.header.bottom - 1);

  if (shell.viewportWidth > 820) {
    expect(Math.abs(shell.sidebar.left), `Desktop sidebar should start at viewport left: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(1);
    expect(Math.abs(shell.workspace.left - shell.sidebar.right), `Workspace must begin exactly after sidebar: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(2);
    expect(shell.main.width, `Desktop main content collapsed: ${JSON.stringify(shell)}`).toBeGreaterThan(720);
    expect(shell.main.width, `Desktop main content is unbounded: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(1482);
    expect(shell.main.left, `Main content escaped workspace: ${JSON.stringify(shell)}`).toBeGreaterThanOrEqual(shell.workspace.left);
    expect(shell.main.right, `Main content escaped viewport: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(shell.viewportWidth);
  } else {
    expect(Math.abs(shell.workspace.left), `Mobile workspace should start at viewport left: ${JSON.stringify(shell)}`).toBeLessThanOrEqual(1);
  }

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

test('desktop shell stays fixed, seam-free and uses readable UI typography', async ({ page }) => {
  await login(page);

  const visual = await page.evaluate(() => {
    const px = (selector, property) => {
      const node = document.querySelector(selector);
      return node ? Number.parseFloat(window.getComputedStyle(node)[property]) : null;
    };
    const style = selector => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const computed = window.getComputedStyle(node);
      return {
        backgroundColor: computed.backgroundColor,
        borderBottomWidth: computed.borderBottomWidth,
        position: computed.position,
        overflowY: computed.overflowY
      };
    };
    return {
      viewportWidth: document.documentElement.clientWidth,
      header: style('.ap-topbar-v4'),
      brand: style('.ap-global-brand'),
      sidebar: style('.ap-sidebar'),
      titleSize: px('.content-head__title', 'fontSize'),
      copySize: px('.content-head-copy', 'fontSize'),
      navSize: px('.ap-nav-label', 'fontSize'),
      metricPadding: px('.ap-metric', 'paddingTop'),
      metricHelp: px('.ap-metric small', 'fontSize')
    };
  });

  expect(visual.header && visual.header.borderBottomWidth, `Header style missing: ${JSON.stringify(visual)}`).toBe('0px');
  expect(visual.brand && visual.sidebar && visual.brand.backgroundColor, `Brand/sidebar background missing: ${JSON.stringify(visual)}`).toBe(visual.sidebar.backgroundColor);
  expect(visual.titleSize, `Page title size missing: ${JSON.stringify(visual)}`).toBeGreaterThanOrEqual(30);
  expect(visual.copySize, `Page description is too small: ${JSON.stringify(visual)}`).toBeGreaterThanOrEqual(13.5);
  expect(visual.navSize, `Sidebar labels are too small: ${JSON.stringify(visual)}`).toBeGreaterThanOrEqual(12.5);
  expect(visual.metricPadding, `Metric spacing collapsed: ${JSON.stringify(visual)}`).toBeGreaterThanOrEqual(20);
  expect(visual.metricHelp, `Metric support text is too small: ${JSON.stringify(visual)}`).toBeGreaterThanOrEqual(11);

  if (visual.viewportWidth > 820) {
    expect(visual.sidebar.position, `Desktop sidebar is not fixed: ${JSON.stringify(visual)}`).toBe('fixed');
    expect(visual.sidebar.overflowY, `Desktop sidebar should not be its own normal scroll region: ${JSON.stringify(visual)}`).toBe('hidden');
    const before = await page.locator('.ap-sidebar').boundingBox();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(100);
    const after = await page.locator('.ap-sidebar').boundingBox();
    expect(before && after && Math.abs(after.y - before.y), `Sidebar moved with document scroll: ${JSON.stringify({ before, after })}`).toBeLessThanOrEqual(1);
  }
});

test('lazy authenticated navigation shows structured skeleton without removing the shell', async ({ page }) => {
  await login(page);
  let delayed = false;

  await page.route('**/assets/*.js', async route => {
    const request = route.request();
    if (!delayed && request.resourceType() === 'script') {
      delayed = true;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await route.continue();
  });

  await page.getByRole('link', { name: /invested products/i }).click();
  if (delayed) await expect(page.locator('.workspace-skeleton')).toBeVisible({ timeout: 1600 });
  await expect(page.locator('.ap-topbar-v4')).toBeVisible();
  await expect(page.locator('.ap-sidebar')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Invested Products/i })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.workspace-skeleton')).toHaveCount(0);
  await page.unroute('**/assets/*.js');
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
