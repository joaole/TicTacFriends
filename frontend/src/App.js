import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; // Navbar pública
import PrivateNavbar from './components/PrivateHeader'; // Navbar privada
import Login from './components/Login';
import Partidas from './components/Partidas';
import Hero from './components/Hero'; // Importando o componente Hero
import Sobre from './components/Sobre'; // Importando o componente Sobre
import PrivateRoute from './components/PrivateRoute';
import User from '../../backend/models/User';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      {/* Exibe a navbar pública ou privada com base no estado de autenticação */}
      {token ? <PrivateNavbar onLogout={handleLogout} /> : <Header />}

      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/auth/login"
          element={
            token ? <Navigate to="/user" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/auth/register"
          element={
            token ? <Navigate to="/user" /> : <Register onRegister={handleLogin} />
          }
        />
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/" />
            ) : (
              <>
                <Hero />
                <Sobre />
              </>
            )
          }
        />

        {/* Rotas privadas */}
        <Route
          path="/user"
          element={
            <PrivateRoute token={token}>
              <User />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
