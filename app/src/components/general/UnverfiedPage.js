import React from 'react';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Subheader from './Subheader';

import Translator from '../../i18n/Translate';

const UnverifiedPage = () => {
  const isGerman = Translator.getLocale() === 'de';

  return (
    <div>
      <Subheader heading={isGerman ? 'Kontoverifizierung' : 'Account verification'} />
      <section className="verification-state" data-motion="table-shell">
        <span className="verification-state-icon" aria-hidden="true"><i className="bx bx-shield-quarter" /></span>
        <div className="verification-state-copy">
          <span>{isGerman ? 'Verifizierung erforderlich' : 'Verification required'}</span>
          <h2><Translate content="unverified.msg" /></h2>
          <p>{isGerman ? 'Prüfen Sie Ihre Profildaten und hinterlegten Unterlagen. Einige Investor-Funktionen bleiben bis zur Freigabe eingeschränkt.' : 'Review your profile details and saved documents. Some investor functions remain restricted until the account is approved.'}</p>
          <Link className="btn btn-primary" to="/user/profile"><Translate content="label.profile" /></Link>
        </div>
      </section>
    </div>
  );
};

export default UnverifiedPage;
