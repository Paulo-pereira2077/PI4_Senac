// backend/src/routes/authRoutes.js
// Rotas de autenticação — contrato com o app mobile
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register — recebe { nome, email, senha, tipo_perfil, cpf }
router.post('/register', authController.register);

// POST /api/auth/login — retorna { id, nome, email, tipo_perfil }
router.post('/login', authController.login);

module.exports = router;