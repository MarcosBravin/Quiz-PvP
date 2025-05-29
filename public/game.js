document.addEventListener("DOMContentLoaded", () => {
    let score = parseInt(document.querySelector("#score span").textContent) || 0;
    let timer;
    let timeLeft = 10; // Tempo inicial em segundos
    const questionText = document.getElementById("question-text");
    const optionsList = document.getElementById("options");
    const timeDisplay = document.getElementById("time-left");

    // Função para buscar uma nova pergunta
    async function fetchQuestion() {
        try {
            const response = await fetch("/game/question");
            const data = await response.json();

            if (!data.question) {
                questionText.textContent = "Nenhuma pergunta disponível!";
                return;
            }

            displayQuestion(data);
        } catch (error) {
            console.error("Erro ao carregar pergunta:", error);
            questionText.textContent = "Erro ao carregar pergunta.";
        }
    }

    // Função para exibir a pergunta e opções
    function displayQuestion(data) {
        questionText.textContent = data.question;
        optionsList.innerHTML = "";

        data.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-btn");
            button.dataset.index = index;
            button.addEventListener("click", (event) => checkAnswer(event, index, data.correctIndex));
            optionsList.appendChild(button);
        });

        resetTimer();
    }

    // Função para verificar resposta e atualizar pontuação
    async function checkAnswer(event, selectedIndex, correctIndex) {
        clearTimeout(timer); // Para o tempo se o jogador responder

        const selectedButton = event.target;

        if (selectedIndex === correctIndex) {
            selectedButton.classList.add("correct"); // Verde para resposta certa
            updateScore(10); // Adiciona 10 pontos
        } else {
            selectedButton.classList.add("incorrect"); // Vermelho para resposta errada
        }

        // Espera 2 segundos antes de carregar a próxima pergunta
        setTimeout(fetchQuestion, 2000);
    }

    // Função para atualizar pontuação do usuário
    async function updateScore(points) {
        try {
            await fetch("/game/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points })
            });

            // Atualiza a pontuação na tela
            score += points;
            document.querySelector("#score span").textContent = score;
        } catch (error) {
            console.error("Erro ao atualizar pontuação:", error);
        }
    }

    // Função para iniciar o timer
    function resetTimer() {
        clearInterval(timer);
        timeLeft = 10;
        timeDisplay.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                fetchQuestion(); // Muda para a próxima pergunta automaticamente
            }
        }, 1000);
    }

    // Inicia o quiz pegando a primeira pergunta
    fetchQuestion();
});
