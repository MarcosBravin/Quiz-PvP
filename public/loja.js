let saldo = 1000;  // Saldo inicial
let carrinho = [];  // Carrinho do jogador

// Itens disponíveis na loja (pode ser modificado conforme necessário)
const itensLoja = [
    { id: 1, nome: 'Poder de Dica Extra', descricao: 'Fornece uma dica extra durante as perguntas.', preco: 100, imagem: 'img/power_dica_extra.png' },
    { id: 2, nome: 'Pule uma Pergunta', descricao: 'Permite pular uma pergunta difícil.', preco: 150, imagem: 'img/pule_pergunta.png' },
    { id: 3, nome: 'Carta Especial', descricao: 'Carta que dobra a pontuação de uma pergunta.', preco: 200, imagem: 'img/carta_especial.png' },
    { id: 4, nome: 'Armadura de Defesa', descricao: 'Protege contra penalidades no jogo.', preco: 300, imagem: 'img/armadura_defesa.png' },
    { id: 5, nome: 'Aumento de Tempo', descricao: 'Aumenta o tempo de resposta durante o jogo.', preco: 250, imagem: 'img/aumento_tempo.png' }
];

// Função para renderizar os itens da loja
function renderizarLoja() {
    const itensSection = document.querySelector('.itens');
    itensLoja.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <p><strong>Preço:</strong> ${item.preco} moedas</p>
            <button onclick="adicionarCarrinho(${item.id})">Adicionar ao Carrinho</button>
        `;
        itensSection.appendChild(itemDiv);
    });
}

// Função para adicionar item ao carrinho
function adicionarCarrinho(itemId) {
    const item = itensLoja.find(i => i.id === itemId);
    if (item) {
        carrinho.push(item);
        atualizarCarrinho();
    }
}

// Função para atualizar o carrinho na interface
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById('itensCarrinho');
    itensCarrinho.innerHTML = ''; // Limpar carrinho para atualização

    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = '<li>Seu carrinho está vazio.</li>';
    } else {
        carrinho.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nome} - ${item.preco} moedas`;
            itensCarrinho.appendChild(li);
        });
    }

    const totalCarrinho = carrinho.reduce((total, item) => total + item.preco, 0);
    document.getElementById('totalCarrinho').textContent = totalCarrinho;
}

// Função para finalizar a compra
function finalizarCompra() {
    const total = carrinho.reduce((total, item) => total + item.preco, 0);

    if (saldo >= total) {
        saldo -= total;
        carrinho = []; // Limpar carrinho após a compra
        document.getElementById('saldo').textContent = saldo;
        alert('Compra realizada com sucesso!');
        atualizarCarrinho();
    } else {
        alert('Saldo insuficiente!');
    }
}

// Inicialização
renderizarLoja();
