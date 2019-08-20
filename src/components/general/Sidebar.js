import React from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

export default props => {
  return (
    <div className="sidebar">
      <nav className="nav-sidebar">
        <ul className="menu-sidebar">
          <li className="current-menu has-sub-menu">
            <Link to="/products" rel="noopener noreferrer">
              <i className="bx bx-dollar-circle" />
              <Translate content="sidebar.product" />
            </Link>
            <ul className="sub-menu">
              <li className="current-menu">
                <Link to="/products" rel="noopener noreferrer">
                  <Translate content="sidebar.products" />
                </Link>
              </li>
              <li>
                <a href="/add-product" target="_self" rel="noopener noreferrer">
                  <Translate content="sidebar.new_product" />
                </a>
              </li>
              <li>
                <a
                  href="/products-invested"
                  target="_self"
                  rel="noopener noreferrer"
                >
                  <Translate content="sidebar.invested_products" />
                </a>
              </li>
              <li>
                <Link to="/credit-request" rel="noopener noreferrer">
                  <Translate content="sidebar.credit_requested_products" />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};
