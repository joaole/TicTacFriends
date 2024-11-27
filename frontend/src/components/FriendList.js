import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/FriendList.css';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchFriendsData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [friendsResponse, friendRequestsResponse, allUsersResponse] = await Promise.all([
          axios.get('/user/friends', { headers }),
          axios.get('/user/friendRequests', { headers }),
          axios.get('/user/all', { headers }),
        ]);

        setFriends(friendsResponse.data);
        setFriendRequests(friendRequestsResponse.data);

        const filteredUsers = allUsersResponse.data.filter(
          (user) =>
            !friendsResponse.data.some((friend) => friend._id === user._id) &&
            !friendRequestsResponse.data.some((request) => request._id === user._id)
        );

        setAllUsers(filteredUsers);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchFriendsData();
  }, []);

  const handleSendFriendRequest = async (userId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post('/user/sendFriendRequest', { friendId: userId }, { headers });
      setAllUsers(allUsers.filter((user) => user._id !== userId));
      alert('Solicitação de amizade enviada!');
    } catch (error) {
      console.error('Erro ao enviar solicitação de amizade:', error);
    }
  };

  const handleAcceptFriendRequest = async (userId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post('/user/acceptFriendRequest', { friendId: userId }, { headers });
      const acceptedFriend = friendRequests.find((req) => req._id === userId);
      setFriends([...friends, acceptedFriend]);
      setFriendRequests(friendRequests.filter((req) => req._id !== userId));
      alert('Solicitação de amizade aceita!');
    } catch (error) {
      console.error('Erro ao aceitar solicitação de amizade:', error);
    }
  };

  const handleRejectFriendRequest = async (userId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post('/user/rejectFriendRequest', { friendId: userId }, { headers });
      setFriendRequests(friendRequests.filter((req) => req._id !== userId));
      alert('Solicitação de amizade recusada!');
    } catch (error) {
      console.error('Erro ao recusar solicitação de amizade:', error);
    }
  };

  const handleRemoveFriend = async (userId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post('/user/removeFriend', { friendId: userId }, { headers });
      setFriends(friends.filter((friend) => friend._id !== userId));
      alert('Amigo removido!');
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
    }
  };

  return (
    <div className="friend-list-container">
      <h3>Amigos</h3>
      <div className="friends-list">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend._id} className="friend-item">
              <img src={friend.avatar || 'default-avatar.png'} alt={friend.name} className="friend-avatar" />
              <span>{friend.name}</span>
              <button onClick={() => handleRemoveFriend(friend._id)}>
                <i className="fas fa-user-minus"></i> Remover
              </button>
            </div>
          ))
        ) : (
          <p>Você ainda não possui amigos.</p>
        )}
      </div>

      <h3>Solicitações de Amizade</h3>
      <div className="friend-requests-list">
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <div key={request._id} className="friend-request-item">
              <img src={request.avatar || 'default-avatar.png'} alt={request.name} className="friend-avatar" />
              <span>{request.name}</span>
              <button onClick={() => handleAcceptFriendRequest(request._id)}>Aceitar</button>
              <button onClick={() => handleRejectFriendRequest(request._id)}>Recusar</button>
            </div>
          ))
        ) : (
          <p>Você não tem solicitações de amizade pendentes.</p>
        )}
      </div>

      <h3>Adicionar Amigos</h3>
      <div className="add-friend-list">
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <div key={user._id} className="add-friend-item">
              <img src={user.avatar || 'default-avatar.png'} alt={user.name} className="friend-avatar" />
              <span>{user.name}</span>
              <button onClick={() => handleSendFriendRequest(user._id)}>
                <i className="fas fa-user-plus"></i> Adicionar
              </button>
            </div>
          ))
        ) : (
          <p>Não há novos usuários para adicionar.</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
