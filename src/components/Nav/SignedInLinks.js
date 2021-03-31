import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/authContext';
import { useHistory, useLocation } from 'react-router';
import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import LocalParkingRoundedIcon from '@material-ui/icons/LocalParkingRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import './SignedInLinks.css';

const useStyles = makeStyles({
  root: {
    position: "fixed",
    left: 0,
    right: 0,
    width: "100%",
    bottom: 0,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.9), 0 6px 20px 0 rgba(0, 0, 0, 0.25)",
    zIndex: 100,
  },
});

function SignedInLinks() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const auth = useContext(AuthContext);
  const trigger = useScrollTrigger();

  return (
    <div className="signed-in-links">
      <BottomNavigation
        value={location.pathname}
        onChange={(event, location) => {
          if (location === '/logout') {
            auth.logout();
          }
          history.push(location);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction label="Find Parking" value="/findSpace" icon={<SearchRoundedIcon />} />
        <BottomNavigationAction label="Book" value="/book" icon={<LocalParkingRoundedIcon />} />
        <BottomNavigationAction label="Profile" value="/account" icon={<AccountCircleRoundedIcon />} />
        <BottomNavigationAction label="Profile" value="/logout" icon={<ExitToAppRoundedIcon />} />
      </BottomNavigation>
    </div>
  )
}

export default SignedInLinks;
