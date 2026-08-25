import React, { useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import { authenticateDemo, clearDemoSession, consumeDemoAccessHandoff, readDemoSession, writeDemoSession } from '../../../packages/platform/src/demo-session';
import { APP_ID, APP_LABEL, DEMO_ACCOUNT, LOGIN_COPY } from './config';
import { Overview, Mandates, Transactions, Structuring, Counterparties, DueDiligence, Execution, Tasks } from './pages';

const NAV = [
  { label: 'Overview', to: '/' },
  { label: 'Mandates', to: '/mandates' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Structuring', to: '/structuring' },
  { label: 'Counterparties', to: '/counterparties' },
  { label: 'Due diligence', to: '/due-diligence' },
  { label: 'Execution', to: '/execution' },
  { label: 'Tasks', to: '/tasks' },
];

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
  const grouped = useMemo(() => NAV, []);
  const link = item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({isActive})=>`ph-nav-link${isActive?' active':''}`}>{item.label}</NavLink>;
  return <div className="ph-app">
    <header className="ph-topbar">
      <div className="ph-topbar-leading">
        <button className="ph-brand" type="button" onClick={()=>navigate('/')}>
          <span className="ph-brandmark">PH</span>
          <span className="ph-brand-copy"><strong>PiHub</strong><small>{APP_LABEL} workspace</small></span>
        </button>
        <span className="ph-workspace-badge">{APP_LABEL}</span>
      </div>
      <div className="ph-topbar-spacer" />
      <div className="ph-topbar-controls">
        <div className="ph-environment-chip" aria-label="Demo environment">
          <span className="ph-environment-dot" aria-hidden="true" />
          <span className="ph-environment-copy"><strong>Demo environment</strong><small>Browser-local workspace data</small></span>
        </div>
        <div className="ph-user-card">
          <span className="ph-avatar" aria-hidden="true">{initials(session.user.name)}</span>
          <span className="ph-user-copy"><strong>{session.user.name}</strong><small>{session.user.organization} · {session.user.role}</small></span>
          <button className="ph-button ph-signout" type="button" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
    <div className="ph-mobile-nav" aria-label={`${APP_LABEL} navigation`}>{grouped.map(link)}</div>
    <div className="ph-shell">
      <aside className="ph-sidebar">
        <div className="ph-nav-group"><div className="ph-nav-label">{APP_LABEL} workspace</div>{grouped.map(link)}</div>
        <div className="ph-sidebar-foot"><strong>PiHub platform</strong><span>Advisory owns structuring and execution workflows. Shared records remain platform-owned.</span></div>
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
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); setSession(null); } } />;
}
