import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MovieDetails.css';

const MovieDetails = ({ imdbID, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=6b7cdb35`);
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  return (
    <div className="movie-details">
      {movieDetails && (
        <>
          <button className="close-button" onClick={onClose}>Close</button>
          <div className="movie-details-content">
            {movieDetails.Poster && movieDetails.Poster !== 'N/A' && (
              <img src={movieDetails.Poster} alt={movieDetails.Title} />
            )}
            <h3>{movieDetails.Title}</h3>
            <div className="details-grid">
              <p><strong>Year:</strong> {movieDetails.Year}</p>
              <p><strong>Rated:</strong> {movieDetails.Rated}</p>
              <p><strong>Released:</strong> {movieDetails.Released}</p>
              <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
              <p><strong>Genre:</strong> {movieDetails.Genre}</p>
              <p><strong>Director:</strong> {movieDetails.Director}</p>
              <p><strong>Writer:</strong> {movieDetails.Writer}</p>
              <p><strong>Actors:</strong> {movieDetails.Actors}</p>
              <p><strong>Language:</strong> {movieDetails.Language}</p>
              <p><strong>Country:</strong> {movieDetails.Country}</p>
              <p><strong>Awards:</strong> {movieDetails.Awards}</p>
              <p><strong>BoxOffice:</strong> {movieDetails.BoxOffice}</p>
              <p><strong>IMDb Rating:</strong> {movieDetails.imdbRating}</p>
              <p><strong>IMDb Votes:</strong> {movieDetails.imdbVotes}</p>
              {movieDetails.Type === 'series' && (
                <p><strong>Total Seasons:</strong> {movieDetails.totalSeasons}</p>
              )}
            </div>
            <div className="plot-section">
              <p><strong>Plot:</strong> {movieDetails.Plot}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
