const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./src/db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3333; // 🔥 Pega a porta do ambiente ou usa 3333

app.get("/", (req, res) => {
  res.send("API Rodando no Render 🚀");
});

// 🔹 Conectar ao banco de dados antes de iniciar o servidor
initializeDatabase().then((db) => {
  app.locals.db = db;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Erro ao inicializar o banco de dados:", err);
});
