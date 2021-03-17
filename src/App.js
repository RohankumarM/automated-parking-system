import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import Home from './components/Home';
import Account from './components/Account';
import FindSpace from './components/FindSpace';
import Book from './components/Book';
// import logo from './images/method-draw-image.svg';
import { AuthContext } from './shared/context/authContext';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import fire from './base';
import './App.css';

const App = () => {

  // const [user, setUser] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState('');

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const signup = useCallback(() => {
    // setIsLoggedIn(true);
  })

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    fire.auth().signOut();
  }, []);
  console.log(isLoggedIn);

  // const handlesetuserID = (id) => {
  //   setUserID(id);
  //   console.log(userID);
  // }

  let routes;
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user);
      setIsLoggedIn(true);
      setUserID(user.uid);
    }
  });

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/account">
          <Account />
        </Route>
        <Route path="/book">
          <Book />
        </Route>
        <Route path="/findSpace">
          <FindSpace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }
  else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/findSpace">
          <FindSpace />
        </Route>
        <Route path="/login" render={(props) => <Login userID={userID} {...props} />} >
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }



  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    }
  });

  const handleDarkMode = () => {
    darkMode === false ?
      setDarkMode(true) :
      setDarkMode(false);
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout, signUp: signup, userID: userID }}
    >
      <ThemeProvider theme={theme}>
        <div className="app">

          <Paper className="main-container">
            <Router>
              {/* <img className="logo" src={logo} alt="image" /> */}
              <Nav
                darkMode={darkMode}
                handleDarkMode={handleDarkMode} />

              {routes}
            </Router>

          </Paper>
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}

export default App;

