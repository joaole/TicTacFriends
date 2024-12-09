const { Server } = require('socket.io');

let playersQueue = [];
let ongoingGames = [];

const initializeWebSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('findGame', (data) => {
            if (data.username) {
                playersQueue.push({ id: socket.id, username: data.username });

                if (playersQueue.length >= 2) {
                    const player1 = playersQueue.shift();
                    const player2 = playersQueue.shift();
                    const gameRoom = `${player1.id}-${player2.id}`;

                    ongoingGames.push({ room: gameRoom, players: [player1, player2] });

                    io.to(player1.id).emit('startGame', { opponent: player2.username, room: gameRoom });
                    io.to(player2.id).emit('startGame', { opponent: player1.username, room: gameRoom });
                }
            }
        });

        socket.on('playMove', (data) => {
            const game = ongoingGames.find((game) => game.room === data.room);
            if (game) {
                io.to(game.room).emit('updateGame', data);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
            playersQueue = playersQueue.filter((player) => player.id !== socket.id);
            ongoingGames = ongoingGames.filter((game) => !game.players.some((player) => player.id === socket.id));
        });
    });

    return io;
};

module.exports = initializeWebSocket;
