// Product-flow fixtures derived from the legacy PiHub Figma structure.
// Visual presentation intentionally remains owned by the current Investor design system.

export const CREDIT_RATING_AGENCIES = Object.freeze([
  'Creditreform',
  'Euler Hermes',
  'Fitch',
  'Standard & Poors',
  "Moody's",
  'Bank / Other',
]);

export const BORROWER_DOCUMENT_REQUIREMENTS = Object.freeze([
  { id: 'financial-statements', name: 'Balance sheet and P&L (last 3 years)', category: 'Financial' },
  { id: 'bwa', name: 'Latest BWA / management accounts', category: 'Financial' },
  { id: 'trade-register', name: 'Trade register excerpt', category: 'Corporate' },
  { id: 'shareholders', name: 'List of shareholders', category: 'Corporate' },
  { id: 'articles', name: 'Bylaws / articles of incorporation', category: 'Corporate' },
  { id: 'business-plan', name: 'Business plan', category: 'Business' },
  { id: 'financial-plan', name: 'Financial plan (next 3 years)', category: 'Financial' },
  { id: 'owner-information', name: 'Information about owner / UBO', category: 'Compliance' },
  { id: 'other', name: 'Other supporting documents', category: 'Other' },
]);

export const FINANCING_PRODUCTS = Object.freeze([
  {
    id: 'PRD-2401',
    title: 'Senior Development Facility',
    creditType: 'Development financing',
    industry: 'Real estate',
    region: 'Berlin',
    county: 'Berlin',
    minAmount: 5000000,
    maxAmount: 30000000,
    minTerm: 12,
    maxTerm: 36,
    collateral: true,
    ndaRequired: true,
    ratingRequired: false,
    provider: 'Rhein Capital Partners',
    availability: 'Open',
  },
  {
    id: 'PRD-2402',
    title: 'Acquisition Bridge',
    creditType: 'Acquisition financing',
    industry: 'Real estate',
    region: 'Germany',
    county: 'Nationwide',
    minAmount: 2000000,
    maxAmount: 20000000,
    minTerm: 6,
    maxTerm: 24,
    collateral: true,
    ndaRequired: false,
    ratingRequired: false,
    provider: 'NordBank Credit Fund',
    availability: 'Open',
  },
  {
    id: 'PRD-2403',
    title: 'Working Capital Revolver',
    creditType: 'Revolving credit',
    industry: 'Business services',
    region: 'DACH',
    county: 'Multi-region',
    minAmount: 250000,
    maxAmount: 8000000,
    minTerm: 12,
    maxTerm: 48,
    collateral: false,
    ndaRequired: false,
    ratingRequired: true,
    provider: 'PiHub Credit Partners',
    availability: 'Open',
  },
  {
    id: 'PRD-2404',
    title: 'Purchase Financing / Finetrading',
    creditType: 'Purchase financing / Finetrading',
    industry: 'Trade & distribution',
    region: 'Germany',
    county: 'Nationwide',
    minAmount: 100000,
    maxAmount: 5000000,
    minTerm: 2,
    maxTerm: 18,
    collateral: false,
    ndaRequired: false,
    ratingRequired: true,
    provider: 'TradeFlow Finance',
    availability: 'Open',
  },
]);

export const ADMIN_REFERENCE_SEED = Object.freeze({
  states: ['Berlin', 'Bavaria', 'Hamburg', 'Hesse', 'North Rhine-Westphalia'],
  counties: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
  industries: ['Real estate', 'Business services', 'Trade & distribution', 'Healthcare', 'Logistics'],
  services: ['Development financing', 'Acquisition financing', 'Revolving credit', 'Purchase financing / Finetrading'],
  ratingAgencies: CREDIT_RATING_AGENCIES,
});

export const ADMIN_OPERATION_QUEUES = Object.freeze({
  productRequests: [
    { id: 'PRQ-101', applicant: 'Berlin Living GmbH', product: 'Senior Development Facility', status: 'Under review', owner: 'Product operations' },
    { id: 'PRQ-102', applicant: 'Nordhafen Logistics SPV', product: 'Acquisition Bridge', status: 'Ready', owner: 'Product operations' },
  ],
  creditRequests: [
    { id: 'CR-601', applicant: 'Berlin Living GmbH', amount: 18000000, status: 'Credit review', owner: 'Credit committee' },
    { id: 'CR-602', applicant: 'CareHaus Holding', amount: 27000000, status: 'Information required', owner: 'Credit team' },
  ],
});
