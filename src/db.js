const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function initializeDatabase() {
  const db = await open({
    filename: "./vagas.db",
    driver: sqlite3.Database,
  });

  // Criar tabela principal de vagas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS vagas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      localizacao TEXT NOT NULL,
      beneficios TEXT,
      link_formulario TEXT NOT NULL,
      status TEXT DEFAULT 'ativa',
      criada_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criar tabela de responsabilidades associadas às vagas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS responsabilidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vaga_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      FOREIGN KEY (vaga_id) REFERENCES vagas(id) ON DELETE CASCADE
    )
  `);

  // Criar tabela de requisitos associados às vagas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS requisitos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vaga_id INTEGER NOT NULL,
      descricao TEXT NOT NULL,
      FOREIGN KEY (vaga_id) REFERENCES vagas(id) ON DELETE CASCADE
    )
  `);

  return db;
}

module.exports = initializeDatabase;