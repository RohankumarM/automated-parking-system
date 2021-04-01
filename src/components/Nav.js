import React, { useContext } from 'react';
import '../styles/Nav.css';
import SignInLinks from './Nav/SignedInLinks';
import SignOutLinks from './Nav/SignOutLinks';
import { AuthContext } from '../shared/context/authContext';

const Nav = () => {

  // const navbar = useRef(null);
  const auth = useContext(AuthContext);

  // const handleEvent = (e) =>{
  //   navbar.current.classList.toggle('active');
  // };
  return (
    <div>
        {auth.isLoggedIn ? <SignInLinks /> : <SignOutLinks />}
    </div>
  )
}

export default Nav;
