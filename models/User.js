const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // A senha será criptografada antes de salvar
  score: { type: Number, default: 0 },
  role: { 
    type: String, 
    enum: ["user", "moderator", "admin"], 
    default: "user" 
  }, // Define níveis de acesso
  isBanned: { type: Boolean, default: false }, // Status de banimento
  createdAt: { type: Date, default: Date.now },
  avatar: { type: String, default: "/default-avatar.png" } // 🖼️ Adicionando campo de avatar
});



// 🔑 Método para comparar senha
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🚫 Verifica se o usuário está ativo (não banido)
UserSchema.methods.isActive = function () {
  return !this.isBanned;
};

// 🔥 Verifica se o usuário tem permissão mínima para uma ação
UserSchema.methods.hasRole = function (role) {
  const roleHierarchy = ["user", "moderator", "admin"];
  return roleHierarchy.indexOf(this.role) >= roleHierarchy.indexOf(role);
};

module.exports = mongoose.model("User", UserSchema);
