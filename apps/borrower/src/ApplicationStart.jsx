import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v6';
import { DEMO_DEAL, DEMO_DOCUMENTS, DEMO_REQUESTS, euro } from '../../../packages/domain/src/demo-data';
import { resetDemoWorkflow } from '../../../packages/platform/src/demo-workflow-store';
import { Card, Field, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { resetLocalWorkspace, writeLocal } from './local-state';

const seed = Object.freeze({
  company: DEMO_DEAL.borrower,
  project: DEMO_DEAL.name,
  amount: String(DEMO_DEAL.requestedAmount),
  purpose: 'Construction and stabilization of the Berlin multifamily development',
  timing: 'Q4 2026',
  structure: DEMO_DEAL.structure,
});

export default function ApplicationStart() {
  const navigate = useNavigate();
  const [form, setForm] = useState(seed);
  const [errors, setErrors] = useState({});
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const create = event => {
    event.preventDefault();
    const nextErrors = {};
    ['company', 'project', 'amount', 'purpose', 'timing'].forEach(key => {
      if (!String(form[key] || '').trim()) nextErrors[key] = 'Required';
    });
    const amount = Number(form.amount);
    if (!nextErrors.amount && (!Number.isFinite(amount) || amount <= 0)) nextErrors.amount = 'Enter a valid amount greater than zero';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    resetLocalWorkspace();
    resetDemoWorkflow();
    const createdAt = new Date().toISOString();
    writeLocal('application', {
      id: DEMO_DEAL.id,
      status: 'Draft',
      createdAt,
      company: form.company.trim(),
      project: form.project.trim(),
    });
    writeLocal('company', {
      legalName: form.company.trim(),
      registration: 'HRB 209147 B',
      jurisdiction: 'Germany',
      website: 'https://example.invalid',
      employees: '24',
      business: 'Residential development and asset management',
    });
    writeLocal('financing', {
      amount: String(amount),
      purpose: form.purpose.trim(),
      timing: form.timing.trim(),
      structure: form.structure,
      notes: '',
    });
    writeLocal('documents', DEMO_DOCUMENTS);
    writeLocal('requests', DEMO_REQUESTS);
    navigate('/financing?created=1', { replace: true });
  };

  return <div className="ph-page-shell">
    <PageHead
      eyebrow="Borrower / Applications"
      title="Start a financing application"
      subtitle="Create a clean borrower-owned draft, then complete financing, company, project, financial and document information before submitting the same deal into PiHub review."
    />
    <div className="ph-workspace-split">
      <form className="ph-card ph-stack" onSubmit={create} noValidate>
        <div>
          <h2 style={{ marginBottom: 4 }}>Application basics</h2>
          <p className="ph-section-note">These fields establish the draft. The detailed workspace remains editable after creation.</p>
        </div>
        <div className="ph-form-grid">
          <Field label="Borrowing company" error={errors.company}><input name="company" value={form.company} onChange={update} /></Field>
          <Field label="Project / transaction" error={errors.project}><input name="project" value={form.project} onChange={update} /></Field>
          <Field label="Requested amount (EUR)" error={errors.amount}><input name="amount" inputMode="decimal" value={form.amount} onChange={update} /></Field>
          <Field label="Target funding timing" error={errors.timing}><input name="timing" value={form.timing} onChange={update} /></Field>
          <Field label="Preferred structure"><select name="structure" value={form.structure} onChange={update}><option>Senior Development Facility</option><option>Bridge Loan</option><option>Whole Loan</option><option>Mezzanine</option></select></Field>
          <Field label="Financing purpose" error={errors.purpose}><input name="purpose" value={form.purpose} onChange={update} /></Field>
        </div>
        <div className="ph-form-actions"><button className="ph-button primary" type="submit">Create application</button><span className="ph-section-note">Creates a browser-local demo draft. It does not submit to PiHub yet.</span></div>
      </form>
      <aside className="ph-sticky-rail" aria-label="Application guidance">
        <Card title="What creation does"><ul className="ph-list"><li><span>Creates a clean draft</span><Status tone="good">Step 1</Status></li><li><span>Opens detailed financing fields</span><Status>Step 2</Status></li><li><span>Restarts the canonical deal workflow</span><Status>Draft</Status></li></ul></Card>
        <Card title="Current demo context"><dl className="ph-kv"><dt>Deal reference</dt><dd>{DEMO_DEAL.id}</dd><dt>Example amount</dt><dd>{euro(DEMO_DEAL.requestedAmount)}</dd><dt>Flow</dt><dd>Borrower → Advisory → Investor → Admin → Funding</dd></dl></Card>
        <div className="ph-callout">Creating the application and submitting it are deliberately separate actions. This prevents an incomplete form from silently entering the downstream transaction workflow.</div>
      </aside>
    </div>
  </div>;
}
