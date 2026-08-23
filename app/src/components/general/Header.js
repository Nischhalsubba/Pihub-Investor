import React, { Component, createRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { getNotificationCount } from '../../actions/notification';
import { changeLanguage } from '../../actions/changeLanguage';
import { logout } from '../../actions/login';
import { getLocale, setLocale } from '../../_utils/locale';

const normalizeNotificationCount = value => {
  const number = candidate => {
    if (candidate === null || candidate === undefined || candidate === '') return null;
    const parsed = Number(candidate);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };
  const direct = number(value);
  if (direct !== null) return direct;
  if (!value || typeof value !== 'object') return 0;
  const candidates = [value.count, value.total, value.unread, value.unread_count, value.data];
  for (let index = 0; index < candidates.length; index += 1) {
    const parsed = number(candidates[index]);
    if (parsed !== null) return parsed;
    const nested = candidates[index];
    if (nested && typeof nested === 'object') {
      const nestedNumber = number(nested.count !== undefined ? nested.count : nested.total !== undefined ? nested.total : nested.unread_count);
      if (nestedNumber !== null) return nestedNumber;
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
  state = { language: getLocale(), accountOpen: false };
  accountRef = createRef();

  componentDidMount() {
    this.props.getNotificationCount();
    document.addEventListener('pointerdown', this.handleOutsidePointer);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('pointerdown', this.handleOutsidePointer);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleOutsidePointer = event => {
    if (this.state.accountOpen && this.accountRef.current && !this.accountRef.current.contains(event.target)) {
      this.setState({ accountOpen: false });
    }
  };

  handleKeyDown = event => {
    if (event.key === 'Escape' && this.state.accountOpen) this.setState({ accountOpen: false });
  };

  onChange = language => {
    const locale = setLocale(language);
    this.setState({ language: locale });
    this.props.changeLanguage(locale);
  };

  openCommand = () => window.dispatchEvent(new CustomEvent('pihub:command-open'));
  closeAccount = () => this.setState({ accountOpen: false });

  render() {
    const notificationCount = normalizeNotificationCount(this.props.count);
    const shortcut = getCommandShortcut();
    const { accountOpen } = this.state;

    return (
      <header className="site-header ap-topbar">
        <div className="ap-topbar-spacer" aria-hidden="true" />
        <nav className="header-actions ap-top-actions" aria-label="Workspace utilities">
          <ul>
            <li>
              <button className="ap-command-trigger" type="button" onClick={this.openCommand} aria-label={`Open command menu, ${shortcut}`}>
                <i className="bx bx-search" aria-hidden="true" /><span>Command</span><kbd>{shortcut}</kbd>
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
            <li className="ap-user-menu" ref={this.accountRef}>
              <button className="ap-user-button" type="button" aria-haspopup="menu" aria-expanded={accountOpen} aria-controls="account-menu" aria-label="Open account menu" onClick={() => this.setState(state => ({ accountOpen: !state.accountOpen }))}>
                <img src="/assets/img/user.png" alt="" />
              </button>
              <div id="account-menu" className={`dropdown-menu dropdown-menu-right ap-account-menu${accountOpen ? ' is-open show' : ''}`} role="menu">
                <Link className="dropdown-item" role="menuitem" to="/user/profile" onClick={this.closeAccount}><Translate content="label.profile" /></Link>
                <Link className="dropdown-item" role="menuitem" to="/user/edit-profile" onClick={this.closeAccount}><Translate content="label.editprofile" /></Link>
                <Link className="dropdown-item" role="menuitem" to="/change-password" onClick={this.closeAccount}><Translate content="label.resetpassword" /></Link>
                <div className="ap-menu-divider" role="separator" />
                <button className="dropdown-item" role="menuitem" type="button" onClick={() => this.props.logout(() => this.props.history.replace('/login'))}><Translate content="label.logout" /></button>
              </div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

const mapStateToProps = state => ({ count: state.notificationCount, language: state.language });
export default connect(mapStateToProps, { getNotificationCount, logout, changeLanguage })(withRouter(Header));
