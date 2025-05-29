const express = require("express");
const { isAuthenticated, isBanned } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require('path');
const User = require("../models/User");
 // Certifique-se de que upload é configurado corretamente

const router = express.Router();

// Página de banidos
router.get("/banned", isAuthenticated, (req, res) => {
  res.render("banned", { title: "Acesso Restrito" });
});

// Configuração do multer para salvar a imagem no servidor
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para evitar conflito
  },
});

const upload = multer({ storage });

// Rota para atualizar o avatar
router.post("/update-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      // Se não houve arquivo
      return res.status(400).json({ message: "Nenhuma imagem foi enviada." });
    }

    const userId = req.session.userId;
    if (!userId) {
      // Se o usuário não estiver autenticado
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    // Novo caminho da imagem
    const avatarPath = `/uploads/${req.file.filename}`;

    // Atualizando o avatar no banco de dados
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    if (!updatedUser) {
      // Se o usuário não for encontrado
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retorna a URL da imagem atualizada
    return res.status(200).json({ avatar: avatarPath });

  } catch (err) {
    console.error("Erro ao atualizar avatar:", err);
    return res.status(500).json({ message: "Erro ao atualizar avatar." });
  }
});

module.exports = router;
