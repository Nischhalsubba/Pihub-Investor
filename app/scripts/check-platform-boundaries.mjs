import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', 'playwright-report', 'test-results']);
const FORBIDDEN_INVESTOR_ROUTE_ROOTS = new Set(['borrower', 'advisory', 'admin', 'access']);

const relativeRepoPath = value => path.relative(repoRoot, value).split(path.sep).join('/');

const classify = absolutePath => {
  const rel = relativeRepoPath(absolutePath);
  if (rel === 'app/src' || rel.startsWith('app/src/')) return { kind: 'legacy-investor', name: 'investor' };

  const parts = rel.split('/');
  if (parts[0] === 'apps' && parts[1]) return { kind: 'app', name: parts[1] };
  if (parts[0] === 'packages' && parts[1]) return { kind: 'shared', name: parts[1] };
  return { kind: 'other', name: '' };
};

const walk = root => {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
};

const importSpecifiers = source => {
  const values = [];
  const patterns = [
    /(?:import|export)\s+(?:[^'";]*?\s+from\s*)?['"]([^'"]+)['"]/g,
    /require\(\s*['"]([^'"]+)['"]\s*\)/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source))) values.push(match[1]);
  }
  return [...new Set(values)];
};

const violations = [];
const scanRoots = [path.join(repoRoot, 'app', 'src'), path.join(repoRoot, 'apps'), path.join(repoRoot, 'packages')];
const files = scanRoots.flatMap(walk);

for (const file of files) {
  const sourceClass = classify(file);
  const source = fs.readFileSync(file, 'utf8');

  for (const specifier of importSpecifiers(source)) {
    if (!specifier.startsWith('.')) continue;
    const target = path.resolve(path.dirname(file), specifier);
    const targetClass = classify(target);
    const relation = `${sourceClass.kind}:${sourceClass.name} -> ${targetClass.kind}:${targetClass.name}`;

    if (sourceClass.kind === 'legacy-investor' && targetClass.kind === 'app') {
      violations.push(`${relativeRepoPath(file)} imports ${specifier} (${relation}). Legacy Investor cannot import future apps.`);
    }

    if (sourceClass.kind === 'app' && targetClass.kind === 'legacy-investor') {
      violations.push(`${relativeRepoPath(file)} imports ${specifier} (${relation}). Future apps cannot import legacy /app code.`);
    }

    if (sourceClass.kind === 'app' && targetClass.kind === 'app' && sourceClass.name !== targetClass.name) {
      violations.push(`${relativeRepoPath(file)} imports ${specifier} (${relation}). Applications cannot import one another.`);
    }

    if (sourceClass.kind === 'shared' && (targetClass.kind === 'app' || targetClass.kind === 'legacy-investor')) {
      violations.push(`${relativeRepoPath(file)} imports ${specifier} (${relation}). Shared packages must never depend on applications.`);
    }
  }
}

const investorRouter = path.join(repoRoot, 'app', 'src', 'index.js');
if (fs.existsSync(investorRouter)) {
  const source = fs.readFileSync(investorRouter, 'utf8');
  const routePattern = /<Route\s+[^>]*path=['"]([^'"]+)['"]/g;
  let match;
  while ((match = routePattern.exec(source))) {
    const root = match[1].replace(/^\/+/, '').split('/')[0].toLowerCase();
    if (FORBIDDEN_INVESTOR_ROUTE_ROOTS.has(root)) {
      violations.push(`app/src/index.js owns route "${match[1]}". ${root} is reserved for its own application and origin.`);
    }
  }
}

// Guard the current production isolation contract as long as Investor is still
// deployed from /app. Changing these values requires a dedicated cutover PR
// with a verified replacement build and deployment, never a feature side effect.
const vercelPath = path.join(repoRoot, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const expected = {
    installCommand: 'npm ci --prefix app --legacy-peer-deps',
    buildCommand: 'npm --prefix app run build',
    outputDirectory: 'app/dist'
  };

  for (const [key, value] of Object.entries(expected)) {
    if (config[key] !== value) {
      violations.push(`vercel.json changed ${key} from the verified Investor contract. Move that change into a dedicated deployment-migration PR.`);
    }
  }
}

if (violations.length) {
  console.error('PiHub platform boundary check failed:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`PiHub platform boundary check passed (${files.length} source files scanned).`);
