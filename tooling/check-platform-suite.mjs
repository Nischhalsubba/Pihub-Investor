import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const apps = ['borrower', 'advisory', 'admin', 'access'];
const failures = [];
const required = ['package.json', 'index.html', 'vite.config.mjs', 'vercel.json', 'src/App.jsx', 'src/main.jsx'];
const textExtensions = new Set(['.js', '.jsx', '.mjs', '.css', '.json', '.md', '.yml', '.yaml']);

const fail = message => failures.push(message);
const read = file => fs.readFileSync(file, 'utf8');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
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
      if (/from\s+['"][^'"]*(?:\.\.\/)+app\//.test(content)) fail(`${relative}: future app importing legacy /app`);
    }
  }
}

for (const shared of ['packages/ui', 'packages/platform', 'packages/domain']) {
  const dir = path.join(root, shared);
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir)) {
    if (!textExtensions.has(path.extname(file))) continue;
    const content = read(file);
    if (/from\s+['"][^'"]*\/apps\//.test(content) || /(?:\.\.\/)+apps\//.test(content)) fail(`${path.relative(root, file)}: shared package imports an application`);
  }
}

const investorVercel = JSON.parse(read(path.join(root, 'vercel.json')));
if (investorVercel.installCommand !== 'npm ci --prefix app --legacy-peer-deps') fail('root Vercel install contract changed');
if (investorVercel.buildCommand !== 'npm --prefix app run build') fail('root Vercel build contract changed');
if (investorVercel.outputDirectory !== 'app/dist') fail('root Vercel output contract changed');

if (failures.length) {
  console.error('Platform suite boundary check failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`Platform suite boundary check passed for ${apps.length} independent applications; Investor Vercel contract preserved.`);
