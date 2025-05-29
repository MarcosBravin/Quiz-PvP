const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Rota do Ranking
router.get("/ranking", async (req, res) => {
  try {
    let user = null;

    // Verifica se há um usuário na sessão
    if (req.session && req.session.userId) {
      user = await User.findById(req.session.userId);
    }

    const users = await User.find({ isBanned: { $ne: true }, role: "user" }) // Filtra quem NÃO está banido
      .sort({ score: -1 }) // Ordena do maior para o menor
      .limit(10); // Pega apenas os 10 melhores

    res.render("ranking", { title: "Ranking", users, user });
  } catch (err) {
    console.error("Erro ao buscar ranking:", err);
    res.status(500).send("Erro ao carregar ranking");
  }
});

module.exports = router;
