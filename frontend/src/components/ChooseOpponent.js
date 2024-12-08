import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChooseOpponent = () => {
  const { user } = useAuth();
  const [opponentName, setOpponentName] = useState('');
  const [status, setStatus] = useState('');
  const [isGameReady, setIsGameReady] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      console.warn('Usuário não autenticado ou não carregado.');
      setStatus('Carregando informações do usuário. Aguarde...');
      return;
    }

    const newSocket = io('http://localhost:5000'); // Conecta ao backend
    setSocket(newSocket);

    newSocket.emit('join', user.name); // Entra na sala do usuário no socket

    newSocket.on('gameReady', ({ opponent }) => {
      setIsGameReady(true);
      setStatus(`Jogo pronto! Seu adversário é ${opponent}.`);
    });

    newSocket.on('connect_error', () => {
      setStatus('Erro de conexão com o servidor. Tente novamente mais tarde.');
    });

    return () => {
      newSocket.disconnect();
      console.log('Socket desconectado.');
    };
  }, [user]);

  const handleChallenge = async () => {
    if (!user) {
      setStatus('Usuário não autenticado. Faça login novamente.');
      console.error('Usuário não autenticado.');
      return;
    }

    if (!opponentName.trim()) {
      setStatus('Por favor, insira o nome ou e-mail de um adversário.');
      return;
    }

    const cleanedName = opponentName.trim();

    try {
      // Buscar ID pelo nome ou e-mail
      const response = await axios.get(`http://localhost:5000/user/findByName/${encodeURIComponent(cleanedName)}`);
      const opponentId = response.data.id;

      // Enviar desafio
      const challengeResponse = await axios.post('http://localhost:5000/api/challenge', {
        challenger: user.name,
        opponentId,
      });

      setStatus(challengeResponse.data.message);
    } catch (error) {
      console.error('Erro ao desafiar o jogador:', error);
      setStatus('Erro ao desafiar o jogador. Verifique o nome ou e-mail e tente novamente.');
    }
  };

  if (!user) {
    return <p>Carregando informações do usuário...</p>;
  }

  if (isGameReady) {
    return (
      <div>
        <h3>{status}</h3>
        <p>Redirecionando para o jogo...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Desafiar um Amigo</h2>
      <input
        type="text"
        placeholder="Nome do adversário"
        value={opponentName}
        onChange={(e) => setOpponentName(e.target.value)}
      />
      <button onClick={handleChallenge}>Desafiar</button>
      <p>{status}</p>
    </div>
  );
};

export default ChooseOpponent;
