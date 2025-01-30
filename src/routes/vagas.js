const express = require('express');
const router = express.Router();
const initializeDatabase = require('../db');
const Vaga = require('../models/Vaga');

// Rota para listar todas as vagas ativas
router.get('/', async (req, res) => {
  const db = await initializeDatabase();
  try {
    const vagas = await Vaga.listarTodas(db);
    res.json(vagas);
  } catch (err) {
    console.error("Erro ao listar vagas:", err);
    res.status(500).json({ error: 'Erro ao listar vagas.' });
  }
});

// Rota para buscar uma vaga específica (incluindo responsabilidades e requisitos)
router.get('/:id', async (req, res) => {
  const db = await initializeDatabase();
  try {
    const { id } = req.params;
    const vaga = await Vaga.buscarPorId(db, id);

    if (!vaga) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    res.json(vaga);
  } catch (err) {
    console.error("Erro ao buscar vaga:", err);
    res.status(500).json({ error: 'Erro ao buscar vaga.' });
  }
});

// Rota para criar uma nova vaga
router.post('/', async (req, res) => {
  const db = await initializeDatabase();
  try {
    const { titulo, localizacao, beneficios, link_formulario, responsabilidades, requisitos } = req.body;

    // Validação básica
    if (!titulo || !localizacao || !link_formulario) {
      return res.status(400).json({ error: 'Campos obrigatórios: titulo, localizacao, link_formulario' });
    }

    if (!Array.isArray(responsabilidades) || !Array.isArray(requisitos)) {
      return res.status(400).json({ error: 'Responsabilidades e requisitos devem ser arrays.' });
    }

    const vagaId = await Vaga.criar(db, req.body);
    res.status(201).json({ message: 'Vaga criada com sucesso!', vagaId });
  } catch (err) {
    console.error("Erro ao criar vaga:", err);
    res.status(500).json({ error: 'Erro ao criar vaga.' });
  }
});

// Rota para atualizar o status de uma vaga
router.patch('/:id/status', async (req, res) => {
  const db = await initializeDatabase();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ativa', 'inativa'].includes(status)) {
      return res.status(400).json({ error: "Status inválido. Use 'ativa' ou 'inativa'." });
    }

    await Vaga.atualizarStatus(db, id, status);
    res.json({ message: 'Status da vaga atualizado com sucesso!' });
  } catch (err) {
    console.error("Erro ao atualizar status da vaga:", err);
    res.status(500).json({ error: 'Erro ao atualizar status da vaga.' });
  }
});

// Rota para deletar uma vaga
router.delete('/:id', async (req, res) => {
  const db = await initializeDatabase();
  try {
    const { id } = req.params;

    // Verifica se a vaga existe antes de tentar deletar
    const vaga = await Vaga.buscarPorId(db, id);
    if (!vaga) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }

    await Vaga.deletar(db, id);
    res.json({ message: 'Vaga deletada com sucesso!' });
  } catch (err) {
    console.error("Erro ao deletar vaga:", err);
    res.status(500).json({ error: 'Erro ao deletar vaga.' });
  }
});

module.exports = router;
