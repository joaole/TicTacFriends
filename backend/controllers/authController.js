const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuário (POST /auth/register)
router.post('/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // Validações
    if (!name) {
        return res.status(400).json({ msg: 'Nome é obrigatório' });
    }

    if (!email) {
        return res.status(400).json({ msg: 'Email é obrigatório' });
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Por favor, forneça um e-mail válido' });
    }

    // Validação de senha (mínimo 6 caracteres, uma letra maiúscula, um número e um caractere especial)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ msg: 'A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, um número e um caractere especial.' });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ msg: 'As senhas não coincidem.' });
    }

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email: email });
    if (userExists) {
        return res.status(400).json({ msg: 'E-mail já cadastrado.' });
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria um novo usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({ msg: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde.' });
    }
});

// Login de usuário (POST /auth/login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validações
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória' });
    }

    // Verifica se o usuário existe
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida.' });
    }

    try {
        // Gera o token JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ msg: 'Erro interno: chave secreta JWT não definida.' });
        }

        const token = jwt.sign(
            { id: user._id },
            secret,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token });
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde.' });
    }
});

module.exports = router;
