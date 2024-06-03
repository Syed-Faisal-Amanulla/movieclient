import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Add import for BrowserRouter
import MyPlaylistsPrivate from './components/MyPlaylistPrivate';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import ForgotPass from './components/ForgotPass';
import Verify from './components/Verify';
import ResetPass from './components/ResetPass';
import CreatePlaylist from './components/CreatePlaylist';
import MyPlaylists from './components/MyPlaylists';
import Navbar from './components/Navbar';
import PlaylistDetails from './components/PlaylistDetails';
import PlaylistPage from './components/PlaylistPage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/createplaylist" element={<CreatePlaylist />} />
        <Route path="/myplaylists" element={<MyPlaylists />} />
        <Route path="/playlists/:id" element={<PlaylistDetails />} />
        <Route path="/myplaylist" element={<MyPlaylistsPrivate />} />
        <Route path="/plays" element={<PlaylistPage />} />
       
      </Routes>
    </BrowserRouter>
  );
};

export default App;
