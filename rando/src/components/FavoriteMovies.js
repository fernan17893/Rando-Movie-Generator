import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import MoviePoster from "./MoviePoster";
import { deleteDoc, doc } from "firebase/firestore";
import { Dropdown } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


const FavoriteMovies = () => {
    const [favorites, setSavedMovies] = useState([]);
    const [currentUser] = useState(auth.currentUser);
    const navigate = useNavigate();

    const handleProfileMenuSelect = (eventKey) => {
      if (eventKey === 'home') {
        navigate('/');
      } else if (eventKey === 'logout') {
        signOut(auth)
          .then(() => {
            console.log('Logout successful');
            navigate('/login');
          })
          .catch((error) => {
            console.error('Logout error:', error);
          });
      }
    };


    useEffect(() => {
        const unsubscribe = onSnapshot(
          collection(db, 'users', auth.currentUser.uid, 'favorites'),
          (snapshot) => {
            const savedMoviesData = [];
            snapshot.forEach((doc) => {
              savedMoviesData.push({ id: doc.id, ...doc.data() });
            });
            setSavedMovies(savedMoviesData);
          },
          (error) => {
            console.error('Error fetching saved movies:', error);
          }
        );

        return () => unsubscribe();
      }, []);

    const removeFavorite = async (movie) => {
      try {
          if (!movie || !movie.id) {
            console.error('No movie ID provided');
            return;
          }

          console.log('Removing movie from favorites:', movie);
    
        const userId = auth.currentUser.uid;
        const favoritesRef = collection(db, 'users', userId, 'favorites');
        const movieDocRef = doc(favoritesRef, movie.id);
        await deleteDoc(movieDocRef);
        } catch (error) {
        console.error('Error removing movie from favorites:', error);
      }
    };
    
    return (
        <><div className="favorite-movies">
          <div className="favorites-header">
          <h2>Favorite Movies</h2>
          <Dropdown
        className="dropdown-favorites-container"
        onSelect={handleProfileMenuSelect}
        auto-close="true"
        >
        <Dropdown.Toggle variant="success" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true">
          Hello {currentUser ? currentUser.displayName || currentUser.email : 'Guest'}
          <span className='dropdown-arrow'>&#9660;</span>
        </Dropdown.Toggle>

        <Dropdown.Menu class="dropdown-menu" autoClose="true">
        <Dropdown.Item eventKey="home">
        <span role="img" aria-label="Home">🎥</span> Home
        </Dropdown.Item>
        <Dropdown.Item eventKey="logout">
        <span>&#128274;</span> Logout
          </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        </div>
      <div className="movies-list">
          {/* Display saved movies here */}
          {favorites.map((movie, index) => (
            <div key={index}
              className="fave-container">
              <MoviePoster poster={movie.poster} title={movie.title} imdbId={movie.imdbId} />
              <div className="remove-favorite" onClick={() => {
                console.log('Removing favorite:', movie);
                removeFavorite(movie);
              } }>X</div>
              {/* Add other movie details as needed */}
              <div className="fave-title">
                {movie.title}
              </div>
            </div>
          ))}
        </div>
        </div>
        </>
    );
}



export default FavoriteMovies;