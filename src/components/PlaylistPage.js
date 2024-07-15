import React, { useEffect, useState } from 'react';
import './PlaylistPage.css'; // Import CSS file for styling

const PlaylistPage = () => {
  const [playlist, setPlaylist] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      try {
        const decodedData = decodeURIComponent(encodedData);
        const playlistData = JSON.parse(decodedData);
        const uniqueMovies = playlistData.movies.filter((movie, index, self) =>
          index === self.findIndex((m) => m.movieId === movie.movieId)
        );
        setPlaylist({ ...playlistData, movies: uniqueMovies });
      } catch (error) {
        console.error('Error decoding playlist data:', error);
      }
    }
  }, []);

  const handleCopyURL = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000); // Reset copied state after 3 seconds
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="playlist-container">
      <div className="playlist-details-card">
        <br/>
        <br/>
     SharableLink: <button style={{backgroundColor: 'red', color: 'white'}} onClick={handleCopyURL}>
  {copied ? 'URL Copied!' : 'Copy URL'}
</button>

        <h1 className="playlist-name">{playlist.name}</h1>
        <p className="playlist-description">{playlist.description}</p>
      </div>
    
     
      
      <div>
        {playlist.movies.map((movie, index) => (
          <div key={index} className="mmmovie-card" style={{ width: 'calc(75% - 16px)', marginRight: '16px', marginBottom: '16px', display: 'inline-block' }}>
            <div className="card" style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', height: '350px', width: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <img src={movie.poster} alt={movie.title} style={{ width: '100%', marginBottom: '8px', height: '90%' }} />
              <p className="mmmovie-title" style={{ margin: '0', color: 'black', fontWeight: 'bold' }}>{movie.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistPage;
