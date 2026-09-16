// backend/src/routes/authRoutes.js
// Rotas de autenticação — contrato do app mobile
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register — recebe { nome, email, senha, tipo_perfil }
router.post('/register', authController.register);

// POST /api/auth/login — retorna { id, nome, tipo_perfil }
router.post('/login', authController.login);

module.exports = router;