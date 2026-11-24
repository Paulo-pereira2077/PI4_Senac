// backend/src/routes/cupom.routes.js
const express = require('express');
const router = express.Router();
const cupomController = require('../controllers/cupom.controller');

router.get('/', cupomController.listarCupons);
router.post('/validar', cupomController.validarCupom);

module.exports = router;