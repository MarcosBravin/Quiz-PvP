const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware"); // Importa o middleware

// Protege a rota do jogo para usuários logados
router.get("/game", isAuthenticated, (req, res) => {
  res.render("game", { title: "Jogo Quiz", user: req.session.userId });
});

module.exports = router;
