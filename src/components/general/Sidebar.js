import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

export default () => {
  const [active, setActive] = useState(0);

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
              <li className={active === 1 ? 'current-menu' : null}>
                <Link to="/products" onClick={() => setActive(1)}>
                  <Translate content="sidebar.products" />
                </Link>
              </li>
              <li className={active === 2 ? 'current-menu' : null}>
                <Link to="/credit-request" onClick={() => setActive(2)}>
                  <Translate content="sidebar.credit_requested_products" />
                </Link>
              </li>

              <li className={active === 3 ? 'current-menu' : null}>
                <Link
                  to="/products-invested"
                  target="_self"
                  rel="noopener noreferrer"
                  onClick={() => setActive(3)}
                >
                  <Translate content="sidebar.invested_products" />
                </Link>
              </li>
              <li className={active === 4 ? 'current-menu' : null}>
                <Link to="/add-product"
                  onClick={() => setActive(4)}
                >
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
