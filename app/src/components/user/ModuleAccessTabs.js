import React from 'react';
import { Link } from 'react-router-dom';
import { PLATFORM_MODULES } from '../../_platform/modules';

const moduleAccessPath = moduleId => moduleId === 'investor' ? '/login' : `/login/${moduleId}`;

const ModuleAccessTabs = ({ selectedModuleId = 'investor' }) => (
  <nav className="nav nav-tabs mb-4" aria-label="PiHub workspace access">
    {PLATFORM_MODULES.map(module => {
      const active = module.id === selectedModuleId;
      return (
        <Link
          className={`nav-item nav-link d-flex align-items-center justify-content-center${active ? ' active' : ''}`}
          to={moduleAccessPath(module.id)}
          key={module.id}
          aria-current={active ? 'page' : undefined}
          style={{ minHeight: 44, minWidth: 0, flex: '1 1 0', fontSize: 12, fontWeight: 600 }}
        >
          <span>{module.label}</span>
        </Link>
      );
    })}
  </nav>
);

export default ModuleAccessTabs;
