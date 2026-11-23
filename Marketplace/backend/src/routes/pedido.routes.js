// backend/src/routes/pedido.routes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido.controller');

// Jornada do Cliente / Checkout
router.post('/checkout', pedidoController.finalizarCompra);
router.get('/historico/:cliente_id', pedidoController.historicoDoCliente);

// Jornada do Vendedor / Gestão de Pedidos Recebidos
router.get('/vendedor/:vendedor_id', pedidoController.pedidosDoVendedor);
router.patch('/:id/status', pedidoController.atualizarStatusPedido);

module.exports = router;