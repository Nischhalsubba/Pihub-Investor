import { access, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'public/assets/css');
const groups = [
  ['pihub-foundation.css', ['pihub-2026.css', 'pihub-workspace.css', 'pihub-detail.css', 'pihub-aux.css', 'pihub-profile-edit.css', 'pihub-flow.css', 'pihub-auth.css', 'pihub-signup-status.css', 'pihub-state.css']],
  ['pihub-analytical.css', ['pihub-analytical-core.css', 'pihub-analytical-data.css', 'pihub-analytical-forms.css', 'pihub-analytical-responsive.css']],
  ['pihub-hardening.css', ['pihub-qa-polish.css', 'pihub-purpose-polish.css', 'pihub-workflows.css', 'pihub-stabilization.css', 'pihub-ui-refinement.css', 'pihub-ui-contrast.css']],
  ['pihub-shell.css', ['pihub-profile-navbar-v3.css', 'pihub-profile-navbar-v3-contrast.css', 'pihub-global-shell-v4.css']],
  ['pihub-motion.css', ['pihub-option-c-motion.css', 'pihub-option-c-loading.css', 'pihub-option-c-guardrails.css', 'pihub-sidebar-anchor-fix.css']],
  ['pihub-product.css', ['pihub-product-suite.css', 'pihub-product-suite-data.css', 'pihub-product-suite-finish.css']]
];

const exists = async path => {
  try { await access(path); return true; } catch (error) { return false; }
};

for (const [targetName, sources] of groups) {
  const target = resolve(root, targetName);
  const available = [];
  for (const sourceName of sources) {
    const source = resolve(root, sourceName);
    if (await exists(source)) available.push([sourceName, source]);
  }

  if (!available.length) {
    if (!(await exists(target))) throw new Error(`Missing consolidated stylesheet ${targetName} and all of its source files.`);
    continue;
  }

  const chunks = [];
  for (const [sourceName, source] of available) {
    const content = await readFile(source, 'utf8');
    chunks.push(`/* consolidated source: ${sourceName} */\n${content.trim()}\n`);
  }
  await writeFile(target, `/* PiHub consolidated layer: ${targetName}. Generated from contiguous historical sources to preserve cascade order. */\n\n${chunks.join('\n')}`, 'utf8');

  for (const [, source] of available) await rm(source);
  console.log(`Consolidated ${available.length} files -> ${targetName}`);
}
