import React from 'react';

export default props => {
  return (
    <header class="site-header">
      <div class="logo-container">
        <img src="/assets/img/logo.png" alt="Pinhub Logo" />
      </div>
      <nav class="header-actions">
        <ul>
          <li class="header-actions__item">
            <a class="header-notification" href="">
              <i class="bx bx-bell" />
              <span class="notification-count">2</span>
            </a>
          </li>
          <li class="header-dropdown">
            <a class="header-user-dropdown">
              <img src="assets/img/user.png" alt="John Doe" />
              <i class="bx bx-chevron-down" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
