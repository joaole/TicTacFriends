const express = require('express');
const router = express.Router();
const { createGame, getGameState, updateGameState, getGameHistory } = require('../controllers/gameController');
const checkToken = require('../middlewares/checkToken'); // Certifique-se de que o nome e o caminho estão corretos

// Rota para criar uma nova partida
router.post('/create', checkToken, createGame);

// Rota para obter o estado atual do jogo
router.get('/:gameId', checkToken, getGameState);

// Rota para atualizar o estado do jogo
router.put('/:gameId', checkToken, updateGameState);

// Rota para recuperar o histórico de partidas de um usuário
router.get('/history/:userId', checkToken, getGameHistory);

module.exports = router;
