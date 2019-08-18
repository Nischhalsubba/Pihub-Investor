import React from 'react';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <header className="site-header">
      <div className="logo-container">
        <img src="/assets/img/logo.png" alt="Pinhub Logo" />
      </div>
      <nav className="header-actions">
        <ul>
          <li className="header-actions__item">
            <Link className="header-notification" to="/notifications">
              <i className="bx bx-bell" />
              <span className="notification-count">2</span>
            </Link>
          </li>
          <li className="header-dropdown">
            <a className="header-user-dropdown">
              <img src="/assets/img/user.png" alt="John Doe" />
              <i className="bx bx-chevron-down" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
