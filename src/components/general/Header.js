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
  localStorage.getItem('language') || navigator.language.split('-')[0] || 'de'
);
class Header extends Component {
  state = { language: localStorage.getItem('language') || navigator.language.split('-')[0] || 'de' }
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
    const { language } = this.state;
    return (
      <header className="site-header">
        <div className="logo-container">
          <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="Pihub Investor" />
          <span className="logo-text">Pihub Investor</span>
        </div>
        <nav className="header-actions">
          <ul>
            <ul className="language-changer">
              <li>
                <button
                  onClick={() => this.onChange('en')}
                  aria-pressed={language === 'en'}
                  className={language === 'en' ? 'active' : ''}
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/img/gb.svg`} alt="English Language" />
                  English
                  </button>
              </li>
              <li>
                <button
                  onClick={() => this.onChange('de')}
                  aria-pressed={language === 'de'}
                  className={language === 'de' ? 'active' : ''}
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/img/de.svg`} alt="Deutsch Language" />
                  Deutsch
                  </button>
              </li>
            </ul>

            <li className="header-actions__item">

              <Link
                className="header-notification"
                to="/notifications"
                aria-label={`Notifications${this.props.count ? `, ${this.props.count} unread` : ''}`}
              >
                <i className="bx bx-bell" />
                <span className="notification-count">{this.props.count}</span>
              </Link>
            </li>


            <div className="dropdown">
              <button type="button" className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="User menu">
                <img src={`${process.env.PUBLIC_URL}/assets/img/user.png`} alt="John Doe" />
              </button>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <Link className="dropdown-item" to='/user/profile'>
                  <Translate content='label.profile' />
                </Link>
                <Link className="dropdown-item" to='/user/edit-profile'>
                  <Translate content='label.editprofile' />

                </Link>
                <Link className="dropdown-item" to='/change-password'>
                  <Translate content='label.resetpassword' />
                </Link>
                <span className="dropdown-item" onClick={() => {
                  this.props.logout(() => this.props.history.push('/login'))
                }}>
                  <Translate content='label.logout' />

                </span>
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
