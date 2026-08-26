import React from 'react';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Subheader from './Subheader';
import Translator from '../../i18n/Translate';

const UnverifiedPage = () => {
  const isGerman = Translator.getLocale() === 'de';
  const refresh = () => window.location.reload();

  return (
    <div>
      <Subheader heading={isGerman ? 'Kontoverifizierung' : 'Account verification'} />
      <section className="verification-state" data-motion="table-shell" aria-labelledby="verification-title">
        <span className="verification-state-icon" aria-hidden="true"><i className="bx bx-shield-quarter" /></span>
        <div className="verification-state-copy">
          <span>{isGerman ? 'Admin-Freigabe ausstehend' : 'Admin approval pending'}</span>
          <h2 id="verification-title"><Translate content="unverified.msg" /></h2>
          <p>{isGerman ? 'Ihr Investor-Konto wurde erstellt, ist aber noch nicht für geschützte Investor-Funktionen freigegeben. Prüfen Sie Ihre Profildaten und warten Sie auf die Freigabe durch den PiHub-Administrator.' : 'Your Investor account has been created but is not yet approved for protected Investor functions. Review your profile details and wait for PiHub Admin approval.'}</p>
          <div className="verification-state-actions">
            <button className="btn btn-primary" type="button" onClick={refresh}>{isGerman ? 'Status aktualisieren' : 'Refresh status'}</button>
            <Link className="btn btn-secondary" to="/user/profile"><Translate content="label.profile" /></Link>
            <Link className="btn btn-tertiary" to="/logout">{isGerman ? 'Abmelden' : 'Sign out'}</Link>
          </div>
          <p className="verification-state-note">{isGerman ? 'Die Freigabe selbst bleibt eine administrative Aktion. Eine Aktualisierung ändert den Status nicht künstlich.' : 'Approval itself remains an administrative action. Refreshing never fabricates a verified state.'}</p>
        </div>
      </section>
    </div>
  );
};

export default UnverifiedPage;
