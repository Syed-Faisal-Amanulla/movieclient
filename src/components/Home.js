import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Import CSS file for styling
import placeholderImage from './placeholder.jpg'; // Import placeholder image
import MovieDetails from './MovieDetails';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

const Home = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [dropdownMovieId, setDropdownMovieId] = useState(null); // State to manage which movie's dropdown is visible
  const [page, setPage] = useState(1); // State to keep track of the current page
  const [totalResults, setTotalResults] = useState(0); // State to keep track of total results

  const fetchMovies = async (query, page) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${query || 'movie'}&apikey=6b7cdb35&page=${page}`);
      const newMovies = response.data.Search || [];
      const sortedMovies = newMovies.sort((a, b) => b.Year - a.Year);

      // If this is the first page, replace the movies list, otherwise append to it
      if (page === 1) {
        setMovies(sortedMovies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...sortedMovies]);
      }

      // Set total results on the first page fetch
      if (page === 1 && response.data.totalResults) {
        setTotalResults(parseInt(response.data.totalResults, 10));
      }
    } catch (error) {
      console.error('Error fetching data from OMDb API', error);
    }
  };

  useEffect(() => {
    fetchMovies(query, page);
  }, [query, page]);

  const uid = localStorage.getItem("userId");
  useEffect(() => {
    // Fetch user playlists (assuming the user is logged in and you have user ID)
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`https://movieserver-nn44.onrender.com/api/playlists/user/${uid}`); // Replace USER_ID with the actual user ID
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists', error);
      }
    };

    if (uid) {
      fetchPlaylists();
    }
  }, [uid]);


  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page on new search
    setQuery(e.target.value);
  };

  const loadMoreMovies = () => {
    if (movies.length < totalResults) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const openMovieDetails = (movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieDetails = () => {
    setSelectedMovie(null);
  };
  const handleAddToPlaylist = async (movie, playlistId) => {
    try {
      // Log movie and playlist details
      console.log('Adding movie to playlist');
      console.log('Movie ID:', movie.imdbID);
      console.log('Movie Title:', movie.Title);
      console.log('Movie Poster:', movie.Poster);
      console.log('Playlist ID:', playlistId);
  
      // Make the API request
      const response = await axios.put(`https://movieserver-nn44.onrender.com/api/playlists/${playlistId}/add-movie`, {
        movieId: movie.imdbID,
        title: movie.Title,
        poster: movie.Poster,
      });
  
      // Log the response from the server
      console.log('Server response:', response.data);
  
      // Show success message
      toast.success(`Added ${movie.Title} to playlist`);
      setDropdownMovieId(null); // Reset the dropdown visibility
    } catch (error) {
      // Log error details
      console.error('Error adding movie to playlist:', error);
      console.error('Error response data:', error.response ? error.response.data : 'No response data');
  
      // Show error message
      toast.error('Failed to add movie to playlist');
    }
  };
  
  
  
  

  const toggleDropdown = (movieId) => {
    if (dropdownMovieId === movieId) {
      setDropdownMovieId(null);
    } else {
      setDropdownMovieId(movieId);
    }
  };

  return (
    <div className="home-container">
      <ToastContainer /> {/* Add ToastContainer here */}
      <div className="search-container">
        <form className="flex" onSubmit={(e) => e.preventDefault()} style={{ marginTop: '20px' }}>
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for movies..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      <div className="mmovies-container">
        {movies.length > 0 &&
          movies.map((movie) => (
            <div key={movie.imdbID} className="mmovie-card">
              <img
                src={movie.Poster === 'N/A' ? placeholderImage : movie.Poster}
                alt={movie.Title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.Title}</h3>
                <button onClick={() => openMovieDetails(movie)} className="details-button">Details</button>
                <div className="add-to-playlist">
                  <button
                    className="add-button"
                    onClick={() => toggleDropdown(movie.imdbID)} // Toggle dropdown visibility for the specific movie
                  >
                    +
                  </button>
                  <span className="add-text">Add to Playlist</span>
                  {uid !== null ? (
                    dropdownMovieId === movie.imdbID && (
                      <div className="playlist-dropdown">
                        <select
                          value={selectedPlaylist}
                          onChange={(e) => setSelectedPlaylist(e.target.value)}
                        >
                          <option value="">Select Playlist</option>
                          {playlists.map((playlist) => (
                            <option key={playlist._id} value={playlist._id}>
                              {playlist.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddToPlaylist(movie, selectedPlaylist)}
                          disabled={!selectedPlaylist}
                        >
                          Add
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="login-first">Login to Add to PlayList</div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      {movies.length < totalResults && (
        <div className="load-more-container">
          <button onClick={loadMoreMovies} className="load-more-button">Load More</button>
        </div>
      )}
      {selectedMovie && <MovieDetails imdbID={selectedMovie.imdbID} onClose={closeMovieDetails} />}
    </div>
  );
};

export default Home;
