import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { inputField } from '../../_formFields';
import { getTokenForEmail } from '../../actions/password';
import * as validation from '../../_utils/validate';
import Translate from 'react-translate-component';
import AuthShell from './AuthShell';

const Translator = require('react-translate-component');

class ForgotPassword extends Component {
  state = { submitted: false, email: null };

  onSubmit = formProps => {
    this.props.getTokenForEmail(formProps, () => this.setState({ submitted: true, email: formProps.email }));
  };

  renderError = error => {
    if (!error) return null;
    const message = Array.isArray(error) ? error.join(' ') : (error.errors || error.error || String(error));
    return <div className="auth-error" role="alert">{message}</div>;
  };

  render() {
    const { handleSubmit } = this.props;
    const isGerman = Translator.getLocale() === 'de';

    return (
      <AuthShell
        eyebrow={isGerman ? 'Kontowiederherstellung' : 'Account recovery'}
        title={<Translate content="label.forgotPassword" />}
        description={isGerman ? 'Geben Sie die E-Mail-Adresse Ihres Kontos ein. Wir senden Ihnen einen Link zum Zurücksetzen des Passworts.' : 'Enter the email address associated with your account. We will send you a password-reset link.'}
        visualEyebrow={isGerman ? 'Sicherer Wiederzugang' : 'Secure recovery'}
        visualTitle={isGerman ? 'Zugriff wiederherstellen, ohne den Arbeitsfluss zu verlieren.' : 'Restore access without losing your workflow.'}
        visualDescription={isGerman ? 'Der Wiederherstellungsprozess ändert nur Ihre Zugangsdaten. Ihre Investorendaten und Arbeitsbereiche bleiben erhalten.' : 'Recovery changes only your access credentials. Your investor data and workspaces remain unchanged.'}
        proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Link' : 'Reset link' }, { label: isGerman ? 'Zugang' : 'Access' }]}
      >
        {this.state.submitted ? (
          <div className="auth-success" role="status" aria-live="polite">
            <span className="auth-success-icon" aria-hidden="true"><i className="bx bx-envelope" /></span>
            <h2>{isGerman ? 'E-Mail gesendet' : 'Email sent'}</h2>
            <p>
              {isGerman ? 'Anweisungen zum Zurücksetzen des Passworts wurden an ' : 'Password-reset instructions were sent to '}
              <strong>{this.state.email}</strong>.
            </p>
            <Link className="btn btn-secondary" to="/login">{isGerman ? 'Zurück zur Anmeldung' : 'Back to login'}</Link>
          </div>
        ) : (
          <form className="form-signin" onSubmit={handleSubmit(this.onSubmit)} noValidate>
            <div className="form-group">
              <Field
                type="email"
                name="email"
                component={inputField}
                className="form-control"
                label={<Translate content="label.emailaddress" />}
                validate={[validation.required, validation.newEmail]}
                autoComplete="email"
              />
            </div>
            {this.renderError(this.props.errMsg)}
            <button className="btn btn-primary btn-form" type="submit">{isGerman ? 'Reset-Link senden' : 'Send reset link'}</button>
            <div className="auth-foot"><Link to="/login">{isGerman ? 'Zurück zur Anmeldung' : 'Back to login'}</Link></div>
          </form>
        )}
      </AuthShell>
    );
  }
}

function mapStateToProps(state) {
  return { errMsg: state.errors || state.error };
}

export default compose(
  connect(mapStateToProps, { getTokenForEmail }),
  reduxForm({ form: 'forgotPassword' })
)(ForgotPassword);
