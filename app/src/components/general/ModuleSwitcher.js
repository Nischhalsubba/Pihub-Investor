import React from 'react';

const ModuleSwitcher = ({ modules = [], currentModuleId = 'investor' }) => {
  if (!Array.isArray(modules) || modules.length <= 1) return null;

  const current = modules.find(module => module.id === currentModuleId) || modules[0];

  return (
    <details className="ap-module-switcher">
      <summary aria-label={`Current workspace: ${current.label}. Switch workspace.`}>
        <span className="ap-module-switcher-icon" aria-hidden="true"><i className={current.icon} /></span>
        <span className="ap-module-switcher-copy"><small>Workspace</small><strong>{current.label}</strong></span>
        <i className="bx bx-chevron-down ap-module-switcher-chevron" aria-hidden="true" />
      </summary>
      <div className="ap-module-switcher-panel">
        <header className="ap-module-switcher-head">
          <strong>Switch workspace</strong>
          <span>Only workspaces available to your account are shown.</span>
        </header>
        <div className="ap-module-switcher-list">
          {modules.map(module => module.id === current.id ? (
            <div className="ap-module-switcher-option is-current" key={module.id} aria-current="page">
              <i className={module.icon} aria-hidden="true" />
              <span><strong>{module.label}</strong><small>{module.eyebrow}</small></span>
              <i className="bx bx-check" aria-hidden="true" />
            </div>
          ) : (
            <a className="ap-module-switcher-option" href={module.href} key={module.id}>
              <i className={module.icon} aria-hidden="true" />
              <span><strong>{module.label}</strong><small>{module.eyebrow}</small></span>
              <i className="bx bx-right-arrow-alt" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </details>
  );
};

export default ModuleSwitcher;
