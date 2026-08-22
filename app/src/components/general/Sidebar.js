import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const items = [
  { to: '/dashboard', icon: 'bx bx-pulse', text: 'Overview', matches: ['/', '/dashboard'] },
  { to: '/products', icon: 'bx bx-grid-alt', label: 'sidebar.products', matches: ['/products', '/product', '/edit-product', '/opportunities'] },
  { to: '/credit-request', icon: 'bx bx-receipt', label: 'sidebar.credit_requested_products', matches: ['/credit-request', '/application', '/credit-requests'] },
  { to: '/products-invested', icon: 'bx bx-line-chart', label: 'sidebar.invested_products', matches: ['/products-invested', '/creditor/detail', '/positions'] },
  { to: '/user/profile', icon: 'bx bx-user', label: 'label.profile', matches: ['/user/profile', '/user/edit-profile', '/change-password'] }
];

const routeMatches = (pathname, matches) => matches.some(path => path === '/' ? pathname === '/' : pathname === path || pathname.indexOf(`${path}/`) === 0);

const Sidebar = ({ location }) => {
  const demo = String(process.env.REACT_APP_DEMO || '').toLowerCase() === 'true';
  return <aside className="sidebar ap-sidebar" aria-label="Primary navigation"><Link className="sidebar-brand ap-brand" to="/dashboard" aria-label="PiHub Investor home"><span className="sidebar-brand-logo ap-brand-symbol" aria-hidden="true"><img src="/assets/img/logo.png" alt="" /></span><span className="sidebar-brand-copy ap-brand-copy"><strong>PiHub Investor</strong><small>Investor workspace</small></span></Link><div className="sidebar-section-label ap-nav-meta"><span>Workspace</span></div><nav className="nav-sidebar ap-nav" aria-label="Workspace"><ul><li><ul>{items.map(item => { const isActive = routeMatches(location.pathname, item.matches); return <li className={isActive ? 'current-menu' : ''} key={item.to}><Link className="ap-nav-item" to={item.to} aria-current={isActive ? 'page' : undefined}><i className={item.icon} aria-hidden="true" /><span className="ap-nav-label">{item.text || <Translate content={item.label} />}</span></Link></li>; })}</ul></li></ul></nav><div className="ap-nav-divider" /><Link className="sidebar-action ap-nav-action" to="/opportunities/new"><i className="bx bx-plus" aria-hidden="true" /><span><Translate content="button.addnewproduct" /></span></Link><div className="sidebar-foot ap-sidebar-foot"><div className="ap-system-line"><i className="ap-system-dot" /><b>{demo ? 'DEMO DATA' : 'LIVE WORKSPACE'}</b><span>EUR</span></div></div></aside>;
};

export default withRouter(Sidebar);
