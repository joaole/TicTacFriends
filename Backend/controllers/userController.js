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

// Enviar solicitação de amizade
exports.sendFriendRequest = async (req, res) => {
    const { friendId } = req.body; // ID do usuário para quem enviar a solicitação
  
    try {
      const user = await User.findById(req.userId);
      const friend = await User.findById(friendId);
  
      if (!friend) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      if (user.friends.includes(friendId) || user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'Solicitação de amizade já enviada ou usuário já é amigo' });
      }
  
      // Adiciona o ID do usuário atual na lista de solicitações de amizade do amigo
      friend.friendRequests.push(user._id);
      await friend.save();
  
      res.status(200).json({ message: 'Solicitação de amizade enviada' });
    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
      res.status(500).json({ message: 'Erro ao enviar solicitação de amizade' });
    }
  };

// Aceitar solicitação de amizade
exports.acceptFriendRequest = async (req, res) => {
    const { friendId } = req.body; // ID do usuário que enviou a solicitação
  
    try {
      const user = await User.findById(req.userId);
      const friend = await User.findById(friendId);
  
      if (!friend) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'Nenhuma solicitação de amizade pendente deste usuário' });
      }
  
      // Adicionar cada um como amigo
      user.friends.push(friendId);
      friend.friends.push(user._id);
  
      // Remover a solicitação de amizade da lista
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: 'Solicitação de amizade aceita' });
    } catch (error) {
      console.error('Erro ao aceitar solicitação de amizade:', error);
      res.status(500).json({ message: 'Erro ao aceitar solicitação de amizade' });
    }
  };

// Recusar solicitação de amizade
exports.rejectFriendRequest = async (req, res) => {
    const { friendId } = req.body;
  
    try {
      const user = await User.findById(req.userId);
  
      if (!user.friendRequests.includes(friendId)) {
        return res.status(400).json({ message: 'Nenhuma solicitação de amizade pendente deste usuário' });
      }
  
      // Remove a solicitação de amizade
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
  
      await user.save();
  
      res.status(200).json({ message: 'Solicitação de amizade recusada' });
    } catch (error) {
      console.error('Erro ao recusar solicitação de amizade:', error);
      res.status(500).json({ message: 'Erro ao recusar solicitação de amizade' });
    }
  };

// Remover amigo
exports.removeFriend = async (req, res) => {
    const { friendId } = req.body;
  
    try {
      const user = await User.findById(req.userId);
      const friend = await User.findById(friendId);
  
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Usuário não é seu amigo' });
      }
  
      // Remove cada um da lista de amigos do outro
      user.friends = user.friends.filter(id => id.toString() !== friendId);
      friend.friends = friend.friends.filter(id => id.toString() !== req.userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: 'Amigo removido' });
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
      res.status(500).json({ message: 'Erro ao remover amigo' });
    }
  };
