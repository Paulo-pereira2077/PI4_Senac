const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamento.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/criar-preferencia', verificarToken, pagamentoController.criarPreferencia);
router.patch('/status', verificarToken, pagamentoController.atualizarStatus);
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;