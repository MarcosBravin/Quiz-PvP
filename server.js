require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");
const socketIo = require("socket.io");
const Question = require("./models/Question");
const { addToQueue } = require("./sockets/matchmaking");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro de conexão:", err));

// Configuração do EJS
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sharedSession = require("express-socket.io-session");

// Configurar Socket.io para usar a mesma sessão do Express
const sessionMiddleware = session({
  secret: "segredoquiz",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
});

// Aplicar o middleware de sessão ao Express
app.use(sessionMiddleware);

// Compartilhar a sessão com o Socket.io
io.use(sharedSession(sessionMiddleware, {
  autoSave: true, // Salva automaticamente a sessão quando alterada
}));


// Middleware global para autenticação
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null;
  res.locals.role = req.session.role || "user";
  next();
});

// Importar rotas
const indexRoutes = require("./routes/indexRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");
const lojaRoutes = require("./routes/lojaRoutes");

// Definir rotas
app.use("/", indexRoutes);
app.use("/", aboutRoutes);
app.use("/", lojaRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", dashboardRoutes);
app.use("/", rankingRoutes);
app.use("/", gameRoutes);
app.use("/admin", adminRoutes);
app.use("/game", questionRoutes);
app.use("/uploads", express.static("public/uploads"));
app.use("/uploads", express.static("public/img"));
app.use("/", quizRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.render("index", { userId: req.session.userId });
});

io.on("connection", async (socket) => {
  console.log("Sessão do socket:", socket.handshake.session);
  
  const userId = socket.handshake.session?.userId;
  if (!userId) {
      console.log("Conexão recusada: usuário não autenticado.");
      socket.disconnect(true);
      return;
  }

  const User = mongoose.model("User");
  const player = await User.findById(new mongoose.Types.ObjectId(userId));
  
  if (!player) {
      console.log(`Usuário com ID ${userId} não encontrado.`);
      socket.disconnect(true);
      return;
  }

  socket.player = player;
  console.log(`Jogador conectado: ${player.name}`);

  socket.on("joinQueue", () => addToQueue(socket));

  socket.on("disconnect", () => {
      console.log(`Jogador desconectado: ${socket.player.name}`);
  });
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
