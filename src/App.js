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
import fire from './base';
import './App.css';

const App = () => {

  // const [user, setUser] = useState('');
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

  let routes;
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user)
      setIsLoggedIn(true);
      setUserID(user.uid);
    }
  });

  console.log(userID)

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
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
        <Route path="/login">
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout, signUp: signup, userID: userID }}
    >
        <div className="app">

            <Router>
              {/* <img className="logo" src={logo} alt="image" /> */}
              <Nav />

              {routes}
            </Router>

        </div>
    </AuthContext.Provider>
  )
}

export default App;

