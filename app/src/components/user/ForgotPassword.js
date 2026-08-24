import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Translator from '../../i18n/Translate';
import { getTokenForEmail } from '../../actions/password';
import * as validation from '../../_utils/validate';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';

const ForgotPassword = ({ getTokenForEmail: requestReset, errMsg }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';

  const onSubmit = event => {
    event.preventDefault();
    const next = validation.required(email) || validation.newEmail(email);
    setError(next || '');
    if (next) return;
    setSubmitting(true);
    Promise.resolve(requestReset({ email }, () => setSubmitted(true))).finally(() => setSubmitting(false));
  };

  return (
    <AuthShell eyebrow={isGerman ? 'Kontowiederherstellung' : 'Account recovery'} title={<Translate content="label.forgotPassword" />} description={isGerman ? 'Geben Sie die E-Mail-Adresse Ihres Kontos ein. Wir senden Ihnen einen Link zum Zurücksetzen des Passworts.' : 'Enter the email address associated with your account. We will send you a password-reset link.'} visualEyebrow={isGerman ? 'Sicherer Wiederzugang' : 'Secure recovery'} visualTitle={isGerman ? 'Zugriff wiederherstellen, ohne den Arbeitsfluss zu verlieren.' : 'Restore access without losing your workflow.'} visualDescription={isGerman ? 'Der Wiederherstellungsprozess ändert nur Ihre Zugangsdaten. Ihre Investorendaten und Arbeitsbereiche bleiben erhalten.' : 'Recovery changes only your access credentials. Your investor data and workspaces remain unchanged.'} proofItems={[{ label: isGerman ? 'E-Mail' : 'Email' }, { label: isGerman ? 'Link' : 'Reset link' }, { label: isGerman ? 'Zugang' : 'Access' }]}>
      {submitted ? (
        <div className="auth-success" role="status" aria-live="polite">
          <span className="auth-success-icon" aria-hidden="true"><i className="bx bx-envelope" /></span>
          <h2>{isGerman ? 'E-Mail gesendet' : 'Email sent'}</h2>
          <p>{isGerman ? 'Anweisungen zum Zurücksetzen des Passworts wurden an ' : 'Password-reset instructions were sent to '}<strong>{email}</strong>.</p>
          <Link className="btn btn-secondary" to="/login">{isGerman ? 'Zurück zur Anmeldung' : 'Back to login'}</Link>
        </div>
      ) : (
        <form className="form-signin" onSubmit={onSubmit} noValidate>
          <AuthField id="recovery-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={email} onChange={event => { setEmail(event.target.value); setError(''); }} error={error} autoComplete="email" />
          <AuthErrorSummary value={errMsg} />
          <button className="btn btn-primary btn-form" type="submit" disabled={submitting}>{isGerman ? 'Reset-Link senden' : 'Send reset link'}</button>
          <div className="auth-foot"><Link to="/login">{isGerman ? 'Zurück zur Anmeldung' : 'Back to login'}</Link></div>
        </form>
      )}
    </AuthShell>
  );
};

export default connect(state => ({ errMsg: state.errors || state.error }), { getTokenForEmail })(ForgotPassword);
