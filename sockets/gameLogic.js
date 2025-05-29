const Question = require("../models/Question");

async function startGame(player1Socket, player2Socket) {
    const questions = await Question.find();
    if (questions.length === 0) {
        console.log("Erro: Nenhuma pergunta encontrada no banco de dados.");
        return;
    }

    let currentQuestionIndex = 0;
    let scores = { [player1Socket.id]: 0, [player2Socket.id]: 0 };

    function sendQuestion() {
        if (currentQuestionIndex >= questions.length) {
            player1Socket.emit("gameOver", { score: scores[player1Socket.id] });
            player2Socket.emit("gameOver", { score: scores[player2Socket.id] });
            console.log("Fim do jogo.");
            return;
        }

        const question = questions[currentQuestionIndex];
        const questionData = {
            question: question.question,
            options: question.options
        };

        player1Socket.emit("question", questionData);
        player2Socket.emit("question", questionData);

        let timeout = setTimeout(() => {
            console.log(`Tempo esgotado para a pergunta: ${question.question}`);
            currentQuestionIndex++;
            sendQuestion();
        }, 10000);

        function processAnswer(socket, data) {
            clearTimeout(timeout);

            if (data.answerIndex === question.correctIndex) {
                scores[socket.id] += 10;
            }

            player1Socket.emit("scoreUpdate", { score: scores[player1Socket.id] });
            player2Socket.emit("scoreUpdate", { score: scores[player2Socket.id] });

            currentQuestionIndex++;
            sendQuestion();
        }

        player1Socket.once("answerQuestion", (data) => processAnswer(player1Socket, data));
        player2Socket.once("answerQuestion", (data) => processAnswer(player2Socket, data));
    }

    sendQuestion();
}

module.exports = { startGame };
