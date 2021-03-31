import React, { useState, useEffect, useRef, useContext } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import FacebookIcon from '@material-ui/icons/Facebook';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { AuthContext } from '../shared/context/authContext';
import fire from '../base';
import { storage } from '../base';
import * as firebase from 'firebase';
import { useHistory } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({ userID }) => {

  const history = useHistory();
  const authContext = useContext(AuthContext);

  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userImage, setUserImage] = useState(null);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleFirebaseLogin = (event) => {
    event.preventDefault();
    clearErrors();
    fire.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return fire.auth().signInWithEmailAndPassword(email, password)
        .then((profile) => {
        }).catch(err => {
          switch (err.code) {
            case "auth/invalid-user":
            case "auth/user-disabled":
            case "auth/user-not-found":
              setEmailError(err.message);
              break;
            case "auth/wrong-password":
              setPasswordError(err.message);
              break;
            default:
          }
        });
    })
      .catch((err) => console.log(err));
  };

  const handleFirebaseSignUp = (event) => {
    event.preventDefault();
    clearErrors();

    const uploadTask = storage.ref(`images/${email}/${userImage.name}`).put(userImage);
    uploadTask.on("state_changed",
      snapshot => { },
      error => { console.log(error) },
      () => storage.ref("images").child(email).child(userImage.name).getDownloadURL()
        .then(url => {
          fire.auth().createUserWithEmailAndPassword(email, password)
            .then((profile) => {
              // authContext.signUp();
              fire.database().ref('users/' + profile.user.uid)
                .set({
                  username,
                  numberPlate,
                  email,
                  userImageUrl: url
                });
            })
            .catch(err => {
              switch (err.code) {
                case "auth/email-already-in-use":
                case "auth/invalid-user":
                  setEmailError(err.message);
                  break;
                case "auth/weak-password":
                  setPasswordError(err.message);
                  break;
                default:
              }
            });
        })
    )
  };
  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
      }
      else {
        setUser('');
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  const login_ref = useRef(null);
  const container = useRef(null);
  const sign_up = useRef(null);

  const handleLoginAnimation = () => {
    container.current.classList.add("sign-up-mode");
  };

  const handleSignUpAnimation = () => {
    container.current.classList.remove("sign-up-mode");
  };

  return (
    <div className="login" ref={container}>
      <div className="form-container">
        <div className="form-login-signup">

          <form action="" className="login-form" onSubmit={handleFirebaseLogin}>
            <h2 className="title">Login</h2>
            <div className="input-field">
              <AccountCircleIcon className="icon" />
              <input autoFocus required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="errorMsg">{emailError}</p>
            </div>
            <div className="input-field">
              <LockIcon className="icon" />
              <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
              <p className="errorMsg">{passwordError}</p>
            </div>
            <input type="submit" value="Login" className="login_btn" />

            <p className="social_login">Or Sign In With Social Platforms</p>
            <div className="social-media">
              <a href="/login" className="social-icon">
                <GTranslateIcon />
              </a>
              <a href="/login" className="social-icon">
                <FacebookIcon />
              </a>
            </div>
          </form>

          <form action="" className="signup-form" onSubmit={handleFirebaseSignUp}>
            <h2 className="title">Signup</h2>
            <div className="input-field">
              <AccountCircleIcon className="icon" />
              <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-field">
              <img className="number-plate" src="https://cdn.iconscout.com/icon/premium/png-256-thumb/number-plate-1582888-1337733.png" alt="number plate" />
              <input type="text" placeholder="Number Plate" required onChange={(e) => setNumberPlate(e.target.value)} />
            </div>
            <div className="input-field">
              <AccountCircleIcon className="icon" />
              <input type="email" value={email} placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-field">
              <LockIcon className="icon" />
              <input type="password" value={password} placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="input-field__userImage">
              <label for="imageUpload">Upload Photo</label>
              <input type="file" id="imageUpload" accept="image/*" required style={{ display: 'none' }} onChange={(e) => setUserImage(e.target.files[0])} />
            </div>
            <input type="submit" value="SignUp" className="login_btn" />

            <p className="social_login">Or Sign In With Social Platforms</p>
            <div className="social-media">
              <a href="/login" className="social-icon">
                <GTranslateIcon />
              </a>
              <a href="/login" className="social-icon">
                <FacebookIcon />
              </a>
            </div>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New Here?</h3>
            <p>Sign Up and start using Smart Parking System to save time and reduce Pollution.</p>
            <button className="btn transparent" id="login-btn" ref={login_ref} onClick={handleLoginAnimation}>Sign Up</button>
          </div>

          <img className="image" src="https://img.freepik.com/free-vector/smart-parking-man-user-with-smartphone-touch-screen-control-car-driving-to-park_33099-165.jpg" alt="" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome to Smart Parking System</p>
            <button className="btn transparent" id="sign-up-btn" ref={sign_up} onClick={handleSignUpAnimation}>Login</button>
          </div>

          <img className="image" src="https://www.joy-mobility.com/img/joy-mobility-corp-carsharing-svg.svg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Login;
