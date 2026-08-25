import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const login = async page => {
  await page.goto('/login');
  await page.locator('#login-email').fill('qa.investor@example.com');
  await page.locator('#login-password').fill('DemoPassword1!');
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
};

const expectNoSeriousA11y = async page => {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const blocking = results.violations.filter(item => item.impact === 'critical' || item.impact === 'serious');
  expect(blocking, blocking.map(item => `${item.id}: ${item.help}`).join('\n')).toEqual([]);
};

test('workspace product suite renders decision intelligence and complete demo data', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Opportunity pipeline')).toBeVisible();
  await expect(page.getByText('Deployed capital progression')).toBeVisible();
  await expect(page.getByText('Portfolio concentration')).toBeVisible();
  await expect(page.getByText('Maturity distribution')).toBeVisible();
  await expect(page.locator('.ap-role-focus')).toBeVisible();
  await expect(page.locator('.ap-analytics-card')).toHaveCount(4);

  await page.goto('/products');
  await expect(page.getByRole('link', { name: 'Growth Loan A', exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Healthcare Expansion H', exact: true }).first()).toBeVisible();

  await page.goto('/credit-request');
  await expect(page.getByText('Nordstern GmbH', { exact: true })).toBeVisible();
  await expect(page.getByText('BBB+', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Not supplied', { exact: true })).toHaveCount(0);
});

test('global search, recent records and keyboard routes work', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);
  await page.keyboard.press('Control+K');
  await expect(page.getByRole('dialog', { name: /global search and command menu/i })).toBeVisible();
  await page.locator('#pihub-command-search').fill('Growth Loan A');
  await expect(page.getByRole('button', { name: /Growth Loan A/i })).toBeVisible();
  await page.getByRole('button', { name: /Growth Loan A/i }).click();
  await expect(page).toHaveURL(/\/opportunities\/DEMO-001$/);

  await page.keyboard.press('g');
  await page.keyboard.press('p');
  await expect(page).toHaveURL(/\/products$/);

  await page.keyboard.press('?');
  await expect(page.getByRole('dialog', { name: /keyboard shortcuts/i })).toBeVisible();
  await expect(page.getByText('Go to Opportunities', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.keyboard.press('Control+K');
  await expect(page.getByRole('button', { name: /Growth Loan A/i }).first()).toBeVisible();
  await page.keyboard.press('Escape');
});

test('notification center supports unread state, deep links and accessibility', async ({ page }) => {
  await login(page);
  const bell = page.getByRole('button', { name: /unread notifications/i });
  await expect(bell).toBeVisible();
  await bell.click();
  await expect(page.getByRole('dialog', { name: /notifications/i })).toBeVisible();
  await expect(page.locator('.ap-notification-drawer')).toHaveCSS('opacity', '1');
  await expect(page.getByText(/3 unread updates?/i)).toBeVisible();
  await expect(page.getByText('Credit request awaiting review', { exact: true })).toBeVisible();
  await expectNoSeriousA11y(page);

  await page.getByRole('button', { name: 'Mark all read' }).click();
  await expect(page.getByText('You are caught up.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close notifications' }).last().click();
  await expect(page.getByRole('button', { name: /0 unread notifications/i })).toBeVisible();
});

test('opportunity quick view, saved density and compare mode work', async ({ page }) => {
  test.setTimeout(60000);
  await login(page);
  await page.goto('/products');

  await page.locator('.ap-view-menu > summary').click();
  const compact = page.getByRole('button', { name: 'Compact' }).first();
  await compact.click();
  await expect(compact).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.ap-view-menu > summary').click();

  await page.getByRole('button', { name: /Quick view Growth Loan A/i }).click();
  const quickView = page.getByRole('dialog', { name: /Growth Loan A/i });
  await expect(quickView).toBeVisible();
  await expect(quickView.getByRole('heading', { name: 'Decision context' })).toBeVisible();
  await quickView.getByRole('button', { name: 'Close quick view' }).click();

  await page.getByRole('checkbox', { name: /Select Growth Loan A for comparison/i }).check();
  await page.getByRole('checkbox', { name: /Select Expansion Note B for comparison/i }).check();
  await page.getByRole('button', { name: /Compare \(2\)/i }).click();
  await expect(page.getByRole('heading', { name: 'Compare opportunities' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Opportunity comparison' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Growth Loan A/i })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Expansion Note B/i })).toBeVisible();
  await expectNoSeriousA11y(page);
});

test('opportunity drafts autosave locally in demo mode', async ({ page }) => {
  await login(page);
  await page.goto('/opportunities/new');
  const title = page.locator('#opportunity-product_title');
  await title.fill('Recovered Demo Opportunity');
  await expect(page.locator('.ap-autosave-status')).toContainText('Autosaved', { timeout: 4000 });
  const draft = await page.evaluate(() => localStorage.getItem('pihub-opportunity-draft:create:new'));
  expect(draft).toContain('Recovered Demo Opportunity');
  await page.getByRole('button', { name: 'Discard draft' }).click();
  await expect(title).toHaveValue('');
});

test('credit and portfolio rows expose quick review without horizontal page overflow', async ({ page }) => {
  await login(page);
  for (const route of ['/credit-request', '/products-invested']) {
    await page.goto(route);
    const quick = page.getByRole('button', { name: /Quick view/i }).first();
    await expect(quick).toBeVisible();
    await quick.click();
    const drawer = page.locator('.ap-context-drawer');
    await expect(drawer).toBeVisible();
    await drawer.getByRole('button', { name: 'Close quick view' }).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} created page-level overflow`).toBeLessThanOrEqual(2);
  }
});

test('desktop sidebar collapse persists and reflows the workspace', async ({ page }) => {
  await login(page);
  const viewport = page.viewportSize();
  if (!viewport || viewport.width <= 820) {
    await expect(page.getByRole('button', { name: /Collapse sidebar/i })).toHaveCount(0);
    return;
  }

  const sidebar = page.locator('.ap-sidebar');
  const workspace = page.locator('.ap-workspace');
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
  await page.waitForTimeout(380);
  const collapsed = await sidebar.boundingBox();
  const collapsedWorkspace = await workspace.boundingBox();
  expect(collapsed && collapsed.width).toBeLessThanOrEqual(80);
  expect(collapsed && collapsedWorkspace && Math.abs(collapsedWorkspace.x - (collapsed.x + collapsed.width))).toBeLessThanOrEqual(2);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
  const persisted = await sidebar.boundingBox();
  expect(persisted && persisted.width).toBeLessThanOrEqual(80);

  await page.getByRole('button', { name: 'Expand sidebar' }).click();
  await page.waitForTimeout(380);
  const expanded = await sidebar.boundingBox();
  expect(expanded && expanded.width).toBeGreaterThanOrEqual(220);
});

test('overview card headers preserve title hierarchy and action alignment', async ({ page }) => {
  await login(page);

  const attention = page.locator('.overview-panel').filter({ has: page.getByText('Needs attention', { exact: true }) });
  const actions = page.locator('.overview-panel').filter({ has: page.getByText('Workspace actions', { exact: true }) });
  const attentionHeader = attention.locator('> header');
  const attentionCopy = attentionHeader.locator('> div');
  const title = attention.getByText('Needs attention', { exact: true });
  const subtitle = attention.getByText('Earliest visible credit deadlines first', { exact: true });
  const openQueue = attention.getByRole('link', { name: 'Open queue' });
  const actionTitle = actions.getByText('Workspace actions', { exact: true });
  const actionSubtitle = actions.getByText('Go directly to the next operational task', { exact: true });

  await expect(attentionHeader).toHaveCSS('display', 'flex');
  await expect(attentionCopy).toHaveCSS('display', 'grid');
  await expect(title).toHaveCSS('display', 'block');
  await expect(subtitle).toHaveCSS('display', 'block');
  await expect(actionTitle).toHaveCSS('display', 'block');
  await expect(actionSubtitle).toHaveCSS('display', 'block');

  const titleBox = await title.boundingBox();
  const subtitleBox = await subtitle.boundingBox();
  const actionTitleBox = await actionTitle.boundingBox();
  const actionSubtitleBox = await actionSubtitle.boundingBox();
  expect(titleBox).not.toBeNull();
  expect(subtitleBox).not.toBeNull();
  expect(actionTitleBox).not.toBeNull();
  expect(actionSubtitleBox).not.toBeNull();
  expect((titleBox.y + titleBox.height) - subtitleBox.y, 'Title and subtitle should not materially overlap').toBeLessThanOrEqual(1);
  expect((actionTitleBox.y + actionTitleBox.height) - actionSubtitleBox.y, 'Action title and subtitle should not materially overlap').toBeLessThanOrEqual(1);

  const viewport = page.viewportSize();
  if (viewport && viewport.width > 680) {
    const headerBox = await attentionHeader.boundingBox();
    const linkBox = await openQueue.boundingBox();
    expect(headerBox && linkBox && linkBox.x).toBeGreaterThan((headerBox && headerBox.x + headerBox.width / 2) || 0);
    expect(headerBox && linkBox && Math.abs((linkBox.y + linkBox.height / 2) - (headerBox.y + headerBox.height / 2))).toBeLessThanOrEqual(12);
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
