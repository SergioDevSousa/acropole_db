const express = require('express');
const pool = require('../db');

const router = express.Router();

// 🔎 LISTAR
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id,
             f.nome AS falecido,
             g.numero AS gaveta,
             s.data_sepultamento,
             s.tipo
      FROM sepultamentos s
      JOIN falecidos f ON s.falecido_id = f.id
      JOIN gavetas g ON s.gaveta_id = g.id
      ORDER BY s.id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ CRIAR
router.post('/', async (req, res) => {
  const { falecido_id, gaveta_id, tipo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO sepultamentos (falecido_id, gaveta_id, data_sepultamento, tipo)
       VALUES ($1, $2, CURRENT_DATE, $3)
       RETURNING *`,
      [falecido_id, gaveta_id, tipo]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ ATUALIZAR
router.put('/:id', async (req, res) => {
  const { falecido_id, gaveta_id, tipo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sepultamentos
       SET falecido_id = $1,
           gaveta_id = $2,
           tipo = $3
       WHERE id = $4
       RETURNING *`,
      [falecido_id, gaveta_id, tipo, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ DELETAR
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM sepultamentos WHERE id = $1`,
      [req.params.id]
    );

    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;