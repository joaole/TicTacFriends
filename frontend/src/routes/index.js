import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import existing components
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';

// Import new Game component
import Game from '../components/Game';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
