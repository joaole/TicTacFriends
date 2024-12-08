require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

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
  console.error("Variáveis de ambiente DB_USER e DB_PASS são obrigatórias.");
  process.exit(1);
}

mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.gbv0j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
    app.listen(5000, () => {
      console.log('Servidor rodando na porta 5000');
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Rota inicial
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem-vindo!' });
});

// Rotas de autenticação
app.use('/auth', authController);

// Rotas de usuário
app.use('/user', userRoutes);



