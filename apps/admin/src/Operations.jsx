import React, { useMemo, useState } from 'react';
import { ADMIN_ACCOUNT_DIRECTORY, ADMIN_OPERATION_QUEUES } from '../../../packages/domain/src/figma-flow-data';
import { DEMO_ORGANIZATIONS, euro } from '../../../packages/domain/src/demo-data';
import { Card, Field, PageHead, Status } from '../../../packages/ui/src/Primitives';
import { readLocal, writeLocal } from './local-state';

const TITLES = Object.freeze({
  'investor-accounts': ['Investor accounts', 'Search, review and maintain investor account access without leaving the Admin control plane.'],
  'borrower-accounts': ['Borrower accounts', 'Search, review and maintain creditor/borrower account access and organization ownership.'],
  'account-requests': ['Account requests', 'Approve or reject requests for new PiHub organization access.'],
  'product-requests': ['Product requests', 'Review product-related requests that require platform operations action.'],
  'credit-requests': ['Credit requests', 'Track creditor-side credit requests and their current review owner.'],
});

const initialAccountRequests = Object.freeze([
  { id: 'AR-301', organization: 'Neue Wohnbau GmbH', type: 'Borrower', requestedBy: 'Sofia Wagner', status: 'Pending' },
  { id: 'AR-302', organization: 'Alpine Pension Fund', type: 'Investor', requestedBy: 'Thomas Frei', status: 'Pending' },
]);

const tone = status => ['Approved', 'Active', 'Ready', 'Verified'].includes(status) ? 'good' : ['Rejected', 'Suspended', 'Removed'].includes(status) ? 'bad' : 'warn';

