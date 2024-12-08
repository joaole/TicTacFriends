const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Função para obter dados do usuário autenticado
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ msg: 'Usuário não encontrado.' });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

// Função para atualizar dados do usuário
exports.updateUser = async (req, res) => {
    try {
        const { name, email, password, imageUrl } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ msg: 'Usuário não encontrado.' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (imageUrl) user.profileImage = imageUrl;

        await user.save();
        res.status(200).json({
            message: 'Informações do usuário atualizadas com sucesso',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        res.status(500).json({ msg: 'Erro interno do servidor' });
    }
};

exports.updateProfileImage = async (req, res) => {
    try {
        const userId = req.userId;
        const { imageUrl } = req.body;

        // Verifique se a URL da imagem é permitida (opcional)
        if (!profileImages.includes(imageUrl)) {
            return res.status(400).json({ message: 'Imagem não permitida' });
        }

        // Atualize a imagem de perfil do usuário com a URL externa
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        );

        res.json({ message: 'Imagem de perfil atualizada', profileImage: user.profileImage });
    } catch (error) {
        console.error('Erro ao atualizar a imagem de perfil:', error);
        res.status(500).json({ message: 'Erro ao atualizar a imagem de perfil' });
    }
};



// Função para listar imagens de perfil permitidas
const profileImages = require('../config/profileImagesConfig');

exports.getAllowedProfileImages = (req, res) => {
    res.status(200).json(profileImages); // Retorna as URLs das imagens
};

