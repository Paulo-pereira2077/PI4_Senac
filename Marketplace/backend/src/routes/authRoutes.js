// backend/src/routes/authRoutes.js
<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// Cadastro
router.post('/register', async (req, res) => {
  const { nome, email, senha, tipo_perfil } = req.body;

  if (!nome || !email || !senha || !tipo_perfil) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    const sql = `
      INSERT INTO usuarios (nome, email, senha_hash, tipo_perfil)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [nome, email, senha_hash, tipo_perfil], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      }

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso.',
        userId: this.lastID,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha.' });
  }

  const sql = `SELECT * FROM usuarios WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    return res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo_perfil: user.tipo_perfil,
    });
  });
});
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8

module.exports = router;