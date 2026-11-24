// backend/src/controllers/authController.js
// Autenticação com bcrypt + Sequelize + Google OAuth2 + JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuarios.model');

const JWT_SECRET = process.env.JWT_SECRET || 'secredo_provisorio_123';

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

    // Gera o token JWT para o utilizador recém-registado
    const token = jwt.sign(
      { id: novoUsuario.id, tipo_perfil: novoUsuario.tipo_perfil },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retorna os dados sem expor a senha
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo_perfil: novoUsuario.tipo_perfil,
      },
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

    // Gera o token JWT no momento do login
    const token = jwt.sign(
      { id: user.id, tipo_perfil: user.tipo_perfil },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retorna o tipo_perfil para o frontend decidir qual tela renderizar
    res.json({
      message: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_perfil: user.tipo_perfil,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

const googleLogin = async (req, res) => {
  const { idToken, tipo_perfil } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'Token do Google ausente.' });
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
  if (!googleClientId) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID não configurado no backend/.env.' });
  }

  // 1. Valida o token com o Google
  let payload;
  try {
    const googleClient = new OAuth2Client(googleClientId);
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error('Erro ao validar token do Google:', error.message);
    return res.status(401).json({ error: `Falha ao validar token do Google: ${error.message}` });
  }

  // 2. Busca ou cria o usuário no banco e gera o JWT
  try {
    const { email, name } = payload;

    let user = await Usuario.findOne({ where: { email } });

    if (!user) {
      const senhaFicticiaHash = await bcrypt.hash('CONTA_GOOGLE_SEM_SENHA', 10);

      user = await Usuario.create({
        nome: name || email.split('@')[0],
        email,
        senha_hash: senhaFicticiaHash,
        tipo_perfil: tipo_perfil || 'Cliente',
        cpf: null,
      });
    }

    const token = jwt.sign(
      { id: user.id, tipo_perfil: user.tipo_perfil },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login via Google realizado com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_perfil: user.tipo_perfil,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar/autenticar usuário Google no banco:', error);
    return res.status(500).json({
      error: `Erro no banco de dados ao autenticar com Google: ${error.message}`,
    });
  }
};

module.exports = { register, login, googleLogin };