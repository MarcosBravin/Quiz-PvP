const socket = io();  // Inicializa o socket.io

// Função que é chamada quando o jogador clica em "Iniciar Jogo"
function joinQueue() {
    const userId = document.getElementById('user-id').value;

    if (!userId) {
        alert("Erro: ID do usuário não encontrado.");
        return;
    }

    const modal = document.getElementById('matchmakingModal');
    const status = document.getElementById('matchmakingStatus');
    modal.style.display = 'flex';
    status.innerHTML = "Procurando um oponente...";

    socket.emit('joinQueue', { userId });

    console.log("Solicitação de matchmaking enviada.");
}

// Ouvinte para receber a resposta do servidor quando um oponente for encontrado
socket.on('matchFound', (data) => {
    console.log("Oponente encontrado:", data.player2Name);

    const modal = document.getElementById('matchmakingModal');
    const status = document.getElementById('matchmakingStatus');

    status.innerHTML = `Oponente encontrado: ${data.player2Name}. Iniciando o jogo...`;

    setTimeout(() => {
        modal.style.display = 'none';

        const gameStartModal = document.getElementById('gameStartModal');
        const player1Name = document.getElementById('player1');
        const player2Name = document.getElementById('player2');
        
        // Exibindo os nomes dos dois jogadores no modal de início de partida
        player1Name.innerHTML = data.player1Name;
        player2Name.innerHTML = data.player2Name;

        // Exibindo o modal de início de partida
        gameStartModal.style.display = 'flex';
    }, 2000);  // Aguarda 2 segundos para mostrar a transição
});

// Ouvinte para quando não for encontrado um oponente
socket.on('noOpponentFound', () => {
    console.log("Nenhum oponente encontrado.");

    const modal = document.getElementById('matchmakingModal');
    const status = document.getElementById('matchmakingStatus');

    status.innerHTML = "Nenhum oponente encontrado. Tente novamente mais tarde.";

    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);
});


// Ouvindo o evento 'matchFound' para exibir as fotos dos jogadores
socket.on("matchFound", (data) => {
    // Atualizando o nome e a foto do Jogador 1
    document.getElementById("player1Avatar").src = data.player1Avatar; // Atualizando a foto do Jogador 1

    // Atualizando o nome e a foto do Jogador 2 (Oponente)
    document.getElementById("player2Avatar").src = data.player2Avatar; // Atualizando a foto do Oponente
  });

// Ouvinte para quando não for encontrado um oponente
socket.on('noOpponentFound', () => {
    console.log("Nenhum oponente encontrado.");

    const modal = document.getElementById('matchmakingModal');
    const status = document.getElementById('matchmakingStatus');

    status.innerHTML = "Nenhum oponente encontrado. Tente novamente mais tarde.";

    setTimeout(() => {
        modal.style.display = 'none';
    }, 2000);
});

// Função chamada ao selecionar uma resposta no quiz
function selectAnswer(answer) {
    alert(`Você escolheu: ${answer}`);
    // Aqui, você pode enviar a resposta para o servidor para validação ou outras ações
}

// Função para iniciar o jogo
function startGame() {
    alert('Partida iniciada!');
    document.getElementById('gameStartModal').style.display = 'none';
    // Lógica para iniciar o jogo (pode incluir redirecionamento ou iniciar o jogo no front-end)
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('gameStartModal').style.display = 'none';
}


socket.on('question', (data) => {
    console.log("Pergunta recebida:", data);

    // Atualize a pergunta e opções no modal
    const quizQuestionPlaceholder = document.getElementById('quizQuestionPlaceholder');
    const quizOptionsContainer = document.querySelector('.quiz-options');

    quizQuestionPlaceholder.innerText = data.question; // Atualize o texto da pergunta
    quizOptionsContainer.innerHTML = ""; // Limpe as opções anteriores

    // Adicione as novas opções como botões
    data.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => {
            submitAnswer(index); // Envie o índice da resposta ao servidor
        };
        quizOptionsContainer.appendChild(button);
    });
});


function submitAnswer(answerIndex) {
    socket.emit('answerQuestion', {
        playerId: document.getElementById('user-id').value, // ID do jogador
        questionId: currentQuestionId, // ID da pergunta atual
        answerIndex: answerIndex, // Índice da resposta selecionada
    });

    alert(`Resposta enviada: ${answerIndex}`);
    console.log(`Resposta enviada ao servidor: ${answerIndex}`);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('matchmakingModal').style.display = 'none';
    document.getElementById('gameStartModal').style.display = 'none';
});

