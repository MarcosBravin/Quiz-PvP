// Evento para mostrar a visualização da imagem
document.getElementById("avatarInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("avatarImg").src = e.target.result;
            document.getElementById("uploadBtn").style.display = "inline-block";
        };
        reader.readAsDataURL(file);
    }
});

// Função para exibir o modal com uma mensagem
function showModal(title, message) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("customModal").style.display = "block"; // Exibe o modal
}

// Função para fechar o modal
document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("customModal").style.display = "none"; // Esconde o modal
});

// Função para fechar o modal clicando fora dele
window.addEventListener("click", function (event) {
    if (event.target === document.getElementById("customModal")) {
        document.getElementById("customModal").style.display = "none"; // Esconde o modal
    }
});

// Evento para o upload do avatar
document.getElementById("uploadBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Impede o comportamento padrão do botão

    const fileInput = document.getElementById("avatarInput");

    if (!fileInput.files[0]) {
        showModal("Erro", "Por favor, escolha uma imagem para enviar.");
        return;
    }

    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);

    // Exibe uma mensagem de carregamento para o usuário
    document.getElementById("uploadBtn").textContent = "Enviando..."; // Muda o texto do botão

    // Envia o arquivo para o servidor
    fetch("/update-avatar", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar o avatar');
        }
        return response.json();
    })
    .then(data => {
        if (data.avatar) {
            document.getElementById("avatarImg").src = data.avatar;
            showModal("Sucesso", "Avatar atualizado com sucesso!");
        } else {
            showModal("Erro", "Erro ao atualizar avatar.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        showModal("Erro", "Ocorreu um erro ao atualizar o avatar.");
    })
    .finally(() => {
        document.getElementById("uploadBtn").textContent = "Salvar Avatar"; // Restaura o texto do botão
    });
});
