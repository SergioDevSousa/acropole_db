const responsavelService = require('../services/responsavelService');

async function criar(req, res) {
  try {
    await responsavelService.criarResponsavel(req.body);
    res.status(201).json({ mensagem: 'Responsável criado com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function listar(req, res) {
  try {
    const dados = await responsavelService.listarResponsaveis(
      req.usuario.role
    );
    res.json(dados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { criar, listar };