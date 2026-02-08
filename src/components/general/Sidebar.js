import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Translate from 'react-translate-component';

const Sidebar = ({ location }) => {
  const path = (location && location.pathname) || '/';
  const activeKey = (() => {
    if (path === '/' || path.startsWith('/products') || path.startsWith('/product')) {
      return 'products';
    }
    if (path.startsWith('/credit-request') || path.startsWith('/application') || path.startsWith('/creditor')) {
      return 'credit-request';
    }
    if (path.startsWith('/products-invested')) {
      return 'invested';
    }
    if (path.startsWith('/add-product') || path.startsWith('/edit-product')) {
      return 'new-product';
    }
    return '';
  })();

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="Pihub Investor" />
        <div className="sidebar-brand__text">
          <span className="sidebar-brand__title">Pihub Investor</span>
          <span className="sidebar-brand__sub">Investor Portal</span>
        </div>
      </div>
      <nav className="nav-sidebar" aria-label="Primary">
        <ul className="menu-sidebar">
          <li className="current-menu has-sub-menu">
            <Link to="/products" >
              <i className="bx bx-dollar-circle" />
              <Translate content="sidebar.product" />
            </Link>
            <ul className="sub-menu">
              <li className={activeKey === 'products' ? 'current-menu' : null}>
                <Link to="/products">
                  <Translate content="sidebar.products" />
                </Link>
              </li>
              <li className={activeKey === 'credit-request' ? 'current-menu' : null}>
                <Link to="/credit-request">
                  <Translate content="sidebar.credit_requested_products" />
                </Link>
              </li>

              <li className={activeKey === 'invested' ? 'current-menu' : null}>
                <Link
                  to="/products-invested"
                  target="_self"
                  rel="noopener noreferrer"
                >
                  <Translate content="sidebar.invested_products" />
                </Link>
              </li>
              <li className={activeKey === 'new-product' ? 'current-menu' : null}>
                <Link to="/add-product">
                  <Translate content="sidebar.new_product" />
                </Link>
              </li>

            </ul>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <span>Creditor &amp; Admin portals coming soon</span>
      </div>
    </div>
  );
};

export default withRouter(Sidebar);
