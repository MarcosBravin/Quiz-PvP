const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Rota principal (index)
router.get("/", async (req, res) => {
  let user = null;

  // Verifica se há um usuário na sessão
  if (req.session && req.session.userId) {
    user = await User.findById(req.session.userId);
  }

  res.render("index", { title: "Página Inicial", user }); // Corrigido: "index" é o nome da view
});

module.exports = router;
