import React, { useState } from "react";

function MovieSearch({ onSearch}) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        onSearch(searchQuery);
    };

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="movie-search">
            <input
                className="search-input"
                type="text"
                placeholder="Search for a movie..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={(event) => {handleKeyDown(event)}}
            />
        </div>
    );

    

}

export default MovieSearch;