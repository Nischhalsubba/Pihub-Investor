import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceRoot = resolve(process.cwd(), 'style-src');
const outputRoot = resolve(process.cwd(), 'public/assets/css');
const files = [
  'bootstrap.min.css',
  'boxicon.css',
  'tablesaw.css',
  'style.css',
  'pihub-2026.css',
  'pihub-workspace.css',
  'pihub-detail.css',
  'pihub-aux.css',
  'pihub-profile-edit.css',
  'pihub-flow.css',
  'pihub-auth.css',
  'pihub-signup-status.css',
  'pihub-state.css',
  'pihub-analytical-core.css',
  'pihub-analytical-data.css',
  'pihub-analytical-forms.css',
  'pihub-analytical-responsive.css',
  'pihub-qa-polish.css',
  'pihub-purpose-polish.css',
  'pihub-workflows.css',
  'pihub-modernization.css'
];

await mkdir(outputRoot, { recursive: true });
const chunks = [];
for (const file of files) {
  let content = await readFile(resolve(sourceRoot, file), 'utf8');
  content = content.replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
  if (file === 'boxicon.css') {
    content = content.replace(/@font-face\{font-family:boxicons[^}]*\}/, "@font-face{font-family:boxicons;font-weight:400;font-style:normal;font-display:block;src:url(../fonts/boxicons.woff2) format('woff2')}");
  }
  chunks.push(`/* source: ${file} */\n${content}`);
}

const header = `/* GENERATED FILE — do not edit.\n   Runtime CSS has one deterministic cascade. Edit style-src/* and the ordered manifest in scripts/build-css.mjs. */\n`;
await writeFile(resolve(outputRoot, 'pihub-bundle.css'), `${header}${chunks.join('\n\n')}\n`, 'utf8');
console.log(`Built pihub-bundle.css from ${files.length} ordered sources.`);
