import React, { useMemo, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import { authenticateDemo, clearDemoSession, readDemoSession, writeDemoSession } from '../../../packages/platform/src/demo-session';
import { APP_ID, APP_LABEL, DEMO_ACCOUNT, LOGIN_COPY } from './config';
import { Overview, Financing, Company, Project, Financials, Documents, Requests, Closing, Account } from './pages';

const NAV = [
  { label: 'Overview', to: '/' },
  { label: 'Financing request', to: '/financing' },
  { label: 'Company', to: '/company' },
  { label: 'Project / Property', to: '/project' },
  { label: 'Financials', to: '/financials' },
  { label: 'Documents', to: '/documents' },
  { label: 'PiHub requests', to: '/requests' },
  { label: 'Terms & closing', to: '/closing' },
  { label: 'Account', to: '/account' },
];

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
        <div className="ph-demo">Demo workspace. Data and actions are stored only in this browser until the shared PiHub server session and API contracts are connected.</div>
        <div className="ph-field"><label htmlFor="login-email">Email</label><input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></div>
        <div className="ph-field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></div>
        {error ? <div role="alert" className="ph-callout">{error}</div> : null}
        <button type="submit" className="ph-button primary">Open {APP_LABEL}</button>
        <div className="ph-login-hint">Demo account: <strong>{DEMO_ACCOUNT.email}</strong><br/>Password: <strong>{DEMO_ACCOUNT.password}</strong></div>
      </form>
    </section>
    <aside className="ph-login-side" aria-hidden="true"><div><div className="ph-eyebrow">PIHUB / {APP_LABEL.toUpperCase()}</div><h1>{LOGIN_COPY.side}</h1><p>One application, one route boundary, one release surface. Shared data can flow through platform contracts without importing another module's screens.</p></div></aside>
  </main>;
};

const Workspace = ({ session, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const grouped = useMemo(() => NAV, []);
  const link = item => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({isActive})=>`ph-nav-link${isActive?' active':''}`}>{item.label}</NavLink>;
  return <div className="ph-app">
    <header className="ph-topbar">
      <button className="ph-brand" type="button" onClick={()=>navigate('/')} style={{background:'transparent',border:0,color:'inherit',padding:0,cursor:'pointer'}}><span className="ph-brandmark">PH</span><span>PiHub</span></button>
      <span className="ph-workspace-badge">{APP_LABEL}</span>
      <div className="ph-topbar-spacer" />
      <span className="ph-env">Demo environment</span>
      <div className="ph-user"><span>{session.user.organization}</span><span className="ph-avatar" aria-hidden="true">{session.user.name.split(' ').map(part=>part[0]).join('').slice(0,2)}</span><button className="ph-button" type="button" onClick={onLogout}>Sign out</button></div>
    </header>
    <div className="ph-mobile-nav" aria-label={`${APP_LABEL} navigation`}>{grouped.map(link)}</div>
    <div className="ph-shell">
      <aside className="ph-sidebar"><div className="ph-nav-group"><div className="ph-nav-label">{APP_LABEL} workspace</div>{grouped.map(link)}</div><div className="ph-demo">{APP_ID === 'admin' ? 'Admin is a supporting application, not a fourth business module.' : 'This workspace owns only its own routes and browser-local demo state.'}</div></aside>
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
  const [session, setSession] = useState(() => readDemoSession(APP_ID));
  if (!session) return <Login onLogin={setSession} />;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); setSession(null); } } />;
}
