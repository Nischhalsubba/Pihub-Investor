import React from 'react';
import { Link } from 'react-router-dom';

const Subheader = ({ heading, subtitle, buttonLabel, link, actions }) => {
  return (
    <div className="page-header">
      <div className="page-header__text">
        <h1 className="page-header__title">{heading}</h1>
        {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="page-header__actions">{actions}</div>
      ) : buttonLabel ? (
        <div className="page-header__actions">
          <Link className="btn btn-primary" to={link}>
            {buttonLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default Subheader;
