const PRODUCTS_KEY = 'pihub-demo-products-v2';

const extraProducts = [
  {
    id: 'DEMO-004', product_code: 'PIH-004', product_title: 'Green Retrofit D',
    service: { id: 2, name: { en: 'Equipment Loan', de: 'Anlagenfinanzierung' } },
    industries: [{ id: 3, name: { en: 'Manufacturing', de: 'Produktion' } }],
    states: [{ id: 3, name: 'Bavaria' }], counties: [{ id: 31, name: 'Munich' }],
    min_time_duration: 24, max_time_duration: 48, min_credit_amount: 180000, max_credit_amount: 620000,
    min_sales_creditor: 850000, collatoral: 1, ratings: [{ name: 'Creditreform', value: 'A-' }], documents: [], status: 'approved'
  },
  {
    id: 'DEMO-005', product_code: 'PIH-005', product_title: 'Receivables Bridge E',
    service: { id: 1, name: { en: 'Working Capital', de: 'Betriebskapital' } },
    industries: [{ id: 4, name: { en: 'Logistics', de: 'Logistik' } }],
    states: [{ id: 4, name: 'Hesse' }], counties: [{ id: 41, name: 'Frankfurt' }],
    min_time_duration: 6, max_time_duration: 18, min_credit_amount: 90000, max_credit_amount: 320000,
    min_sales_creditor: 420000, collatoral: 1, ratings: [{ name: 'Euler Hermes', value: 'A2' }], documents: [], status: 'requested'
  },
  {
    id: 'DEMO-006', product_code: 'PIH-006', product_title: 'Export Working Capital F',
    service: { id: 1, name: { en: 'Working Capital', de: 'Betriebskapital' } },
    industries: [{ id: 5, name: { en: 'Industrial Technology', de: 'Industrietechnologie' } }],
    states: [{ id: 5, name: 'North Rhine-Westphalia' }], counties: [{ id: 51, name: 'Düsseldorf' }],
    min_time_duration: 12, max_time_duration: 30, min_credit_amount: 140000, max_credit_amount: 480000,
    min_sales_creditor: 760000, collatoral: 0, ratings: [{ name: 'Fitch', value: 'BBB' }], documents: [], status: 'invested'
  },
  {
    id: 'DEMO-007', product_code: 'PIH-007', product_title: 'Digital Infrastructure G',
    service: { id: 3, name: { en: 'Growth Finance', de: 'Wachstumsfinanzierung' } },
    industries: [{ id: 1, name: { en: 'Technology', de: 'Technologie' } }],
    states: [{ id: 1, name: 'Berlin' }, { id: 2, name: 'Hamburg' }], counties: [{ id: 11, name: 'Berlin Mitte' }, { id: 21, name: 'Hamburg Mitte' }],
    min_time_duration: 18, max_time_duration: 42, min_credit_amount: 220000, max_credit_amount: 900000,
    min_sales_creditor: 1200000, collatoral: 0, ratings: [{ name: "Moody's", value: 'Baa2' }], documents: [], status: 'invested'
  },
  {
    id: 'DEMO-008', product_code: 'PIH-008', product_title: 'Healthcare Expansion H',
    service: { id: 3, name: { en: 'Growth Finance', de: 'Wachstumsfinanzierung' } },
    industries: [{ id: 2, name: { en: 'Healthcare', de: 'Gesundheitswesen' } }],
    states: [{ id: 2, name: 'Hamburg' }], counties: [{ id: 21, name: 'Hamburg Mitte' }],
    min_time_duration: 24, max_time_duration: 60, min_credit_amount: 300000, max_credit_amount: 1100000,
    min_sales_creditor: 1600000, collatoral: 1, ratings: [{ name: 'Standard & Poors', value: 'BBB+' }], documents: [], status: 'requested'
  }
];

const readProducts = () => {
  try {
    const value = localStorage.getItem(PRODUCTS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const ensureDemoWorkspaceData = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  const current = readProducts();
  if (!current.length) return; // The legacy demo seed owns the initial three records.
  const ids = new Set(current.map(product => String(product && product.id)));
  const missing = extraProducts.filter(product => !ids.has(String(product.id)));
  if (!missing.length) return;
  try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...current, ...missing])); } catch (error) { /* demo enrichment is non-critical */ }
};

export const enrichDemoWorkspaceAfterFirstRequest = () => {
  if (typeof window === 'undefined') return;
  window.setTimeout(ensureDemoWorkspaceData, 0);
};
