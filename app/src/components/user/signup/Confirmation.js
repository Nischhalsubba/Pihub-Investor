import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../AuthShell';
import SignupProgress from './SignupProgress';

const Translator = require('react-translate-component');

class Confirmation extends Component {
  componentDidMount() {
    document.title = 'Confirmation';
  }

  render() {
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Registrierung' : 'Account setup'}
        title={isGerman ? 'Registrierungsstatus' : 'Signup status'}
        description={isGerman ? 'Prüfen Sie Ihre E-Mail und folgen Sie dem Bestätigungslink, um mit der Freigabe fortzufahren.' : 'Check your email and follow the confirmation link to continue to account approval.'}
        visualEyebrow={isGerman ? 'Status' : 'Status'}
        visualTitle={isGerman ? 'Der nächste Schritt beginnt in Ihrem Posteingang.' : 'The next step begins in your inbox.'}
        visualDescription={isGerman ? 'Nach der E-Mail-Bestätigung führt PiHub Sie automatisch durch die verbleibenden Freigabeschritte.' : 'After email confirmation, PiHub guides you through the remaining approval steps.'}
        proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Freigabe' : 'Approval' }, { label: isGerman ? 'Aktivierung' : 'Activation' }]}
      >
        <SignupProgress stage={1} />
        <div className="auth-status-card" role="status">
          <span className="auth-status-icon" aria-hidden="true"><i className="bx bx-envelope" /></span>
          <div>
            <h2>{isGerman ? 'Bestätigungslink öffnen' : 'Open your confirmation link'}</h2>
            <p>{isGerman ? 'Wenn Sie die E-Mail bereits bestätigt haben, können Sie die Anmeldung erneut versuchen.' : 'If you have already confirmed the email, you can try signing in again.'}</p>
            <Link className="btn btn-secondary" to="/login">{isGerman ? 'Zur Anmeldung' : 'Back to login'}</Link>
          </div>
        </div>
      </AuthShell>
    );
  }
}

export default Confirmation;
