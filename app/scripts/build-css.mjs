import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { styleGroups, runtimeStyleFiles } from './style-manifest.mjs';

// Runtime HTML loads one generated stylesheet. Authoring sources are grouped by
// responsibility so historical compatibility rules cannot quietly grow another
// generation of *-fix.css / *-polish.css patches.
const sourceRoot = resolve(process.cwd(), 'public/assets/css');
const outputRoot = sourceRoot;

await mkdir(outputRoot, { recursive: true });
const chunks = [];
for (const group of styleGroups) {
  chunks.push(`/* ===== PiHub layer: ${group.name} ===== */`);
  for (const file of group.files) {
    let content = await readFile(resolve(sourceRoot, file), 'utf8');
    content = content.replace(/\/\*# sourceMappingURL=.*?\*\//g, '');
    if (file === 'boxicon.css') {
      content = content.replace(/@font-face\{font-family:boxicons[^}]*\}/, "@font-face{font-family:boxicons;font-weight:400;font-style:normal;font-display:block;src:url(../fonts/boxicons.woff2) format('woff2')}");
    }
    chunks.push(`/* source: ${file} */\n${content}`);
  }
}

const header = `/* GENERATED FILE — do not edit.\n   Runtime CSS has one deterministic cascade from ${runtimeStyleFiles.length} authoring files.\n   Edit the canonical/grouped sources and scripts/style-manifest.mjs. */\n`;
await writeFile(resolve(outputRoot, 'pihub-bundle.css'), `${header}${chunks.join('\n\n')}\n`, 'utf8');
console.log(`Built pihub-bundle.css from ${runtimeStyleFiles.length} ordered sources across ${styleGroups.length} layers.`);
