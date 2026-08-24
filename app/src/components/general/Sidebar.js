import React, { useLayoutEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { getSidebarCollapsed, setSidebarCollapsed } from '../../_utils/workspacePreferences';
import { openShortcutHelp } from '../../_utils/workspaceEvents';

gsap.registerPlugin(Flip);

const items = [
  { to: '/dashboard', icon: 'bx bx-pulse', text: 'Overview', matches: ['/', '/dashboard'] },
  { to: '/products', icon: 'bx bx-grid-alt', label: 'sidebar.products', matches: ['/products', '/product', '/edit-product', '/opportunities'] },
  { to: '/credit-request', icon: 'bx bx-receipt', label: 'sidebar.credit_requested_products', matches: ['/credit-request', '/application', '/credit-requests'] },
  { to: '/products-invested', icon: 'bx bx-line-chart', label: 'sidebar.invested_products', matches: ['/products-invested', '/creditor/detail', '/positions'] },
  { to: '/user/profile', icon: 'bx bx-user', label: 'label.profile', matches: ['/user/profile', '/user/edit-profile', '/change-password'] }
];

const routeMatches = (pathname, matches) => matches.some(path => path === '/' ? pathname === '/' : pathname === path || pathname.indexOf(`${path}/`) === 0);
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const applySidebarState = collapsed => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.pihubSidebar = collapsed ? 'collapsed' : 'expanded';
};

const Sidebar = ({ location }) => {
  const demo = String(process.env.REACT_APP_DEMO || '').toLowerCase() === 'true';
  const [collapsed, setCollapsed] = useState(() => getSidebarCollapsed());

  useLayoutEffect(() => { applySidebarState(collapsed); }, []);

  const toggleSidebar = () => {
    const next = !collapsed;
    const targets = document.querySelectorAll('.ap-global-brand, .ap-global-header-main, .ap-sidebar, .ap-workspace');
    const flipState = !reduceMotion() && window.innerWidth > 820 && targets.length ? Flip.getState(targets) : null;
    setSidebarCollapsed(next);
    setCollapsed(next);
    applySidebarState(next);
    if (flipState) {
      window.requestAnimationFrame(() => Flip.from(flipState, {
        duration: 0.32,
        ease: 'power3.out',
        absolute: false,
        nested: true,
        prune: true,
        onComplete: () => gsap.set(targets, { clearProps: 'transform' })
      }));
    }
  };

  return (
    <aside className={`sidebar ap-sidebar${collapsed ? ' is-collapsed' : ''}`} aria-label="Primary navigation">
      <div className="sidebar-section-label ap-nav-meta"><span>Workspace</span></div>
      <nav className="nav-sidebar ap-nav" aria-label="Workspace"><ul><li><ul>{items.map(item => {
        const isActive = routeMatches(location.pathname, item.matches);
        return <li className={isActive ? 'current-menu' : ''} key={item.to}><Link className="ap-nav-item" to={item.to} aria-current={isActive ? 'page' : undefined} title={collapsed && item.text ? item.text : undefined}><i className={item.icon} aria-hidden="true" /><span className="ap-nav-label">{item.text || <Translate content={item.label} />}</span></Link></li>;
      })}</ul></li></ul></nav>
      <div className="ap-nav-divider" />
      <Link className="sidebar-action ap-nav-action" to="/opportunities/new" aria-label="Add new product" title={collapsed ? 'Add new product' : undefined}><i className="bx bx-plus" aria-hidden="true" /><span><Translate content="button.addnewproduct" /></span></Link>
      <div className="ap-sidebar-utilities">
        <button className="ap-sidebar-utility" type="button" onClick={openShortcutHelp} title="Keyboard shortcuts" aria-label="Keyboard shortcuts"><i className="bx bx-command" aria-hidden="true" /><span>Shortcuts</span><kbd>?</kbd></button>
        <button className="ap-sidebar-collapse" type="button" onClick={toggleSidebar} aria-pressed={collapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}><i className={collapsed ? 'bx bx-chevrons-right' : 'bx bx-chevrons-left'} aria-hidden="true" /><span>{collapsed ? 'Expand' : 'Collapse'}</span></button>
      </div>
      <div className="sidebar-foot ap-sidebar-foot"><div className="ap-system-line"><i className="ap-system-dot" /><b>{demo ? 'DEMO DATA' : 'LIVE WORKSPACE'}</b><span>EUR</span></div></div>
    </aside>
  );
};

export default withRouter(Sidebar);
