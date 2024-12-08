import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChooseOpponent from './ChooseOpponent'; // Importa o componente de desafio
import './styles/User.css';

const User = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImages, setProfileImages] = useState([]);
  const [showImageOptions, setShowImageOptions] = useState(false);

  // Estados de edição separados
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Estados de valores temporários para edição
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setNewName(response.data.name); // Carrega o nome atual para o estado de edição
        setNewEmail(response.data.email); // Carrega o email atual para o estado de edição
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setError('Erro ao carregar dados do usuário.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateField = async (field, value) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/user/update/${userData._id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza o campo específico no estado local do usuário
      setUserData((prevData) => ({ ...prevData, [field]: value }));

      // Desativa o modo de edição do campo
      if (field === 'name') setIsEditingName(false);
      if (field === 'email') setIsEditingEmail(false);
      if (field === 'password') setIsEditingPassword(false);
    } catch (error) {
      console.error(`Erro ao atualizar ${field}:`, error);
    }
  };

  if (loading) return <p>Carregando informações do usuário...</p>;
  if (error) return <p>{error}</p>;

  

  return (
    <div className="user-container">
      <div className="user-profile">
        <img
          src={userData?.profileImage || 'https://example.com/path/to/default-avatar.png'}
          alt="Imagem de Perfil"
          className="user-avatar"
          onClick={() => setShowImageOptions(!showImageOptions)}
        />
        {showImageOptions && (
          <div className="image-options">
            {profileImages.map((image) => (
              <img
                key={image}
                src={image}
                alt="Opção de imagem de perfil"
                className="image-option"
                onClick={() => handleUpdateField('profileImage', image)}
              />
            ))}
          </div>
        )}

        <div className="user-info">
          <p>
            <strong>Nome:</strong>{' '}
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => handleUpdateField('name', newName)}>Salvar</button>
                <button onClick={() => setIsEditingName(false)}>Cancelar</button>
              </>
            ) : (
              <>
                {userData.name}{' '}
                <span className="edit-icon" onClick={() => setIsEditingName(true)}>
                  ✎
                </span>
              </>
            )}
          </p>
          <p>
            <strong>Email:</strong>{' '}
            {isEditingEmail ? (
              <>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <button onClick={() => handleUpdateField('email', newEmail)}>Salvar</button>
                <button onClick={() => setIsEditingEmail(false)}>Cancelar</button>
              </>
            ) : (
              <>
                {userData.email}{' '}
                <span className="edit-icon" onClick={() => setIsEditingEmail(true)}>
                  ✎
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="choose-opponent-section">
        <ChooseOpponent /> {/* Integra a funcionalidade de desafiar */}
      </div>
    </div>
  );
};

export default User;
