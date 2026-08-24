import React from 'react';
import { Link } from 'react-router-dom';

import Translator from '../../i18n/Translate';

const PasswordChangeSuccess = () => {
  const isGerman = Translator.getLocale() === 'de';

  return (
    <main className="standalone-status-page">
      <section className="standalone-status-card" role="status">
        <span className="standalone-status-icon standalone-status-icon-success" aria-hidden="true"><i className="bx bx-check" /></span>
        <div>
          <span className="standalone-status-eyebrow">{isGerman ? 'Sicherheit' : 'Security'}</span>
          <h1>{isGerman ? 'Passwort geändert' : 'Password changed'}</h1>
          <p>{isGerman ? 'Ihr neues Passwort ist gespeichert. Verwenden Sie es bei der nächsten Anmeldung.' : 'Your new password has been saved. Use it the next time you sign in.'}</p>
          <Link className="btn btn-primary" to="/login">{isGerman ? 'Zur Anmeldung' : 'Go to login'}</Link>
        </div>
      </section>
    </main>
  );
};

export default PasswordChangeSuccess;
