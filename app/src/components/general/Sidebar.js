import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const items = [
  { to: '/products', label: 'sidebar.products' },
  { to: '/credit-request', label: 'sidebar.credit_requested_products' },
  { to: '/products-invested', label: 'sidebar.invested_products' },
  { to: '/add-product', label: 'sidebar.new_product' }
];

const Sidebar = ({ location }) => (
  <aside className="sidebar" aria-label="Primary navigation">
    <nav className="nav-sidebar">
      <ul className="menu-sidebar">
        <li className="current-menu has-sub-menu">
          <Link to="/products">
            <i className="bx bx-line-chart" aria-hidden="true" />
            <Translate content="sidebar.product" />
          </Link>
          <ul className="sub-menu">
            {items.map(item => {
              const isActive = location.pathname === item.to;
              return (
                <li className={isActive ? 'current-menu' : ''} key={item.to}>
                  <Link to={item.to} aria-current={isActive ? 'page' : undefined}>
                    <Translate content={item.label} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
);

export default withRouter(Sidebar);
