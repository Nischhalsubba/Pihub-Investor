import React, { useState } from 'react';
import { FINANCING_PRODUCTS } from '../../../packages/domain/src/figma-flow-data';
import { euro } from '../../../packages/domain/src/demo-data';
import { Card, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { readLocal, writeLocal } from './local-state';

export default function AdminCatalog() {
  const [products, setProducts] = useState(() => readLocal('product-catalog', FINANCING_PRODUCTS.map(item => ({ ...item, status: 'Active' }))));
  const toggle = id => {
    const next = products.map(item => item.id === id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item);
    setProducts(next);
    writeLocal('product-catalog', next);
  };
  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / Investor operations" title="Financing product catalog" subtitle="Govern product availability without duplicating Investor product ownership. Investor creates and edits products; Admin controls platform visibility and reference integrity." />
    <Card title="Products" action={<Status tone="good">{products.filter(item => item.status === 'Active').length} active</Status>}>
      <div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Product</th><th>Credit type</th><th>Amount range</th><th>Term</th><th>Status</th><th /></tr></thead><tbody>{products.map(item => <tr key={item.id}><td><strong>{item.title}</strong><small>{item.id} · {item.provider}</small></td><td>{item.creditType}<small>{item.industry}</small></td><td className="ph-mono">{euro(item.minAmount)} – {euro(item.maxAmount)}</td><td className="ph-mono">{item.minTerm}–{item.maxTerm} mo</td><td><Status tone={item.status === 'Active' ? 'good' : 'warn'}>{item.status}</Status></td><td><button className="ph-button secondary" type="button" onClick={() => toggle(item.id)}>{item.status === 'Active' ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table></div>
    </Card>
  </div>;
}
