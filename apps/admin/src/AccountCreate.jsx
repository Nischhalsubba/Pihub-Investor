import React, { useState } from 'react';
import { Card, Field, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { readLocal, writeLocal } from './local-state';

const seed = Object.freeze({ organization: '', type: 'Investor', contact: '', email: '', jurisdiction: 'Germany', role: 'Organization Owner' });

export default function AccountCreate() {
  const [form, setForm] = useState(seed);
  const [created, setCreated] = useState(null);
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    if (!form.organization.trim() || !form.contact.trim() || !form.email.trim()) return;
    const accounts = readLocal('created-accounts', []);
    const next = { ...form, id: `ORG-DEMO-${String(accounts.length + 1).padStart(3, '0')}`, status: 'Active', createdAt: new Date().toISOString() };
    writeLocal('created-accounts', [...accounts, next]);
    setCreated(next);
    setForm(seed);
  };
  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / Accounts" title="Add organization account" subtitle="Create a browser-local Investor or Borrower organization record with an initial owner. Production provisioning remains server-authorized and audited." />
    {created ? <div className="ph-callout" role="status"><strong>{created.organization}</strong> created as {created.type} account · {created.id}.</div> : null}
    <div className="ph-workspace-split">
      <form className="ph-card ph-stack" onSubmit={submit}>
        <div className="ph-form-grid">
          <Field label="Organization name"><input name="organization" value={form.organization} onChange={update} required /></Field>
          <Field label="Account type"><select name="type" value={form.type} onChange={update}><option>Investor</option><option>Borrower</option></select></Field>
          <Field label="Primary contact"><input name="contact" value={form.contact} onChange={update} required /></Field>
          <Field label="Email"><input name="email" type="email" value={form.email} onChange={update} required /></Field>
          <Field label="Jurisdiction"><select name="jurisdiction" value={form.jurisdiction} onChange={update}><option>Germany</option><option>Austria</option><option>Switzerland</option></select></Field>
          <Field label="Initial role"><select name="role" value={form.role} onChange={update}><option>Organization Owner</option><option>Investor Admin</option><option>Borrower Owner</option></select></Field>
        </div>
        <div className="ph-form-actions"><button className="ph-button primary" type="submit">Create account</button></div>
      </form>
      <aside className="ph-sticky-rail"><Card title="Provisioning contract"><ul className="ph-list"><li><span>Organization record</span><Status tone="good">Required</Status></li><li><span>Initial owner</span><Status tone="good">Required</Status></li><li><span>Compliance review</span><Status tone="warn">Next</Status></li><li><span>Module access</span><Status>Admin governed</Status></li></ul></Card></aside>
    </div>
  </div>;
}
