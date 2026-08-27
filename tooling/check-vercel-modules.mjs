import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'vercel.modules.json');
const fail = message => {
  console.error(`Vercel module contract failed: ${message}`);
  process.exit(1);
};

if (!fs.existsSync(manifestPath)) fail('vercel.modules.json is missing');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.teamSlug !== 'nischhalsubbas-projects') fail('teamSlug must remain nischhalsubbas-projects');
if (manifest.productionBranch !== 'main') fail('productionBranch must remain main');

const expected = {
  investor: { project: 'pihub-investor', rootDirectory: '.', config: 'vercel.json' },
  borrower: { project: 'pihub-borrower', rootDirectory: 'apps/borrower', config: 'apps/borrower/vercel.json' },
  advisory: { project: 'pihub-advisory', rootDirectory: 'apps/advisory', config: 'apps/advisory/vercel.json' },
  admin: { project: 'pihub-admin', rootDirectory: 'apps/admin', config: 'apps/admin/vercel.json' },
  access: { project: 'pihub-access', rootDirectory: 'apps/access', config: 'apps/access/vercel.json' },
};

for (const [id, contract] of Object.entries(expected)) {
  const module = manifest.modules?.[id];
  if (!module) fail(`${id}: deployment manifest entry is missing`);
  if (module.project !== contract.project) fail(`${id}: project must be ${contract.project}`);
  if (module.rootDirectory !== contract.rootDirectory) fail(`${id}: rootDirectory must be ${contract.rootDirectory}`);
  if (module.vercelConfig !== contract.config) fail(`${id}: vercelConfig must be ${contract.config}`);
  if (!/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(module.productionUrl || '')) fail(`${id}: productionUrl must be an https://*.vercel.app alias`);
  const configPath = path.join(root, contract.config);
  if (!fs.existsSync(configPath)) fail(`${id}: ${contract.config} is missing`);
}

const independentApps = ['borrower', 'advisory', 'admin', 'access'];
for (const id of independentApps) {
  const config = JSON.parse(fs.readFileSync(path.join(root, expected[id].config), 'utf8'));
  if (config.framework !== 'vite') fail(`${id}: Vercel framework must remain vite`);
  if (config.buildCommand !== 'npm run build') fail(`${id}: buildCommand must remain npm run build`);
  if (config.outputDirectory !== 'dist') fail(`${id}: outputDirectory must remain dist`);
}

const investor = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
if (investor.buildCommand !== 'npm --prefix app run build') fail('investor: root project must build /app only');
if (investor.outputDirectory !== 'app/dist') fail('investor: outputDirectory must remain app/dist');

console.log('Vercel module contract passed for Investor, Borrower, Advisory, Admin and Access.');
