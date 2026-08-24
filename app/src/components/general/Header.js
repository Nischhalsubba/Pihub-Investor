import React, { Component, createRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Translate from '../../i18n/Translate';
import { getNotificationCount } from '../../actions/notification';
import { getProfile } from '../../actions/profile';
import { changeLanguage } from '../../actions/changeLanguage';
import { logout } from '../../actions/login';
import { getLocale, setLocale } from '../../_utils/locale';
import { isDemoMode } from '../../_utils/demoMode';
import { withCompleteDemoProfile } from '../../_utils/demoProfileData';
import { openCommandPalette, openNotificationDrawer } from '../../_utils/workspaceEvents';

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

const titleCase = value => String(value || 'Investor')
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, letter => letter.toUpperCase());

class Header extends Component {
  state = { language: getLocale(), accountOpen: false };
  accountRef = createRef();

  componentDidMount() {
    this.props.getNotificationCount();
    if (!this.props.profile) this.props.getProfile();
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

  closeAccount = () => this.setState({ accountOpen: false });

  render() {
    const notificationCount = normalizeNotificationCount(this.props.count);
    const shortcut = getCommandShortcut();
    const { accountOpen } = this.state;
    const { demoMode } = this.props;
    const profile = this.props.profile && isDemoMode() ? withCompleteDemoProfile(this.props.profile) : this.props.profile;
    const accountName = profile && (profile.company_name || [profile.fname, profile.lname].filter(Boolean).join(' '))
      ? (profile.company_name || [profile.fname, profile.lname].filter(Boolean).join(' '))
      : 'Investor workspace';
    const accountCategory = titleCase(profile && profile.category ? profile.category : 'Institutional investor');

    return (
      <header className="site-header ap-topbar ap-topbar-v3 ap-topbar-v4">
        <Link className="ap-global-brand" to="/dashboard" aria-label="PiHub Investor home">
          <span className="ap-global-brand-mark" aria-hidden="true"><img src="/assets/img/logo.png" alt="" /></span>
          <span className="ap-global-brand-copy"><strong>PiHub Investor</strong><small>Investor workspace</small></span>
        </Link>

        <div className="ap-global-header-main">
          <div className="ap-topbar-leading">
            {demoMode ? (
              <div className="ap-environment-chip" role="status" aria-label="Demo workspace. Data and actions stay in this browser and are not live financial records.">
                <span className="ap-environment-dot" aria-hidden="true" />
                <span className="ap-environment-copy"><strong>Demo workspace</strong><small>Local browser data · no live records</small></span>
              </div>
            ) : (
              <div className="ap-environment-chip is-live" role="status" aria-label="Live workspace">
                <span className="ap-environment-dot" aria-hidden="true" />
                <span className="ap-environment-copy"><strong>Live workspace</strong><small>Connected institution data</small></span>
              </div>
            )}
          </div>

          <nav className="header-actions ap-top-actions" aria-label="Workspace utilities">
            <ul className="ap-topbar-controls">
              <li className="ap-topbar-command-item">
                <button className="ap-command-trigger ap-command-trigger-v3" type="button" onClick={() => openCommandPalette()} aria-label={`Open global search and command menu, ${shortcut}`}>
                  <i className="bx bx-search" aria-hidden="true" />
                  <span className="ap-command-trigger-copy">Search or command</span>
                  <kbd>{shortcut}</kbd>
                </button>
              </li>
              <li className="ap-language-item">
                <div className="ap-language-v4" role="group" aria-label="Language selector">
                  <span className="ap-language-glyph" aria-hidden="true"><i className="bx bx-globe" /></span>
                  <button type="button" onClick={() => this.onChange('en')} aria-pressed={this.state.language === 'en'} aria-label="Use English" title="English">EN</button>
                  <button type="button" onClick={() => this.onChange('de')} aria-pressed={this.state.language === 'de'} aria-label="Deutsch verwenden" title="Deutsch">DE</button>
                </div>
              </li>
              <li className="header-actions__item">
                <button className="header-notification ap-icon-btn ap-icon-btn-v3" type="button" onClick={openNotificationDrawer} aria-label={`${notificationCount} unread notifications. Open notification center.`} title="Notifications">
                  <i className="bx bx-bell" aria-hidden="true" />
                  {notificationCount > 0 ? <span className="notification-count">{notificationCount}</span> : null}
                </button>
              </li>
              <li className="ap-user-menu" ref={this.accountRef}>
                <button className="ap-user-button ap-user-button-v3" type="button" aria-haspopup="menu" aria-expanded={accountOpen} aria-controls="account-menu" aria-label="Open account menu" onClick={() => this.setState(state => ({ accountOpen: !state.accountOpen }))}>
                  <span className="ap-user-avatar"><img src="/assets/img/user.png" alt="" /></span>
                  <span className="ap-user-copy"><strong>{accountName}</strong><small>{accountCategory}</small></span>
                  <i className="bx bx-chevron-down ap-user-chevron" aria-hidden="true" />
                </button>
                <div id="account-menu" className={`dropdown-menu dropdown-menu-right ap-account-menu${accountOpen ? ' is-open show' : ''}`} role="menu">
                  <div className="ap-account-menu-head" aria-hidden="true"><strong>{accountName}</strong><span>{accountCategory}</span></div>
                  <Link className="dropdown-item" role="menuitem" to="/user/profile" onClick={this.closeAccount}><i className="bx bx-building" aria-hidden="true" /><Translate content="label.profile" /></Link>
                  <Link className="dropdown-item" role="menuitem" to="/user/edit-profile" onClick={this.closeAccount}><i className="bx bx-edit-alt" aria-hidden="true" /><Translate content="label.editprofile" /></Link>
                  <Link className="dropdown-item" role="menuitem" to="/change-password" onClick={this.closeAccount}><i className="bx bx-lock-alt" aria-hidden="true" /><Translate content="label.resetpassword" /></Link>
                  <div className="ap-menu-divider" role="separator" />
                  <button className="dropdown-item is-danger" role="menuitem" type="button" onClick={() => this.props.logout(() => this.props.history.replace('/login'))}><i className="bx bx-log-out" aria-hidden="true" /><Translate content="label.logout" /></button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({ count: state.notificationCount, language: state.language, profile: state.profile });

export default connect(mapStateToProps, { getNotificationCount, getProfile, logout, changeLanguage })(withRouter(Header));
