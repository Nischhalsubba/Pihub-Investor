import fs from 'node:fs';
import path from 'node:path';
import {
  createInitialDemoWorkflow,
  getDemoWorkflowState,
  transitionDemoWorkflow,
} from '../packages/platform/src/demo-workflow.js';

const root = process.cwd();
const apps = ['borrower', 'advisory', 'admin', 'access'];
const failures = [];
const required = ['package.json', 'index.html', 'vite.config.mjs', 'vercel.json', 'src/App.jsx', 'src/main.jsx'];
const textExtensions = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx', '.css', '.json', '.md', '.yml', '.yaml']);
const fail = message => failures.push(message);
const read = file => fs.readFileSync(file, 'utf8');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (['node_modules', 'dist', 'playwright-report', 'test-results'].includes(entry.name)) return [];
  const target = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});

for (const app of apps) {
  const dir = path.join(root, 'apps', app);
  for (const file of required) if (!fs.existsSync(path.join(dir, file))) fail(`${app}: missing ${file}`);

  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(read(pkgPath));
    if (pkg.name !== `@pihub/${app}`) fail(`${app}: package name must be @pihub/${app}`);
    for (const script of ['build', 'test:unit', 'test:e2e']) if (!pkg.scripts?.[script]) fail(`${app}: missing ${script} script`);
  }

  const mainPath = path.join(dir, 'src/main.jsx');
  if (fs.existsSync(mainPath)) {
    const main = read(mainPath);
    const baseImports = main.match(/packages\/ui\/src\/investor-base\.css/g) || [];
    if (baseImports.length !== 1) fail(`${app}: src/main.jsx must import investor-base.css exactly once`);
    for (const obsolete of ['platform.css', 'containment.css', 'workspace-system.css', 'investor-design-system.css', 'workspace-account.css']) {
      if (main.includes(`packages/ui/src/${obsolete}`)) fail(`${app}: src/main.jsx directly imports ${obsolete}; use investor-base.css`);
    }
  }

  const stylesPath = path.join(dir, 'src/styles.css');
  if (fs.existsSync(stylesPath)) {
    const styles = read(stylesPath);
    const forbiddenGlobal = /(^|[}\s,])(:root|html|body|#root|\.ph-(?:app|topbar|shell|sidebar|main|button|field|table|status|account|user-card))\b/m;
    if (forbiddenGlobal.test(styles)) fail(`${app}: styles.css redefines global Investor UI; keep only app-specific composition`);
  }

  const vercelPath = path.join(dir, 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    const config = JSON.parse(read(vercelPath));
    if (config.outputDirectory !== 'dist') fail(`${app}: Vercel outputDirectory must remain dist`);
    if (config.buildCommand !== 'npm run build') fail(`${app}: Vercel buildCommand must remain npm run build`);
  }

  if (fs.existsSync(dir)) {
    for (const file of walk(dir)) {
      if (!textExtensions.has(path.extname(file))) continue;
      const content = read(file);
      const relative = path.relative(root, file).replaceAll('\\', '/');
      if (/from\s+['"][^'"]*\/apps\//.test(content) || /import\s*\(['"][^'"]*\/apps\//.test(content)) fail(`${relative}: app-to-app import detected`);
      if (/from\s+['"][^'"]*(?:\.\.\/)+app\//.test(content)) fail(`${relative}: independent app importing legacy /app`);
    }
  }
}

for (const shared of ['packages/ui', 'packages/platform', 'packages/domain', 'packages/contracts']) {
  const dir = path.join(root, shared);
  if (!fs.existsSync(dir)) fail(`${shared}: shared package is missing`);
  if (!fs.existsSync(path.join(dir, 'package.json'))) fail(`${shared}: package.json is missing`);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    if (!textExtensions.has(path.extname(file))) continue;
    const content = read(file);
    if (/from\s+['"][^'"]*\/apps\//.test(content) || /(?:\.\.\/)+apps\//.test(content)) fail(`${path.relative(root, file)}: shared package imports an application`);
  }
}

const rootPackage = JSON.parse(read(path.join(root, 'package.json')));
if (!rootPackage.workspaces?.includes('apps/*') || !rootPackage.workspaces?.includes('packages/*')) fail('root package.json must include apps/* and packages/* workspaces');

const baseCss = read(path.join(root, 'packages/ui/src/investor-base.css'));
for (const requiredImport of ['investor-design-system.css', 'workspace-account.css', 'workflow-journey.css']) {
  if (!baseCss.includes(requiredImport)) fail(`investor-base.css is missing ${requiredImport}`);
}

let workflow = createInitialDemoWorkflow();
const lifecycle = [
  ['borrower', 'submit'],
  ['advisory', 'start_structuring'],
  ['advisory', 'start_due_diligence'],
  ['advisory', 'send_to_investor'],
  ['investor', 'approve'],
  ['advisory', 'start_documentation'],
  ['admin', 'clear_compliance'],
  ['investor', 'fund'],
  ['investor', 'start_monitoring'],
  ['investor', 'close'],
];
for (const [actor, event] of lifecycle) {
  const result = transitionDemoWorkflow(workflow, { actor, event });
  if (!result.ok) {
    fail(`workflow: ${actor}/${event} failed: ${result.error}`);
    break;
  }
  workflow = result.snapshot;
}
if (!getDemoWorkflowState(workflow.state)?.terminal || workflow.state !== 'closed') fail('workflow: happy path must finish in closed');

const investorVercel = JSON.parse(read(path.join(root, 'vercel.json')));
if (investorVercel.installCommand !== 'npm ci --prefix app --legacy-peer-deps') fail('root Vercel install contract changed');
if (investorVercel.buildCommand !== 'npm --prefix app run build') fail('root Vercel build contract changed');
if (investorVercel.outputDirectory !== 'app/dist') fail('root Vercel output contract changed');

if (failures.length) {
  console.error('Platform suite boundary check failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`Platform suite boundary check passed for ${apps.length} applications; Investor UI, workflow and Vercel contracts preserved.`);
