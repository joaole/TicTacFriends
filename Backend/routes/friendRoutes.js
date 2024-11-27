
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');

router.use(checkToken); // Proteger todas as rotas abaixo

router.post('/sendFriendRequest', userController.sendFriendRequest);
router.post('/acceptFriendRequest', userController.acceptFriendRequest);
router.post('/rejectFriendRequest', userController.rejectFriendRequest);
router.post('/removeFriend', userController.removeFriend);

module.exports = router;