export default function Operations({ kind }) {
  const [title, description] = TITLES[kind] || TITLES['account-requests'];
  const [requests, setRequests] = useState(() => readLocal('account-requests', initialAccountRequests));
  const [productRequests, setProductRequests] = useState(() => readLocal('product-requests', ADMIN_OPERATION_QUEUES.productRequests));
  const [creditRequests, setCreditRequests] = useState(() => readLocal('credit-requests', ADMIN_OPERATION_QUEUES.creditRequests));
  const [accounts, setAccounts] = useState(() => readLocal('account-directory', ADMIN_ACCOUNT_DIRECTORY));
  const [accountSearch, setAccountSearch] = useState('');
  const [createdSince, setCreatedSince] = useState('');
  const [draft, setDraft] = useState({ organization: '', type: 'Borrower', requestedBy: '' });
  const [message, setMessage] = useState('');

  const accountType = kind === 'investor-accounts' ? 'Investor' : kind === 'borrower-accounts' ? 'Borrower' : null;
  const accountRows = useMemo(() => {
    if (!accountType) return [];
    const needle = accountSearch.trim().toLowerCase();
    return accounts.filter(item => item.type === accountType && item.status !== 'Removed')
      .filter(item => !needle || `${item.name} ${item.email} ${item.phone} ${item.organization}`.toLowerCase().includes(needle))
      .filter(item => !createdSince || item.createdAt >= createdSince);
  }, [accountSearch, accountType, accounts, createdSince]);
  const organizationCount = accountType ? DEMO_ORGANIZATIONS.filter(item => item.type === accountType).length : 0;

  const saveAccounts = next => { setAccounts(next); writeLocal('account-directory', next); };
  const removeAccount = id => {
    const next = accounts.map(item => item.id === id ? { ...item, status: 'Removed' } : item);
    saveAccounts(next); setMessage(`${id} removed from active ${accountType?.toLowerCase()} accounts.`);
  };
  const decideAccount = (id, status) => {
    const next = requests.map(item => item.id === id ? { ...item, status } : item);
    setRequests(next); writeLocal('account-requests', next); setMessage(`${id} marked ${status.toLowerCase()}.`);
  };
  const advanceProduct = id => {
    const next = productRequests.map(item => item.id === id ? { ...item, status: item.status === 'Ready' ? 'Approved' : 'Ready' } : item);
    setProductRequests(next); writeLocal('product-requests', next); setMessage(`${id} advanced.`);
  };
  const advanceCredit = id => {
    const next = creditRequests.map(item => item.id === id ? { ...item, status: 'Approved' } : item);
    setCreditRequests(next); writeLocal('credit-requests', next); setMessage(`${id} approved in the demo queue.`);
  };
  const addRequest = event => {
    event.preventDefault();
    if (!draft.organization.trim() || !draft.requestedBy.trim()) return;
    const next = [...requests, { id: `AR-${303 + requests.length}`, organization: draft.organization.trim(), type: draft.type, requestedBy: draft.requestedBy.trim(), status: 'Pending' }];
    setRequests(next); writeLocal('account-requests', next); setDraft({ organization: '', type: 'Borrower', requestedBy: '' }); setMessage('Account request created.');
  };

  return <div className="ph-page-shell">
    <PageHead eyebrow="Admin / Operations" title={title} subtitle={description} />
    {message ? <div className="ph-callout" role="status">{message}</div> : null}

    {accountType ? <>
      <div className="ph-metric-grid"><Card title="Active accounts"><div className="ph-metric-value">{accounts.filter(item => item.type === accountType && item.status !== 'Removed').length}</div><p className="ph-section-note">Individual user accounts</p></Card><Card title="Organizations"><div className="ph-metric-value">{organizationCount || 1}</div><p className="ph-section-note">Current demo organizations</p></Card><Card title="Provisioning"><Status tone="warn">Admin governed</Status><p className="ph-section-note">Production removal requires server-side audit and authorization.</p></Card></div>
      <Card title={`${accountType} account directory`} action={<Status tone="good">{accountRows.length} visible</Status>}>
        <div className="ph-form-grid" style={{ marginBottom: 16 }}><Field label="Search accounts"><input value={accountSearch} onChange={event => setAccountSearch(event.target.value)} placeholder="Name, email, phone or organization" /></Field><Field label="Created on or after"><input type="date" value={createdSince} onChange={event => setCreatedSince(event.target.value)} /></Field></div>
        <div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Name</th><th>Organization</th><th>Email</th><th>Phone</th><th>Created</th><th>Status</th><th /></tr></thead><tbody>{accountRows.map(item => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.id}</small></td><td>{item.organization}</td><td>{item.email}</td><td>{item.phone}</td><td className="ph-mono">{item.createdAt}</td><td><Status tone="good">{item.status}</Status></td><td><button className="ph-button secondary" type="button" onClick={() => removeAccount(item.id)}>Remove</button></td></tr>)}</tbody></table></div>
        {!accountRows.length ? <div className="ph-empty"><strong>No accounts match these filters.</strong><span>Clear the search or date filter to restore the directory.</span></div> : null}
      </Card>
    </> : null}

    {kind === 'account-requests' ? <>
      <Card title="Create account request"><form className="ph-form-grid" onSubmit={addRequest}><Field label="Organization"><input value={draft.organization} onChange={event => setDraft(current => ({ ...current, organization: event.target.value }))} /></Field><Field label="Account type"><select value={draft.type} onChange={event => setDraft(current => ({ ...current, type: event.target.value }))}><option>Borrower</option><option>Investor</option></select></Field><Field label="Requested by"><input value={draft.requestedBy} onChange={event => setDraft(current => ({ ...current, requestedBy: event.target.value }))} /></Field><div className="ph-form-actions"><button className="ph-button primary" type="submit">Create request</button></div></form></Card>
      <Card title="Account request queue"><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Organization</th><th>Type</th><th>Requested by</th><th>Status</th><th /></tr></thead><tbody>{requests.map(item => <tr key={item.id}><td><strong>{item.organization}</strong><small>{item.id}</small></td><td>{item.type}</td><td>{item.requestedBy}</td><td><Status tone={tone(item.status)}>{item.status}</Status></td><td><div className="ph-inline"><button className="ph-button secondary" type="button" disabled={item.status !== 'Pending'} onClick={() => decideAccount(item.id, 'Approved')}>Approve</button><button className="ph-button secondary" type="button" disabled={item.status !== 'Pending'} onClick={() => decideAccount(item.id, 'Rejected')}>Reject</button></div></td></tr>)}</tbody></table></div></Card>
    </> : null}

    {kind === 'product-requests' ? <Card title="Product request queue"><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Applicant</th><th>Product</th><th>Status</th><th>Owner</th><th /></tr></thead><tbody>{productRequests.map(item => <tr key={item.id}><td><strong>{item.applicant}</strong><small>{item.id}</small></td><td>{item.product}</td><td><Status tone={tone(item.status)}>{item.status}</Status></td><td>{item.owner}</td><td><button className="ph-button primary" type="button" disabled={item.status === 'Approved'} onClick={() => advanceProduct(item.id)}>{item.status === 'Ready' ? 'Approve' : item.status === 'Approved' ? 'Approved' : 'Mark ready'}</button></td></tr>)}</tbody></table></div></Card> : null}

    {kind === 'credit-requests' ? <Card title="Credit request queue"><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Applicant</th><th>Amount</th><th>Status</th><th>Owner</th><th /></tr></thead><tbody>{creditRequests.map(item => <tr key={item.id}><td><strong>{item.applicant}</strong><small>{item.id}</small></td><td className="ph-mono">{euro(item.amount)}</td><td><Status tone={tone(item.status)}>{item.status}</Status></td><td>{item.owner}</td><td><button className="ph-button primary" type="button" disabled={item.status === 'Approved'} onClick={() => advanceCredit(item.id)}>{item.status === 'Approved' ? 'Approved' : 'Approve'}</button></td></tr>)}</tbody></table></div></Card> : null}
  </div>;
}
