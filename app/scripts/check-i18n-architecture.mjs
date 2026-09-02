import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.cwd(), 'src');
const forbidden = ['react-translate-component', 'react-interpolate-component', "from 'counterpart'", 'from "counterpart"'];
const offenders = [];

const walk = async dir => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (['.js', '.jsx'].includes(extname(entry.name))) {
      const source = await readFile(path, 'utf8');
      if (forbidden.some(marker => source.includes(marker))) offenders.push(path.replace(`${root}/`, 'src/'));
    }
  }
};

await walk(root);
if (offenders.length) throw new Error(`Deprecated or vulnerable translation runtime imports remain: ${offenders.join(', ')}`);
console.log('i18n architecture OK: local PiHub dictionaries and React renderers are the only translation runtime.');
