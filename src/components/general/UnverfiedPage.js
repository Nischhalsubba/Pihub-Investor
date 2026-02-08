import React from 'react';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import AnimatedCard from './AnimatedCard';


export default props => {
  return (
    <AnimatedCard className="content-body">
      <strong>
        <Translate content='unverified.msg' />
      </strong>
      <br />
      <Link to='/user/profile'>
        <Translate content='label.profile' />
      </Link>
    </AnimatedCard>

  );
}
