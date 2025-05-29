const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para evitar conflitos
  },
});

// Filtros para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de arquivo inválido! Apenas JPG, PNG e GIF são permitidos."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
