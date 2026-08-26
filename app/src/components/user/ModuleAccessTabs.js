import React from 'react';
import { Link } from 'react-router-dom';
import { PLATFORM_ACCESS_APPLICATIONS } from '../../_platform/modules';

const applicationAccessPath = applicationId => {
  if (applicationId === 'investor') return '/login';
  if (applicationId === 'admin') return '/login?next=admin';
  return `/login/${applicationId}`;
};

const ModuleAccessTabs = ({ selectedApplicationId = 'investor' }) => (
  <nav className="nav nav-tabs mb-4" aria-label="PiHub workspace access">
    {PLATFORM_ACCESS_APPLICATIONS.map(application => {
      const active = application.id === selectedApplicationId;
      return (
        <Link
          className={`nav-item nav-link d-flex align-items-center justify-content-center${active ? ' active' : ''}`}
          to={applicationAccessPath(application.id)}
          key={application.id}
          aria-current={active ? 'page' : undefined}
          style={{ minHeight: 44, minWidth: 0, flex: '1 1 0', fontSize: 12, fontWeight: 600 }}
        >
          <span>{application.label}</span>
        </Link>
      );
    })}
  </nav>
);

export default ModuleAccessTabs;
