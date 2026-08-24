import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Translator from '../../i18n/Translate';
import { signin } from '../../actions/login';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';
import * as validation from '../../_utils/validate';

const Login = ({ signin: signIn, errorMessage }) => {
  const history = useHistory();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';

  const update = event => setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = event => {
    event.preventDefault();
    const next = {
      email: validation.required(values.email) || validation.newEmail(values.email),
      password: validation.required(values.password)
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
    setErrors(clean);
    if (Object.keys(clean).length) return;
    setSubmitting(true);
    signIn(values, () => history.replace('/dashboard')).finally?.(() => setSubmitting(false));
    window.setTimeout(() => setSubmitting(false), 1200);
  };

  return (
    <AuthShell
      eyebrow={isGerman ? 'Sicherer Investorenzugang' : 'Secure investor access'}
      title={<Translate content="label.login" />}
      description={<Translate content="label.enteryouremail" />}
      visualEyebrow={isGerman ? 'Kapitalentscheidungen, klar strukturiert' : 'Capital decisions, structured clearly'}
      visualTitle={isGerman ? 'Ein Arbeitsbereich für Kredite, Chancen und Portfolioentscheidungen.' : 'One workspace for credit, opportunities and portfolio decisions.'}
      visualDescription={isGerman ? 'Prüfen Sie relevante Daten, verfolgen Sie Anfragen und behalten Sie investierte Positionen ohne unnötige visuelle Ablenkung im Blick.' : 'Review relevant data, track requests and monitor invested positions without unnecessary visual noise.'}
      proofItems={[{ label: isGerman ? 'Chancen' : 'Opportunities' }, { label: isGerman ? 'Kreditanfragen' : 'Credit requests' }, { label: 'Portfolio' }]}
    >
      <form className="form-signin" onSubmit={onSubmit} noValidate>
        <AuthField id="login-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={values.email} onChange={update} error={errors.email} autoComplete="email" />
        <AuthField id="login-password" name="password" type="password" label={<Translate content="label.password" />} value={values.password} onChange={update} error={errors.password} autoComplete="current-password" />
        <AuthErrorSummary value={errorMessage} />
        <div className="auth-meta"><Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link></div>
        <button className="btn btn-primary btn-form" type="submit" disabled={submitting}><Translate content="label.login" /></button>
      </form>
      <div className="auth-foot"><Translate content="label.ifyoudont" />&nbsp;<Link to="/signup"><strong><Translate content="label.here" /></strong></Link></div>
    </AuthShell>
  );
};

export default connect(state => ({ errorMessage: state.auth.errorMessage }), { signin })(Login);
