import { test, expect } from '@playwright/test';

const CENTRAL_LOGIN = 'https://pihub-investor.vercel.app';
const stubCentralLogin = async page => page.route(`${CENTRAL_LOGIN}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><html><body><h1>Central PiHub sign in</h1></body></html>' }));
const open = page => page.goto('/?pihub_demo_access=borrower&source=investor-access');

const routes = [
  ['Financing request','/financing','Financing request'],['Company','/company','Company information'],['Project / Property','/project','Project & property'],['Financials','/financials','Financial information'],['Documents','/documents','Document room'],['PiHub requests','/requests','Requests from PiHub'],['Terms & closing','/closing','Terms & closing'],['Account','/account','Organization account']
];

test('borrower handoff, Investor design contract and every destination work', async ({ page }) => {
  await open(page);
  await expect(page.getByRole('heading',{name:'Financing overview'})).toBeVisible();
  await expect(page).not.toHaveURL(/pihub_demo_access/);
  await expect(page.locator('.ph-app[data-workspace="borrower"]')).toBeVisible();
  if ((page.viewportSize()?.width || 0) > 820) {
    const design = await page.evaluate(() => { const css=n=>getComputedStyle(n); const root=css(document.documentElement); return {font:css(document.body).fontFamily,bodySize:css(document.body).fontSize,topbar:css(document.querySelector('.ph-topbar')).height,sidebar:css(document.querySelector('.ph-sidebar')).width,sidebarBg:css(document.querySelector('.ph-sidebar')).backgroundColor,canvasBg:css(document.querySelector('.ph-main')).backgroundColor,primary:root.getPropertyValue('--pi-primary').trim(),navHeight:css(document.querySelector('.ph-nav-link')).minHeight}; });
    expect(design.font).toContain('IBM Plex Sans'); expect(design.bodySize).toBe('15px'); expect(design.topbar).toBe('68px'); expect(design.sidebar).toBe('232px'); expect(design.sidebarBg).toBe('rgb(11, 18, 32)'); expect(design.canvasBg).toBe('rgb(246, 248, 252)'); expect(design.primary).toBe('#2457e6'); expect(design.navHeight).toBe('44px');
  }
  for (const [link,path,heading] of routes) { await page.getByRole('link',{name:link,exact:true}).first().click(); await expect(page).toHaveURL(new RegExp(`${path}$`)); await expect(page.getByRole('heading',{name:heading})).toBeVisible(); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
});

test('borrower forms, document workflow and requests persist locally', async ({ page }) => {
  await open(page);
  await page.goto('/financing');
  const amount=page.getByLabel('Requested amount (EUR)'); await amount.fill('19500000'); await page.getByRole('button',{name:'Save financing request'}).click(); await expect(page.getByText('Saved locally')).toBeVisible(); await page.reload(); await expect(amount).toHaveValue('19500000');
  await page.goto('/company'); await page.getByLabel('Employees').fill('31'); await page.getByRole('button',{name:'Save company'}).click(); await page.reload(); await expect(page.getByLabel('Employees')).toHaveValue('31');
  await page.goto('/documents'); await page.getByRole('button',{name:'Mark demo upload'}).first().click(); await expect(page.getByText('Uploaded',{exact:true}).first()).toBeVisible();
  await page.goto('/requests'); const complete=page.getByRole('button',{name:'Mark complete'}).first(); await complete.click(); await expect(page.getByText('Complete',{exact:true}).first()).toBeVisible();
});

test('borrower has one login surface and sign out returns centrally', async ({ page }) => {
  await open(page); await stubCentralLogin(page); await page.getByRole('button',{name:'Sign out'}).click(); await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`);
});

test('borrower direct visit has no fallback login', async ({ page }) => { await stubCentralLogin(page); await page.goto('/'); await expect(page).toHaveURL(`${CENTRAL_LOGIN}/login/borrower`); await expect(page.getByRole('button',{name:'Open Borrower'})).toHaveCount(0); });
