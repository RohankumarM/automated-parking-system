import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import './SignedOutLinks.css';

const useStyles = makeStyles({
  root: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.9), 0 6px 20px 0 rgba(0, 0, 0, 0.25)",
    zIndex: 100,
  },
});

function SignOutLinks() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <div className="signed-out-links">
      <BottomNavigation
        value={location.pathname}
        onChange={(event, location) => {
          history.push(location);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction label="Find Parking" value="/findSpace" icon={<SearchRoundedIcon />} />
        <BottomNavigationAction label="Login" value="/login" icon={<AccountCircleRoundedIcon />} />
      </BottomNavigation>
    </div>
  )
}

export default SignOutLinks;
