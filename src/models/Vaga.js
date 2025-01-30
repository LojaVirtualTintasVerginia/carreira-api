class Vaga {
  /**
   * Lista todas as vagas ativas
   */
  static async listarTodas(db) {
    const query = `SELECT * FROM vagas WHERE status = 'ativa'`;
    return await db.all(query);
  }

  /**
   * Busca uma vaga específica com seus detalhes completos (responsabilidades e requisitos)
   */
  static async buscarPorId(db, id) {
    const vaga = await db.get(`SELECT * FROM vagas WHERE id = ?`, [id]);

    if (!vaga) return null;

    const responsabilidades = await db.all(
      `SELECT descricao FROM responsabilidades WHERE vaga_id = ?`,
      [id]
    );

    const requisitos = await db.all(
      `SELECT descricao FROM requisitos WHERE vaga_id = ?`,
      [id]
    );

    return {
      ...vaga,
      responsabilidades: responsabilidades.map((r) => r.descricao),
      requisitos: requisitos.map((r) => r.descricao),
    };
  }

  /**
   * Cria uma nova vaga e adiciona responsabilidades e requisitos
   */
  static async criar(db, vaga) {
    // Inserir a vaga
    const query = `
      INSERT INTO vagas (titulo, localizacao, beneficios, link_formulario, status)
      VALUES (?, ?, ?, ?, 'ativa')
    `;
    const params = [
      vaga.titulo,
      vaga.localizacao,
      vaga.beneficios || '',
      vaga.link_formulario,
    ];
    const result = await db.run(query, params);
    const vagaId = result.lastID;

    // Inserir responsabilidades
    for (const responsabilidade of vaga.responsabilidades) {
      await db.run(
        `INSERT INTO responsabilidades (vaga_id, descricao) VALUES (?, ?)`,
        [vagaId, responsabilidade]
      );
    }

    // Inserir requisitos
    for (const requisito of vaga.requisitos) {
      await db.run(
        `INSERT INTO requisitos (vaga_id, descricao) VALUES (?, ?)`,
        [vagaId, requisito]
      );
    }

    return vagaId; // Retorna o ID da nova vaga criada
  }

  /**
   * Atualiza o status da vaga (ativa/inativa)
   */
  static async atualizarStatus(db, id, status) {
    const query = `UPDATE vagas SET status = ? WHERE id = ?`;
    return await db.run(query, [status, id]);
  }

  /**
   * Deleta uma vaga e remove suas responsabilidades e requisitos
   */
  static async deletar(db, id) {
    // Remover responsabilidades e requisitos antes de excluir a vaga
    await db.run(`DELETE FROM responsabilidades WHERE vaga_id = ?`, [id]);
    await db.run(`DELETE FROM requisitos WHERE vaga_id = ?`, [id]);

    // Agora deletar a vaga
    const query = `DELETE FROM vagas WHERE id = ?`;
    return await db.run(query, [id]);
  }
}

module.exports = Vaga;
