import React, { useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import { authenticateDemo, clearDemoSession, consumeDemoAccessHandoff, readDemoSession, writeDemoSession } from '../../../packages/platform/src/demo-session';
import { DEMO_DEAL } from '../../../packages/domain/src/demo-data';
import { APP_ID, APP_LABEL, DEMO_ACCOUNT, LOGIN_COPY } from './config';
import Overview from './Overview';
import { Mandates, Transactions, Structuring, Counterparties, DueDiligence, Execution, Tasks } from './pages';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [{ label: 'Overview', to: '/', icon: 'overview' }]
  },
  {
    label: 'Pipeline',
    items: [
      { label: 'Mandates', to: '/mandates', icon: 'mandates' },
      { label: 'Transactions', to: '/transactions', icon: 'transactions' }
    ]
  },
  {
    label: 'Execution',
    items: [
      { label: 'Structuring', to: '/structuring', icon: 'structuring' },
      { label: 'Counterparties', to: '/counterparties', icon: 'counterparties' },
      { label: 'Due diligence', to: '/due-diligence', icon: 'dd' },
      { label: 'Execution', to: '/execution', icon: 'execution' },
      { label: 'Tasks', to: '/tasks', icon: 'tasks' }
    ]
  }
];

const Icon = ({ name }) => {
  const paths = {
    overview: <><path d="M4 13h6V4H4z"/><path d="M14 20h6v-9h-6z"/><path d="M14 8h6V4h-6z"/><path d="M4 20h6v-3H4z"/></>,
    mandates: <><path d="M6 3h12v18H6z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></>,
    transactions: <><path d="M4 7h16"/><path d="M7 4l-3 3 3 3"/><path d="M20 17H4"/><path d="M17 14l3 3-3 3"/></>,
    structuring: <><path d="M4 6h16"/><path d="M7 6v12"/><path d="M17 6v12"/><path d="M4 18h16"/><path d="M10 10h4v4h-4z"/></>,
    counterparties: <><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a5 5 0 0 1 10 0"/><path d="M13 20a4 4 0 0 1 8 0"/></>,
    dd: <><path d="M5 4h14v16H5z"/><path d="M8 8h8"/><path d="M8 12h5"/><path d="M8 16h3"/><path d="M15 15l1.5 1.5L20 13"/></>,
    execution: <><path d="M4 12l5 5L20 6"/><path d="M4 6h7"/><path d="M4 18h12"/></>,
    tasks: <><path d="M5 5h14v14H5z"/><path d="M8 9l1.5 1.5L12 8"/><path d="M14 10h3"/><path d="M8 15l1.5 1.5L12 14"/><path d="M14 16h3"/></>
  };
  return <span className="ph-nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24">{paths[name] || paths.overview}</svg></span>;
};

const initials = name => String(name || '').split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState(DEMO_ACCOUNT.password);
  const [error, setError] = useState('');
  const submit = event => {
    event.preventDefault();
    const result = authenticateDemo({ applicationId: APP_ID, email, password, account: DEMO_ACCOUNT });
    if (!result.ok) { setError(result.error); return; }
    writeDemoSession(APP_ID, result.session);
    onLogin(result.session);
  };
  return <main className="ph-login">
    <section className="ph-login-main">
      <form className="ph-login-card ph-login-form" onSubmit={submit} noValidate>
        <div className="ph-login-brand"><span className="ph-brandmark">PH</span><span>PiHub</span><span className="ph-status">{APP_LABEL}</span></div>
        <div><div className="ph-eyebrow">{LOGIN_COPY.eyebrow}</div><h1 className="ph-title">Sign in</h1><p className="ph-subtitle">{LOGIN_COPY.description}</p></div>
        <div className="ph-demo">Direct demo access. The shared PiHub access screen normally opens this workspace without asking for credentials twice.</div>
        <div className="ph-field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></div>
        <div className="ph-field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></div>
        {error ? <div role="alert" className="ph-callout">{error}</div> : null}
        <button type="submit" className="ph-button primary">Open {APP_LABEL}</button>
        <div className="ph-login-hint">Demo account: <strong>{DEMO_ACCOUNT.email}</strong><br/>Password: <strong>{DEMO_ACCOUNT.password}</strong></div>
      </form>
    </section>
    <aside className="ph-login-side" aria-hidden="true"><div><div className="ph-eyebrow">PIHUB / {APP_LABEL.toUpperCase()}</div><h1>{LOGIN_COPY.side}</h1><p>Separate application boundary, shared PiHub design system and one canonical transaction record.</p></div></aside>
  </main>;
};

const Workspace = ({ session, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mobileItems = useMemo(() => NAV_SECTIONS.flatMap(section => section.items), []);
  const link = item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `ph-nav-link${isActive ? ' active' : ''}`}><Icon name={item.icon}/><span>{item.label}</span></NavLink>;

  return <div className="ph-app" data-workspace="advisory">
    <header className="ph-topbar">
      <div className="ph-topbar-leading">
        <button className="ph-brand" type="button" onClick={() => navigate('/')}>
          <span className="ph-brandmark">PH</span>
          <span className="ph-brand-copy"><strong>PiHub Advisory</strong><small>Structuring workspace</small></span>
        </button>
        <div className="ph-workspace-context">
          <span className="ph-workspace-badge">Advisory</span>
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
        <div className="ph-sidebar-primary"><Link className="ph-button primary" to="/transactions"><span className="ph-button-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16M7 4L4 7l3 3M20 17H4m13-3 3 3-3 3"/></svg></span>Open transactions</Link></div>
        {NAV_SECTIONS.map(section => <div className="ph-sidebar-section" key={section.label}><div className="ph-nav-label">{section.label}</div>{section.items.map(link)}</div>)}
        <div className="ph-sidebar-foot">
          <div className="ph-sidebar-foot-copy">Advisory owns mandate, structuring and execution coordination. Borrower-facing progress and Investor decision material remain separate views of shared records.</div>
          <div className="ph-system-line"><i/><b>DEMO DATA</b><span>EUR</span></div>
        </div>
      </aside>

      <main className="ph-main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/mandates" element={<Mandates />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/structuring" element={<Structuring />} />
          <Route path="/counterparties" element={<Counterparties />} />
          <Route path="/due-diligence" element={<DueDiligence />} />
          <Route path="/execution" element={<Execution />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  </div>;
};

export default function App() {
  const [session, setSession] = useState(() => consumeDemoAccessHandoff({ applicationId: APP_ID, account: DEMO_ACCOUNT }) || readDemoSession(APP_ID));
  if (!session) return <Login onLogin={setSession} />;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); setSession(null); }} />;
}
