import React from 'react';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <div className="sidebar">
      <nav className="nav-sidebar">
        <ul className="menu-sidebar">
          <li className="current-menu has-sub-menu">
            <a href="http://">
              <i className="bx bx-dollar-circle" />
              Product
            </a>
            <ul className="sub-menu">
              <li className="current-menu">
                <Link to="/products" rel="noopener noreferrer">
                  All Products
                </Link>
              </li>
              <li>
                <a href="/add-product" target="_self" rel="noopener noreferrer">
                  New Product
                </a>
              </li>
              <li>
                <a href="/products-invested" target="_self" rel="noopener noreferrer">
                  Invested Products
                </a>
              </li>
              <li>
                <a href="/products-applications" target="_self" rel="noopener noreferrer">
                  Credit Request
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};
