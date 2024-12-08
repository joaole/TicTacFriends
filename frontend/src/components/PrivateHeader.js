import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles/Header.css';

const PrivateHeader = ({ onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Tem certeza que deseja sair?');
    if (confirmLogout) {
      setIsLoggingOut(true);
      setTimeout(() => {
        onLogout(); // Chama a função de logout passada por prop
        setIsLoggingOut(false); // Reseta o estado do botão
      }, 1000);
    }
  };

  return (
    <header className="navbar">
      <NavLink to="/home" className="logo">
        <div className="logo">
          <span className="logo-tic">Tic</span>
          <span className="logo-tac">Tac</span>
          <span className="logo-friends">Friends</span>
        </div>
      </NavLink>
      <div className="auth-buttons">
        <button className="login-button" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Saindo...' : 'Logout'}
        </button>
        <button className="settings-button" aria-label="Configurações">
          <i className="fas fa-cog" aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
};

export default PrivateHeader;
