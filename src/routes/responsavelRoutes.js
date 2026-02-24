const express = require('express');
const router = express.Router();
const controller = require('../controllers/responsavelController');
const autenticar = require('../middlewares/authMiddleware');

router.get('/', autenticar, controller.listar);
router.post('/', autenticar, controller.criar);

module.exports = router;
