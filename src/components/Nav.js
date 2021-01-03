import React, { useRef, useContext } from 'react';
import '../styles/Nav.css';
import SignInLinks from './Nav/SignedInLinks';
import SignOutLinks from './Nav/SignOutLinks';
import { AuthContext } from '../shared/context/authContext';
import { Switch, Typography } from '@material-ui/core';

const Nav = ({ user, darkMode, handleDarkMode }) => {

  const navbar = useRef(null);

  const auth = useContext(AuthContext);
  console.log(user);

  // const handleEvent = (e) =>{
  //   navbar.current.classList.toggle('active');
  // };


  return (
    <nav>
      <div className="header">Smart Parking System</div>
      {auth.isLoggedIn ? <SignInLinks /> : <SignOutLinks />}
      <div className="dark-mode-container">
      <Switch className="dark-mode-btn" checked={darkMode} onChange={handleDarkMode} size='small'/>
      <Typography className="dark-mode-font">Dark Mode</Typography>
      </div>
    </nav>
  )
}

export default Nav;
