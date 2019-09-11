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
            <li class="d-flex lang__select dropdown">
              <span onClick={() => this.onChange('en')}>EN</span>
              <ul class="dropdown-container">
                <li>
                  <span className='lang__select-btn' onClick={() => this.onChange('de')}>DE</span>
                </li>
              </ul>
              <i class="bx bx-chevron-down"></i>
            </li>
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
                {/* <span
                  onClick={() =>
                    this.props.logout(() => this.props.history.push('/login'))
                  }
                >
                  logout
                </span> */}
                <Translate content='label.logout' component="span" onClick={() =>
                  this.props.logout(() => this.props.history.push('/login'))
                } />
              </a>
            </li>

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
