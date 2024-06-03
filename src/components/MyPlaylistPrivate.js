import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPlaylists.css';

const MyPlaylistsPrivate = () => {
  const [privatePlaylists, setPrivatePlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMovies, setPlaylistMovies] = useState([]);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  const uid = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    const fetchPrivatePlaylists = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/playlists/user/${uid}`);
        const playlists = response.data;
        setPrivatePlaylists(playlists.filter(playlist => playlist.type === 'private'));
      } catch (error) {
        console.error('Error fetching private playlists:', error);
      }
    };

    if (uid) { // Check if uid is available before making the request
      fetchPrivatePlaylists();
    }
  }, [uid]); // Add uid to the dependencies array

  const handleCardClick = (playlist) => {
    setSelectedPlaylist(playlist);
    fetchMovieDetails(playlist.movies);
  };

  const fetchMovieDetails = async (movies) => {
    try {
      const uniqueMovieIds = Array.from(new Set(movies.map((movie) => movie.movieId)));
      const movieDetails = await Promise.all(
        uniqueMovieIds.map(async (id) => {
          const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=6b7cdb35`);
          return response.data;
        })
      );
      setPlaylistMovies(movieDetails);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const closePopup = () => {
    setSelectedPlaylist(null);
    setPlaylistMovies([]);
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setUpdatedName(playlist.name);
    setUpdatedDescription(playlist.description);
  };

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/playlists/${editingPlaylist._id}`, {
        name: updatedName,
        description: updatedDescription
      });
      if (response.status === 200) {
        const updatedPlaylists = privatePlaylists.map((playlist) => {
          if (playlist._id === editingPlaylist._id) {
            return response.data;
          }
          return playlist;
        });
        setPrivatePlaylists(updatedPlaylists);
        setEditingPlaylist(null);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  return (
    <div className="my-playlists-container">
      <h2>My Private Playlists</h2>
      <div className="playlist-list">
        {privatePlaylists.map((playlist) => (
          <div 
            key={playlist._id} 
            className="playlist-card" 
            onClick={() => handleCardClick(playlist)}
          >
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
            <button onClick={(e) => { e.stopPropagation(); handleEditPlaylist(playlist); }}>Edit</button>
          </div>
        ))}
      </div>

      {editingPlaylist && (
        <div className="edit-form">
          <h3>Edit Playlist</h3>
          <form onSubmit={handleUpdatePlaylist}>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              required
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              required
            ></textarea>
            <button type="submit">Save</button>
            <button onClick={() => setEditingPlaylist(null)}>Cancel</button>
          </form>
        </div>
      )}

      {selectedPlaylist && (
        <div className="playlist-popup">
          <div className="playlist-popup-content">
            <span className="close-popup" onClick={closePopup}>&times;</span>
            <h3>{selectedPlaylist.name}</h3>
            <p>{selectedPlaylist.description}</p>
            <h4>Movies:</h4>
            <ul>
              {playlistMovies.map((movie) => (
                <li key={movie.imdbID}>
                  <img src={movie.Poster} alt={movie.Title} />
                  <p>{movie.Title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylistsPrivate;
