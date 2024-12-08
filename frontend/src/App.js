import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; // Navbar pública
import PrivateNavbar from './components/PrivateHeader'; // Navbar privada
import Login from './components/Login'; // Componente de login
import Hero from './components/Hero'; // Componente Hero
import Sobre from './components/Sobre'; // Componente Sobre
import PrivateRoute from './components/PrivateRoute'; // Componente de rota privada
import Register from './components/Register'; // Componente de registro
import User from './components/User'; // Componente de usuário (frontend)

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Função para lidar com o login e salvar o token no localStorage
  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  // Função para lidar com o logout e remover o token do localStorage
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      {/* Navbar pública ou privada com base no estado de autenticação */}
      {token ? <PrivateNavbar onLogout={handleLogout} /> : <Header />}

      <Routes>
        {/* Página inicial pública (Hero e Sobre) */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Sobre />
            </>
          }
        />

        {/* Rotas públicas adicionais */}
        <Route
          path="/auth/login"
          element={
            token ? (
              <Navigate to="/user" />
            ) : (
              <Login
                onLogin={(token) => {
                  handleLogin(token);
                  window.location.href = '/user'; // Redireciona após login
                }}
              />
            )
          }
        />
        <Route
          path="/auth/register"
          element={
            token ? (
              <Navigate to="/user" />
            ) : (
              <Register
                onRegister={(token) => {
                  handleLogin(token);
                  window.location.href = '/user'; // Redireciona após cadastro
                }}
              />
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
