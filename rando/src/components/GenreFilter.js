import React, { useState } from 'react';

const GenreFilter = ({ onSelectGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onSelectGenre(genre);
  };

  return (
    <div className="genre-filter">
      <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
        <option value="">All Genres</option>
        <option value="Action">Action</option>
        <option value="Comedy">Comedy</option>
        <option value="Crime">Crime</option>
        <option value="Drama">Drama</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Horror">Horror</option>
        <option value="Mystery">Mystery</option>
        <option value="Romance">Romance</option>
      </select>
    </div>
  );
};

export default GenreFilter;
