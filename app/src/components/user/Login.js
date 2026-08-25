import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Translator from '../../i18n/Translate';
import { signin } from '../../actions/login';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';
import ModuleAccessTabs from './ModuleAccessTabs';
import { getAccessCopy } from '../../_platform/access';
import { getDemoModuleAccount, getDemoModuleLaunchHref } from '../../_platform/demoModuleAccess';
import { normalizeModuleId, PLATFORM_MODULES } from '../../_platform/modules';
import { getApplicationHomeHref, getCurrentApplicationId, getModuleRuntime } from '../../_platform/runtime';
import * as validation from '../../_utils/validate';

const blankCredentials = () => ({ email: '', password: '' });

const Login = ({ signin: signIn, errorMessage }) => {
  const history = useHistory();
  const { moduleId: requestedModuleId } = useParams();
  const [values, setValues] = useState(blankCredentials);
  const [errors, setErrors] = useState({});
  const [moduleError, setModuleError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';
  const locale = isGerman ? 'de' : 'en';
  const currentApplicationId = getCurrentApplicationId();
  const currentBusinessModuleId = normalizeModuleId(currentApplicationId) || 'investor';
  const normalizedRequestedModuleId = normalizeModuleId(requestedModuleId);
  const selectedModuleId = requestedModuleId ? (normalizedRequestedModuleId || currentBusinessModuleId) : currentBusinessModuleId;
  const selectedModule = PLATFORM_MODULES.find(module => module.id === selectedModuleId) || PLATFORM_MODULES[0];
  const runtime = getModuleRuntime(selectedModuleId);
  const copy = getAccessCopy(selectedModuleId, locale);
  const isCurrentApplication = selectedModuleId === currentApplicationId;
  const demoAccount = getDemoModuleAccount(selectedModuleId);

  useEffect(() => {
    if (!requestedModuleId) return;
    const normalized = normalizeModuleId(requestedModuleId);
    const canonical = normalized
      ? (normalized === currentBusinessModuleId ? '/login' : `/login/${normalized}`)
      : '/login';
    const requested = `/login/${requestedModuleId}`;
    if (canonical !== requested) history.replace(canonical);
  }, [currentBusinessModuleId, history, requestedModuleId]);

  useEffect(() => {
    setErrors({});
    setModuleError('');
    setSubmitting(false);
    setValues(demoAccount ? { email: demoAccount.email, password: demoAccount.password } : blankCredentials());
  }, [demoAccount, selectedModuleId]);

  const update = event => setValues(current => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = event => {
    event.preventDefault();
    const next = {
      email: validation.required(values.email) || validation.newEmail(values.email),
      password: validation.required(values.password)
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
    setErrors(clean);
    setModuleError('');
    if (Object.keys(clean).length) return;

    if (isCurrentApplication) {
      setSubmitting(true);
      signIn(values, () => history.replace(getApplicationHomeHref(currentApplicationId) || '/dashboard')).finally?.(() => setSubmitting(false));
      window.setTimeout(() => setSubmitting(false), 1200);
      return;
    }

    if (!runtime?.configured || !demoAccount) {
      setModuleError(`${selectedModule.label} access is not configured for this environment.`);
      return;
    }

    const emailMatches = String(values.email || '').trim().toLowerCase() === demoAccount.email.toLowerCase();
    if (!emailMatches || values.password !== demoAccount.password) {
      setModuleError(`Use the prefilled ${selectedModule.label} demo credentials for this frontend workspace.`);
      return;
    }

    const launchHref = getDemoModuleLaunchHref(selectedModuleId, runtime.homeHref);
    if (!launchHref) {
      setModuleError(`Unable to open the ${selectedModule.label} workspace safely.`);
      return;
    }

    setSubmitting(true);
    window.location.assign(launchHref);
  };

  const proofItems = copy.proofItems.map(label => ({ label }));

  return (
    <AuthShell
      brandLabel="PiHub"
      brandHref="/login"
      workspaceNav={<ModuleAccessTabs selectedModuleId={selectedModuleId} />}
      eyebrow={copy.eyebrow}
      title={<Translate content="label.login" />}
      description={copy.description}
      visualEyebrow={copy.visualEyebrow}
      visualTitle={copy.visualTitle}
      visualDescription={copy.visualDescription}
      proofItems={proofItems}
    >
      <form className="form-signin" onSubmit={onSubmit} noValidate>
        {!isCurrentApplication ? (
          <div className="alert alert-light border py-2 px-3 mb-3" role="status">
            <strong className="d-block mb-1">{selectedModule.label} demo access</strong>
            <span>Use this same PiHub access screen. The demo credentials are prefilled and the workspace opens without a second login page.</span>
          </div>
        ) : null}
        <AuthField id="login-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={values.email} onChange={update} error={errors.email} autoComplete="email" />
        <AuthField id="login-password" name="password" type="password" label={<Translate content="label.password" />} value={values.password} onChange={update} error={errors.password} autoComplete="current-password" />
        <AuthErrorSummary value={moduleError || (isCurrentApplication ? errorMessage : '')} />
        {isCurrentApplication ? <div className="auth-meta"><Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link></div> : null}
        <button className="btn btn-primary btn-form" type="submit" disabled={submitting}>
          {isCurrentApplication ? <Translate content="label.login" /> : `Open ${selectedModule.label}`}
        </button>
      </form>
      {isCurrentApplication ? (
        <div className="auth-foot"><Translate content="label.ifyoudont" />&nbsp;<Link to="/signup"><strong><Translate content="label.here" /></strong></Link></div>
      ) : (
        <div className="auth-foot">This is a browser-local demo handoff. Production shared SSO and authorization remain server-owned.</div>
      )}
    </AuthShell>
  );
};

export default connect(state => ({ errorMessage: state.auth.errorMessage }), { signin })(Login);
