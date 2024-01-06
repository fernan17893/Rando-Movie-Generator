import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import { auth } from './firebase';
import MovieGenerator from './components/MovieGenerator';
import { onAuthStateChanged } from 'firebase/auth';
import './index.css';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once authentication check is complete
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false); // Set loading to false in case of an error
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      {user ? <MovieGenerator /> : <Login />}
      <div className="footer">
        <p>Created by: <a href="https://github.com/fernan17893">Fern</a></p>
      </div>
    </div>
    
  );
}

export default App;
