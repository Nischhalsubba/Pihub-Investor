import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import AuthShell from '../AuthShell';
import SignupProgress from './SignupProgress';

const Translator = Translate;

class SignUpActivated extends Component {
  componentDidMount() {
    document.title = 'Welcome';
  }

  render() {
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Registrierung abgeschlossen' : 'Account setup complete'}
        title={isGerman ? 'Konto aktiviert' : 'Account activated'}
        description={<Translate content="label.youraccounthasbeen" />}
        visualEyebrow={isGerman ? 'Schritt 3 von 3' : 'Step 3 of 3'}
        visualTitle={isGerman ? 'Ihr Investorenzugang ist bereit.' : 'Your investor workspace is ready.'}
        visualDescription={isGerman ? 'Sie können sich jetzt anmelden und mit Produkten, Anfragen und investierten Positionen arbeiten.' : 'You can now sign in and work with products, requests and invested positions.'}
        proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Freigabe' : 'Approval' }, { label: isGerman ? 'Aktiv' : 'Active' }]}
      >
        <SignupProgress stage={3} />
        <div className="auth-status-card auth-status-card-success" role="status">
          <span className="auth-status-icon" aria-hidden="true"><i className="bx bx-check" /></span>
          <div>
            <Translate content="label.wow" component="h2" />
            <p><Translate content="label.youraccounthasbeen" /></p>
            <Link className="btn btn-primary" to="/login">{isGerman ? 'Anmelden' : 'Sign in'}</Link>
          </div>
        </div>
      </AuthShell>
    );
  }
}

export default SignUpActivated;
