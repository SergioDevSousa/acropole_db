const pool = require('../db');

exports.listar = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM gavetas ORDER BY id'
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
      `INSERT INTO gavetas (lote_id, numero)
       VALUES ($1, $2)
       RETURNING *`,
      [lote_id, numero]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.atualizar = async (req, res) => {
  const { lote_id, numero, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE gavetas
       SET lote_id=$1, numero=$2, status=$3
       WHERE id=$4
       RETURNING *`,
      [lote_id, numero, status, req.params.id]
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