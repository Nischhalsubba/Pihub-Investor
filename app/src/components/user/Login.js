import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import Translate from '../../i18n/Translate';
import Translator from '../../i18n/Translate';
import { signin } from '../../actions/login';
import { AuthErrorSummary, AuthField } from './AuthFields';
import AuthShell from './AuthShell';
import ModuleAccessTabs from './ModuleAccessTabs';
import { getAccessCopy } from '../../_platform/access';
import { getDemoModuleAccount, getDemoModuleLaunchHref } from '../../_platform/demoModuleAccess';
import { normalizeApplicationId, normalizeModuleId } from '../../_platform/moduleIds';
import { PLATFORM_ACCESS_APPLICATIONS } from '../../_platform/modules';
import { getApplicationHomeHref, getApplicationRuntime, getCurrentApplicationId } from '../../_platform/runtime';
import * as validation from '../../_utils/validate';

const blankCredentials = () => ({ email: '', password: '' });
const isDemoBuild = () => typeof __PIHUB_DEMO__ !== 'undefined' && Boolean(__PIHUB_DEMO__);

const Login = ({ signin: signIn, errorMessage }) => {
  const history = useHistory();
  const location = useLocation();
  const { moduleId: requestedModuleId } = useParams();
  const [values, setValues] = useState(blankCredentials);
  const [errors, setErrors] = useState({});
  const [moduleError, setModuleError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';
  const locale = isGerman ? 'de' : 'en';
  const currentApplicationId = getCurrentApplicationId();
  const currentBusinessModuleId = normalizeModuleId(currentApplicationId) || 'investor';
  const queryApplicationId = useMemo(() => normalizeApplicationId(new URLSearchParams(location.search).get('next')), [location.search]);
  const routeApplicationId = normalizeApplicationId(requestedModuleId);
  const selectedApplicationId = queryApplicationId || routeApplicationId || currentApplicationId;
  const selectedApplication = PLATFORM_ACCESS_APPLICATIONS.find(application => application.id === selectedApplicationId) || PLATFORM_ACCESS_APPLICATIONS[0];
  const runtime = getApplicationRuntime(selectedApplicationId);
  const copy = getAccessCopy(selectedApplicationId, locale);
  const isCurrentApplication = selectedApplicationId === currentApplicationId;
  const demoAccount = isDemoBuild() ? getDemoModuleAccount(selectedApplicationId) : null;

  useEffect(() => {
    if (requestedModuleId) {
      const normalized = normalizeApplicationId(requestedModuleId);
      const canonical = !normalized
        ? '/login'
        : normalized === currentBusinessModuleId
          ? '/login'
          : normalized === 'admin'
            ? '/login?next=admin'
            : `/login/${normalized}`;
      const requested = `/login/${requestedModuleId}`;
      if (canonical !== requested) history.replace(canonical);
      return;
    }

    const requestedNext = new URLSearchParams(location.search).get('next');
    if (requestedNext && normalizeApplicationId(requestedNext) !== 'admin') history.replace('/login');
  }, [currentBusinessModuleId, history, location.search, requestedModuleId]);

  useEffect(() => {
    setErrors({});
    setModuleError('');
    setSubmitting(false);
    setValues(demoAccount ? { email: demoAccount.email, password: demoAccount.password } : blankCredentials());
  }, [demoAccount, selectedApplicationId]);

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
      setModuleError(`${selectedApplication.label} access is not configured for this environment.`);
      return;
    }

    const emailMatches = String(values.email || '').trim().toLowerCase() === demoAccount.email.toLowerCase();
    if (!emailMatches || values.password !== demoAccount.password) {
      setModuleError(`Use the prefilled ${selectedApplication.label} demo credentials for this frontend workspace.`);
      return;
    }

    const launchHref = getDemoModuleLaunchHref(selectedApplicationId, runtime.homeHref);
    if (!launchHref) {
      setModuleError(`Unable to open the ${selectedApplication.label} workspace safely.`);
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
      workspaceNav={<ModuleAccessTabs selectedApplicationId={selectedApplicationId} />}
      eyebrow={copy.eyebrow}
      title={<Translate content="label.login" />}
      description={copy.description}
      visualEyebrow={copy.visualEyebrow}
      visualTitle={copy.visualTitle}
      visualDescription={copy.visualDescription}
      proofItems={proofItems}
    >
      <form className="form-signin" onSubmit={onSubmit} noValidate>
        <div className="alert alert-light border py-2 px-3 mb-3" role="status">
          <strong className="d-block mb-1">{selectedApplication.label} {isCurrentApplication ? 'demo sign in' : 'demo access'}</strong>
          <span>{isCurrentApplication ? 'Demo credentials are prefilled in this demo build. Production sign-in never exposes demo credentials.' : 'Use this same PiHub access screen. The destination opens without a second login page.'}</span>
        </div>
        <AuthField id="login-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={values.email} onChange={update} error={errors.email} autoComplete="email" />
        <AuthField id="login-password" name="password" type="password" label={<Translate content="label.password" />} value={values.password} onChange={update} error={errors.password} autoComplete="current-password" />
        <AuthErrorSummary value={moduleError || (isCurrentApplication ? errorMessage : '')} />
        {isCurrentApplication ? <div className="auth-meta"><Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link></div> : null}
        <button className="btn btn-primary btn-form" type="submit" disabled={submitting}>
          {isCurrentApplication ? <Translate content="label.login" /> : `Open ${selectedApplication.label}`}
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
