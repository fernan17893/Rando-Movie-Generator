// MovieGenerator.js
import React, { useState } from 'react';
import MovieDetails from './MovieDetails';
import MoviePoster from './MoviePoster';
import LoadingSpinner from './LoadingSpinner';
import GenreFilter from './GenreFilter';
import defaultPoster from '../assets/no-poster-available.jpg';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../index.css';

function MovieGenerator() {
  const [movieData, setMovieData] = useState({
    title: 'The Mask',
    genre: 'Action, Comedy, Crime',
    year: 1994,
    actors: 'Jim Carrey, Cameron Diaz, Peter Rieger',
    plot:
      "Timid bank clerk, Stanley Ipkiss (Jim Carrey). Unfortunately, he's too gentle, and is unable to handle confrontations. After one of the worst days, he finds a mask which depicts Loki, the Norse god of mischief.",
    runtime: '3 min',
    poster: defaultPoster,
  });

  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  const apiKey = '08396464e93e24a2d2e4e071a16d2788';

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
      console.log(validMovieData);
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Logout successful');
      })
      .catch((error) => {
        // An error happened.
        console.error('Logout error:', error);
      });
    console.log('Logout clicked');
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


  return (
    <div className="container">
      <div className="header">
        <h1>RANDO: A MOVIE GENERATOR</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <MoviePoster poster={movieData.poster} title={movieData.title} imdbId={movieData.imdbId} />
      </div>
      <button className="button" onClick={generate} disabled={isLoading}>
        {isLoading ? <LoadingSpinner /> : 'Generate'}
      </button>
      <GenreFilter onSelectGenre={handleGenreSelect} />
      <div className="content">
        <div className="content-left">
          <MovieDetails
            title={movieData.title}
            genre={movieData.genre}
            year={movieData.year}
            actors={movieData.actors}
            plot={movieData.plot}
            runtime={movieData.runtime}
          />
        </div>
      </div>
    </div>
  );
}

export default MovieGenerator;
