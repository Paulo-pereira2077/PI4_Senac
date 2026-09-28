const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produto.controller');

router.get('/', produtoController.getAll);
router.get('/:id', produtoController.getById);
router.get('/vendedor/:vendedorId', produtoController.getByVendedor);

router.post('/', produtoController.create);

router.put('/:id', produtoController.update);

router.delete('/:id', produtoController.deleteProduto);

module.exports = router;
