import React from 'react';
import { Link } from 'react-router-dom';


export default props => {
  return (
    <div className="content-body">
      <strong> Ihr Konto ist noch nicht bestätigt.Bitte kontaktieren Sie den Administrator</strong>
      <br />
      <Link to='/user/profile'>
        Mein Profil
      </Link>
    </div>

  );
}
