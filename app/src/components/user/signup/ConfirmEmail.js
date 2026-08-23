import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import AuthShell from '../AuthShell';
import SignupProgress from './SignupProgress';

const Translator = Translate;

class ConfirmEmail extends Component {
  componentDidMount() {
    document.title = 'Confirm Email';
  }

  render() {
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Registrierung' : 'Account setup'}
        title={isGerman ? 'E-Mail bestätigen' : 'Confirm your email'}
        description={<Translate content="label.youraccounthas" />}
        visualEyebrow={isGerman ? 'Schritt 1 von 3' : 'Step 1 of 3'}
        visualTitle={isGerman ? 'Bestätigen Sie zuerst Ihre E-Mail-Adresse.' : 'Start by confirming your email address.'}
        visualDescription={isGerman ? 'Nach der Bestätigung wird Ihr Konto zur Freigabe weitergeleitet.' : 'After confirmation, your account moves to the approval stage.'}
        proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Freigabe' : 'Approval' }, { label: isGerman ? 'Aktivierung' : 'Activation' }]}
      >
        <SignupProgress stage={1} />
        <div className="auth-status-card" role="status">
          <span className="auth-status-icon" aria-hidden="true"><i className="bx bx-envelope" /></span>
          <div>
            <Translate content="label.weve" component="h2" />
            <p><Translate content="label.youraccounthas" /></p>
            <div className="auth-status-note">
              <Translate content="label.didnt" />{' '}
              <Translate content="label.sendit" component="a" href="#" onClick={event => event.preventDefault()} />
            </div>
          </div>
        </div>
        <div className="auth-foot"><Link to="/login">{isGerman ? 'Zur Anmeldung' : 'Back to login'}</Link></div>
      </AuthShell>
    );
  }
}

export default ConfirmEmail;
