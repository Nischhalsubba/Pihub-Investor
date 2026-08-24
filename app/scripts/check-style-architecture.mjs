import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { runtimeStyleFiles } from './style-manifest.mjs';

const cssRoot = resolve(process.cwd(), 'public/assets/css');
const files = await readdir(cssRoot);
const runtime = new Set(runtimeStyleFiles);
const bannedName = /pihub-.*(?:fix|polish|stabilization|contrast|v\d).*\.css$/i;
const offenders = files.filter(file => bannedName.test(file) && !runtime.has(file));
if (offenders.length) throw new Error(`New patch-style CSS files are forbidden. Put rules in pihub-system.css instead: ${offenders.join(', ')}`);

for (const file of runtimeStyleFiles) {
  if (!files.includes(file)) throw new Error(`Style manifest references missing file: ${file}`);
}

const system = await readFile(resolve(cssRoot, 'pihub-system.css'), 'utf8');
const requiredTokens = ['--pihub-space-2', '--pihub-control', '--pihub-motion-standard', '--pihub-z-overlay'];
for (const token of requiredTokens) {
  if (!system.includes(token)) throw new Error(`Canonical system token missing: ${token}`);
}

console.log(`Style architecture OK: ${runtimeStyleFiles.length} runtime sources; canonical patch layer enforced.`);
