const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  // Verificar se o email já existe
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  // Hash (criptografar) a senha antes de salvar
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Criar um novo usuário
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
