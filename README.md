# Jogo da Velha - TicTacFriends

Este projeto é um Jogo da Velha desenvolvido como parte da disciplina INE5646. A aplicação permite que dois jogadores se alternem para jogar em um tabuleiro de 3x3, com verificação de vitória ou empate, e a opção de reiniciar o jogo. Além disso, a aplicação conta com funcionalidades de cadastro de usuário, adição de amigos, e um sistema de ranque para acompanhar vitórias e derrotas entre amigos.

## Participantes

- **João Leonardo Filgueiras Rodrigues 22100905**
- **Gabriel Sampaio Scherer**
- **Lucas Pasti Ferreira 22100912**

## Descrição do Projeto

O Jogo da Velha é uma aplicação web desenvolvida utilizando HTML, CSS, e JavaScript. Ele permite que dois jogadores joguem alternadamente até que um vença ou o jogo termine em empate. A aplicação inclui as seguintes funcionalidades:

### Funcionalidades

- **Cadastro de Usuário**: Cada jogador pode criar sua conta, inserindo seu nome de usuário e senha.
- **Autenticação**: O jogador precisa se autenticar (fazer login) para acessar a aplicação.
- **Adicionar Amigos**: Os usuários podem enviar solicitações de amizade e adicionar outros jogadores à sua lista de amigos.
- **Ranque de Vitórias e Derrotas**: O sistema mantém um histórico de vitórias e derrotas entre os amigos, criando um ranque personalizado.
- **Jogo Multijogador**: Dois jogadores podem jogar alternadamente no mesmo tabuleiro.
- **Reiniciar Partida**: O jogo pode ser reiniciado a qualquer momento após uma partida ser concluída (vitória ou empate).

## Tecnologias Utilizadas

- **HTML**: Estrutura da aplicação.
- **CSS**: Estilização e responsividade do jogo.
- **JavaScript**: Lógica de funcionamento do jogo e interação entre os usuários.
- **Back-end**: Implementação de autenticação de usuários e armazenamento de dados de amigos e ranque de partidas. Tecnologias utilizadas, express, mongo db, node.js 
- **Banco de Dados**: Utilização de uma base de dados (MongoDB) para armazenar informações de usuários, amigos e partidas.

## Como Rodar o Projeto

