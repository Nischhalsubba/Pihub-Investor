import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const assets = resolve(process.cwd(), 'dist/assets');
const files = await readdir(assets);
const sizes = [];
for (const file of files) {
  if (!/\.(js|css)$/.test(file)) continue;
  const info = await stat(resolve(assets, file));
  sizes.push({ file, bytes: info.size });
}

const js = sizes.filter(item => item.file.endsWith('.js'));
const css = sizes.filter(item => item.file.endsWith('.css'));
const total = list => list.reduce((sum, item) => sum + item.bytes, 0);
const mb = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const failures = [];

js.forEach(item => {
  if (item.bytes > 950 * 1024) failures.push(`${item.file} is ${mb(item.bytes)}; individual JS limit is 0.93 MB.`);
});
if (total(js) > 2 * 1024 * 1024) failures.push(`Total JS is ${mb(total(js))}; budget is 2.00 MB.`);
if (total(css) > 650 * 1024) failures.push(`Total bundled CSS is ${mb(total(css))}; budget is 0.63 MB.`);

console.log(`Bundle budget: ${js.length} JS chunks (${mb(total(js))}), ${css.length} CSS assets (${mb(total(css))}).`);
if (failures.length) {
  failures.forEach(message => console.error(`BUDGET: ${message}`));
  process.exit(1);
}
