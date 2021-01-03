import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../shared/context/authContext';

function SignedInLinks() {

  const auth = useContext(AuthContext);

  return (
    <div className="signed-in-links">
    <ul>
      <Link to="/findSpace">
      <li>Find Space</li>
      </Link>
      <Link to="/account">
      <li>Account</li>
      </Link>
      <Link to="/book">
      <li>Book</li>
      </Link>
      <Link to="/login">
      <li onClick={auth.logout}>Logout</li>
      </Link>
    </ul>
    </div>
  )
}

export default SignedInLinks;