1. Clone este repositório:
   ```bash
   git clone https://github.com/joaole/TicTacFriends.git

### estrutura do projeto
#### Backend Structure
##### config: Contains configuration files like profileImagesConfig.js.
##### controllers: Contains controller files such as authController.js and userController.js.
##### imagens_perfil: Likely for profile images (not much detail provided here).
##### middlewares: Contains middlewares like checkToken.js for handling token authentication or other middleware tasks.
##### models: Includes models, for example, User.js, which may represent the user schema or database model.
##### routes: Contains routing files like userRoutes.js, presumably defining API endpoints.
Other Files: Includes environment configuration (.env), package.json, and server.js, which is likely the entry point for your backend server.
#### Frontend Structure
##### src: Primary source folder with components and styles.
##### components: Contains various components such as Header.js, Hero.js, Login.js, PrivateRoute.js, Register.js, Sobre.js, and User.js. Additionally, there’s an img folder for images and a styles folder for styling the components.
##### App.js and index.js: Core files to start the React app and handle routing or main component mounting.
#### This structure suggests a full-stack project where:
The backend (Node.js/Express) handles API requests, authentication, and possibly image handling.
The frontend (React) is responsible for rendering the user interface, with organized components for different parts of the application.

## Estrutura do Projeto (frontend)
1. App.js: Gerencia as rotas e decide qual navbar (pública ou privada) exibir.
2. Header.js: Navbar pública.
3. PrivateNavbar.js: Navbar privada.
4. Login.js: Página de login.
5. Register.js: Página de cadastro.
6. Home.js: Página protegida (rota privada).
7. Partidas.js: Outra página protegida (rota privada).
8. PrivateRoute.js: Protege rotas com base no estado de autenticação.
9. AuthContext.js (opcional): Gerencia o estado global de autenticação.

---

Pelo que vejo no layout da imagem fornecida, o botão "Adicionar Amigos" não está aparecendo porque não há usuários disponíveis para serem adicionados. Isso pode ser devido a:

API Não Retornando Usuários:

O endpoint /user/all pode não estar retornando dados corretamente.
Filtro da Lista de Usuários:

Todos os usuários estão sendo filtrados porque podem já estar na lista de amigos ou em solicitações pendentes.
Erro no Frontend:

O botão de "Adicionar Amigos" está condicionado a existir usuários disponíveis, mas ele não está sendo exibido corretamente.
Solução
Vamos investigar e corrigir o problema. Aqui está o passo a passo:

1. Verificar a API /user/all
Certifique-se de que a API /user/all está retornando a lista completa de usuários. No backend, o endpoint deve ser algo como:

javascript
Copiar código
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id name avatar'); // Retorna apenas os campos necessários
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar todos os usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};
2. Ajustar Filtro no Frontend
Certifique-se de que o filtro no frontend está funcionando corretamente. Aqui está o código atualizado para corrigir o filtro:

javascript
Copiar código
useEffect(() => {
  const fetchFriendsData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [friendsResponse, friendRequestsResponse, allUsersResponse] = await Promise.all([
        axios.get('/user/friends', { headers }),
        axios.get('/user/friendRequests', { headers }),
        axios.get('/user/all', { headers }), // API para buscar todos os usuários
      ]);

      setFriends(friendsResponse.data);
      setFriendRequests(friendRequestsResponse.data);

      // Filtrar apenas usuários que não estão na lista de amigos ou de solicitações pendentes
      const filteredUsers = allUsersResponse.data.filter(
        (user) =>
          !friendsResponse.data.some((friend) => friend._id === user._id) &&
          !friendRequestsResponse.data.some((request) => request._id === user._id) &&
          user._id !== localStorage.getItem('userId') // Não incluir o próprio usuário
      );

      setAllUsers(filteredUsers);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  fetchFriendsData();
}, []);
3. Forçar Exibição do Botão de Adicionar Amigos
Mesmo que não haja usuários disponíveis, o botão de "Adicionar Amigos" deve ser exibido com uma mensagem indicando que não há usuários. Atualize o JSX:

jsx
Copiar código
<div className="add-friend-btn-wrapper">
  <button className="add-friend-btn" disabled={allUsers.length === 0}>
    <i className="fas fa-user-plus"></i> Adicionar Amigo
  </button>
</div>
4. Estilização CSS Atualizada
Certifique-se de que o botão está visualmente destacável e funcional:

css
Copiar código
.add-friend-btn-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.add-friend-btn {
  background: linear-gradient(135deg, #28a745, #34d058);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.add-friend-btn:disabled {
  background: #ddd;
  color: #aaa;
  cursor: not-allowed;
}

.add-friend-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
}
5. Exibir Mensagem Quando Não Houver Usuários
Atualize a lista de usuários disponíveis para adicionar:

jsx
Copiar código
<h3>Adicionar Amigos</h3>
<div className="add-friend-list">
  {allUsers.length > 0 ? (
    allUsers.map((user) => (
      <div key={user._id} className="add-friend-item">
        <img src={user.avatar || 'default-avatar.png'} alt={user.name} className="friend-avatar" />
        <span>{user.name}</span>
        <button
          className="add-friend-action-btn"
          onClick={() => handleSendFriendRequest(user._id)}
        >
          <i className="fas fa-user-plus"></i> Adicionar
        </button>
      </div>
    ))
  ) : (
    <p>Não há novos usuários para adicionar.</p>
  )}
</div>
Testes
Teste a API /user/all:

Verifique se ela está retornando os usuários esperados no formato { _id, name, avatar }.
Verifique o Filtro:

Certifique-se de que o próprio usuário, amigos e solicitações pendentes são filtrados corretamente.
Teste o Botão:

Verifique se o botão é exibido corretamente e se é desabilitado quando não há usuários disponíveis.
Agora o botão de "Adicionar Amigos" será exibido corretamente, mesmo que não haja usuários disponíveis, com uma mensagem informativa. Se precisar de mais ajustes ou debug, avise!
