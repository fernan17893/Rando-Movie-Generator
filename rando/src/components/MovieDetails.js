// components/MovieDetails.js
import React from 'react';
import '../App.css';

function MovieDetails({ title, genre, year, actors, plot, runtime }) {
  return (
    <div className="result-area">
      <p className="movie-title">{title}</p>
      <p className="movie-genre">{genre}</p>
      <p className="movie-year">{year}</p>
      <p className="actors">{actors}</p>
      <p className="movie-plot">{plot}</p>
      <p className="movie-runtime">{runtime}</p>
    </div>
  );
}

export default MovieDetails;
