// backend/src/routes/carrinho.routes.js
const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinho.controller');

const { verificarToken } = require('../middlewares/auth.middleware');
const { autorizarPerfis } = require('../middlewares/role.middleware');

router.post('/', verificarToken, autorizarPerfis(['cliente']), carrinhoController.adicionarAoCarrinho);
router.put('/:id', verificarToken, autorizarPerfis(['cliente']), carrinhoController.atualizarQuantidade);
router.get('/:cliente_id', verificarToken, autorizarPerfis(['cliente']), carrinhoController.listarCarrinho);
router.delete('/:id', verificarToken, autorizarPerfis(['cliente']), carrinhoController.removerDoCarrinho);

module.exports = router;