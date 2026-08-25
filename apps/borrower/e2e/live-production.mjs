import { chromium } from '@playwright/test';

const CENTRAL = 'https://pihub-investor.vercel.app';
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
      const sidebarColor = await sidebar.evaluate(node => getComputedStyle(node).backgroundColor);
      if (sidebarColor !== 'rgb(11, 18, 32)') throw new Error(`${module.label} live shell is not using the Investor dark rail; got ${sidebarColor}.`);
      console.log(`PASS ${module.label}: central handoff opens the live Investor-design workspace without a second login.`);
    } catch (error) {
      failed = true;
      console.error(`FAIL ${module.label} handoff: ${error.message}`);
      console.error(`Current URL: ${handoffPage.url()}`);
    } finally {
      await handoffContext.close();
    }
  }
} finally {
  await browser.close();
}

if (failed) process.exit(1);
