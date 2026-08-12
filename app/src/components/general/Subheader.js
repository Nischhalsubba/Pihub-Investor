import React from 'react';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <div className="content-head">
      <div className="content-head-left">
        <h1 className="content-head__title">{props.heading}</h1>
      </div>
      {props.buttonLabel ? (
        <div className="content-head-right">
          <Link className="btn btn-primary" to={props.link}>
            {props.buttonLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
};
