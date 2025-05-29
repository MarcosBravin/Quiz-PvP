const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true }, // Array de opções
    correctIndex: { type: Number, required: true }, // Índice da resposta correta
    category: { type: String, enum: ["História", "Ciências", "Matemática", "Geografia", "Entretenimento"], required: true },
    difficulty: { type: String, enum: ["Fácil", "Médio", "Difícil"], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
