const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Importa corretamente o middleware
const PvpRoom = require('../models/PvpRoom'); // Importa o modelo de salas PvP

// Rota: Entrar na fila de PvP
router.post('/queue', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        // Verifica se o jogador já está em uma sala
        let room = await PvpRoom.findOne({ $or: [{ player1: userId }, { player2: userId }] });

        if (room) {
            return res.status(200).json({ message: 'Você já está em uma sala!', room });
        }

        // Procura uma sala de espera
        room = await PvpRoom.findOne({ status: 'waiting' });

        if (!room) {
            // Cria uma nova sala se nenhuma estiver disponível
            room = await PvpRoom.create({ player1: userId });
        } else {
            // Adiciona o jogador à sala existente
            room.player2 = userId;
            room.status = 'active';
            await room.save();
        }

        res.status(200).json({ message: 'Você entrou na fila com sucesso!', room });
    } catch (error) {
        console.error('Erro ao processar a fila:', error);
        res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
});

module.exports = router;
