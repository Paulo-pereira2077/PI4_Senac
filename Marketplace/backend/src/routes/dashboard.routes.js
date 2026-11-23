const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { autorizarPerfis } = require('../middlewares/role.middleware');

router.post(
  '/gerar-codigo',
  verificarToken,
  autorizarPerfis(['vendedor', 'admin']),
  dashboardController.gerarCodigoAcesso
);

router.post('/trocar-codigo', dashboardController.trocarCodigo);

router.get(
  '/metricas',
  verificarToken,
  autorizarPerfis(['vendedor', 'admin']),
  dashboardController.obterMetricas
);

router.get(
  '/exportar',
  verificarToken,
  autorizarPerfis(['vendedor', 'admin']),
  dashboardController.exportarDados
);

module.exports = router;