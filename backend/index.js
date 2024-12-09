require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const initializeWebSocket = require('./socket');

const app = express();

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());
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

// Rotas da API
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem-vindo!' });
});

app.use('/auth', authController);
app.use('/user', userRoutes);

// Inicializa o servidor HTTP
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Inicializa o WebSocket
initializeWebSocket(server);

// Inicializa o servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
