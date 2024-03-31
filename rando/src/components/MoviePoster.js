// components/MoviePoster.js
import React from 'react';
import '../index.css';

function MoviePoster({ poster, title, imdbId }) {

  const generateIMDBLink = (imdbId) => {

    return `https://www.imdb.com/title/${imdbId}/`;
  };

  const handlePosterClick = () => {
    const imdbLink = generateIMDBLink(imdbId);
    window.open(imdbLink, '_blank');
  };

  return (
   <div className='poster-container'>
    <img className="poster" src={poster} alt={title} onClick={handlePosterClick}/>
    </div>
  );
}

export default MoviePoster;
