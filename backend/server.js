require('dotenv').config();  // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configuração para aceitar JSON nas requisições
app.use(express.json());

// Importa middlewares e controladores
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');

// Conexão com o MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.gbv0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000 e conectado ao banco de dados!');
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Rota aberta (GET /) - Exibe uma mensagem de boas-vindas
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo' });
});

// Rotas de autenticação
app.use('/auth', authController);

// Rotas de usuário
app.use('/user', userController);

