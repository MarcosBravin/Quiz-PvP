const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/dashboard", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.userId);
  res.render("dashboard", { title: "Painel", user });
});

module.exports = router;
