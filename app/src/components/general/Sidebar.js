import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const items = [
  { to: '/products', icon: 'bx bx-grid-alt', label: 'sidebar.products', index: '01', matches: ['/', '/products', '/product', '/edit-product'] },
  { to: '/credit-request', icon: 'bx bx-receipt', label: 'sidebar.credit_requested_products', index: '02', matches: ['/credit-request', '/application'] },
  { to: '/products-invested', icon: 'bx bx-line-chart', label: 'sidebar.invested_products', index: '03', matches: ['/products-invested', '/creditor/detail'] },
  { to: '/user/profile', icon: 'bx bx-user', label: 'label.profile', index: '04', matches: ['/user/profile', '/user/edit-profile', '/change-password'] }
];

const routeMatches = (pathname, matches) => matches.some(path => {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.indexOf(`${path}/`) === 0;
});

const Sidebar = ({ location }) => {
  const demo = String(process.env.REACT_APP_DEMO || '').toLowerCase() === 'true';
  return (
    <aside className="sidebar ap-sidebar" aria-label="Primary navigation">
      <Link className="sidebar-brand ap-brand" to="/products" aria-label="PiHub Investor home">
        <span className="sidebar-brand-logo ap-brand-symbol" aria-hidden="true"><img src="/assets/img/logo.png" alt="" /></span>
        <span className="sidebar-brand-copy ap-brand-copy"><strong>PiHub Investor</strong><small>Investor workspace</small></span>
      </Link>

      <div className="sidebar-section-label ap-nav-meta"><span>Workspace</span><span>01—05</span></div>
      <nav className="nav-sidebar ap-nav" aria-label="Workspace">
        <ul><li><ul>
          {items.map(item => {
            const isActive = routeMatches(location.pathname, item.matches);
            return (
              <li className={isActive ? 'current-menu' : ''} key={item.to}>
                <Link className="ap-nav-item" to={item.to} aria-current={isActive ? 'page' : undefined}>
                  <i className={item.icon} aria-hidden="true" />
                  <span className="ap-nav-label"><Translate content={item.label} /></span>
                  <span className="ap-nav-index" aria-hidden="true">{item.index}</span>
                </Link>
              </li>
            );
          })}
        </ul></li></ul>
      </nav>

      <div className="ap-nav-divider" />
      <Link className="sidebar-action ap-nav-action" to="/add-product">
        <i className="bx bx-plus" aria-hidden="true" />
        <span><Translate content="button.addnewproduct" /></span>
        <span className="ap-nav-index" aria-hidden="true">05</span>
      </Link>

      <div className="sidebar-foot ap-sidebar-foot">
        <div className="ap-system-line"><i className="ap-system-dot" /><b>{demo ? 'DEMO DATA' : 'LIVE WORKSPACE'}</b><span>EUR</span></div>
      </div>
    </aside>
  );
};

export default withRouter(Sidebar);
