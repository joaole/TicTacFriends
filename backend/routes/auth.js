const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi'); // Optional: for validation

// Joi schema for validation (Optional, but useful for input validation)
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  // Validate the data before saving a user (optional, but useful)
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Verificar se o email já existe
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  // Hash (criptografar) a senha antes de salvar
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Criar um novo usuário
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Salvar o usuário no banco de dados
    const savedUser = await user.save();
    res.send({ message: 'User registered successfully', userId: savedUser._id });
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

module.exports = router;
