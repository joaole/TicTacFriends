import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ChooseOpponent = () => {
  const { user } = useAuth(); // Obtém as informações do usuário logado
  const [opponentName, setOpponentName] = useState('');
  const [status, setStatus] = useState('');
  const [isGameReady, setIsGameReady] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return; // Se o usuário não estiver disponível, interrompa o useEffect

    const newSocket = io('http://localhost:5000'); // Conecta ao backend
    setSocket(newSocket);

    newSocket.emit('join', user.name); // Entra na sala do usuário
    console.log(`Usuário conectado à sala: ${user.name}`);

    newSocket.on('gameReady', ({ opponent }) => {
      setIsGameReady(true);
      setStatus(`Jogo pronto! Seu adversário é ${opponent}.`);
    });

    newSocket.on('connect_error', () => {
      setStatus('Erro de conexão com o servidor. Tente novamente mais tarde.');
    });

    return () => {
      newSocket.disconnect(); // Desconecta ao desmontar o componente
      console.log('Socket desconectado.');
    };
  }, [user]);

  if (!user) {
    return <div>Carregando informações do usuário...</div>;
  }

  const handleChallenge = async () => {
    if (!opponentName.trim()) {
      setStatus('Por favor, insira o nome de um adversário.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/challenge', {
        challenger: user.name,
        opponent: opponentName,
      });
      setStatus(response.data.message);
    } catch (error) {
      console.error('Erro ao desafiar o jogador:', error);
      setStatus('Erro ao desafiar o jogador. Verifique o nome e tente novamente.');
    }
  };

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
