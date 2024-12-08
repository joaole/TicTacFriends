const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  board: { type: [String], default: Array(9).fill(null) }, // Tabuleiro (9 células)
  currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ongoing', 'finished'], default: 'ongoing' }, // Status do jogo
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Jogador vencedor
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
