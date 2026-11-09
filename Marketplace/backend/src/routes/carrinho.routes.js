const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinho.controller');

// Importar as nossas barreiras de segurança
const { verificarToken } = require('../middlewares/auth.middleware');
const { autorizarPerfis } = require('../middlewares/role.middleware');

// Adicionamos as barreiras ANTES do controller.
// Apenas utilizadores com JWT válido E com o perfil 'cliente' podem usar o carrinho.

// Rota para adicionar um produto ao carrinho (POST /api/carrinho)
router.post('/', verificarToken, autorizarPerfis(['cliente']), carrinhoController.adicionarAoCarrinho);

// Rota para listar o carrinho de um cliente específico (GET /api/carrinho/:cliente_id)
router.get('/:cliente_id', verificarToken, autorizarPerfis(['cliente']), carrinhoController.listarCarrinho);

// Rota para remover um item do carrinho (DELETE /api/carrinho/:id)
router.delete('/:id', verificarToken, autorizarPerfis(['cliente']), carrinhoController.removerDoCarrinho);

module.exports = router;