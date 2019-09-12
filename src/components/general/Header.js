import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import counterpart from 'counterpart';
import { getNotificationCount } from '../../actions/notification';
import { changeLanguage } from '../../actions/changeLanguage';
import { logout } from '../../actions/login';
import Translate from 'react-translate-component';
import en from '../../_locale/en';
import de from '../../_locale/de';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('de', de);
counterpart.setLocale(
  'de' || localStorage.getItem('language') || navigator.language.split('-')[0]
);
class Header extends Component {
  state = { language: localStorage.getItem('language') || 'de' }
  onChange = e => {

    // let language = e.target.value;
    counterpart.setLocale(e);
    this.setState({ language: e })
    this.props.changeLanguage(e);
  }
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
            <select class="d-flex lang__select dropdown" onChange={(e) => this.onChange(e.target.value)}>
              <option class="lang__select-btn" value='en'>EN</option>
              <option value='de'>DE</option>
            </select>
            <li className="header-actions__item">

              <Link className="header-notification" to="/notifications">
                <i className="bx bx-bell" />
                <span className="notification-count">{this.props.count}</span>
              </Link>
            </li>


            <div className="dropdown">
              <a className=" dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="/assets/img/user.png" alt="John Doe" />
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <Link className="dropdown-item" to='/user/profile'>Profile</Link>
                <Link className="dropdown-item" to='/user/edit-profile'>Edit Profile</Link>
                <span className="dropdown-item" onClick={() => {
                  this.props.logout(() => this.props.history.push('/login'))
                }}>Logout</span>
              </div>
            </div>
          </ul>
        </nav>
      </header>
    );
  }
}
function mapStateToProps(state) {
  return { count: state.notificationCount, language: state.language };
}
export default connect(
  mapStateToProps,
  { getNotificationCount, logout, changeLanguage }
)(withRouter(Header));
