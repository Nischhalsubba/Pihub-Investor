import React from 'react';

export default props => {
  return (
    <div className="content-head">
      <div className="content-head-left">
        <h1 className="content-head__title">{props.heading}</h1>
      </div>
      {props.buttonLabel ? (
        <div className="content-head-right">
          <a className="btn btn-primary" href="">
            {props.buttonLabel}
          </a>
        </div>
      ) : null}
    </div>
  );
};
