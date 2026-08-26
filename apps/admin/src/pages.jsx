import React, { useState } from 'react';
import { DEMO_AUDIT, DEMO_COMPLIANCE, DEMO_ORGANIZATIONS, DEMO_USERS } from '../../../packages/domain/src/demo-data';
import { getDefaultDemoDestinations } from '../../../packages/platform/src/demo-workflow-store';
import WorkflowJourney from '../../../packages/ui/src/WorkflowJourney';
import { readLocal, writeLocal } from './local-state';
import { Card, Metric, PageHead, Status } from './ui';

export const Overview = () => <>
  <PageHead eyebrow="Admin / Overview" title="Platform governance" subtitle="Identity, access, compliance, audit and workflow control for the shared PiHub platform." />
  <div className="ph-demo">Demo governance data only. Real role changes, compliance decisions, session revocation and workflow authorization must be enforced by the production API.</div>
  <div className="ph-grid cols-4"><Metric value={DEMO_ORGANIZATIONS.length} label="Organizations"/><Metric value={DEMO_USERS.length} label="Demo users"/><Metric value={DEMO_COMPLIANCE.filter(item => item.status !== 'Verified').length} label="Compliance items open"/><Metric value={DEMO_AUDIT.length} label="Recent audit events"/></div>
  <div className="ph-grid cols-2" style={{ marginTop: 16 }}>
    <Card title="Governance priorities"><ul className="ph-list"><li><span>KYB annual review · Berlin Living GmbH</span><Status tone="bad">Action required</Status></li><li><span>UBO evidence · ABC Development AG</span><Status tone="warn">In review</Status></li><li><span>Shared-session backend contract</span><Status>Backend dependency</Status></li></ul></Card>
    <Card title="Architecture boundary"><p className="ph-subtitle">Admin is the supporting control plane for the same organizations, users, policies and audit events used by Borrower, Investor and Advisory. It is independently deployable and never hidden inside another module.</p></Card>
  </div>
  <WorkflowJourney applicationId="admin" destinations={getDefaultDemoDestinations(import.meta.env)} />
</>;

export const Organizations = () => <><PageHead eyebrow="Admin / Organizations" title="Organizations" subtitle="Manage legal-entity context used across Borrower, Investor and Advisory without duplicate organization records."/><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Organization</th><th>Type</th><th>Jurisdiction</th><th>Compliance</th><th>Risk</th><th>Users</th></tr></thead><tbody>{DEMO_ORGANIZATIONS.map(organization => <tr key={organization.id}><td><strong>{organization.name}</strong><div className="ph-metric-label">{organization.id}</div></td><td>{organization.type}</td><td>{organization.jurisdiction}</td><td><Status tone={organization.compliance === 'Verified' ? 'good' : 'warn'}>{organization.compliance}</Status></td><td>{organization.risk}</td><td>{organization.users}</td></tr>)}</tbody></table></div></>;

export const Users = () => {
  const [users, setUsers] = useState(() => readLocal('users', DEMO_USERS));
  const toggle = (id, module) => {
    const next = users.map(user => user.id === id ? { ...user, modules: user.modules.includes(module) ? user.modules.filter(item => item !== module) : [...user.modules, module] } : user);
    setUsers(next);
    writeLocal('users', next);
  };
  return <><PageHead eyebrow="Admin / Identity" title="Users & roles" subtitle="Role management is demonstrated here; production authorization is validated by the server for every module, action and record."/><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>User</th><th>Organization</th><th>Roles</th><th>Module access</th><th>Demo action</th></tr></thead><tbody>{users.map(user => <tr key={user.id}><td><strong>{user.name}</strong><div className="ph-metric-label">{user.email}</div></td><td>{user.organization}</td><td>{user.roles.join(', ')}</td><td>{user.modules.join(', ') || 'None'}</td><td><button className="ph-button" onClick={() => toggle(user.id, 'Borrower')}>{user.modules.includes('Borrower') ? 'Remove Borrower' : 'Add Borrower'}</button></td></tr>)}</tbody></table></div></>;
};

export const Compliance = () => {
  const [items, setItems] = useState(() => readLocal('compliance', DEMO_COMPLIANCE));
  const verify = id => {
    const next = items.map(item => item.id === id ? { ...item, status: 'Verified' } : item);
    setItems(next);
    writeLocal('compliance', next);
  };
  return <><PageHead eyebrow="Admin / Compliance" title="Compliance queue" subtitle="KYB, UBO, investor classification and review expiry belong in a controlled workflow rather than scattered profile fields."/><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Organization</th><th>Check</th><th>Status</th><th>Owner</th><th>Due</th><th>Action</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.organization}</td><td>{item.check}</td><td><Status tone={item.status === 'Verified' ? 'good' : item.status === 'Action required' ? 'bad' : 'warn'}>{item.status}</Status></td><td>{item.owner}</td><td>{item.due}</td><td>{item.status !== 'Verified' ? <button className="ph-button" onClick={() => verify(item.id)}>Verify demo</button> : '—'}</td></tr>)}</tbody></table></div></>;
};

export const AccessPolicies = () => <><PageHead eyebrow="Admin / Authorization" title="Access policies" subtitle="Module visibility is not authorization. Production policies use user, organization, role, module, action and record scope."/><div className="ph-grid cols-3"><Card title="Borrower"><p className="ph-subtitle">Organization members access only their borrower-facing financing requests, documents and messages.</p><Status>Server-enforced target</Status></Card><Card title="Investor"><p className="ph-subtitle">Capital-provider users access only opportunities, positions and documents granted to their institution and role.</p><Status>Server-enforced target</Status></Card><Card title="Advisory"><p className="ph-subtitle">PiHub transaction users access mandates and work products assigned to their internal scope.</p><Status>Server-enforced target</Status></Card></div><Card title="Admin rule"><div className="ph-callout">Admin configures policy, but a frontend toggle is never proof that the policy is secure. The backend remains authoritative.</div></Card></>;

export const Audit = () => <><PageHead eyebrow="Admin / Audit" title="Audit log" subtitle="Security, role and transaction-governance events become immutable server records with actor, time, entity and reason."/><div className="ph-table-wrap"><table className="ph-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th></tr></thead><tbody>{DEMO_AUDIT.map(item => <tr key={item.id}><td>{item.at}</td><td>{item.actor}</td><td>{item.action}</td><td><strong>{item.entity}</strong></td></tr>)}</tbody></table></div></>;

export const Platform = () => <><PageHead eyebrow="Admin / Platform" title="Platform boundaries" subtitle="Operational status for independently deployable PiHub applications and the backend capabilities still required."/><div className="ph-grid cols-2"><Card title="Applications"><ul className="ph-list"><li><span>Investor</span><Status tone="good">Production</Status></li><li><span>Borrower</span><Status tone="good">Application implemented</Status></li><li><span>Advisory</span><Status tone="good">Application implemented</Status></li><li><span>Admin</span><Status tone="good">Control plane implemented</Status></li><li><span>Access</span><Status tone="warn">Gateway only</Status></li></ul></Card><Card title="Backend contracts"><ul className="ph-list"><li><span>Shared secure session / SSO</span><Status tone="bad">Required</Status></li><li><span>Server RBAC / record authorization</span><Status tone="bad">Required</Status></li><li><span>Canonical deal / document APIs</span><Status tone="bad">Required</Status></li><li><span>Audit/event persistence</span><Status tone="bad">Required</Status></li></ul></Card></div></>;
