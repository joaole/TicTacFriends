const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');
const User = require('../models/User'); // Modelo do usuário

// Rota para obter dados do usuário autenticado
router.get('/', checkToken, userController.getUserData);

// Rota para atualizar a imagem de perfil
router.put('/updateProfileImage', checkToken, userController.updateProfileImage);

// Rota para atualizar informações do usuário (nome, email, senha, imagem)
router.put('/update/:id', checkToken, userController.updateUser);

// Rota para obter as imagens permitidas de perfil
router.get('/profile-images', checkToken, userController.getAllowedProfileImages);

// Rota para buscar ID pelo nome ou e-mail
router.get('/findByName/:identifier', async (req, res) => {
  const { identifier } = req.params;

  try {
    const user = await User.findOne({
      $or: [{ name: identifier }, { email: identifier }], // Busca por nome ou e-mail
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json({ id: user._id }); // Retorna o ID do usuário
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
