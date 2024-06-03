import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePlay.css';

const CreatePlay = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [playlistType, setPlaylistType] = useState('private');
  const [playlists, setPlaylists] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`https://movieserver-nn44.onrender.com/api/playlists/user/${userId}`);
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      // Check if the playlist name already exists for the selected type
      const existingPlaylist = playlists.find((playlist) => {
        return playlist.name === playlistName && playlist.type === playlistType;
      });
      if (existingPlaylist) {
        toast.error('Playlist with the same name already exists for this type.');
        return;
      }

      // Continue with creating the playlist
      const response = await axios.post('https://movieserver-nn44.onrender.com/api/playlists', {
        userId,
        name: playlistName,
        description,
        type: playlistType,
      });
      if (response.status === 201) {
        toast.success('Playlist created successfully!');
        setPlaylistName('');
        setDescription('');
        setPlaylistType('private');
        setPlaylists([...playlists, response.data]); // Update playlists state with new playlist
      } else {
        toast.error('Failed to create playlist.');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('An error occurred while creating the playlist.');
    }
  };

  return (
    <div className="create-playlist-container">
      <div className="create-playlist-form-container">
        <h2>Create a New Playlist</h2>
        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
          <div className="form-group">
            <input
              type="text"
              id="playlistName"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select
              id="playlistType"
              value={playlistType}
              onChange={(e) => setPlaylistType(e.target.value)}
            >
              <option value="private">Private Playlist</option>
              <option value="public">Public Playlist</option>
            </select>
          </div>
          <div className="form-group">
            <textarea
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="create-button">Create Playlist</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreatePlay;
