const bcrypt = require("bcryptjs");

// Gerar uma nova senha criptografada
const novaSenha = "casamv022"; // Escolha uma senha nova
const hashedPassword = bcrypt.hashSync(novaSenha, 10);
console.log("Senha criptografada:", hashedPassword);
