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
counterpart.setLocale(localStorage.getItem('language') || navigator.language.split('-')[0] || 'de');

const normalizeNotificationCount = value => {
  const readNumber = candidate => {
    if (candidate === null || candidate === undefined || candidate === '') return null;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };
  const direct = readNumber(value);
  if (direct !== null) return direct;
  if (value && typeof value === 'object') {
    const candidates = [value.count, value.total, value.unread, value.unread_count, value.data];
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const parsed = readNumber(candidate);
      if (parsed !== null) return parsed;
      if (candidate && typeof candidate === 'object') {
        const nested = readNumber(candidate.count !== undefined ? candidate.count : candidate.total !== undefined ? candidate.total : candidate.unread_count);
        if (nested !== null) return nested;
      }
    }
  }
  return 0;
};

const getCommandShortcut = () => {
  if (typeof navigator === 'undefined') return 'Ctrl K';
  const platform = `${navigator.platform || ''} ${navigator.userAgent || ''}`;
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? '⌘K' : 'Ctrl K';
};

class Header extends Component {
  state = { language: localStorage.getItem('language') || navigator.language.split('-')[0] || 'de' };

  onChange = language => {
    counterpart.setLocale(language);
    this.setState({ language });
    this.props.changeLanguage(language);
  };

  componentDidMount() {
    this.props.getNotificationCount();
  }

  openCommand = () => window.dispatchEvent(new CustomEvent('pihub:command-open'));

  render() {
    const notificationCount = normalizeNotificationCount(this.props.count);
    const shortcut = getCommandShortcut();

    return (
      <header className="site-header ap-topbar">
        <div className="ap-topbar-spacer" aria-hidden="true" />
        <nav className="header-actions ap-top-actions" aria-label="Workspace utilities">
          <ul>
            <li>
              <button className="ap-command-trigger" type="button" onClick={this.openCommand} aria-label={`Open command menu, ${shortcut}`}>
                <i className="bx bx-search" aria-hidden="true" />
                <span>Command</span>
                <kbd>{shortcut}</kbd>
              </button>
            </li>
            <li>
              <ul className="language-changer ap-language" aria-label="Language">
                <li><button type="button" onClick={() => this.onChange('en')} aria-pressed={this.state.language === 'en'} aria-label="Use English">EN</button></li>
                <li><button type="button" onClick={() => this.onChange('de')} aria-pressed={this.state.language === 'de'} aria-label="Deutsch verwenden">DE</button></li>
              </ul>
            </li>
            <li className="header-actions__item">
              <Link className="header-notification ap-icon-btn" to="/notifications" aria-label={`${notificationCount} notifications`}>
                <i className="bx bx-bell" aria-hidden="true" />
                {notificationCount > 0 ? <span className="notification-count">{notificationCount}</span> : null}
              </Link>
            </li>
            <li className="dropdown">
              <button className="dropdown-toggle ap-user-button" id="dropdownMenuButton" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Open account menu">
                <img src="/assets/img/user.png" alt="" />
              </button>
              <div className="dropdown-menu dropdown-menu-right ap-account-menu" aria-labelledby="dropdownMenuButton">
                <Link className="dropdown-item" to="/user/profile"><Translate content="label.profile" /></Link>
                <Link className="dropdown-item" to="/user/edit-profile"><Translate content="label.editprofile" /></Link>
                <Link className="dropdown-item" to="/change-password"><Translate content="label.resetpassword" /></Link>
                <div className="ap-menu-divider" />
                <button className="dropdown-item" type="button" onClick={() => this.props.logout(() => this.props.history.push('/login'))}><Translate content="label.logout" /></button>
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

export default connect(mapStateToProps, { getNotificationCount, logout, changeLanguage })(withRouter(Header));
