const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkToken = require('../middlewares/checkToken');

// Rota privada que requer autenticação JWT
router.get('/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    // Verifica se o usuário existe
    const user = await User.findById(id, '-password');  // Exclui o campo senha
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.status(200).json({ user });
});

module.exports = router;
