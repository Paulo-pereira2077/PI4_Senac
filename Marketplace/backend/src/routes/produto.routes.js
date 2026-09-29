// backend/src/routes/produto.routes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produto.controller');
const upload = require('../config/multer'); // Importa a configuração do Multer

router.get('/', produtoController.getAll);
router.get('/vendedor/:vendedorId', produtoController.getByVendedor);
router.get('/:id', produtoController.getById);

// upload.single('imagem') intercepta o arquivo enviado no campo 'imagem' do FormData
router.post('/', upload.single('imagem'), produtoController.create);

router.put('/:id', upload.single('imagem'), produtoController.update);

router.delete('/:id', produtoController.deleteProduto);

module.exports = router;