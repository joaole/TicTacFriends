import React from 'react';
import './style/styles.css';
import Game from './componets/Game.js';
import Login from './componets/login_resgistro.js'

export default function App() {
  return (
    <div className="App">
      <h1>TicTacFriends O Clássico da Ilha</h1>
      <Login />
      <Game />
    </div>
  );
}
