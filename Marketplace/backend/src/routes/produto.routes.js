// backend/src/routes/produto.routes.js
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produto.controller');
const upload = require('../config/multer'); // Importa a configuração do Multer

// Importar as nossas barreiras de segurança
const { verificarToken } = require('../middlewares/auth.middleware');
const { autorizarPerfis } = require('../middlewares/role.middleware');

// Adicionamos as barreiras ANTES do controller.
// Apenas Vendedores e Admins podem manipular produtos. Clientes apenas visualizam (GET).

router.get('/', produtoController.getAll);
router.get('/vendedor/:vendedorId', produtoController.getByVendedor);
router.get('/:id', produtoController.getById);

// upload.single('imagem') intercepta o arquivo enviado no campo 'imagem' do FormData
router.post('/', verificarToken, autorizarPerfis(['vendedor', 'admin']), upload.single('imagem'), produtoController.create);

router.put('/:id', verificarToken, autorizarPerfis(['vendedor', 'admin']), upload.single('imagem'), produtoController.update);

router.delete('/:id', verificarToken, autorizarPerfis(['vendedor', 'admin']), produtoController.deleteProduto);

module.exports = router;