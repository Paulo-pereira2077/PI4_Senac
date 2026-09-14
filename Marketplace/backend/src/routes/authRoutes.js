// backend/src/routes/authRoutes.js
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

module.exports = router;