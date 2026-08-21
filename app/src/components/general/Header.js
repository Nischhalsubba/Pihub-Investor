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
  state = {
    language: localStorage.getItem('language') || navigator.language.split('-')[0] || 'de'
  };

  onChange = language => {
    counterpart.setLocale(language);
    this.setState({ language });
    this.props.changeLanguage(language);
  };

  componentDidMount() {
    this.props.getNotificationCount();
  }

  render() {
    return (
      <header className="site-header">
        <Link className="logo-container" to="/products" aria-label="Pihub Investor home">
          <img src="/assets/img/logo.png" alt="Pihub" />
        </Link>
        <nav className="header-actions" aria-label="Account actions">
          <ul>
            <li>
              <ul className="language-changer" aria-label="Language">
                <li>
                  <button type="button" onClick={() => this.onChange('en')} aria-pressed={this.state.language === 'en'}>
                    <img src="/assets/img/gb.svg" alt="" />English
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => this.onChange('de')} aria-pressed={this.state.language === 'de'}>
                    <img src="/assets/img/de.svg" alt="" />Deutsch
                  </button>
                </li>
              </ul>
            </li>
            <li className="header-actions__item">
              <Link className="header-notification" to="/notifications" aria-label={`${this.props.count || 0} notifications`}>
                <i className="bx bx-bell" aria-hidden="true" />
                {this.props.count ? <span className="notification-count">{this.props.count}</span> : null}
              </Link>
            </li>
            <li className="dropdown">
              <button className="dropdown-toggle" id="dropdownMenuButton" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Open account menu">
                <img src="/assets/img/user.png" alt="" />
              </button>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <Link className="dropdown-item" to="/user/profile"><Translate content="label.profile" /></Link>
                <Link className="dropdown-item" to="/user/edit-profile"><Translate content="label.editprofile" /></Link>
                <Link className="dropdown-item" to="/change-password"><Translate content="label.resetpassword" /></Link>
                <button className="dropdown-item" type="button" onClick={() => this.props.logout(() => this.props.history.push('/login'))}>
                  <Translate content="label.logout" />
                </button>
              </div>
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
