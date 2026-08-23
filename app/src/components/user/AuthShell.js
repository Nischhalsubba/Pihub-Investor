import React from 'react';
import { Link } from 'react-router-dom';
import AuthAtmosphere from './AuthAtmosphere';

const AuthShell = ({
  children,
  eyebrow,
  title,
  description,
  visualEyebrow,
  visualTitle,
  visualDescription,
  proofItems = [],
  wide = false,
  hideVisual = false
}) => (
  <main className={`auth-world${wide ? ' auth-world-wide-form' : ''}${hideVisual ? ' auth-world-no-visual' : ''}`}>
    <section className="auth-form-panel">
      <div className={`auth-card${wide ? ' auth-card-wide' : ''}`} data-motion="auth-card">
        <Link className="auth-brand" to="/login" aria-label="PiHub Investor">
          <span className="auth-brand-logo" aria-hidden="true"><img src="/assets/img/logo.png" alt="" /></span>
          <strong>PiHub Investor</strong>
        </Link>
        {eyebrow ? <div className="auth-eyebrow">{eyebrow}</div> : null}
        {title ? <h1 className="page-title">{title}</h1> : null}
        {description ? <div className="page-desc">{description}</div> : null}
        {children}
      </div>
    </section>

    {!hideVisual ? (
      <aside className="auth-visual" aria-hidden="true">
        <AuthAtmosphere />
        <div className="auth-visual-copy" data-motion="auth-visual-copy">
          {visualEyebrow ? <span>{visualEyebrow}</span> : null}
          {visualTitle ? <h2>{visualTitle}</h2> : null}
          {visualDescription ? <p>{visualDescription}</p> : null}
          {proofItems.length ? (
            <div className="auth-proof">
              {proofItems.map((item, index) => (
                <div key={`${item.label}-${index}`}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </aside>
    ) : null}
  </main>
);

export default AuthShell;
