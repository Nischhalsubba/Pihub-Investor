import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

export default props => {
  const [active, setActive] = useState(0);

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
              <li className={active === 1 ? 'current-menu' : null}>
                <Link to="/products" rel="noopener noreferrer" onClick={() => setActive(1)}>
                  <Translate content="sidebar.products" />
                </Link>
              </li>
              <li className={active === 2 ? 'current-menu' : null}>
                <Link to="/credit-request" rel="noopener noreferrer" onClick={() => setActive(2)}>
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
                <Link to="/add-product" target="_self" rel="noopener noreferrer"
                  onClick={() => setActive(4)}
                >
                  <Translate content="sidebar.new_product" />
                </Link>
              </li>

            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};
