const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// ==========================================
// NOVAS ROTAS (Jornada do Cliente / Checkout)
// ==========================================
router.post('/checkout', pedidoController.finalizarCompra);
router.get('/historico/:cliente_id', pedidoController.historicoDoCliente);

// ==========================================
// ROTAS PADRÃO (CRUD Antigo - Pausadas temporariamente)
// ==========================================
// Quando precisar destas rotas para o painel de administrador, 
// basta recriar as funções no controller e remover as barras (//) abaixo:

// router.get('/', pedidoController.getAll);
// router.get('/:id', pedidoController.getById);
// router.post('/', pedidoController.create);
// router.put('/:id', pedidoController.update);
// router.delete('/:id', pedidoController.deletePedido);

module.exports = router;