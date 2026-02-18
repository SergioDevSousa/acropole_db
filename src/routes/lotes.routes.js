const express = require('express');
const controller = require('../controllers/lotes.controller');
const pool = require('../db');

const router = express.Router();

router.get('/', controller.listar);
router.post('/', controller.criar);
router.post('/:id/transferir', controller.transferirTitularidade);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;