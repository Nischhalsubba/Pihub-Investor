import { chromium } from '@playwright/test';

const CENTRAL = 'https://pihub-investor.vercel.app';
const ACCESS = 'https://pihub-access-nischhalsubbas-projects.vercel.app';
const modules = [
  {
    id: 'borrower',
    label: 'Borrower',
    origin: 'https://pihub-borrower-nischhalsubbas-projects.vercel.app',
    loginPath: '/login/borrower',
    heading: 'Financing overview',
  },
  {
    id: 'advisory',
    label: 'Advisory',
    origin: 'https://pihub-advisory-nischhalsubbas-projects.vercel.app',
    loginPath: '/login/advisory',
    heading: 'Transaction overview',
  },
  {
    id: 'admin',
    label: 'Admin',
    origin: 'https://pihub-admin-nischhalsubbas-projects.vercel.app',
    loginPath: '/login?next=admin',
    heading: 'Platform governance',
  },
];

const browser = await chromium.launch({ headless: true });
let failed = false;

try {
  for (const module of modules) {
    const directContext = await browser.newContext();
    const directPage = await directContext.newPage();
    try {
      await directPage.goto(module.origin, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await directPage.waitForURL(`${CENTRAL}${module.loginPath}`, { timeout: 30_000 });
      const duplicateLogin = await directPage.getByRole('button', { name: `Open ${module.label}` }).count();
      if (duplicateLogin !== 0) throw new Error(`${module.label} direct access still exposes a module-owned fallback login.`);
      console.log(`PASS ${module.label}: direct unauthenticated access returns to central PiHub login.`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${module.label} direct access: ${error.message}`);
      console.error(`Current URL: ${directPage.url()}`);
    } finally {
      await directContext.close();
    }

    const handoffContext = await browser.newContext();
    const handoffPage = await handoffContext.newPage();
    try {
      const handoff = new URL(module.origin);
      handoff.searchParams.set('pihub_demo_access', module.id);
      handoff.searchParams.set('source', 'investor-access');
      await handoffPage.goto(handoff.toString(), { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await handoffPage.getByRole('heading', { name: module.heading }).waitFor({ state: 'visible', timeout: 30_000 });
      if (handoffPage.url().startsWith(CENTRAL)) throw new Error(`${module.label} valid handoff was incorrectly returned to central login.`);
      if (handoffPage.url().includes('pihub_demo_access')) throw new Error(`${module.label} did not remove the demo handoff marker from the URL.`);

      const sidebar = handoffPage.locator('.ph-sidebar');
      await sidebar.waitFor({ state: 'visible', timeout: 15_000 });
      const shell = await handoffPage.evaluate(() => ({
        sidebar: getComputedStyle(document.querySelector('.ph-sidebar')).backgroundColor,
        sidebarWidth: getComputedStyle(document.querySelector('.ph-sidebar')).width,
        topbarHeight: getComputedStyle(document.querySelector('.ph-topbar')).height,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      if (shell.sidebar !== 'rgb(11, 18, 32)') throw new Error(`${module.label} live shell is not using the Investor dark rail; got ${shell.sidebar}.`);
      if (shell.sidebarWidth !== '232px') throw new Error(`${module.label} live sidebar width drifted; got ${shell.sidebarWidth}.`);
      if (shell.topbarHeight !== '68px') throw new Error(`${module.label} live header height drifted; got ${shell.topbarHeight}.`);
      if (shell.overflow > 2) throw new Error(`${module.label} live page has ${shell.overflow}px horizontal overflow.`);
      await handoffPage.getByRole('button', { name: /Open search and command menu/i }).waitFor({ state: 'visible', timeout: 10_000 });
      await handoffPage.getByRole('button', { name: 'Open account menu' }).waitFor({ state: 'visible', timeout: 10_000 });
      const standaloneSignout = await handoffPage.getByRole('button', { name: 'Sign out', exact: true }).count();
      if (standaloneSignout) throw new Error(`${module.label} still exposes a standalone topbar Sign out button instead of the shared account dropdown.`);

      if (module.id === 'borrower') {
        await handoffPage.goto(`${module.origin}/products`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await handoffPage.getByRole('heading', { name: 'Find financing' }).waitFor({ state: 'visible', timeout: 10_000 });
        await handoffPage.getByRole('button', { name: 'Reset filters', exact: true }).waitFor({ state: 'visible', timeout: 10_000 });
        const parity = await handoffPage.evaluate(() => {
          const card = document.querySelector('.ph-card');
          const cardHead = card?.querySelector('.ph-card-head');
          const action = cardHead?.querySelector('.ph-card-head-action .ph-button');
          const select = document.querySelector('.ph-field select');
          return {
            cardRadius: card ? getComputedStyle(card).borderRadius : null,
            cardPadding: card ? getComputedStyle(card).paddingTop : null,
            cardHeadDisplay: cardHead ? getComputedStyle(cardHead).display : null,
            actionHeight: action?.getBoundingClientRect().height || 0,
            selectMinHeight: select ? getComputedStyle(select).minHeight : null,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });
        if (parity.cardRadius !== '12px') throw new Error(`Borrower live card radius is not Investor parity; got ${parity.cardRadius}.`);
        if (parity.cardPadding !== '18px') throw new Error(`Borrower live card padding is not Investor parity; got ${parity.cardPadding}.`);
        if (parity.cardHeadDisplay !== 'flex') throw new Error(`Borrower live card header action contract is missing; got ${parity.cardHeadDisplay}.`);
        if (parity.actionHeight < 43 || parity.actionHeight > 45) throw new Error(`Borrower live card action height drifted; got ${parity.actionHeight}px.`);
        if (parity.selectMinHeight !== '46px') throw new Error(`Borrower live select does not use the Investor 46px control minimum; got ${parity.selectMinHeight}.`);
        if (parity.overflow > 2) throw new Error(`Borrower live product page has ${parity.overflow}px horizontal overflow.`);

        await handoffPage.getByRole('link', { name: 'New application', exact: true }).first().click();
        await handoffPage.getByRole('heading', { name: 'Start a financing application' }).waitFor({ state: 'visible', timeout: 10_000 });
        await handoffPage.getByRole('button', { name: 'Create application' }).waitFor({ state: 'visible', timeout: 10_000 });
      }

      console.log(`PASS ${module.label}: live shared shell, utilities and authenticated workspace match the Investor contract.`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${module.label} handoff: ${error.message}`);
      console.error(`Current URL: ${handoffPage.url()}`);
    } finally {
      await handoffContext.close();
    }
  }

  const accessContext = await browser.newContext();
  const accessPage = await accessContext.newPage();
  try {
    await accessPage.goto(ACCESS, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await accessPage.getByRole('heading', { name: 'Choose your workspace' }).waitFor({ state: 'visible', timeout: 30_000 });
    if (accessPage.url().startsWith('https://vercel.com/login')) throw new Error('Access is still behind Vercel Authentication.');

    const expectedLinks = [
      ['Investor', CENTRAL],
      ['Borrower', 'https://pihub-borrower-nischhalsubbas-projects.vercel.app'],
      ['Advisory', 'https://pihub-advisory-nischhalsubbas-projects.vercel.app'],
      ['Admin', 'https://pihub-admin-nischhalsubbas-projects.vercel.app'],
    ];
    for (const [label, expectedOrigin] of expectedLinks) {
      const link = accessPage.getByRole('link', { name: `Open ${label}`, exact: true });
      await link.waitFor({ state: 'visible', timeout: 10_000 });
      const href = await link.getAttribute('href');
      if (href !== expectedOrigin) throw new Error(`Access ${label} link is '${href}', expected '${expectedOrigin}'.`);
    }
    const configured = await accessPage.locator('.access-card .ph-status.good', { hasText: 'Configured' }).count();
    if (configured !== 4) throw new Error(`Access has ${configured}/4 configured workspace origins.`);
    console.log('PASS Access: public gateway is live and every workspace origin is configured.');
  } catch (error) {
    failed = true;
    console.error(`FAIL Access live gateway: ${error.message}`);
    console.error(`Current URL: ${accessPage.url()}`);
  } finally {
    await accessContext.close();
  }
} finally {
  await browser.close();
}

if (failed) process.exit(1);
