import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import {
  clearDemoSession,
  consumeDemoAccessHandoff,
  readDemoSession,
  redirectToCentralAccess,
} from '../../../packages/platform/src/demo-session';
import { DEMO_DEAL } from '../../../packages/domain/src/demo-data';
import PlatformShell from '../../../packages/ui/src/PlatformShell';
import { APP_ID, APP_LABEL, DEMO_ACCOUNT } from './config';
import Overview from './Overview';
import { Mandates, Transactions, Structuring, Counterparties, DueDiligence, Execution, Tasks } from './pages';

const ICONS = {
  overview: 'M4 13h6V4H4v9m10 7h6v-9h-6v9',
  mandates: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h4',
  transactions: 'M4 7h16M7 4 4 7l3 3M20 17H4m13-3 3 3-3 3',
  structuring: 'M4 6h16M7 6v12M17 6v12M4 18h16',
  counterparties: 'M4 20a8 8 0 0 1 16 0M8 8a4 4 0 1 0 8 0',
  diligence: 'M5 4h14v16H5zM8 8h8M8 12h5M8 16h3',
  execution: 'M4 12l5 5L20 6M4 18h12',
  tasks: 'M5 5h14v14H5zM8 9l2 2 3-4M14 10h3',
};

const NAVIGATION = [
  { label: 'Workspace', items: [{ label: 'Overview', to: '/', iconPath: ICONS.overview }] },
  { label: 'Pipeline', items: [
    { label: 'Mandates', to: '/mandates', iconPath: ICONS.mandates },
    { label: 'Transactions', to: '/transactions', iconPath: ICONS.transactions },
  ] },
  { label: 'Execution', items: [
    { label: 'Structuring', to: '/structuring', iconPath: ICONS.structuring },
    { label: 'Counterparties', to: '/counterparties', iconPath: ICONS.counterparties },
    { label: 'Due diligence', to: '/due-diligence', iconPath: ICONS.diligence },
    { label: 'Execution', to: '/execution', iconPath: ICONS.execution },
    { label: 'Tasks', to: '/tasks', iconPath: ICONS.tasks },
  ] },
];

const CentralAccessRedirect = () => {
  useEffect(() => { redirectToCentralAccess(APP_ID); }, []);
  return null;
};

const Workspace = ({ session, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <PlatformShell
      applicationId={APP_ID}
      brandTitle="PiHub Advisory"
      brandSubtitle="Structuring workspace"
      workspaceBadge={APP_LABEL}
      contextTitle={DEMO_DEAL.id}
      contextSubtitle={DEMO_DEAL.name}
      environmentDetail="Local browser data · no live records"
      navigationSections={NAVIGATION}
      primaryAction={{ label: 'Open transactions', to: '/transactions' }}
      footerCopy="Advisory owns mandate, structuring and execution coordination around shared deal records."
      user={session.user}
      onLogout={onLogout}
      onHome={() => navigate('/')}
      accountSecondaryAction={{ label: 'Execution tasks', onSelect: () => navigate('/tasks') }}
      routeKey={location.pathname}
    >
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
    </PlatformShell>
  );
};

export default function App() {
  const [session] = useState(() => consumeDemoAccessHandoff({ applicationId: APP_ID, account: DEMO_ACCOUNT }) || readDemoSession(APP_ID));
  if (!session) return <CentralAccessRedirect />;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); redirectToCentralAccess(APP_ID); }} />;
}
