import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const path = resolve(process.cwd(), 'src/_utils/demoMode.js');
let source = await readFile(path, 'utf8');

source = source.replace(
  /const DEMO_CREDITORS = \[[^\]]*\];/,
  "const DEMO_CREDITORS = ['Nordstern GmbH', 'Helios Medical AG', 'Rheinwerk Industries', 'Bavaria Anlagenbau SE', 'RheinLogistik GmbH', 'Westfalen Export AG', 'NovaGrid Systems GmbH', 'HanseCare Kliniken GmbH'];"
);

source = source.replace(
  /const buildCreditRequest = \(product, index\) => \(\{[\s\S]*?\n\}\);\n\nconst buildInvestment/,
  `const buildCreditRequest = (product, index) => ({
  application_id: applicationIdFor(product),
  product_id: product.id,
  creditor_name: DEMO_CREDITORS[index] || 'Demo Creditor',
  product_title: productTitle(product),
  name: productTitle(product),
  service: product.service,
  requested_amount: product.min_credit_amount || 100000,
  amount: product.min_credit_amount || 100000,
  ratings: product.ratings,
  risk_band: product.risk_band || 'Moderate',
  owner: product.owner || 'Investor team',
  created_on: new Date(Date.UTC(2026, 7, 4 + index)).toISOString(),
  deadline: product.next_review_at ? new Date(\`${'${product.next_review_at}'}T00:00:00Z\`).toISOString() : '2026-09-30T00:00:00Z',
  status: product.status === 'invested' ? 'invested' : 'requested'
});

const buildInvestment`
);

source = source.replace(
  /const buildInvestment = \(product, index\) => \(\{[\s\S]*?\n\}\);\n\nconst extractIdFromPath/,
  `const buildInvestment = (product, index) => ({
  application_id: applicationIdFor(product),
  product_id: product.id,
  creditor_name: DEMO_CREDITORS[index] || 'Demo Creditor',
  product_title: productTitle(product),
  invested_on: new Date(Date.UTC(2026, 6 + (index % 2), 12 + index)).toISOString(),
  invested_amount: product.min_credit_amount || 100000,
  duration: product.max_time_duration || 24,
  expected_yield_bps: product.expected_yield_bps || 500,
  risk_band: product.risk_band || 'Moderate',
  owner: product.owner || 'Portfolio team',
  ratings: product.ratings,
  next_review_at: product.next_review_at || null,
  status: 'invested'
});

const extractIdFromPath`
);

source = source.replace(
  /ratings: product\.ratings\n\}\);/,
  "ratings: product.ratings,\n  risk_band: product.risk_band || 'Moderate',\n  owner: product.owner || 'Investor team',\n  expected_yield_bps: product.expected_yield_bps || 500,\n  next_review_at: product.next_review_at || null\n});"
);

await writeFile(path, source, 'utf8');
console.log('Enriched demo API records with amount, owner, risk, yield and decision dates.');
