import React from 'react';

export default props => {
  return (
    <div class="content-head">
      <div class="content-head-left">
        <h1 class="content-head__title">{props.heading}</h1>
      </div>
      <div class="content-head-right">
        <a class="btn btn-primary" href="">
          {props.buttonLabel}
        </a>
      </div>
    </div>
  );
};
