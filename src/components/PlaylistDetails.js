import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPlaylists.css';

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const uid = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/playlists/user/${uid}`);
        const publicPlaylists = response.data.filter((playlist) => playlist.type === 'public');

        // Remove duplicate movie IDs
        const uniquePlaylists = publicPlaylists.map((playlist) => {
          const uniqueMovies = Array.from(new Set(playlist.movies.map((movie) => movie.movieId)))
            .map((id) => playlist.movies.find((movie) => movie.movieId === id));
          return { ...playlist, movies: uniqueMovies };
        });

        setPlaylists(uniquePlaylists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (uid) {
      fetchPlaylists();
    }
  }, [uid]);

  return (
    <div className="my-playlists-container">
      <h2>My Public Playlists</h2>
      <div className="playlist-list">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card">
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
            <p>Type: {playlist.type}</p>
            <h4>Movies:</h4>
            <ul>
              {playlist.movies.map((movie) => (
                <li key={movie._id}>
                  <img src={movie.poster} alt={movie.title} />
                  <p>{movie.title}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPlaylists;
