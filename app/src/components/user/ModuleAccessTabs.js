import React from 'react';
import { Link } from 'react-router-dom';
import { PLATFORM_MODULES } from '../../_platform/modules';
import { getModuleAccessHref, getModuleRuntime, isAbsoluteNavigationHref } from '../../_platform/runtime';

const ModuleAccessTabs = ({ selectedModuleId = 'investor' }) => (
  <nav className="nav nav-tabs mb-4" aria-label="PiHub workspace access">
    {PLATFORM_MODULES.map(module => {
      const runtime = getModuleRuntime(module.id);
      const href = getModuleAccessHref(module.id);
      const active = module.id === selectedModuleId;
      const className = `nav-item nav-link d-flex align-items-center justify-content-center${active ? ' active' : ''}`;
      const content = (
        <>
          <span>{module.label}</span>
          {!runtime?.configured && module.id !== 'investor' ? <span className="sr-only">, in development</span> : null}
        </>
      );
      const common = {
        className,
        'aria-current': active ? 'page' : undefined,
        style: { minHeight: 44, minWidth: 0, flex: '1 1 0', fontSize: 12, fontWeight: 600 }
      };

      return isAbsoluteNavigationHref(href)
        ? <a {...common} href={href} key={module.id}>{content}</a>
        : <Link {...common} to={href} key={module.id}>{content}</Link>;
    })}
  </nav>
);

export default ModuleAccessTabs;
