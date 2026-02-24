require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// console.log('JWT_SECRET no authService:', process.env.JWT_SECRET);

async function login(email, senha) {
  const result = await pool.query(
    'SELECT * FROM usuarios_sistema WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const usuario = result.rows[0];

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    { id: usuario.id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return token;
}

module.exports = { login };