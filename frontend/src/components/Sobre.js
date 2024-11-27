// Sobre.js
import React from 'react';
import './styles/Sobre.css';

const Sobre = () => {
  return (
    <section id='sobre' className="sobre">
      <div className="sobre-content">
        <p>
          Isso é um trabalho de faculdade bla bla blabla bla
          blabla bla blabla bla blabla <br />
          blabla bla blabla bla blabla bla <br />
          blabla bla blabla bla blabla <br />
          blabla bla blabla bla blabla bla
        </p>
      </div>
      <div className="sobre-info">
        <ul>
          <li>Nome 1</li>
          <li>Nome 2</li>
          <li>Nome 3</li>
          <li>Professor</li>
          <li>Matéria</li>
          <li>Ano</li>
        </ul>
      </div>
    </section>
  );
};

export default Sobre;
