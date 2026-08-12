import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component'
export default props => {
  return (
    <Fragment>
      
      <Translate content='label.passwordChange' />
      <br />
      <Link to='/login'><Translate content='label.login' /></Link> <Translate content='label.newPassword' />
      </Fragment>
  );
}