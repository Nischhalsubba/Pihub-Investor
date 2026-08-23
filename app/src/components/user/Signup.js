import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
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
    return Object.fromEntries(Object.entries(next).filter(([, value]) => value));
  };

  const onSubmit = event => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    Promise.resolve(createAccount(values, () => history.replace('/signup/confirm-email'))).finally(() => setSubmitting(false));
  };

  return (
    <AuthShell wide eyebrow={isGerman ? 'Investorenzugang erstellen' : 'Create investor access'} title={<Translate content="label.signupto" />} description={<Translate content="label.enteryourdetails" />} visualEyebrow={isGerman ? 'Ein Zugang, ein Arbeitsbereich' : 'One account, one workspace'} visualTitle={isGerman ? 'Von der Kreditanfrage bis zur investierten Position.' : 'From credit request to invested position.'} visualDescription={isGerman ? 'PiHub bündelt produktbezogene Prüfungen, Anfragen und Portfoliopositionen in einem konsistenten Arbeitsbereich.' : 'PiHub keeps product review, requests and portfolio positions in one consistent workspace.'} proofItems={[{ label: isGerman ? 'Prüfen' : 'Review' }, { label: isGerman ? 'Entscheiden' : 'Decide' }, { label: isGerman ? 'Verfolgen' : 'Track' }]}>
      <form className="form-signin auth-signup-form" onSubmit={onSubmit} noValidate>
        <div className="auth-form-grid">
          <AuthField id="signup-first-name" name="fname" type="text" label={<Translate content="label.firstname" />} value={values.fname} onChange={update} error={errors.fname} autoComplete="given-name" />
          <AuthField id="signup-last-name" name="lname" type="text" label={<Translate content="label.lastname" />} value={values.lname} onChange={update} error={errors.lname} autoComplete="family-name" />
        </div>
        <AuthField id="signup-company" name="company_name" type="text" label={<Translate content="label.companyname" />} value={values.company_name} onChange={update} autoComplete="organization" />
        <AuthField id="signup-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={values.email} onChange={update} error={errors.email} autoComplete="email" />
        <div className="auth-form-grid">
          <AuthField id="signup-password" name="password" type="password" label={<Translate content="label.password" />} value={values.password} onChange={update} error={errors.password} autoComplete="new-password" />
          <AuthField id="signup-password-confirm" name="password_confirmation" type="password" label={<Translate content="label.confirmpassword" />} value={values.password_confirmation} onChange={update} error={errors.password_confirmation} autoComplete="new-password" />
        </div>
        <div className="auth-field auth-phone-field">
          <label htmlFor="signup-phone"><Translate content="label.phonenumber" /></label>
          <ReactPhoneInput country="de" regions="europe" value={values.phone_number} onChange={phone => { setValues(current => ({ ...current, phone_number: phone })); setErrors(current => ({ ...current, phone_number: undefined })); }} inputProps={{ id: 'signup-phone', name: 'phone_number', required: true, autoComplete: 'tel', 'aria-invalid': Boolean(errors.phone_number) || undefined }} />
          {errors.phone_number ? <span className="auth-field-error" role="alert">{errors.phone_number}</span> : null}
        </div>
        <div className="auth-terms">
          <div className="form-check">
            <input id="signup-terms" name="agreed_term" type="checkbox" checked={values.agreed_term} onChange={update} aria-invalid={Boolean(errors.agreed_term) || undefined} />
            <label className="form-check-label" htmlFor="signup-terms"><Translate content="column.iagree" />{' '}<Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer"><Translate content="column.terms" /></Link>{' '}<Translate content="placeholder.and" />{' '}<a href="https://www.pihub-pi.com/de/datenschutz/" rel="noopener noreferrer" target="_blank"><Translate content="placeholder.privacy_policy" /></a><Translate content="placeholder.privacy_policy_ending" /></label>
            {errors.agreed_term ? <span className="auth-field-error" role="alert">{errors.agreed_term}</span> : null}
          </div>
        </div>
        <AuthErrorSummary value={errMsg} />
        <button className="btn btn-primary btn-form" type="submit" disabled={submitting}><Translate content="button.signup" /></button>
      </form>
      <div className="auth-foot"><Translate content="label.alreadyhaveanaccount" />&nbsp;<Link to="/login"><strong><Translate content="label.login" /></strong></Link></div>
    </AuthShell>
  );
};

export default connect(state => ({ errMsg: state.errors }), { signup, clearError })(Signup);
