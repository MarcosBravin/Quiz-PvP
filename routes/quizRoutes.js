const express = require("express");
const router = express.Router();

router.get("/quiz-pvp", (req, res) => {
  res.render("quiz-pvp", { title: "quiz-pvp"});
});

module.exports = router;
