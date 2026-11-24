// backend/src/routes/avaliacao.routes.js
const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacao.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/produto/:produtoId', avaliacaoController.listarPorProduto);
router.post('/', verificarToken, avaliacaoController.salvarAvaliacao);

module.exports = router;