import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import counterpart from 'counterpart';
import { getNotificationCount } from '../../actions/notification';
import { changeLanguage } from '../../actions/changeLanguage';
import { logout } from '../../actions/login';
import Translate from 'react-translate-component';
import { AnimatePresence, motion } from 'framer-motion';
import en from '../../_locale/en';
import de from '../../_locale/de';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('de', de);
counterpart.setLocale(
  localStorage.getItem('language') || navigator.language.split('-')[0] || 'de'
);

const Header = ({ count, getNotificationCount, logout, changeLanguage, history }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || navigator.language.split('-')[0] || 'de'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    getNotificationCount();
  }, [getNotificationCount]);

  const onChange = useCallback(
    (lang) => {
      counterpart.setLocale(lang);
      setLanguage(lang);
      changeLanguage(lang);
    },
    [changeLanguage]
  );

  const handleDocumentClick = useCallback(
    (event) => {
      if (!menuOpen) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    },
    [menuOpen]
  );

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDocumentClick, handleKeyDown]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout(() => history.push('/login'));
  };

  return (
    <header className="site-header">
      <div className="logo-container">
        <img src={`${process.env.PUBLIC_URL}/assets/img/logo.png`} alt="Pihub Investor" />
        <span className="logo-text">Pihub Investor</span>
      </div>
      <nav className="header-actions" aria-label="Global">
        <ul className="header-actions__list">
          <li className="header-actions__item header-actions__languages">
            <ul className="language-changer" aria-label="Language">
              <li>
                <button
                  onClick={() => onChange('en')}
                  aria-pressed={language === 'en'}
                  className={language === 'en' ? 'active' : ''}
                  type="button"
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/img/gb.svg`} alt="English" />
                  English
                </button>
              </li>
              <li>
                <button
                  onClick={() => onChange('de')}
                  aria-pressed={language === 'de'}
                  className={language === 'de' ? 'active' : ''}
                  type="button"
                >
                  <img src={`${process.env.PUBLIC_URL}/assets/img/de.svg`} alt="Deutsch" />
                  Deutsch
                </button>
              </li>
            </ul>
          </li>

          <li className="header-actions__item">
            <Link
              className="header-notification"
              to="/notifications"
              aria-label={`Notifications${count ? `, ${count} unread` : ''}`}
            >
              <i className="bx bx-bell" />
              <span className="notification-count">{count}</span>
            </Link>
          </li>

          <li className="header-actions__item">
            <div className="dropdown" ref={menuRef}>
              <button
                type="button"
                className="dropdown-toggle"
                id="dropdownMenuButton"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="user-menu"
                aria-label="User menu"
                onClick={() => setMenuOpen((prevOpen) => !prevOpen)}
              >
                <img src={`${process.env.PUBLIC_URL}/assets/img/user.png`} alt="Account menu" />
              </button>
              <AnimatePresence>
                {menuOpen ? (
                  <motion.div
                    className="dropdown-menu dropdown-menu-right show"
                    id="user-menu"
                    aria-labelledby="dropdownMenuButton"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link className="dropdown-item" to="/user/profile" onClick={() => setMenuOpen(false)}>
                      <Translate content="label.profile" />
                    </Link>
                    <Link className="dropdown-item" to="/user/edit-profile" onClick={() => setMenuOpen(false)}>
                      <Translate content="label.editprofile" />
                    </Link>
                    <Link className="dropdown-item" to="/change-password" onClick={() => setMenuOpen(false)}>
                      <Translate content="label.resetpassword" />
                    </Link>
                    <button type="button" className="dropdown-item button-link" onClick={handleLogout}>
                      <Translate content="label.logout" />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

function mapStateToProps(state) {
  return { count: state.notificationCount, language: state.language };
}

export default connect(
  mapStateToProps,
  { getNotificationCount, logout, changeLanguage }
)(withRouter(Header));
