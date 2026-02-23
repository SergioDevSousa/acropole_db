const express = require('express');
const router = express.Router();
const controller = require('../controllers/responsavelController');

router.post('/', controller.criar);
router.get('/', controller.listar);

module.exports = router;