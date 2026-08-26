import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom-v6';
import {
  clearDemoSession,
  consumeDemoAccessHandoff,
  readDemoSession,
  redirectToCentralAccess,
} from '../../../packages/platform/src/demo-session';
import PlatformShell from '../../../packages/ui/src/PlatformShell';
import { APP_ID, DEMO_ACCOUNT } from './config';
import { Overview, Organizations, Users, Compliance, AccessPolicies, Audit, Platform } from './pages';
import Operations from './Operations';
import ReferenceData from './ReferenceData';
import AdminCatalog from './AdminCatalog';
import AccountCreate from './AccountCreate';
import EmailTemplates from './EmailTemplates';
import NotFound from './NotFound';

const ICONS = {
  overview: 'M4 13h6V4H4v9m10 7h6v-9h-6v9',
  organizations: 'M4 21V8l8-4 8 4v13M9 21v-5h6v5',
  users: 'M4 21a8 8 0 0 1 16 0M8 8a4 4 0 1 0 8 0',
  compliance: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8 12l3 3 5-6',
  access: 'M4 10h16v11H4zM8 10V7a4 4 0 0 1 8 0v3',
  audit: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
  platform: 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1',
  accounts: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h5',
  products: 'M4 5h16v14H4zM8 9h8M8 13h5',
  requests: 'M4 5h16v12H8l-4 4zM8 9h8M8 13h5',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 12h2M18 12h2M12 4v2M12 18v2',
};

const NAVIGATION = [
  { label: 'Workspace', items: [{ label: 'Overview', to: '/', iconPath: ICONS.overview }] },
  { label: 'Governance', items: [
    { label: 'Organizations', to: '/organizations', iconPath: ICONS.organizations },
    { label: 'Users & roles', to: '/users', iconPath: ICONS.users },
    { label: 'Compliance', to: '/compliance', iconPath: ICONS.compliance },
    { label: 'Access policies', to: '/access-policies', iconPath: ICONS.access },
  ] },
  { label: 'Accounts & requests', items: [
    { label: 'Investor accounts', to: '/investor-accounts', iconPath: ICONS.accounts },
    { label: 'Borrower accounts', to: '/borrower-accounts', iconPath: ICONS.accounts },
    { label: 'Add new account', to: '/accounts/new', iconPath: ICONS.users },
    { label: 'Account requests', to: '/account-requests', iconPath: ICONS.requests },
    { label: 'All products', to: '/products', iconPath: ICONS.products },
    { label: 'Product requests', to: '/product-requests', iconPath: ICONS.requests },
    { label: 'Credit requests', to: '/credit-requests', iconPath: ICONS.requests },
  ] },
  { label: 'Settings', items: [
    { label: 'Email templates', to: '/settings/email-templates', iconPath: ICONS.settings },
    { label: 'States & counties', to: '/settings/geography', iconPath: ICONS.settings },
    { label: 'Services', to: '/settings/services', iconPath: ICONS.settings },
    { label: 'Industries', to: '/settings/industries', iconPath: ICONS.settings },
    { label: 'Ratings', to: '/settings/ratings', iconPath: ICONS.settings },
  ] },
  { label: 'System', items: [
    { label: 'Audit log', to: '/audit', iconPath: ICONS.audit },
    { label: 'Platform', to: '/platform', iconPath: ICONS.platform },
  ] },
];

const NOTIFICATIONS = [
  { id: 'admin-kyb', title: 'KYB review requires action', detail: 'Berlin Living GmbH annual review is due.', to: '/compliance' },
  { id: 'admin-access', title: 'Review module access', detail: 'Confirm role and workspace access remain appropriate.', to: '/users' },
  { id: 'admin-account', title: 'New account requests', detail: 'Investor and Borrower organization requests are waiting for a decision.', to: '/account-requests' },
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
      headerVariant="investor"
      brandTitle="PiHub Admin"
      brandSubtitle="Governance workspace"
      workspaceBadge="Admin"
      contextTitle="Platform control plane"
      contextSubtitle="Identity · access · compliance · reference data"
      environmentDetail="Local browser data · no live policy changes"
      navigationSections={NAVIGATION}
      primaryAction={{ label: 'Compliance queue', to: '/compliance' }}
      footerCopy="Admin governs identity, policy, compliance, reference data, audit and the canonical workflow control plane."
      footerMeta="CONTROL"
      user={session.user}
      onLogout={onLogout}
      onHome={() => navigate('/')}
      accountSecondaryAction={{ label: 'Platform status', onSelect: () => navigate('/platform') }}
      notifications={NOTIFICATIONS}
      routeKey={location.pathname}
    >
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/users" element={<Users />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/access-policies" element={<AccessPolicies />} />
        <Route path="/investor-accounts" element={<Operations kind="investor-accounts" />} />
        <Route path="/borrower-accounts" element={<Operations kind="borrower-accounts" />} />
        <Route path="/accounts/new" element={<AccountCreate />} />
        <Route path="/account-requests" element={<Operations kind="account-requests" />} />
        <Route path="/products" element={<AdminCatalog />} />
        <Route path="/product-requests" element={<Operations kind="product-requests" />} />
        <Route path="/credit-requests" element={<Operations kind="credit-requests" />} />
        <Route path="/settings/email-templates" element={<EmailTemplates />} />
        <Route path="/settings/geography" element={<ReferenceData kind="geography" />} />
        <Route path="/settings/services" element={<ReferenceData kind="services" />} />
        <Route path="/settings/industries" element={<ReferenceData kind="industries" />} />
        <Route path="/settings/ratings" element={<ReferenceData kind="ratings" />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PlatformShell>
  );
};

export default function App() {
  const [session] = useState(() => consumeDemoAccessHandoff({ applicationId: APP_ID, account: DEMO_ACCOUNT }) || readDemoSession(APP_ID));
  if (!session) return <CentralAccessRedirect />;
  return <Workspace session={session} onLogout={() => { clearDemoSession(APP_ID); redirectToCentralAccess(APP_ID); }} />;
}
