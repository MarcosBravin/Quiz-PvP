const mongoose = require('mongoose');

const pvpRoomSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PvpRoom', pvpRoomSchema);
