// Hero.js
import React from 'react';
import './styles/Hero.css';
import img from './img/hero_img.png'

const Hero = () => {
  return (
    <section id='home'className="hero">
      <div className="hero-content">
        <h1>
          Junte-se à diversão, <br />
          desafie seus amigos no <br />
          clássico jogo da velha!
        </h1>
        <a className="hero-button">Jogue Agora!</a>
      </div>
      <div className="hero-image">
        <img src={img} alt="Tic Tac Toe game" />
      </div>
    </section>
  );
};

export default Hero;
