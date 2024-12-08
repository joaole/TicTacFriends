const express = require('express');
const router = express.Router();

let challenges = {}; // Armazena desafios pendentes no formato { player1: player2 }

router.post('/challenge', (req, res) => {
  const { challenger, opponent } = req.body;

  if (!challenges[opponent]) {
    // Primeiro jogador desafia
    challenges[challenger] = opponent;
    res.json({ message: `Aguardando ${opponent} aceitar o desafio.` });
  } else if (challenges[opponent] === challenger) {
    // Ambos confirmaram, jogo começa
    const io = req.app.get('io');
    io.to(challenger).emit('gameReady', { opponent });
    io.to(opponent).emit('gameReady', { opponent: challenger });
    delete challenges[opponent];
    delete challenges[challenger];
    res.json({ message: 'Jogo iniciado!' });
  } else {
    res.status(400).json({ message: 'Aguardando outro jogador aceitar o desafio.' });
  }
});

module.exports = router;
