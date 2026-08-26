import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom-v6';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
import CommandPalette from './general/CommandPalette';
import MotionController from './general/MotionController';
import WorkspaceSkeleton from './general/WorkspaceSkeleton';
import WorkspaceActivityTracker from './general/WorkspaceActivityTracker';
import NotificationDrawer from './general/NotificationDrawer';
import ContextDrawer from './general/ContextDrawer';
import ShortcutHelp from './general/ShortcutHelp';
import ToastRegion from './general/ToastRegion';
import WorkflowJourney from '../../../packages/ui/src/WorkflowJourney';

const App = () => {
  const mainRef = useRef(null);
  const location = useLocation();
  const demoMode = typeof __PIHUB_DEMO__ !== 'undefined' && __PIHUB_DEMO__;
  const destinations = useMemo(() => ({
    investor: 'https://pihub-investor.vercel.app/dashboard',
    borrower: typeof __PIHUB_BORROWER_APP_URL__ !== 'undefined' ? __PIHUB_BORROWER_APP_URL__ : '',
    advisory: typeof __PIHUB_ADVISORY_APP_URL__ !== 'undefined' ? __PIHUB_ADVISORY_APP_URL__ : '',
    admin: typeof __PIHUB_ADMIN_APP_URL__ !== 'undefined' ? __PIHUB_ADMIN_APP_URL__ : '',
  }), []);

  useEffect(() => {
    if (!mainRef.current) return;
    try { mainRef.current.focus({ preventScroll: true }); } catch (error) { mainRef.current.focus(); }
  }, [location.pathname]);

  const overview = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <div className="workspace-shell ct-container ap-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header demoMode={demoMode} />
      <Sidebar />
      <WorkspaceActivityTracker />
      <div className="main-content main-content--padded ap-workspace">
        <main id="main-content" className="workspace-main ap-main route-motion-scope" ref={mainRef} tabIndex="-1">
          <MotionController />
          <div className="route-stage" data-route={location.pathname}>
            <Suspense fallback={<WorkspaceSkeleton />}>
              <Outlet />
            </Suspense>
            {demoMode && overview ? <WorkflowJourney applicationId="investor" destinations={destinations} /> : null}
          </div>
        </main>
      </div>
      <CommandPalette />
      <NotificationDrawer />
      <ContextDrawer />
      <ShortcutHelp />
      <ToastRegion />
    </div>
  );
};

export default App;
