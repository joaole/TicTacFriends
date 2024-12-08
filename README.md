# Jogo da Velha - TicTacFriends

Este projeto é um Jogo da Velha desenvolvido como parte da disciplina INE5646. A aplicação permite que dois jogadores se alternem para jogar em um tabuleiro de 3x3, com verificação de vitória ou empate, e a opção de reiniciar o jogo. Além disso, a aplicação conta com funcionalidades de cadastro de usuário, alterações de informações do usuário, chat para conversar durante os jogos e sistema de ranque durante as partidas, armazenando numeros de vitorias derrotas ou empates.

## Participantes

- **João Leonardo Filgueiras Rodrigues 22100905**
- **Gabriel Sampaio Scherer**
- **Lucas Pasti Ferreira 22100912**

## Descrição do Projeto

O Jogo da Velha é uma aplicação web desenvolvida utilizando HTML, CSS, e JavaScript. Ele permite que dois jogadores joguem alternadamente até que um vença ou o jogo termine em empate. A aplicação inclui as seguintes funcionalidades:

### Funcionalidades

- **Cadastro de Usuário**: Cada jogador pode criar sua conta, inserindo seu nome de usuário e senha.
- **Autenticação**: O jogador precisa se autenticar (fazer login) para acessar a aplicação.
- **Jogo Multijogador**: Dois jogadores podem jogar alternadamente no mesmo tabuleiro.
- **Reiniciar Partida**: O jogo pode ser reiniciado a qualquer momento após uma partida ser concluída (vitória ou empate).

## Tecnologias Utilizadas

- **HTML**: Estrutura da aplicação.
- **CSS**: Estilização e responsividade do jogo.
- **JavaScript**: Lógica de funcionamento do jogo e interação entre os usuários.
- **Back-end**: Implementação de autenticação de usuários. Tecnologias utilizadas, express, mongo db, node.js 
- **Banco de Dados**: Utilização de uma base de dados (MongoDB) para armazenar informações de usuários.

## Documentação

### Estrutura:

TICTACFRIENDS/
│
├── backend/
│   ├── config/              # Configurações dos links das imagens de perfil
│   │   └── profileImagesConfig.js
│   ├── controllers/         # Controladores das rotas (lógica de negócios)
│   │   └── userController.js
│   │   └── gameController.js
│   ├── middlewares/         # Middlewares (ex: autenticação)
│   │   └── authMiddleware.js
│   ├── models/              # Modelos de dados (definições do banco)
│   │   └── User.js
│   │   └── Game.js
│   ├── routes/              # Rotas da API
│   │   └── userRoutes.js
│   │   └── gameRoutes.js
│   ├── node_modules/        # Dependências do Node.js
│   ├── .env                 # Variáveis de ambiente (ex: credenciais do banco)
│   ├── .gitignore           # Arquivos/diretórios a serem ignorados pelo Git
│   ├── package.json         # Gerenciador de dependências do Node.js
│   ├── package-lock.json    # Controle de versão das dependências
│   └── index.js             # Entrada principal do backend (servidor Express)
│
├── frontend/
│   ├── public/              # Arquivos públicos (HTML, favicons, etc.)
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Componentes React reutilizáveis
│   │   │   ├── TicTacToe.js
│   │   │   ├── Chat.js
│   │   │   ├── Header.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── Sobre.js
│   │   ├── context/         # Context API para gerenciamento de estado
│   │   │   └── AuthContext.js
│   │   ├── styles/          # Arquivos CSS para estilização
│   │   │   ├── TicTacToe.css
│   │   │   ├── Chat.css
│   │   │   ├── Header.css
│   │   │   └── global.css
│   │   ├── App.js           # Componente principal da aplicação
│   │   ├── index.js         # Ponto de entrada do React
│   │   └── routes/          # Gerenciamento de rotas com React Router
│   │       └── AppRoutes.js
│   ├── node_modules/        # Dependências do Node.js (frontend)
│   ├── .gitignore           # Arquivos/diretórios a serem ignorados pelo Git
│   ├── package.json         # Gerenciador de dependências do Node.js (frontend)
│   ├── package-lock.json    # Controle de versão das dependências
│
├── .gitignore               # Arquivos/diretórios a serem ignorados pelo Git no projeto
├── README.md                # Documentação do projeto
├── package.json             # Gerenciador de dependências do projeto global (monorepo)
└── package-lock.json        # Controle de versão das dependências (global)

Explicação da Estrutura
1. Backend
Config: Contém arquivos para configuração global, como conexão com banco de dados (MongoDB).
Controllers: Lógica das rotas (como autenticação, cadastro, e manipulação do jogo).
Middlewares: Funções intermediárias, como validação de autenticação ou permissões.
Models: Definições de esquema para o banco de dados (ex: usuários e partidas).
Routes: Declaração das rotas da API e seus endpoints.
Index.js: Ponto de entrada do backend, onde o servidor Express é inicializado.
2. Frontend
Public: Contém arquivos estáticos, como index.html, favicons e imagens públicas.
Src/Components: Componentes React reutilizáveis, como TicTacToe e Chat.
Src/Context: Configuração do gerenciamento de estado com Context API.
Src/Styles: Arquivos CSS modulares para estilização dos componentes.
App.js: Ponto de composição da aplicação React.
Index.js: Ponto de entrada para inicializar o React.
3. Geral
README.md: Contém a documentação do projeto (ex: funcionalidades, participantes e instruções de uso).
Gitignore: Define arquivos ou diretórios a serem ignorados pelo Git.
Package.json: Gerencia as dependências do projeto para o frontend e backend.
Fluxo do Desenvolvimento
Implementar o Backend:

Configure os endpoints de autenticação e registro de usuários.
Crie rotas para gerenciar o jogo da velha (ex: salvar partidas, histórico).
Configure o Socket.io para gerenciar mensagens de chat em tempo real.
Implementar o Frontend:

Crie os componentes React para o jogo (TicTacToe) e o chat (Chat).
Configure o Context API para gerenciar estado de autenticação.
Adicione estilos e rotas protegidas (ex: redirecionamento se o usuário não estiver autenticado).
Testar e Integrar:

Teste a comunicação entre frontend e backend (ex: autenticação, chat).
Valide os fluxos (cadastro, login, partida, chat).
Melhorias Finais:

Ajuste a interface para responsividade.
Adicione funcionalidades extras, como ranqueamento de jogadores.