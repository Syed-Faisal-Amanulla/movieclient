import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const uid = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2>Movie Library</h2>
      </Link>
      <div className="nav-links">
        {uid !== null ? (
          <>
            <Link to="/createplaylist">Create Playlist</Link>
            <Link to="/myplaylists">My Public Playlists</Link>
            <Link to="/myplaylist">My Private Playlists</Link>
         
            <button onClick={handleSignOut} className="signout-button">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
