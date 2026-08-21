import React, { Component } from 'react';
import { connect } from 'react-redux';
import { confirmEmail } from '../../../actions/confirmEmail';
import { withRouter, Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import AuthShell from '../AuthShell';
import SignupProgress from './SignupProgress';

const Translator = require('react-translate-component');

class Approval extends Component {
  state = { invalid: false };

  componentDidMount() {
    document.title = 'Approval';
    const { hash } = this.props.match.params;
    this.props.confirmEmail(
      hash,
      () => this.props.history.push('/signup/activated'),
      () => this.setState({ invalid: true })
    );
  }

  render() {
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Registrierung' : 'Account setup'}
        title={this.state.invalid ? (isGerman ? 'Bestätigung fehlgeschlagen' : 'Confirmation failed') : (isGerman ? 'E-Mail bestätigt' : 'Email confirmed')}
        description={this.state.invalid ? <Translate content="label.theconfirm" /> : <Translate content="label.ouradminneed" />}
        visualEyebrow={isGerman ? 'Schritt 2 von 3' : 'Step 2 of 3'}
        visualTitle={isGerman ? 'Nach der E-Mail-Bestätigung folgt die Kontofreigabe.' : 'After email confirmation, account approval is next.'}
        visualDescription={isGerman ? 'Der Status wird aktualisiert, sobald die Freigabe abgeschlossen ist.' : 'The account status updates when approval is complete.'}
        proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Freigabe' : 'Approval' }, { label: isGerman ? 'Aktivierung' : 'Activation' }]}
      >
        <SignupProgress stage={2} />
        {this.state.invalid ? (
          <div className="auth-status-card auth-status-card-error" role="alert">
            <span className="auth-status-icon" aria-hidden="true"><i className="bx bx-x" /></span>
            <div>
              <Translate content="label.wecant" component="h2" />
              <p><Translate content="label.theconfirm" /></p>
              <p><Translate content="label.youcanask" /></p>
              <Link className="btn btn-secondary" to="/signup">{isGerman ? 'Registrierung öffnen' : 'Open signup'}</Link>
            </div>
          </div>
        ) : (
          <div className="auth-status-card" role="status" aria-live="polite">
            <span className="auth-status-icon auth-status-icon-spinner" aria-hidden="true"><i className="bx bx-loader-alt" /></span>
            <div>
              <Translate content="label.justonemore" component="h2" />
              <p><Translate content="label.ouradminneed" /></p>
            </div>
          </div>
        )}
      </AuthShell>
    );
  }
}

export default connect(null, { confirmEmail })(withRouter(Approval));
