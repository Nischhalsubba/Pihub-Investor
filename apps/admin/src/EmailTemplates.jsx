import React, { useState } from 'react';
import { Card, Field, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { readLocal, writeLocal } from './local-state';

const seed = Object.freeze([
  { id: 'TPL-01', name: 'Account invitation', subject: 'Welcome to PiHub', body: 'Your PiHub workspace access is ready. Use the secure access link to continue.', status: 'Active' },
  { id: 'TPL-02', name: 'Information request', subject: 'PiHub requires additional information', body: 'Please review the outstanding request in your PiHub workspace and provide the requested information.', status: 'Active' },
  { id: 'TPL-03', name: 'Credit decision', subject: 'Update to your PiHub financing request', body: 'A decision update is available in PiHub. Sign in to review the current status and next action.', status: 'Active' },
]);

export default function EmailTemplates() {
  const [templates, setTemplates] = useState(() => readLocal('email-templates', seed));
  const [editing, setEditing] = useState(templates[0]);
  const [saved, setSaved] = useState(false);
  const save = event => {
    event.preventDefault();
    const next = templates.map(item => item.id === editing.id ? editing : item);
    setTemplates(next); writeLocal('email-templates', next); setSaved(true);
  };
  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / Settings" title="Email templates" subtitle="Maintain the transactional copy used for access, information requests and decision notifications. Production delivery remains handled by a server-owned notification service." />
    <div className="ph-workspace-split">
      <Card title="Templates"><div className="ph-list">{templates.map(item => <button key={item.id} className="ph-list-row" type="button" onClick={() => { setEditing(item); setSaved(false); }}><span><strong>{item.name}</strong><small>{item.subject}</small></span><Status tone="good">{item.status}</Status></button>)}</div></Card>
      <form className="ph-card ph-stack" onSubmit={save}>
        <div className="ph-card-head"><div><h2>Edit template</h2><p>{editing.id}</p></div>{saved ? <Status tone="good">Saved</Status> : null}</div>
        <Field label="Template name"><input value={editing.name} onChange={event => setEditing(current => ({ ...current, name: event.target.value }))} /></Field>
        <Field label="Subject"><input value={editing.subject} onChange={event => setEditing(current => ({ ...current, subject: event.target.value }))} /></Field>
        <Field label="Message body"><textarea rows="8" value={editing.body} onChange={event => setEditing(current => ({ ...current, body: event.target.value }))} /></Field>
        <div className="ph-form-actions"><button className="ph-button primary" type="submit">Save template</button></div>
      </form>
    </div>
  </div>;
}
