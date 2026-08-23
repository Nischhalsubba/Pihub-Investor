import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Translate from 'react-translate-component';
import Translator from 'react-translate-component';
import { signup } from '../../actions/signup';
import { clearError } from '../../actions/clearError';
import * as validation from '../../_utils/validate';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';

const initial = { fname: '', lname: '', company_name: '', email: '', password: '', password_confirmation: '', phone_number: '', agreed_term: false };

const Signup = ({ signup: createAccount, clearError: clear, errMsg }) => {
  const history = useHistory();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';

  useEffect(() => { clear(); }, [clear]);

  const update = event => {
    const { name, type, checked, value } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors(current => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const next = {
      fname: validation.required(values.fname),
      lname: validation.required(values.lname),
      email: validation.required(values.email) || validation.newEmail(values.email),
      password: validation.required(values.password) || validation.password(values.password),
      password_confirmation: validation.required(values.password_confirmation) || (values.password !== values.password_confirmation ? 'Passwords do not match.' : undefined),
      phone_number: validation.required(values.phone_number),
      agreed_term: values.agreed_term ? undefined : 'Accept the terms and privacy policy to continue.'
    };
    const cleaned = Object.keys(next).reduce((result, key) => {
      if (next[key]) result[key] = next[key];
      return result;
    }, {});
    setErrors(cleaned);
    return cleaned;
  };

  const submit = async event => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      const node = document.getElementById(`signup-${first}`);
      if (node && node.focus) node.focus();
      return;
    }

    setSubmitting(true);
    const result = await createAccount(values, () => history.push('/signup/confirmation'));
    if (result === false) setSubmitting(false);
  };

  return (
    <AuthShell
      eyebrow={isGerman ? 'INVESTORENZUGANG ERSTELLEN' : 'CREATE INVESTOR ACCESS'}
      title={isGerman ? 'Als Investor registrieren' : 'Sign up as an investor'}
      description={isGerman ? 'Geben Sie Ihre Kontaktdaten ein.' : 'Enter your account and contact details.'}
      panelEyebrow="ONE ACCOUNT, ONE WORKSPACE"
      panelTitle="From credit request to invested position."
      panelCopy="PiHub keeps product review, requests and portfolio positions in one consistent workspace."
      metrics={[['01', 'Review'], ['02', 'Decide'], ['03', 'Track']]}
    >
      <form className="form-signup auth-form" onSubmit={submit} noValidate>
        <AuthErrorSummary message={errMsg} />
        <div className="auth-grid-two">
          <AuthField id="signup-fname" label={isGerman ? 'Vorname' : 'First name'} name="fname" value={values.fname} onChange={update} autoComplete="given-name" error={errors.fname} />
          <AuthField id="signup-lname" label={isGerman ? 'Nachname' : 'Last name'} name="lname" value={values.lname} onChange={update} autoComplete="family-name" error={errors.lname} />
        </div>
        <AuthField id="signup-company_name" label={isGerman ? 'Unternehmen' : 'Company name'} name="company_name" value={values.company_name} onChange={update} autoComplete="organization" error={errors.company_name} />
        <AuthField id="signup-email" label={isGerman ? 'E-Mail-Adresse' : 'Email address'} name="email" type="email" value={values.email} onChange={update} autoComplete="email" error={errors.email} />
        <div className="auth-grid-two">
          <AuthField id="signup-password" label={isGerman ? 'Passwort' : 'Password'} name="password" type="password" value={values.password} onChange={update} autoComplete="new-password" error={errors.password} />
          <AuthField id="signup-password_confirmation" label={isGerman ? 'Passwort bestätigen' : 'Confirm password'} name="password_confirmation" type="password" value={values.password_confirmation} onChange={update} autoComplete="new-password" error={errors.password_confirmation} />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-phone_number">{isGerman ? 'Telefonnummer' : 'Phone number'}</label>
          <ReactPhoneInput
            inputProps={{ id: 'signup-phone_number', name: 'phone_number', autoComplete: 'tel', 'aria-invalid': Boolean(errors.phone_number), 'aria-describedby': errors.phone_number ? 'signup-phone_number-error' : undefined }}
            country="de"
            value={values.phone_number}
            onChange={phone_number => {
              setValues(current => ({ ...current, phone_number }));
              setErrors(current => ({ ...current, phone_number: undefined }));
            }}
            containerClass="auth-phone"
            inputClass="form-control"
          />
          {errors.phone_number ? <span className="field-error" id="signup-phone_number-error" role="alert">{errors.phone_number}</span> : null}
        </div>
        <label className="auth-check" htmlFor="signup-agreed_term">
          <input id="signup-agreed_term" type="checkbox" name="agreed_term" checked={values.agreed_term} onChange={update} aria-describedby={errors.agreed_term ? 'signup-agreed_term-error' : undefined} />
          <span>{isGerman ? 'Ich stimme den Bedingungen und der Datenschutzerklärung zu.' : 'I agree to the terms, conditions and privacy policy.'}</span>
        </label>
        {errors.agreed_term ? <span className="field-error" id="signup-agreed_term-error" role="alert">{errors.agreed_term}</span> : null}
        <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>{submitting ? (isGerman ? 'WIRD ERSTELLT…' : 'CREATING…') : (isGerman ? 'REGISTRIEREN' : 'SIGN UP')}</button>
        <p className="auth-switch">{isGerman ? 'Sie haben bereits ein Konto?' : 'Already have an account?'} <Link to="/login">{isGerman ? 'Anmelden' : 'Login'}</Link></p>
      </form>
    </AuthShell>
  );
};

export default connect(state => ({ errMsg: state.auth && state.auth.errorMessage }), { signup, clearError })(Signup);
