import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom-v6';
import { clearDemoSession, consumeDemoAccessHandoff, readDemoSession, redirectToCentralAccess } from '../../../packages/platform/src/demo-session';
import { APP_ID, DEMO_ACCOUNT } from './config';
import { Overview, Organizations, Users, Compliance, AccessPolicies, Audit, Platform } from './pages';

const NAV_SECTIONS = [
  { label: 'Workspace', items: [{ label: 'Overview', to: '/', icon: 'overview' }] },
  { label: 'Governance', items: [
    { label: 'Organizations', to: '/organizations', icon: 'organizations' },
    { label: 'Users & roles', to: '/users', icon: 'users' },
    { label: 'Compliance', to: '/compliance', icon: 'compliance' },
    { label: 'Access policies', to: '/access-policies', icon: 'access' },
  ] },
  { label: 'Operations', items: [
    { label: 'Audit log', to: '/audit', icon: 'audit' },
    { label: 'Platform', to: '/platform', icon: 'platform' },
  ] },
];

const Icon = ({ name }) => {
  const paths = {
    overview: <><path d="M4 13h6V4H4z"/><path d="M14 20h6v-9h-6z"/><path d="M14 8h6V4h-6z"/><path d="M4 20h6v-3H4z"/></>,
    organizations: <><path d="M4 21V8l8-4 8 4v13"/><path d="M9 21v-5h6v5"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></>,
    users: <><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M17 8a3 3 0 1 1 0 6"/><path d="M17 17a5 5 0 0 1 5 4"/></>,
    compliance: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8 12l3 3 5-6"/></>,
    access: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    audit: <><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></>,
    platform: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></>,
  };
  return <span className="ph-nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[name] || paths.overview}</svg></span>;
};

const initials = name => String(name || '').split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
const CentralAccessRedirect = () => { useEffect(() => { redirectToCentralAccess(APP_ID); }, []); return null; };

const Workspace = ({ session, onLogout }) => {
  const navigate = useNavigate();
  const mobileItems = useMemo(() => NAV_SECTIONS.flatMap(section => section.items), []);
  const link = item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `ph-nav-link${isActive ? ' active' : ''}`}><Icon name={item.icon}/><span>{item.label}</span></NavLink>;
  return <div className="ph-app" data-workspace="admin">
    <header className="ph-topbar"><div className="ph-topbar-leading"><button className="ph-brand" type="button" onClick={() => navigate('/')}><span className="ph-brandmark">PH</span><span className="ph-brand-copy"><strong>PiHub Admin</strong><small>Governance workspace</small></span></button><div className="ph-workspace-context"><span className="ph-workspace-badge">Admin</span><span className="ph-workspace-context-copy"><strong>Platform control plane</strong><small>Identity · access · compliance · audit</small></span></div></div><div className="ph-topbar-spacer"/><div className="ph-topbar-controls"><div className="ph-environment-chip" aria-label="Demo environment"><span className="ph-environment-dot" aria-hidden="true"/><span className="ph-environment-copy"><strong>Demo workspace</strong><small>Local browser data · no live policy changes</small></span></div><div className="ph-user-card"><span className="ph-avatar" aria-hidden="true">{initials(session.user.name)}</span><span className="ph-user-copy"><strong>{session.user.name}</strong><small>{session.user.organization} · {session.user.role}</small></span><button className="ph-button ph-signout" type="button" onClick={onLogout}>Sign out</button></div></div></header>
    <div className="ph-mobile-nav" aria-label="Admin navigation">{mobileItems.map(link)}</div>
    <div className="ph-shell"><aside className="ph-sidebar">{NAV_SECTIONS.map(section => <div className="ph-sidebar-section" key={section.label}><div className="ph-nav-label">{section.label}</div>{section.items.map(link)}</div>)}<div className="ph-sidebar-foot"><div className="ph-sidebar-foot-copy">Admin is the supporting control plane for PiHub identity, policy, compliance and audit.</div><div className="ph-system-line"><i/><b>DEMO DATA</b><span>CONTROL</span></div></div></aside><main className="ph-main"><Routes><Route path="/" element={<Overview/>}/><Route path="/organizations" element={<Organizations/>}/><Route path="/users" element={<Users/>}/><Route path="/compliance" element={<Compliance/>}/><Route path="/access-policies" element={<AccessPolicies/>}/><Route path="/audit" element={<Audit/>}/><Route path="/platform" element={<Platform/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main></div>
  </div>;
};

export default function App() {
  const [session] = useState(() => consumeDemoAccessHandoff({ applicationId: APP_ID, account: DEMO_ACCOUNT }) || readDemoSession(APP_ID));
  if (!session) return <CentralAccessRedirect/>;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); redirectToCentralAccess(APP_ID); }}/>;
}
