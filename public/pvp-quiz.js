async function joinQueue() {
    try {
        const response = await fetch('/pvp/queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}` // Substitua pela lógica real
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            console.log('Sala:', data.room);
        } else {
            alert(data.error || 'Erro ao entrar na fila.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar-se à fila.');
    }
}

// Botão para entrar na fila
document.getElementById('joinQueueButton').addEventListener('click', joinQueue);
