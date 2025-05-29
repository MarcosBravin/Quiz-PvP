const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/about", async (req, res) => { // Adicionando "async"
  try {
    let user = null;
    
    // Verifica se há um usuário na sessão
    if (req.session && req.session.userId) {
      user = await User.findById(req.session.userId);
    }

    res.render("about", { title: "Sobre Nós", user }); // Agora renderiza com user
  } catch (err) {
    console.error("Erro ao carregar página Sobre Nós:", err);
    res.status(500).send("Erro ao carregar a página.");
  }
});

module.exports = router;
