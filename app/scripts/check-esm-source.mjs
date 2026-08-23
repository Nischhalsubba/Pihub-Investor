import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const offenders = [];

const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!/\.(js|jsx)$/.test(entry.name)) continue;
    const source = fs.readFileSync(fullPath, 'utf8');
    source.split(/\r?\n/).forEach((line, index) => {
      if (/\brequire\s*\(/.test(line) && !/^\s*\/\//.test(line)) {
        offenders.push(`${path.relative(process.cwd(), fullPath)}:${index + 1}: ${line.trim()}`);
      }
    });
  }
};

walk(root);

if (offenders.length) {
  console.error('Browser ESM source still contains CommonJS require() calls:');
  offenders.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('ESM source guard: no runtime require() calls found in src/.');
