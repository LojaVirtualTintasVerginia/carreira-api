const express = require('express');
const cors = require('cors');
const vagasRoutes = require('./routes/vagas');

const app = express();
const PORT = process.env.PORT || 3333;

// Configuração do CORS para permitir requisições do frontend
app.use(cors({
  origin: [
    "http://localhost:3000",  // Permite localhost para desenvolvimento
    "https://carreiras-git-main-lojavirtualtintasverginias-projects.vercel.app", // Permite Vercel
  ],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // Permite envio de JSON no corpo das requisições

app.use('/vagas', vagasRoutes); // Rotas de vagas

app.get('/', (req, res) => {
  res.send('API de Vagas rodando 🚀');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});