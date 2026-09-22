// backend/src/controllers/authController.js
// Autenticação com bcrypt + Sequelize
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios.model');

const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo_perfil, cpf } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !email || !senha || !tipo_perfil) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome, email, senha, tipo_perfil' });
    }

    // Verifica se o email já está cadastrado
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash: senhaHash,
      tipo_perfil,
      cpf: cpf || null,
    });

    // Retorna os dados sem expor a senha
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      tipo_perfil: novoUsuario.tipo_perfil,
    });
  } catch (error) {
    console.error('Erro no registro:', error.message);
    res.status(400).json({ error: 'Erro ao cadastrar. Verifique os dados enviados.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Retorna o tipo_perfil para o frontend decidir qual tela renderizar
    res.json({
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo_perfil: user.tipo_perfil,
    });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

module.exports = { register, login };
