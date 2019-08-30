import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNotificationCount } from '../../actions/notification';
import { logout } from '../../actions/login';
class Header extends Component {
  componentDidMount() {
    this.props.getNotificationCount();
  }

  render() {
    return (
      <header className="site-header">
        <div className="logo-container">
          <img src="/assets/img/logo.png" alt="Pinhub Logo" />
        </div>
        <nav class="header-actions">
          <ul>
            <li className="header-actions__item">
              <Link className="header-notification" to="/notifications">
                <i className="bx bx-bell" />
                <span className="notification-count">{this.props.count}</span>
              </Link>
            </li>
            <li className="header-dropdown">
              <a className="header-user-dropdown">
                <img src="/assets/img/user.png" alt="John Doe" />
                <i className="bx bx-chevron-down" />
                <span
                  onClick={() =>
                    this.props.logout(() => this.props.history.push('/login'))
                  }
                >
                  logout
                </span>
              </a>
            </li>

          </ul>
        </nav>
      </header>
    );
  }
}
function mapStateToProps(state) {
  return { count: state.notificationCount };
}
export default connect(
  mapStateToProps,
  { getNotificationCount, logout }
)(withRouter(Header));
