const mongoose = require('mongoose');

// Definir o schema (modelo) de usuário
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    unique: true  // Garantir que o email seja único
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024  // Armazenar a senha criptografada, então pode ser maior
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Exportar o modelo
module.exports = mongoose.model('User', userSchema);
