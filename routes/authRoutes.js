const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Página de Registro
router.get("/register", (req, res) => {
  res.render("register", { title: "Cadastro", error: null });
});

// Página de Login
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

// Criar um novo usuário (Registro)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.render("register", { title: "Cadastro", error: "Todos os campos são obrigatórios!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { title: "Cadastro", error: "E-mail já cadastrado!" });
    }

    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    res.render("register", { title: "Cadastro", error: "Erro ao criar conta!" });
  }
});


// Login do usuário
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { title: "Login", error: "Preencha todos os campos!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", { title: "Login", error: "Credenciais inválidas!" });
    }

    if (user.isBanned) {
      return res.render("login", { title: "Login", error: "Conta banida. Contate o suporte!" });
    }

    // Criar sessão do usuário
    req.session.userId = user._id;
    req.session.role = user.role; // Salva o nível de acesso na sessão

    // Redireciona conforme o tipo de usuário
    if (user.role === "admin") {
      res.redirect("/admin/dashboard"); // Admins vão para o painel admin
    } else {
      res.redirect("/"); // Usuários comuns vão para a página inicial
    }
  } catch (err) {
    console.error("Erro ao autenticar usuário:", err);
    res.render("login", { title: "Login", error: "Erro no servidor. Tente novamente!" });
  }
});


// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;