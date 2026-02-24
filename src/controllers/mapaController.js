const mapaService = require('../services/mapaService');

async function listar(req, res) {
  try {
    const dados = await mapaService.listarCoordenadas();
    res.json(dados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { listar };