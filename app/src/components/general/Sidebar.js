import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const items = [
  { to: '/products', icon: 'bx bx-grid-alt', label: 'sidebar.products' },
  { to: '/credit-request', icon: 'bx bx-receipt', label: 'sidebar.credit_requested_products' },
  { to: '/products-invested', icon: 'bx bx-line-chart', label: 'sidebar.invested_products' },
  { to: '/add-product', icon: 'bx bx-plus-circle', label: 'sidebar.new_product' }
];

const Sidebar = ({ location }) => (
  <aside className="sidebar" aria-label="Primary navigation">
    <div className="sidebar-brand">
      <div className="sidebar-mark" aria-hidden="true">P</div>
      <div className="sidebar-brand-copy">
        <strong>PiHub Investor</strong>
        <small>Private Capital</small>
      </div>
    </div>

    <div className="sidebar-kicker">Workspace</div>
    <nav className="nav-sidebar">
      <ul>
        <li>
          <ul>
            {items.map(item => {
              const isActive = location.pathname === item.to;
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

    <div className="sidebar-foot">
      <strong>Investor environment</strong>
      <span>Portfolio, credit and opportunity workflows in one controlled workspace.</span>
    </div>
  </aside>
);

export default withRouter(Sidebar);
