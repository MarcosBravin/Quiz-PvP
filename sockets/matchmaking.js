const usersInQueue = [];

function addToQueue(socket) {
    if (usersInQueue.some((user) => user.socket.id === socket.id)) {
        socket.emit("matchmaking", { status: "Você já está na fila..." });
        return;
    }

    usersInQueue.push({ userId: socket.player._id, socket });
    console.log(`${socket.player.name} entrou na fila. Total: ${usersInQueue.length}`);

    socket.emit("matchmaking", { status: "Procurando oponente..." });

    if (usersInQueue.length > 1) {
        startMatch();
    }
}

function startMatch() {
    const player1 = usersInQueue.shift();
    const player2 = usersInQueue.shift();

    if (!player1?.socket || !player2?.socket) {
        console.log("Erro: Jogador desconectado antes da partida.");
        return;
    }

    player1.socket.emit("matchFound", {
        player1Name: player1.socket.player.name,
        player1Avatar: player1.socket.player.avatar,
        player2Name: player2.socket.player.name,
        player2Avatar: player2.socket.player.avatar
    });

    player2.socket.emit("matchFound", {
        player1Name: player2.socket.player.name,
        player1Avatar: player2.socket.player.avatar,
        player2Name: player1.socket.player.name,
        player2Avatar: player1.socket.player.avatar
    });

    console.log(`Partida iniciada entre ${player1.socket.player.name} e ${player2.socket.player.name}`);
    
    require("./gameLogic").startGame(player1.socket, player2.socket);
}

module.exports = { addToQueue };
