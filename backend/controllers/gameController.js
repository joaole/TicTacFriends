const Game = require('../models/Game'); // Modelo do jogo
const User = require('../models/User'); // Modelo do usuário

// Criar uma nova partida
const createGame = async (req, res) => {
  try {
    const { player1, player2 } = req.body;

    const newGame = new Game({
      player1,
      player2,
      board: Array(9).fill(null),
      currentPlayer: player1,
      status: 'ongoing', // ongoing, finished
    });

    await newGame.save();

    res.status(201).json({ message: 'Jogo criado com sucesso!', gameId: newGame._id });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o jogo', error });
  }
};

// Obter o estado atual do jogo
const getGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar o estado do jogo', error });
  }
};

// Atualizar o estado do jogo
const updateGameState = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { board, currentPlayer, status } = req.body;

    const game = await Game.findByIdAndUpdate(
      gameId,
      { board, currentPlayer, status },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    res.status(200).json({ message: 'Estado do jogo atualizado', game });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o estado do jogo', error });
  }
};

// Obter histórico de partidas
const getGameHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const games = await Game.find({
      $or: [{ player1: userId }, { player2: userId }],
    });

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao recuperar o histórico de partidas', error });
  }
};

module.exports = {
  createGame,
  getGameState,
  updateGameState,
  getGameHistory,
};
