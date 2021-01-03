import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignOutLinks() {

  return (
    <div className="signed-out-links">
    <ul>
      <Link to="/findSpace">
      <li>Find Space</li>
      </Link>
      <Link to="/login">
      <li>Login</li>
      </Link>
    </ul>
    </div>
  )
}

export default SignOutLinks;
