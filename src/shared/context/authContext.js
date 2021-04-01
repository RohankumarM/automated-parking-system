import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false, 
  login: () => { }, 
  logout: () => { },
  signUp: () => { },
  userID: '',
  username: '',
  email: '', 
  image: '',
});