import React from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';


export default props => {
  return (
    <div className="content-body">
      <strong>
        <Translate content='unverified.msg' />
      </strong>
      <br />
      <Link to='/user/profile'>
        <Translate content='label.profile' />
      </Link>
    </div>

  );
}
