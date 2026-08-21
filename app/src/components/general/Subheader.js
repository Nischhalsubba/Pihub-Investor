import React from 'react';
import { Link } from 'react-router-dom';

export default props => (
  <div className="content-head" data-motion="page-head">
    <div className="content-head-left">
      <div className="content-head-kicker">Opportunity intelligence</div>
      <h1 className="content-head__title">{props.heading}</h1>
      <p className="content-head-copy">
        Review credit opportunities with a clearer view of range, duration, sector exposure and current status.
      </p>
    </div>
    {props.buttonLabel ? (
      <div className="content-head-right">
        <Link className="btn btn-primary" to={props.link}>{props.buttonLabel}</Link>
      </div>
    ) : null}
  </div>
);
