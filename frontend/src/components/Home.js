import React, { useState } from 'react';
import User from './User';
import FriendList from './FriendList';
import './styles/Home.css'; // Arquivo de estilos atualizado

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // Controla abertura do chat

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="home-container">
      {/* Avatar e informações do usuário */}
      <section className="user-section">
        <User />
        <button className="chat-toggle-btn" onClick={toggleChat}>
          {isChatOpen ? 'X' : <i className="fas fa-comments"></i>}
        </button>
      </section>

      {/* Lista de amigos e solicitações */}
      <section className="friend-list-section">
        <FriendList />
      </section>

      {/* Chat Lateral */}
      {isChatOpen && (
        <div className="chat-sidebar">
          <h3>Chat</h3>
          <p>Mensagens do amigo selecionado aparecerão aqui.</p>
          <button onClick={toggleChat}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default Home;
