import React from 'react';

export const PageHead = ({ eyebrow, title, subtitle, action }) => (
  <div className="ph-page-head"><div><div className="ph-eyebrow">{eyebrow}</div><h1 className="ph-title">{title}</h1>{subtitle ? <p className="ph-subtitle">{subtitle}</p> : null}</div>{action || null}</div>
);

export const Card = ({ title, children, className = '' }) => <section className={`ph-card ${className}`.trim()}>{title ? <h2>{title}</h2> : null}{children}</section>;
export const Metric = ({ value, label }) => <div className="ph-card ph-metric-card"><div className="ph-metric">{value}</div><div className="ph-metric-label">{label}</div></div>;
export const Status = ({ children, tone = '' }) => <span className={`ph-status ${tone}`.trim()}>{children}</span>;
export const Field = ({ label, children }) => <div className="ph-field"><label>{label}</label>{children}</div>;
export const Empty = ({ children }) => <div className="ph-empty">{children}</div>;
