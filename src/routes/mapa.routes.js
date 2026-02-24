const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vw_mapa_lotes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/coordenadas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        g.id,
        ST_X(g.localizacao::geometry) AS longitude,
        ST_Y(g.localizacao::geometry) AS latitude,
        u.nome AS titular,
        CASE 
          WHEN s.id IS NOT NULL THEN true
          ELSE false
        END AS ocupado
      FROM gavetas g
      LEFT JOIN lotes l ON g.lote_id = l.id
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN sepultamentos s ON s.gaveta_id = g.id
      WHERE g.localizacao IS NOT NULL
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;