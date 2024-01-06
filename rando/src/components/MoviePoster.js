// components/MoviePoster.js
import React from 'react';

function MoviePoster({ poster, title, imdbId }) {

  const generateIMDBLink = (imdbId) => {

    return `https://www.imdb.com/title/${imdbId}/`;
  };

  const handlePosterClick = () => {
    const imdbLink = generateIMDBLink(imdbId);
    window.open(imdbLink, '_blank');
  };

  return (
   <div className="poster" onClick={handlePosterClick}>
    <img src={poster} alt={title} />
    </div>
  );
}

export default MoviePoster;
