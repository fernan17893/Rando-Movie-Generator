import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import '../index.css'; // Import your styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`login-container${isSignUp ? ' signup-mode' : ''}`}>
      <div className="login-box">
        <h2>Rando: A Movie Generator!</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp ? (
          <button className="signup-button" onClick={handleSignUp}>
            Sign Up
          </button>
        ) : (
          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        )}
        <p onClick={toggleMode} className="toggle-mode">
  {isSignUp ? (
    <>
      Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }}>Log in</span>
    </>
  ) : (
    <>
      Don't have an account? <span style={{ color: 'blue', cursor: 'pointer' }}>Sign up</span>
    </>
  )}
</p>

      </div>
    </div>
  );
};

export default Login;
