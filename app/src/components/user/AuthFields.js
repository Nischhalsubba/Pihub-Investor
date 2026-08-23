import React from 'react';

export const normalizeMessages = value => {
  const messages = [];
  const visit = current => {
    if (current === null || current === undefined || current === '') return;
    if (typeof current === 'string' || typeof current === 'number') { messages.push(String(current)); return; }
    if (Array.isArray(current)) { current.forEach(visit); return; }
    if (typeof current === 'object') {
      if (typeof current.message === 'string') { messages.push(current.message); return; }
      Object.keys(current).forEach(key => visit(current[key]));
    }
  };
  visit(value);
  return Array.from(new Set(messages));
};

export const AuthField = ({ id, label, error, ...inputProps }) => {
  const errorId = `${id}-error`;
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="form-control" aria-invalid={Boolean(error) || undefined} aria-describedby={error ? errorId : undefined} {...inputProps} />
      {error ? <span id={errorId} className="auth-field-error" role="alert">{error}</span> : null}
    </div>
  );
};

export const AuthErrorSummary = ({ value }) => {
  const messages = normalizeMessages(value);
  if (!messages.length) return null;
  return (
    <div className="auth-error auth-form-status" role="alert" aria-live="assertive">
      {messages.map(message => <div key={message}>{message}</div>)}
    </div>
  );
};
