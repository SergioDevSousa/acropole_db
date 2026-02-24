const pool = require('../db');
const { encrypt, decrypt } = require('../crypto');

function mascararCPF(cpf) {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '***.***.***-$4');
}

async function criarResponsavel(dados) {
  const cpfCriptografado = encrypt(dados.cpf);

  await pool.query(
    `INSERT INTO responsavel (nome, cpf, telefone, email)
     VALUES ($1, $2, $3, $4)`,
    [dados.nome, cpfCriptografado, dados.telefone, dados.email]
  );
}

async function listarResponsaveis(role) {
  const result = await pool.query(`SELECT * FROM responsavel`);

  return result.rows.map(r => {
    const cpfDescriptografado = decrypt(r.cpf);

    return {
      id: r.id,
      nome: r.nome,
      cpf:
        role === 'admin'
          ? cpfDescriptografado
          : mascararCPF(cpfDescriptografado),
      telefone: r.telefone,
      email: r.email
    };
  });
}


module.exports = {
  criarResponsavel,
  listarResponsaveis
};