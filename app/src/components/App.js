import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom-v6';
import Sidebar from './general/Sidebar';
import Header from './general/Header';
import CommandPalette from './general/CommandPalette';
import MotionController from './general/MotionController';

const App = () => {
  const mainRef = useRef(null);
  const location = useLocation();
  const demoMode = typeof __PIHUB_DEMO__ !== 'undefined' && __PIHUB_DEMO__;

  useEffect(() => {
    if (!mainRef.current) return;
    try { mainRef.current.focus({ preventScroll: true }); } catch (error) { mainRef.current.focus(); }
  }, [location.pathname]);

  return (
    <div className="workspace-shell ct-container ap-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Sidebar />
      <div className="main-content main-content--padded ap-workspace">
        {demoMode ? (
          <div className="runtime-environment-banner" role="status">
            <span aria-hidden="true" />
            <strong>Demo environment</strong>
            <span>Data and actions are local to this browser and are not live financial records.</span>
          </div>
        ) : null}
        <Header />
        <main id="main-content" className="workspace-main ap-main route-motion-scope" ref={mainRef} tabIndex="-1">
          <MotionController />
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  );
};

export default App;
