const mongoose = require('mongoose');
const User = require("../models/User");

// Verifica se o usuário está logado
function isAuthenticated(req, res, next) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Acesso negado. Faça login primeiro.' });
        }
        next();
    } catch (error) {
        res.status(500).send("Erro de autenticação.");
    }
}

// Verifica se o usuário é administrador
async function isAdmin(req, res, next) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Acesso negado. Faça login primeiro.' });
        }

        // Valida o formato do ID do usuário
        if (!mongoose.Types.ObjectId.isValid(req.session.userId)) {
            return res.status(400).send("ID de usuário inválido.");
        }

        // Busca o usuário no banco de dados
        const user = await User.findById(req.session.userId);
        if (user && user.role === "admin") {
            req.user = user; // Armazena o usuário na requisição
            return next();
        } else {
            return res.status(403).send("Acesso negado! Você não tem permissão.");
        }
    } catch (err) {
        res.status(500).send("Erro ao verificar permissão.");
    }
}

module.exports = { isAuthenticated, isAdmin };
