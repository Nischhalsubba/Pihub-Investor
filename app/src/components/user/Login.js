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
import { normalizeModuleId, PLATFORM_MODULES } from '../../_platform/modules';
import { getCurrentModuleId, getModuleHomeHref, getModuleRuntime } from '../../_platform/runtime';
import * as validation from '../../_utils/validate';

const Login = ({ signin: signIn, errorMessage }) => {
  const history = useHistory();
  const { moduleId: requestedModuleId } = useParams();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isGerman = Translator.getLocale() === 'de';
  const locale = isGerman ? 'de' : 'en';
  const currentModuleId = getCurrentModuleId();
  const normalizedRequestedModuleId = normalizeModuleId(requestedModuleId);
  const selectedModuleId = requestedModuleId ? (normalizedRequestedModuleId || 'investor') : 'investor';
  const selectedModule = PLATFORM_MODULES.find(module => module.id === selectedModuleId) || PLATFORM_MODULES[0];
  const runtime = getModuleRuntime(selectedModuleId);
  const copy = getAccessCopy(selectedModuleId, locale);
  const isCurrentApplication = selectedModuleId === currentModuleId;

  useEffect(() => {
    if (!requestedModuleId) return;
    const normalized = normalizeModuleId(requestedModuleId);
    const canonical = normalized
      ? (normalized === 'investor' ? '/login' : `/login/${normalized}`)
      : '/login';
    const requested = `/login/${requestedModuleId}`;
    if (canonical !== requested) history.replace(canonical);
  }, [history, requestedModuleId]);

  const update = event => setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  const onSubmit = event => {
    event.preventDefault();
    if (!isCurrentApplication) return;

    const next = {
      email: validation.required(values.email) || validation.newEmail(values.email),
      password: validation.required(values.password)
    };
    const clean = Object.fromEntries(Object.entries(next).filter(([, value]) => value));
    setErrors(clean);
    if (Object.keys(clean).length) return;
    setSubmitting(true);
    signIn(values, () => history.replace(getModuleHomeHref(currentModuleId) || '/dashboard')).finally?.(() => setSubmitting(false));
    window.setTimeout(() => setSubmitting(false), 1200);
  };

  const proofItems = copy.proofItems.map(label => ({ label }));
  const moduleLogin = runtime?.loginHref || '';

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
      {isCurrentApplication ? (
        <>
          <form className="form-signin" onSubmit={onSubmit} noValidate>
            <AuthField id="login-email" name="email" type="email" label={<Translate content="label.emailaddress" />} value={values.email} onChange={update} error={errors.email} autoComplete="email" />
            <AuthField id="login-password" name="password" type="password" label={<Translate content="label.password" />} value={values.password} onChange={update} error={errors.password} autoComplete="current-password" />
            <AuthErrorSummary value={errorMessage} />
            <div className="auth-meta"><Link to="/forgot-password"><Translate content="label.forgotPassword" /></Link></div>
            <button className="btn btn-primary btn-form" type="submit" disabled={submitting}><Translate content="label.login" /></button>
          </form>
          <div className="auth-foot"><Translate content="label.ifyoudont" />&nbsp;<Link to="/signup"><strong><Translate content="label.here" /></strong></Link></div>
        </>
      ) : (
        <section className="mt-4" aria-labelledby="module-access-status">
          <div className="alert alert-light border" role="status">
            <strong id="module-access-status" className="d-block mb-2">{selectedModule.label} workspace</strong>
            {runtime?.configured ? (
              <span>This workspace runs as a separate PiHub application so its routes and releases stay isolated from Investor.</span>
            ) : (
              <span>This workspace is being prepared as a separate PiHub application. It is not available for sign-in yet.</span>
            )}
          </div>
          {runtime?.configured ? (
            <a className="btn btn-primary btn-form" href={moduleLogin}>Continue to {selectedModule.label} login</a>
          ) : (
            <Link className="btn btn-outline-primary btn-form" to="/login">Return to Investor login</Link>
          )}
        </section>
      )}
    </AuthShell>
  );
};

export default connect(state => ({ errorMessage: state.auth.errorMessage }), { signin })(Login);
