const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinho.controller');

// Rota para adicionar um produto ao carrinho (POST /api/carrinho)
router.post('/', carrinhoController.adicionarAoCarrinho);

// Rota para listar o carrinho de um cliente específico (GET /api/carrinho/:cliente_id)
router.get('/:cliente_id', carrinhoController.listarCarrinho);

// Rota para remover um item do carrinho (DELETE /api/carrinho/:id)
router.delete('/:id', carrinhoController.removerDoCarrinho);

module.exports = router;