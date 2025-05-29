const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const User = require("../models/User");
const { isAuthenticated } = require("../middlewares/authMiddleware");

// 🔹 Rota para buscar uma pergunta aleatória
router.get("/question", isAuthenticated, async (req, res) => {
    try {
        const question = await Question.aggregate([{ $sample: { size: 1 } }]); // Retorna uma pergunta aleatória
        if (!question.length) return res.status(404).json({ error: "Nenhuma pergunta disponível." });

        res.json(question[0]); // Retorna a pergunta no formato JSON
    } catch (err) {
        console.error("Erro ao buscar pergunta:", err);
        res.status(500).json({ error: "Erro ao carregar pergunta." });
    }
});

// 🔹 Rota para atualizar o score do usuário ao acertar uma resposta
router.post("/score", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { userAnswerIndex, correctIndex } = req.body;

        if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });

        if (userAnswerIndex === correctIndex) {
            await User.findByIdAndUpdate(userId, { $inc: { score: 1 } }); // Adiciona 1 pontos se acertar
            return res.json({ success: true, message: "Resposta correta! +1 pontos" });
        } else {
            return res.json({ success: false, message: "Resposta errada!" });
        }
    } catch (err) {
        console.error("Erro ao atualizar pontuação:", err);
        res.status(500).json({ error: "Erro ao atualizar pontuação." });
    }
});

module.exports = router;
