import { getLocale, translate } from '../../../_utils/locale';

export const statusOptions = [
  { value: '', labelKey: null },
  { value: 'approved', labelKey: 'label.approved' },
  { value: 'requested', labelKey: 'label.requested' },
  { value: 'invested', labelKey: 'label.invested' },
  { value: 'suspended', labelKey: 'label.suspended' }
];

export const opportunityColumns = [
  { key: 'facility', label: 'Facility' },
  { key: 'industry', label: 'Industry' },
  { key: 'tenor', label: 'Tenor' },
  { key: 'credit', label: 'Credit' },
  { key: 'status', label: 'Status' }
];

export const toDisplayText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
};

export const localizedText = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return '';
  const locale = getLocale();
  const candidates = [value[locale], value.en, value.de, value.label, value.name, value.title];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return '';
};

export const formatEuro = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(getLocale() === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
};

export const statusLabel = status => {
  const keys = {
    approved: 'label.approved',
    requested: 'label.requested',
    invested: 'label.invested',
    suspended: 'label.suspended',
    rejected: 'label.rejected',
    open: 'label.open'
  };
  return keys[status] ? translate(keys[status]) : status || '—';
};

export const safePage = value => {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
};

export const industriesFor = product => (Array.isArray(product && product.industries) ? product.industries.filter(Boolean) : [])
  .map(industry => localizedText(industry && industry.name !== undefined ? industry.name : industry))
  .filter(Boolean);

export const serviceFor = product => product && product.service ? localizedText(product.service.name !== undefined ? product.service.name : product.service) : '';

export const ratingFor = product => {
  const ratings = Array.isArray(product && product.ratings) ? product.ratings.filter(Boolean) : [];
  if (!ratings.length) return '—';
  const first = ratings[0];
  if (typeof first === 'string') return first;
  return [localizedText(first.name), toDisplayText(first.value || first.rating)].filter(Boolean).join(' ') || '—';
};

export const riskFor = product => product && (product.risk_band || product.risk || product.risk_rating) ? localizedText(product.risk_band || product.risk || product.risk_rating) : ratingFor(product);
export const ownerFor = product => localizedText(product && (product.owner || product.assignee || product.relationship_manager)) || 'Unassigned';
export const reviewFor = product => localizedText(product && (product.next_review || product.next_review_at || product.decision_deadline)) || '—';

export const sortValue = (product, key) => {
  if (key === 'title') return localizedText(product.product_title).toLowerCase();
  if (key === 'facility') return serviceFor(product).toLowerCase();
  if (key === 'industry') return (industriesFor(product)[0] || '').toLowerCase();
  if (key === 'tenor') return Number(product.max_time_duration) || 0;
  if (key === 'credit') return Number(product.max_credit_amount) || 0;
  if (key === 'status') return String(product.status || '');
  return '';
};

export const sortProducts = (products, view) => {
  const direction = view.dir === 'desc' ? -1 : 1;
  return products.slice().sort((a, b) => {
    const av = sortValue(a, view.sort);
    const bv = sortValue(b, view.sort);
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * direction;
    return String(av).localeCompare(String(bv)) * direction;
  });
};

export const summaryFor = products => ({
  visible: products.length,
  approved: products.filter(product => product.status === 'approved').length,
  requested: products.filter(product => product.status === 'requested').length,
  invested: products.filter(product => product.status === 'invested').length
});
