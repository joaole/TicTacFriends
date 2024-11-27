const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');

// Rota para obter dados do usuário autenticado
router.get('/', checkToken, userController.getUserData);

// Rota para atualizar a imagem de perfil
router.put('/updateProfileImage', checkToken, userController.updateProfileImage);

// Rota para atualizar informações do usuário (nome, email, senha, imagem)
router.put('/update/:id', checkToken, userController.updateUser);

// Rota para obter as imagens permitidas de perfil
router.get('/profile-images', checkToken, userController.getAllowedProfileImages);

module.exports = router;
