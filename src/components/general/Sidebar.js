import React from 'react';

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
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  All Products
                </a>
              </li>
              <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  Product Request
                </a>
              </li>
              <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  Add New Account
                </a>
              </li>
              <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  All Accounts
                </a>
              </li>
              <li>
                <a href="http://" target="_blank" rel="noopener noreferrer">
                  Account Request
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="http://">
              <i className="bx bx-news" />
              News & Updates
            </a>
          </li>
          <li>
            <a href="http://">
              <i className="bx bx-cog" />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
