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
const singular = key => ({ states: 'state', counties: 'county', services: 'service', industries: 'industry', ratingAgencies: 'rating agency' }[key] || human(key).toLowerCase());
const sectionTitle = (config, field) => human(field) === config.title ? 'Reference records' : human(field);
const statusKey = (field, value) => `${field}:${value}`;

export default function ReferenceData({ kind }) {
  const config = CONFIG[kind] || CONFIG.geography;
  const [data, setData] = useState(() => readLocal('reference-data', ADMIN_REFERENCE_SEED));
  const [statuses, setStatuses] = useState(() => readLocal('reference-statuses', {}));
  const [drafts, setDrafts] = useState({});
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState('');
  const counts = useMemo(() => config.fields.reduce((total, field) => total + (data[field] || []).filter(value => statuses[statusKey(field, value)] !== 'Inactive').length, 0), [config, data, statuses]);

  const saveData = next => { setData(next); writeLocal('reference-data', next); };
  const saveStatuses = next => { setStatuses(next); writeLocal('reference-statuses', next); };
  const add = field => {
    const value = String(drafts[field] || '').trim();
    if (!value) return;
    if ((data[field] || []).some(item => item.toLowerCase() === value.toLowerCase())) { setMessage(`${value} already exists.`); return; }
    saveData({ ...data, [field]: [...(data[field] || []), value] });
    setDrafts(current => ({ ...current, [field]: '' }));
    setMessage(`${value} added to ${human(field).toLowerCase()}.`);
  };
  const toggleStatus = (field, value) => {
    const key = statusKey(field, value);
    const nextStatus = statuses[key] === 'Inactive' ? 'Active' : 'Inactive';
    saveStatuses({ ...statuses, [key]: nextStatus });
    setMessage(`${value} marked ${nextStatus.toLowerCase()}.`);
  };
  const startEdit = (field, value) => { setEditing({ field, value }); setEditValue(value); };
  const cancelEdit = () => { setEditing(null); setEditValue(''); };
  const saveEdit = () => {
    const value = editValue.trim();
    if (!editing || !value) return;
    const { field, value: previous } = editing;
    if ((data[field] || []).some(item => item !== previous && item.toLowerCase() === value.toLowerCase())) { setMessage(`${value} already exists.`); return; }
    saveData({ ...data, [field]: (data[field] || []).map(item => item === previous ? value : item) });
    const oldKey = statusKey(field, previous);
    if (statuses[oldKey]) {
      const next = { ...statuses, [statusKey(field, value)]: statuses[oldKey] };
      delete next[oldKey];
      saveStatuses(next);
    }
    setMessage(`${previous} renamed to ${value}.`);
    cancelEdit();
  };
  const remove = (field, value) => {
    saveData({ ...data, [field]: (data[field] || []).filter(item => item !== value) });
    const next = { ...statuses }; delete next[statusKey(field, value)]; saveStatuses(next);
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
    {config.fields.map(field => <Card key={field} title={sectionTitle(config, field)} action={<Status tone="good">{(data[field] || []).filter(value => statuses[statusKey(field, value)] !== 'Inactive').length} active</Status>}>
      <div className="ph-form-actions" style={{ marginBottom: 16 }}>
        <Field label={`Add ${singular(field)}`}><input value={drafts[field] || ''} onChange={event => setDrafts(current => ({ ...current, [field]: event.target.value }))} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); add(field); } }} /></Field>
        <button className="ph-button primary" type="button" onClick={() => add(field)}>Add</button>
      </div>
      <div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Name</th><th>Status</th><th>Actions</th></tr></thead><tbody>{(data[field] || []).map(value => {
        const inactive = statuses[statusKey(field, value)] === 'Inactive';
        const isEditing = editing?.field === field && editing?.value === value;
        return <tr key={value}><td>{isEditing ? <input aria-label={`Edit ${value}`} value={editValue} onChange={event => setEditValue(event.target.value)} /> : <strong>{value}</strong>}</td><td><Status tone={inactive ? 'warn' : 'good'}>{inactive ? 'Inactive' : 'Active'}</Status></td><td><div className="ph-inline">{isEditing ? <><button className="ph-button primary" type="button" onClick={saveEdit}>Save</button><button className="ph-button secondary" type="button" onClick={cancelEdit}>Cancel</button></> : <><button className="ph-button secondary" type="button" onClick={() => startEdit(field, value)}>Edit</button><button className="ph-button secondary" type="button" onClick={() => toggleStatus(field, value)}>{inactive ? 'Activate' : 'Deactivate'}</button><button className="ph-button secondary" type="button" onClick={() => remove(field, value)}>Remove</button></>}</div></td></tr>;
      })}</tbody></table></div>
    </Card>)}
  </div>;
}
