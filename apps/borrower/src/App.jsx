import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import { clearDemoSession, consumeDemoAccessHandoff, readDemoSession, redirectToCentralAccess } from '../../../packages/platform/src/demo-session';
import { DEMO_DEAL } from '../../../packages/domain/src/demo-data';
import { APP_ID, APP_LABEL, DEMO_ACCOUNT } from './config';
import Overview from './Overview';
import { Financing, Company, Project, Financials, Documents, Requests, Closing, Account } from './pages';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [{ label: 'Overview', to: '/', icon: 'overview' }]
  },
  {
    label: 'Financing',
    items: [
      { label: 'Financing request', to: '/financing', icon: 'request' },
      { label: 'Company', to: '/company', icon: 'company' },
      { label: 'Project / Property', to: '/project', icon: 'project' },
      { label: 'Financials', to: '/financials', icon: 'financials' }
    ]
  },
  {
    label: 'Process',
    items: [
      { label: 'Documents', to: '/documents', icon: 'documents' },
      { label: 'PiHub requests', to: '/requests', icon: 'requests' },
      { label: 'Terms & closing', to: '/closing', icon: 'closing' },
      { label: 'Account', to: '/account', icon: 'account' }
    ]
  }
];

const Icon = ({ name }) => {
  const paths = {
    overview: <><path d="M4 13h6V4H4z"/><path d="M14 20h6v-9h-6z"/><path d="M14 8h6V4h-6z"/><path d="M4 20h6v-3H4z"/></>,
    request: <><path d="M7 3h10l3 3v15H7z"/><path d="M17 3v4h4"/><path d="M10 11h7"/><path d="M10 15h7"/></>,
    company: <><path d="M4 21V8l8-4 8 4v13"/><path d="M9 21v-5h6v5"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></>,
    project: <><path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/></>,
    financials: <><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></>,
    documents: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5"/><path d="M9 13h7"/><path d="M9 17h5"/></>,
    requests: <><path d="M4 5h16v12H8l-4 4z"/><path d="M8 9h8"/><path d="M8 13h5"/></>,
    closing: <><path d="M4 12l5 5L20 6"/><path d="M4 6h7"/><path d="M4 18h12"/></>,
    account: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>
  };
  return <span className="ph-nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[name] || paths.overview}</svg></span>;
};

const initials = name => String(name || '').split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();

const CentralAccessRedirect = () => {
  useEffect(() => { redirectToCentralAccess(APP_ID); }, []);
  return null;
};

const Workspace = ({ session, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileItems = useMemo(() => NAV_SECTIONS.flatMap(section => section.items), []);
  const link = item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `ph-nav-link${isActive ? ' active' : ''}`}><Icon name={item.icon}/><span>{item.label}</span></NavLink>;

  return <div className="ph-app" data-workspace="borrower">
    <header className="ph-topbar">
      <div className="ph-topbar-leading">
        <button className="ph-brand" type="button" onClick={() => navigate('/')}>
          <span className="ph-brandmark">PH</span>
          <span className="ph-brand-copy"><strong>PiHub Borrower</strong><small>Origination workspace</small></span>
        </button>
        <div className="ph-workspace-context">
          <span className="ph-workspace-badge">Borrower</span>
          <span className="ph-workspace-context-copy"><strong>{DEMO_DEAL.id}</strong><small>{DEMO_DEAL.name}</small></span>
        </div>
      </div>
      <div className="ph-topbar-spacer" />
      <div className="ph-topbar-controls">
        <div className="ph-environment-chip" aria-label="Demo environment">
          <span className="ph-environment-dot" aria-hidden="true" />
          <span className="ph-environment-copy"><strong>Demo workspace</strong><small>Local browser data · no live records</small></span>
        </div>
        <div className="ph-user-card">
          <span className="ph-avatar" aria-hidden="true">{initials(session.user.name)}</span>
          <span className="ph-user-copy"><strong>{session.user.name}</strong><small>{session.user.organization} · {session.user.role}</small></span>
          <button className="ph-button ph-signout" type="button" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>

    <div className="ph-mobile-nav" aria-label={`${APP_LABEL} navigation`}>{mobileItems.map(link)}</div>

    <div className="ph-shell">
      <aside className="ph-sidebar">
        <div className="ph-sidebar-primary"><Link className="ph-button primary" to="/financing"><span className="ph-button-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>Continue application</Link></div>
        {NAV_SECTIONS.map(section => <div className="ph-sidebar-section" key={section.label}><div className="ph-nav-label">{section.label}</div>{section.items.map(link)}</div>)}
        <div className="ph-sidebar-foot">
          <div className="ph-sidebar-foot-copy">Borrower shows application progress, borrower-owned information and requests from PiHub. Internal lender or advisory decisions stay outside this workspace.</div>
          <div className="ph-system-line"><i/><b>DEMO DATA</b><span>EUR</span></div>
        </div>
      </aside>

      <main className="ph-main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/company" element={<Company />} />
          <Route path="/project" element={<Project />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/closing" element={<Closing />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  </div>;
};

export default function App() {
  const [session] = useState(() => consumeDemoAccessHandoff({ applicationId: APP_ID, account: DEMO_ACCOUNT }) || readDemoSession(APP_ID));
  if (!session) return <CentralAccessRedirect />;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); redirectToCentralAccess(APP_ID); }} />;
}
