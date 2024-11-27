import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link do react-router-dom
import './styles/Header.css';

function Header() {
    return (
        <header className="navbar">
            {/* Link envolvendo a logo para redirecionar para a home */}
            <Link to="/" className="logo">
                <div className="logo">
                    <span className="logo-tic">Tic</span>
                    <span className="logo-tac">Tac</span>
                    <span className="logo-friends">Friends</span>
                </div>
            </Link>
            <nav>
                <ul className="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#sobre">Sobre</a></li>
                </ul>
            </nav>
            <div className="auth-buttons">
                <Link to="auth/login">
                    <button className="login-button">LOGIN</button>
                </Link>
                <Link to="auth/register">
                    <button className="register-button">CADASTRO</button>
                </Link>
            </div>
        </header>
    );
}

export default Header;
