import React from 'react';
import { Link } from 'react-router-dom';

const Subheader = ({ heading, kicker, description, buttonLabel, link, linkState }) => (
  <div className="content-head" data-motion="page-head">
    <div className="content-head-left">
      {kicker ? <div className="content-head-kicker">{kicker}</div> : null}
      <h1 className="content-head__title">{heading}</h1>
      {description ? <p className="content-head-copy">{description}</p> : null}
    </div>
    {buttonLabel && link ? (
      <div className="content-head-right">
        <Link className="btn btn-primary" to={linkState ? { pathname: link, state: linkState } : link}>{buttonLabel}</Link>
      </div>
    ) : null}
  </div>
);

export default Subheader;
