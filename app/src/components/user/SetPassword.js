import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Translator from 'react-translate-component';
import { changePasswordWithToken } from '../../actions/password';
import * as validation from '../../_utils/validate';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';

const SetPassword = ({ changePasswordWithToken: savePassword, errMsg }) => {
  const history = useHistory();
  const { token } = useParams();
  const [values, setValues] = useState({ password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';

  const update = event => setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = event => {
    event.preventDefault();
    const next = {
      password: validation.required(values.password) || validation.password(values.password),
      password_confirmation: validation.required(values.password_confirmation) || (values.password !== values.password_confirmation ? 'Passwords do not match.' : undefined)
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
    setErrors(clean);
    if (Object.keys(clean).length) return;
    setSubmitting(true);
    Promise.resolve(savePassword({ ...values, token }, () => history.replace('/password-change-success'))).finally(() => setSubmitting(false));
  };

  return (
    <AuthShell eyebrow={isGerman ? 'Kontowiederherstellung' : 'Account recovery'} title={isGerman ? 'Neues Passwort festlegen' : 'Set a new password'} description={isGerman ? 'Wählen Sie ein neues Passwort und bestätigen Sie es, um den Kontozugang wiederherzustellen.' : 'Choose a new password and confirm it to restore account access.'} visualEyebrow={isGerman ? 'Sicherer Zugang' : 'Secure access'} visualTitle={isGerman ? 'Ein kontrollierter Schritt zurück in Ihren Arbeitsbereich.' : 'One controlled step back into your workspace.'} visualDescription={isGerman ? 'Die Änderung betrifft Ihre Zugangsdaten, nicht Ihre Produkte, Anfragen oder investierten Positionen.' : 'The change affects your credentials, not your products, requests or invested positions.'} proofItems={[{ label: isGerman ? 'Passwort' : 'Password' }, { label: isGerman ? 'Bestätigen' : 'Confirm' }, { label: isGerman ? 'Anmelden' : 'Sign in' }]}>
      <form className="form-signin" onSubmit={onSubmit} noValidate>
        <AuthField id="reset-password" name="password" type="password" label={isGerman ? 'Neues Passwort' : 'New password'} value={values.password} onChange={update} error={errors.password} autoComplete="new-password" />
        <AuthField id="reset-password-confirm" name="password_confirmation" type="password" label={isGerman ? 'Passwort bestätigen' : 'Confirm password'} value={values.password_confirmation} onChange={update} error={errors.password_confirmation} autoComplete="new-password" />
        <AuthErrorSummary value={errMsg} />
        <button className="btn btn-primary btn-form" type="submit" disabled={submitting}>{isGerman ? 'Passwort speichern' : 'Save password'}</button>
      </form>
    </AuthShell>
  );
};

export default connect(state => ({ errMsg: state.errors || state.error }), { changePasswordWithToken })(SetPassword);
