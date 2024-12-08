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

// Middleware para aceitar JSON nas requisições
app.use(express.json());

// Importa controladores de rota
const authController = require('./controllers/authController');
const userRoutes = require('./routes/userRoutes');

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

// Configuração do Socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);

  socket.on('message', (message) => {
    io.emit('message', message); // Envia a mensagem para todos os usuários conectados
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Rotas da API
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo!' });
});

app.use('/auth', authController);
app.use('/user', userRoutes);

// Inicializa o servidor na porta 5000
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const gameRoutes = require('./routes/gameRoutes');
app.use('/game', gameRoutes);
