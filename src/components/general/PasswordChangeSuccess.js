import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <Fragment>
      You have successfully changed your password.
      <br />
      <Link to='/login'>Login</Link> with your new password.
      </Fragment>
  );
}