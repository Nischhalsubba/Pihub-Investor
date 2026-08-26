import React from 'react';
import { Link, NavLink } from 'react-router-dom-v6';
import WorkspaceAccount from './WorkspaceAccount';
import PlatformRouteMotion from './PlatformRouteMotion';

const NavIcon = ({ path }) => (
  <span className="ph-nav-icon" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d={path || 'M4 5h16v14H4zM8 9h8M8 13h8'} /></svg>
  </span>
);

const renderNavigationLink = item => (
  <NavLink
    key={item.to}
    to={item.to}
    end={item.to === '/'}
    className={({ isActive }) => `ph-nav-link${isActive ? ' active' : ''}`}
  >
    <NavIcon path={item.iconPath} />
    <span>{item.label}</span>
  </NavLink>
);

export default function PlatformShell({
  applicationId,
  brandTitle,
  brandSubtitle,
  workspaceBadge,
  contextTitle,
  contextSubtitle,
  environmentDetail,
  navigationSections,
  primaryAction,
  footerCopy,
  footerMeta = 'EUR',
  user,
  onLogout,
  onHome,
  accountSecondaryAction,
  routeKey,
  children,
}) {
  const items = navigationSections.flatMap(section => section.items);

  return (
    <div className="ph-app" data-workspace={applicationId}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="ph-topbar">
        <div className="ph-topbar-leading">
          <button className="ph-brand" type="button" onClick={onHome}>
            <span className="ph-brandmark">PH</span>
            <span className="ph-brand-copy">
              <strong>{brandTitle}</strong>
              <small>{brandSubtitle}</small>
            </span>
          </button>
          <div className="ph-workspace-context">
            <span className="ph-workspace-badge">{workspaceBadge}</span>
            <span className="ph-workspace-context-copy">
              <strong>{contextTitle}</strong>
              <small>{contextSubtitle}</small>
            </span>
          </div>
        </div>
        <div className="ph-topbar-spacer" />
        <div className="ph-topbar-controls">
          <div className="ph-environment-chip" role="status" aria-label={`Demo workspace. ${environmentDetail}`}>
            <span className="ph-environment-dot" aria-hidden="true" />
            <span className="ph-environment-copy">
              <strong>Demo workspace</strong>
              <small>{environmentDetail}</small>
            </span>
          </div>
          <WorkspaceAccount
            user={user}
            onLogout={onLogout}
            onHome={onHome}
            secondaryAction={accountSecondaryAction}
          />
        </div>
      </header>

      <nav className="ph-mobile-nav" aria-label={`${workspaceBadge} navigation`}>
        {items.map(renderNavigationLink)}
      </nav>

      <div className="ph-shell">
        <aside className="ph-sidebar">
          {primaryAction ? (
            <div className="ph-sidebar-primary">
              <Link className="ph-button primary" to={primaryAction.to}>{primaryAction.label}</Link>
            </div>
          ) : null}
          {navigationSections.map(section => (
            <div className="ph-sidebar-section" key={section.label}>
              <div className="ph-nav-label">{section.label}</div>
              {section.items.map(renderNavigationLink)}
            </div>
          ))}
          <div className="ph-sidebar-foot">
            <div className="ph-sidebar-foot-copy">{footerCopy}</div>
            <div className="ph-system-line"><i /><b>DEMO DATA</b><span>{footerMeta}</span></div>
          </div>
        </aside>

        <main id="main-content" className="ph-main" tabIndex="-1">
          <PlatformRouteMotion routeKey={routeKey}>{children}</PlatformRouteMotion>
        </main>
      </div>
    </div>
  );
}
