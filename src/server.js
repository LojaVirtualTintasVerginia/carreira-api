const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./src/db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3333; // 🔥 Define a porta do Railway ou usa 3333 localmente

app.get("/", (req, res) => {
  res.send("API Rodando no Railway 🚀");
});

// 🔹 Conectar ao banco de dados antes de iniciar o servidor
initializeDatabase().then((db) => {
  app.locals.db = db;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Erro ao inicializar o banco de dados:", err);
});
