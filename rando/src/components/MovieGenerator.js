import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import MovieDetails from './MovieDetails';
import MoviePoster from './MoviePoster';
import LoadingSpinner from './LoadingSpinner';
import GenreFilter from './GenreFilter';
import defaultPoster from '../assets/no-poster-available.jpg';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../index.css';
import { collection, addDoc } from 'firebase/firestore';
import MovieSearch from './MovieSearch';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import logo from '../assets/logo.png';


function MovieGenerator() {
  const [movieData, setMovieData] = useState({
    title: <strong>Welcome to Rando!</strong>,
    genre: `• Click on Generate to get started!`,
    year: `• Use the filter button to filter by genre`,
    actors: `• Click on the movie poster to go to the movie IMDB page`,
    plot: `• Click on the page title to log out and return to the login page`,
    runtime: '',
    poster: defaultPoster,
  });

  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [buttonPlusClass, setButtonPlusClass] = useState("");
  

  const apiKey = '08396464e93e24a2d2e4e071a16d2788';
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
      return () => {
        unsubscribe();
    };
  }, []);

 

  const handleSearch = async (searchQuery) => {
    try {
      setIsLoading(true);

      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data && data.results && data.results.length > 0) {
        const movie = data.results[0];
        const validMovieData = {
          title: movie.title,
          year: new Date(movie.release_date).getFullYear(),
          actors: '',
          plot: movie.overview,
          runtime: `${movie.runtime} min`,
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : defaultPoster,
          imdbId: movie.imdb_id,
        };
        setMovieData(validMovieData);
        console.log('Your movie is: '+ validMovieData.title, validMovieData);
      } else {
        setMovieData({
          title: 'No movie found',
          genre: '',
          year: '',
          actors: '',
          plot: '',
          runtime: '',
          poster: defaultPoster,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const skip = () => {
    generate();
  };

  const generate = async () => {
    try {
      setIsLoading(true);

      let movieId;
      let validMovieData;

      do {
        movieId = pad(Math.floor(Math.random() * 1000) + 1, 7);
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
      
        const response = await fetch(url);
        const data = await response.json();
        console.log('Imdb id:', data.imdb_id);
      
        if (
          response.ok &&
          data &&
          !data.adult &&
          data.runtime > 60 &&
          data.genres.some((genre) => genre.name.toLowerCase().includes(selectedGenre.toLowerCase()))
        ) {
          validMovieData = {
            title: data.title,
            genre: data.genres.map((genre) => genre.name).join(', '),
            year: new Date(data.release_date).getFullYear(),
            actors: '',
            plot: data.overview,
            runtime: `${data.runtime} min`,
            poster: data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : defaultPoster,
            imdbId: data.imdb_id,
          };
        }
      } while (!validMovieData || (isMatching && !validMovieData.genre.toLowerCase().includes(selectedGenre.toLowerCase())));
      
      setMovieData(validMovieData);
      console.log('Your movie is: '+ validMovieData.title, validMovieData);
    } catch (error) {
      console.error('Error:', error);
      skip();
    } finally {
      setIsLoading(false);
    }
  };

  const pad = (num, size) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  };



  const handleGenreSelect = (selectedGenre) => {
    setSelectedGenre(selectedGenre);
    console.log('Selected genre:', selectedGenre);
    if (selectedGenre) {
      setIsMatching(true);
    }
    else {
      setIsMatching(false);
      generate();
    }
  };

  const addToFavorites = async (validMovieData) => {
    try {
      setButtonPlusClass("button-plus-animate");
      setTimeout(() => setButtonPlusClass(""), 1000);

      const userId = auth.currentUser.uid;
      const favoritesRef = collection(db, 'users', userId, 'favorites');

      const { title, genre, year, actors, plot, runtime, poster, imdbId } = movieData;

      const movieToAdd = {
        title,
        genre,
        year,
        actors,
        plot,
        runtime,
        poster,
        imdbId,
      };

      await addDoc(favoritesRef, movieToAdd);

      console.log('Movie added to favorites:', movieToAdd);
    } catch (error) {
      console.error('Error adding movie to favorites:', error);
    }
  };

  const handleProfileMenuSelect = (eventKey) => {
    if (eventKey === 'favorites') {
      navigate('/favoritemovies');
    } else if (eventKey === 'logout') {
      signOut(auth)
        .then(() => {
          console.log('Logout successful');
        })
        .catch((error) => {
          console.error('Logout error:', error);
        });
    }
  };



  return (
      <><header>
        <div className='header-column'>
          <MovieSearch onSearch={handleSearch} />
        </div>
        <div className='header-column center-column'>
      <button className="button" id='generateButton' onClick={generate} disabled={isLoading}>
      {isLoading ? <LoadingSpinner /> : 'Generate'}
      </button>
      </div>
      <div className='header-column'>
      <Dropdown
        className="dropdown-container"
        onSelect={handleProfileMenuSelect}
        auto-close="true"
        >
        <Dropdown.Toggle variant="success" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true">
          Hello {currentUser ? currentUser.displayName || currentUser.email : 'Guest'}
          <span className='dropdown-arrow'>&#9660;</span>
        </Dropdown.Toggle>

        <Dropdown.Menu class="dropdown-menu" autoClose="true">
        <Dropdown.Item eventKey="favorites">
        <span>&#10084;</span> Favorites
        </Dropdown.Item>
        <Dropdown.Item eventKey="logout">
        <span>&#128274;</span> Logout
          </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
    <div className="container">
      <div className='container-column-poster'>
        <MoviePoster poster={movieData.poster} title={movieData.title} imdbId={movieData.imdbId} />
        </div>
        <div className='container-column-data'>
        <div className="content">
          <div className="content-left">
            <MovieDetails
              title={movieData.title}
              genre={movieData.genre}
              year={movieData.year}
              actors={movieData.actors}
              plot={movieData.plot}
              runtime={movieData.runtime} />
              <button className={`button_plus ${buttonPlusClass}`} onClick={addToFavorites}></button>

              <GenreFilter id='genreFilterButton' onSelectGenre={handleGenreSelect} />
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer-column">
        <h3>Contact</h3>
        <p>Created by: <a href="https://github.com/fernan17893">Fern</a></p>
        <p>API: <a href="https://www.themoviedb.org/documentation/api">The Movie Database API</a></p>
        <p>Powered by: <a href="https://firebase.google.com/">Firebase</a></p>
        </div>
        <img className='logo_img' src={logo} alt="logo" />
      </div>
      

      </div></>
  );
}

export default MovieGenerator;
