const pool = require('../db');
const { encrypt, decrypt } = require('../crypto');

async function criarResponsavel(dados) {
  const cpfCriptografado = encrypt(dados.cpf);

  await pool.query(
    `INSERT INTO responsavel (nome, cpf, telefone, email)
     VALUES ($1, $2, $3, $4)`,
    [dados.nome, cpfCriptografado, dados.telefone, dados.email]
  );
}

async function listarResponsaveis() {
  const result = await pool.query(`SELECT * FROM responsavel`);

  return result.rows.map(r => ({
    id: r.id,
    nome: r.nome,
    cpf: decrypt(r.cpf),
    telefone: r.telefone,
    email: r.email
  }));
}

module.exports = {
  criarResponsavel,
  listarResponsaveis
};