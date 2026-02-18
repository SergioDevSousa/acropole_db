const pool = require('../db');

exports.listar = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lotes ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gavetas WHERE id = $1',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.criar = async (req, res) => {
  const { lote_id, numero } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO gavetas (quadra_id, numero)
       VALUES ($1, $2)
       RETURNING *`,
      [lote_id, numero]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.transferirTitularidade = async (req, res) => {
  const loteId = req.params.id;
  const { novo_usuario_id } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // verifica usuário
    const usuario = await client.query(
      'SELECT id FROM usuarios WHERE id = $1',
      [novo_usuario_id]
    );

    if (usuario.rowCount === 0) {
      throw new Error('Usuário não existe.');
    }

    // encerra titular atual
    await client.query(
      `UPDATE lote_titularidade
       SET ativo = FALSE,
           data_fim = CURRENT_DATE
       WHERE lote_id = $1
       AND ativo = TRUE`,
      [loteId]
    );

    // cria novo titular
    await client.query(
      `INSERT INTO lote_titularidade (lote_id, usuario_id)
       VALUES ($1, $2)`,
      [loteId, novo_usuario_id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Titularidade transferida com sucesso.' });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.atualizar = async (req, res) => {
  const { quadra_id, numero, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE gavetas
       SET quadra_id=$1, numero=$2, status=$3
       WHERE id=$4
       RETURNING *`,
      [quadra_id, numero, status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remover = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM gavetas WHERE id=$1',
      [req.params.id]
    );

    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};