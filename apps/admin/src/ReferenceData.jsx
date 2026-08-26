import React, { useMemo, useState } from 'react';
import { ADMIN_REFERENCE_SEED } from '../../../packages/domain/src/figma-flow-data';
import { Card, Field, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { readLocal, writeLocal } from './local-state';

const CONFIG = Object.freeze({
  geography: { title: 'States & counties', description: 'Maintain the geographic reference data used by product eligibility, borrower profiles and search.', fields: ['states', 'counties'] },
  services: { title: 'Financing services', description: 'Maintain the financing-service taxonomy consumed by Investor product creation and Borrower product discovery.', fields: ['services'] },
  industries: { title: 'Industries', description: 'Maintain the industry taxonomy used across product search, borrower profiles and risk review.', fields: ['industries'] },
  ratings: { title: 'Rating agencies', description: 'Maintain external rating providers available to Investor products and Borrower corporate information.', fields: ['ratingAgencies'] },
});

const human = key => ({ states: 'States', counties: 'Counties', services: 'Services', industries: 'Industries', ratingAgencies: 'Rating agencies' }[key] || key);

export default function ReferenceData({ kind }) {
  const config = CONFIG[kind] || CONFIG.geography;
  const [data, setData] = useState(() => readLocal('reference-data', ADMIN_REFERENCE_SEED));
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState('');
  const counts = useMemo(() => config.fields.reduce((total, field) => total + (data[field]?.length || 0), 0), [config, data]);

  const saveData = next => {
    setData(next);
    writeLocal('reference-data', next);
  };
  const add = field => {
    const value = String(drafts[field] || '').trim();
    if (!value) return;
    if ((data[field] || []).some(item => item.toLowerCase() === value.toLowerCase())) {
      setMessage(`${value} already exists.`);
      return;
    }
    saveData({ ...data, [field]: [...(data[field] || []), value] });
    setDrafts(current => ({ ...current, [field]: '' }));
    setMessage(`${value} added to ${human(field).toLowerCase()}.`);
  };
  const remove = (field, value) => {
    saveData({ ...data, [field]: (data[field] || []).filter(item => item !== value) });
    setMessage(`${value} removed from ${human(field).toLowerCase()}.`);
  };

  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / Reference data" title={config.title} subtitle={config.description} />
    {message ? <div className="ph-callout" role="status">{message}</div> : null}
    <div className="ph-metric-grid">
      <Card title="Active records"><div className="ph-metric-value">{counts}</div><p className="ph-section-note">Browser-local demo reference values</p></Card>
      <Card title="Used by"><div className="ph-metric-value">3</div><p className="ph-section-note">Investor · Borrower · Advisory</p></Card>
      <Card title="Change control"><Status tone="warn">Admin governed</Status><p className="ph-section-note">Production changes require backend audit and authorization.</p></Card>
    </div>
    {config.fields.map(field => <Card key={field} title={human(field)} action={<Status tone="good">{(data[field] || []).length} active</Status>}>
      <div className="ph-form-actions" style={{ marginBottom: 16 }}>
        <Field label={`Add ${human(field).replace(/s$/, '').toLowerCase()}`}><input value={drafts[field] || ''} onChange={event => setDrafts(current => ({ ...current, [field]: event.target.value }))} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); add(field); } }} /></Field>
        <button className="ph-button primary" type="button" onClick={() => add(field)}>Add</button>
      </div>
      <div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Name</th><th>Status</th><th /></tr></thead><tbody>{(data[field] || []).map(value => <tr key={value}><td><strong>{value}</strong></td><td><Status tone="good">Active</Status></td><td><button className="ph-button secondary" type="button" onClick={() => remove(field, value)}>Remove</button></td></tr>)}</tbody></table></div>
    </Card>)}
  </div>;
}
