const pool = require('../db');

exports.listar = async (req, res) => {
  const result = await pool.query('SELECT * FROM falecidos ORDER BY id');
  res.json(result.rows);
};

exports.buscarPorId = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM falecidos WHERE id = $1',
    [req.params.id]
  );
  res.json(result.rows[0]);
};

exports.criar = async (req, res) => {
  const { nome, data_nascimento, data_obito, cpf } = req.body;

  const result = await pool.query(
    `INSERT INTO falecidos (nome, data_nascimento, data_obito, cpf)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [nome, data_nascimento, data_obito, cpf]
  );

  res.json(result.rows[0]);
};

exports.atualizar = async (req, res) => {
  const { nome, data_nascimento, data_obito, cpf } = req.body;

  const result = await pool.query(
    `UPDATE falecidos
     SET nome=$1, data_nascimento=$2, data_obito=$3, cpf=$4
     WHERE id=$5
     RETURNING *`,
    [nome, data_nascimento, data_obito, cpf, req.params.id]
  );

  res.json(result.rows[0]);
};

exports.remover = async (req, res) => {
  await pool.query('DELETE FROM falecidos WHERE id=$1', [req.params.id]);
  res.json({ message: 'Removido com sucesso' });
};