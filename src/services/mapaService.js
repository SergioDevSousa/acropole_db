const pool = require('../db');

async function listarCoordenadas() {
  const result = await pool.query(`
    SELECT 
      id,
      ST_X(localizacao::geometry) AS longitude,
      ST_Y(localizacao::geometry) AS latitude
    FROM gavetas
    WHERE localizacao IS NOT NULL
  `);

  return result.rows;
}

module.exports = { listarCoordenadas };