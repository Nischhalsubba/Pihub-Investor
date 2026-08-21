import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const items = [
  {
    to: '/products',
    icon: 'bx bx-grid-alt',
    label: 'sidebar.products',
    matches: ['/products', '/product', '/edit-product']
  },
  {
    to: '/credit-request',
    icon: 'bx bx-receipt',
    label: 'sidebar.credit_requested_products',
    matches: ['/credit-request', '/application']
  },
  {
    to: '/products-invested',
    icon: 'bx bx-line-chart',
    label: 'sidebar.invested_products',
    matches: ['/products-invested', '/creditor/detail']
  }
];

const routeMatches = (pathname, matches) => matches.some(path => pathname === path || pathname.indexOf(`${path}/`) === 0);

const Sidebar = ({ location }) => (
  <aside className="sidebar" aria-label="Primary navigation">
    <Link className="sidebar-brand" to="/products" aria-label="PiHub Investor home">
      <span className="sidebar-brand-logo" aria-hidden="true">
        <img src="/assets/img/logo.png" alt="" />
      </span>
      <span className="sidebar-brand-copy">
        <strong>PiHub Investor</strong>
        <small>Investor workspace</small>
      </span>
    </Link>

    <div className="sidebar-section-label">Workspace</div>
    <nav className="nav-sidebar">
      <ul>
        <li>
          <ul>
            {items.map(item => {
              const isActive = routeMatches(location.pathname, item.matches);
              return (
                <li className={isActive ? 'current-menu' : ''} key={item.to}>
                  <Link to={item.to} aria-current={isActive ? 'page' : undefined}>
                    <i className={item.icon} aria-hidden="true" />
                    <Translate content={item.label} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>

    <Link className="sidebar-action" to="/add-product">
      <i className="bx bx-plus" aria-hidden="true" />
      <Translate content="button.addnewproduct" />
    </Link>

    <div className="sidebar-foot">
      <strong>PiHub Investor</strong>
      <span>Credit opportunities and investment operations.</span>
    </div>
  </aside>
);

export default withRouter(Sidebar);
