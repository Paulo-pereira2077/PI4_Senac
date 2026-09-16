const express = require('express');
const router = express.Router();
const itensPedidoController = require('../controllers/itens_pedido.controller');

router.get('/', itensPedidoController.getAll);
router.get('/:id', itensPedidoController.getById);

router.post('/', itensPedidoController.create);

router.put('/:id', itensPedidoController.update);

router.delete('/:id', itensPedidoController.deleteItensPedido);

module.exports = router;
