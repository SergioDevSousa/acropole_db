const authService = require('../services/authService');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const token = await authService.login(email, senha);

    res.json({ token });
  } catch (error) {
    res.status(401).json({ erro: error.message });
  }
}

module.exports = { login };