// backend/src/routes/authRoutes.js
<<<<<<< HEAD
// Rotas de autenticação — contrato do app mobile
=======
>>>>>>> origin
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

<<<<<<< HEAD
// POST /api/auth/register — recebe { nome, email, senha, tipo_perfil }
router.post('/register', authController.register);

// POST /api/auth/login — retorna { id, nome, tipo_perfil }
=======
router.post('/register', authController.register);
>>>>>>> origin
router.post('/login', authController.login);

module.exports = router;