import React from 'react';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <div class="sidebar">
      <nav class="nav-sidebar">
        <ul class="menu-sidebar">
          <li class="current-menu has-sub-menu">
            <a href="http://">
              <i class="bx bx-dollar-circle" />
              Product
            </a>
            <ul class="sub-menu">
              <li class="current-menu">
                <Link to="/products" rel="noopener noreferrer">
                  All Products
                </Link>
              </li>
              <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  Product Request
                </a>
              </li>
              <li>
                <Link to="/add_products" rel="noopener noreferrer">
                  Add New Product
                </Link>
              </li>
              <li>
                <a
                  href="./listing-product.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Invested Products
                </a>
              </li>
              <li>
                <a
                  href="./credit-request-single.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
