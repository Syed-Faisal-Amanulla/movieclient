import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicPlaylist.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

const MyPlaylistsPublic = () => {
  const [publicPlaylists, setPublicPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMovies, setPlaylistMovies] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/playlists/user/${userId}`);
        const playlists = response.data;
        const uniquePublicPlaylists = playlists.filter(playlist => playlist.type === 'public');
        setPublicPlaylists(uniquePublicPlaylists);
      } catch (error) {
        console.error('Error fetching public playlists:', error);
      }
    };

    if (userId) {
      fetchPublicPlaylists();
    }
  }, [userId]);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (uid) {
      setUserId(uid);
    }
  }, []);

  const handleCardClick = (playlist) => {
    setSelectedPlaylist(playlist);
    const uniqueMovies = [...new Set(playlist.movies.map(movie => movie.title))];
    const moviesData = uniqueMovies.map(title => {
      const movie = playlist.movies.find(m => m.title === title);
      return {
        title: movie.title,
        poster: movie.poster
      };
    });
    setPlaylistMovies(moviesData);
  };

  const closePopup = () => {
    setSelectedPlaylist(null);
    setPlaylistMovies([]);
  };

  const handleSharePlaylist = (playlist) => {
    const playlistData = {
      id: playlist._id,
      name: playlist.name,
      description: playlist.description,
      movies: playlist.movies.map(movie => ({
        movieId: movie.movieId,
        title: movie.title,
        poster: movie.poster
      }))
    };
    const encodedData = encodeURIComponent(JSON.stringify(playlistData));
    const sharableLink = `http://localhost:3000/plays/?data=${encodedData}`;
    console.log('Sharable link:', sharableLink);
    window.open(sharableLink, '_blank');
  };

  return (
    <div className="my-playlists-container">
      <h2>My Public Playlists</h2>
      <div className="playlist-list">
        {publicPlaylists.map((playlist) => (
          <div 
            key={playlist._id} 
            className="playlist-card" 
            onClick={() => handleCardClick(playlist)}
          >
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
            <button 
              className="share-button" 
              onClick={(e) => { e.stopPropagation(); handleSharePlaylist(playlist); }}
            >
              <FontAwesomeIcon icon={faShareAlt} />
            </button>
          </div>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="playlist-popup">
          <div className="playlist-popup-content">
            <span className="close-popup" onClick={closePopup}>&times;</span>
            <h3>{selectedPlaylist.name}</h3>
            <p>{selectedPlaylist.description}</p>
            <h4>Movies:</h4>
            <div className="movies-container">
              {playlistMovies.map((movie, index) => (
                <div key={index} className="fmovie-card">
                  <img src={movie.poster} alt={movie.title} />
                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylistsPublic;
