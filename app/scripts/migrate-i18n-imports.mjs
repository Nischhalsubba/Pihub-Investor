import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

const srcRoot = resolve(process.cwd(), 'src');
const targets = {
  'react-translate-component': resolve(srcRoot, 'i18n/Translate'),
  'react-interpolate-component': resolve(srcRoot, 'i18n/Interpolate')
};

const walk = async dir => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (['.js', '.jsx'].includes(extname(entry.name))) files.push(path);
  }
  return files;
};

const importPath = (file, target) => {
  let value = relative(dirname(file), target).split(sep).join('/');
  if (!value.startsWith('.')) value = `./${value}`;
  return value;
};

let changed = 0;
for (const file of await walk(srcRoot)) {
  let content = await readFile(file, 'utf8');
  const original = content;
  for (const [legacy, target] of Object.entries(targets)) {
    const local = importPath(file, target);
    content = content.replace(new RegExp(`from\\s+(['"])${legacy}\\1`, 'g'), `from '${local}'`);
    content = content.replace(new RegExp(`const\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*require\\((['"])${legacy}\\2\\);?`, 'g'), `import $1 from '${local}';`);
    content = content.replace(new RegExp(`require\\((['"])${legacy}\\1\\)`, 'g'), `require('${local}')`);
  }
  if (content !== original) {
    await writeFile(file, content, 'utf8');
    changed += 1;
  }
}
console.log(`Migrated legacy translation imports in ${changed} source files.`);
