import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Translator from '../../../i18n/Translate';
import { getTokenForEmail, changePasswordWithToken } from '../../../actions/password';
import * as validation from '../../../_utils/validate';
import { AuthErrorSummary, AuthField } from '../AuthFields';
import Subheader from '../../general/Subheader';

const ChangePassword = ({ getTokenForEmail: verifyEmail, changePasswordWithToken: savePassword, errMsg }) => {
  const history = useHistory();
  const [step, setStep] = useState('verify');
  const [token, setToken] = useState(null);
  const [values, setValues] = useState({ email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';
  const verifyStep = step === 'verify';

  const update = event => setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = event => {
    event.preventDefault();
    if (verifyStep) {
      const emailError = validation.required(values.email) || validation.newEmail(values.email);
      setErrors(emailError ? { email: emailError } : {});
      if (emailError) return;
      setSubmitting(true);
      Promise.resolve(verifyEmail({ email: values.email }, nextToken => { setToken(nextToken); setStep('reset'); })).finally(() => setSubmitting(false));
      return;
    }

    const next = {
      password: validation.required(values.password) || validation.password(values.password),
      password_confirmation: validation.required(values.password_confirmation) || (values.password !== values.password_confirmation ? 'Passwords do not match.' : undefined)
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
    setErrors(clean);
    if (Object.keys(clean).length) return;
    setSubmitting(true);
    Promise.resolve(savePassword({ password: values.password, password_confirmation: values.password_confirmation, token }, () => history.replace('/password-change-success'))).finally(() => setSubmitting(false));
  };

  return (
    <div>
      <Subheader heading={isGerman ? 'Passwort ändern' : 'Change password'} />
      <section className="account-form-panel" data-motion="table">
        <div className="account-form-head">
          <div><h2>{verifyStep ? (isGerman ? 'Konto verifizieren' : 'Verify account') : (isGerman ? 'Neues Passwort' : 'New password')}</h2><p>{verifyStep ? (isGerman ? 'Bestätigen Sie zuerst die E-Mail-Adresse Ihres Kontos.' : 'Confirm the email address associated with your account first.') : (isGerman ? 'Legen Sie anschließend das neue Passwort fest.' : 'Then choose and confirm your new password.')}</p></div>
        </div>
        <form className="account-form-body" onSubmit={onSubmit} noValidate>
          {verifyStep ? (
            <AuthField id="change-password-email" name="email" type="email" label="Email" value={values.email} onChange={update} error={errors.email} autoComplete="email" />
          ) : (
            <React.Fragment>
              <AuthField id="change-password-new" name="password" type="password" label={isGerman ? 'Neues Passwort' : 'New password'} value={values.password} onChange={update} error={errors.password} autoComplete="new-password" />
              <AuthField id="change-password-confirm" name="password_confirmation" type="password" label={isGerman ? 'Passwort bestätigen' : 'Confirm password'} value={values.password_confirmation} onChange={update} error={errors.password_confirmation} autoComplete="new-password" />
            </React.Fragment>
          )}
          <AuthErrorSummary value={errMsg} />
          <button className="btn btn-primary" type="submit" disabled={submitting}>{verifyStep ? (isGerman ? 'Weiter' : 'Continue') : (isGerman ? 'Passwort speichern' : 'Save password')}</button>
        </form>
      </section>
    </div>
  );
};

export default connect(state => ({ errMsg: state.errors || state.error }), { getTokenForEmail, changePasswordWithToken })(ChangePassword);
