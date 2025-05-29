const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAdmin } = require("../middlewares/authMiddleware");

// Painel de Administração
router.get("/dashboard", isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render("adminDashboard", { title: "Painel Admin", users, message: null });
    } catch (err) {
        console.error("Erro ao carregar painel admin:", err);
        res.status(500).send("Erro ao carregar painel admin.");
    }
});

// 🚫 **Banir Usuário**
router.post("/ban/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Usuário não encontrado!");

        user.isBanned = true;
        await user.save();
        
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Erro ao banir usuário:", err);
        res.status(500).send("Erro ao banir usuário.");
    }
});

// 🔓 **Desbanir Usuário**
router.post("/unban/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Usuário não encontrado!");

        user.isBanned = false;
        await user.save();
        
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Erro ao desbanir usuário:", err);
        res.status(500).send("Erro ao desbanir usuário.");
    }
});

// 🚀 **Promover Usuário (user → moderator → admin)**
router.post("/promote/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Usuário não encontrado!");

        if (user.role === "user") {
            user.role = "moderator"; // Promove para Moderador
        } else if (user.role === "moderator") {
            user.role = "admin"; // Promove para Admin
        } else {
            return res.status(400).send("Este usuário já é um administrador!");
        }

        await user.save();
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Erro ao promover usuário:", err);
        res.status(500).send("Erro ao promover usuário.");
    }
});

// 🔽 **Rebaixar Usuário (admin → moderator → user)**
router.post("/demote/:id", isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("Usuário não encontrado!");

        if (user.role === "admin") {
            user.role = "moderator"; // Rebaixa para Moderador
        } else if (user.role === "moderator") {
            user.role = "user"; // Rebaixa para Usuário comum
        } else {
            return res.status(400).send("Este usuário já está no nível mais baixo!");
        }

        await user.save();
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Erro ao rebaixar usuário:", err);
        res.status(500).send("Erro ao rebaixar usuário.");
    }
});

module.exports = router;
