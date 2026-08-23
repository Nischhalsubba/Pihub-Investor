import React from 'react';
import { getLocale } from '../../../_utils/locale';

const SignupProgress = ({ stage }) => {
  const isGerman = getLocale() === 'de';
  const steps = [
    isGerman ? 'E-Mail bestätigen' : 'Confirm email',
    isGerman ? 'Freigabe' : 'Approval',
    isGerman ? 'Aktivierung' : 'Activation'
  ];

  return (
    <ol className="signup-progress" aria-label={isGerman ? 'Registrierungsfortschritt' : 'Signup progress'}>
      {steps.map((label, index) => {
        const number = index + 1;
        const completed = number < stage;
        const current = number === stage;
        const className = completed ? 'is-complete' : (current ? 'is-current' : '');
        return (
          <li className={className} key={label} aria-current={current ? 'step' : undefined}>
            <span className="signup-progress-marker">{completed ? <i className="bx bx-check" aria-hidden="true" /> : number}</span>
            <span className="signup-progress-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default SignupProgress;
