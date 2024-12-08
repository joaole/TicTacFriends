require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Necessário para usar express e socket.io juntos
const { Server } = require('socket.io');
const path = require('path');

// Inicializa app e servidor HTTP
const app = express();
const server = http.createServer(app);

// Configura Socket.io
const io = new Server(server, {
  cors: { origin: '*' },
});

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());
app.use(express.json());

// Importa controladores de rota
const authController = require('./controllers/authController');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const challengeRoutes = require('./routes/challengeRoutes');

// Conexão com o MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Verifica se as variáveis de ambiente estão configuradas
if (!dbUser || !dbPassword) {
  console.error('Variáveis de ambiente DB_USER e DB_PASS são obrigatórias.');
  process.exit(1);
}

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.gbv0j.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Gerenciamento de desafios
let challenges = {}; // Armazena desafios no formato { player1: player2 }

// Configuração do Socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  // Associar o socket ao usuário logado
  socket.on('join', (username) => {
    if (!username) {
      console.error('Nome de usuário ausente no evento join.');
      return;
    }
    socket.join(username); // Cria uma sala para o usuário
    socket.username = username; // Associa o username ao socket
    console.log(`${username} entrou na sala ${username}`);
  });

  // Gerenciar desafio entre jogadores
  socket.on('challenge', ({ challenger, opponent }) => {
    if (!challenger || !opponent) {
      console.error('Challenger ou opponent ausentes no desafio.');
      socket.emit('error', { message: 'Dados inválidos para desafio.' });
      return;
    }

    if (challenger === opponent) {
      socket.emit('error', { message: 'Você não pode desafiar a si mesmo.' });
      return;
    }

    if (!challenges[opponent]) {
      // Primeiro jogador desafia
      challenges[challenger] = opponent;
      io.to(opponent).emit('challenged', { challenger });
      console.log(`${challenger} desafiou ${opponent}`);
    } else if (challenges[opponent] === challenger) {
      // Ambos confirmaram, jogo começa
      io.to(challenger).emit('gameReady', { opponent });
      io.to(opponent).emit('gameReady', { opponent: challenger });
      delete challenges[opponent];
      delete challenges[challenger];
      console.log(`Jogo iniciado entre ${challenger} e ${opponent}`);
    } else {
      socket.emit('waiting', { message: 'Aguardando o outro jogador aceitar o desafio.' });
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
    if (socket.username) {
      const opponent = challenges[socket.username];
      if (opponent) {
        // Notifica o oponente que o jogador desconectou
        io.to(opponent).emit('opponentDisconnected', {
          message: `${socket.username} desconectou-se.`,
        });
        delete challenges[opponent];
      }
      delete challenges[socket.username];
      console.log(`Desafios associados ao usuário ${socket.username} foram limpos.`);
    }
  });
});

// Rotas da API
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo!' });
});

app.use('/auth', authController);
app.use('/user', userRoutes);
app.use('/game', gameRoutes);
app.use('/api', challengeRoutes); // Incluindo as rotas de desafio

// Inicializa o servidor na porta 5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
