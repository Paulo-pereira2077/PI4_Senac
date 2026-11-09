// backend/src/controllers/authController.js
// Autenticação com bcrypt + Sequelize + Google OAuth2 + JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuarios.model');

// Configuração do Google e JWT
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
      token, // Frontend precisa do token para as próximas requisições
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo_perfil: novoUsuario.tipo_perfil,
      }
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
      token, // Envia o token para o Expo guardar (AsyncStorage)
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_perfil: user.tipo_perfil,
      }
    });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: 'Token do Google ausente.' });
    }

    // 1. O Google valida se o token é autêntico e devolve os dados da conta
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 2. Verifica se o email já existe na nossa base de dados
    let user = await Usuario.findOne({ where: { email } });

    if (!user) {
      // 3. Cadastra o novo utilizador gerando um hash genérico para a senha obrigatória
      const senhaFicticiaHash = await bcrypt.hash('CONTA_GOOGLE_SEM_SENHA', 10);
      
      user = await Usuario.create({
        nome: name,
        email: email,
        senha_hash: senhaFicticiaHash,
        tipo_perfil: 'cliente', // Define 'cliente' como padrão para quem entra via Google
        cpf: null
      });
    }

    // 4. Gera o token JWT usando os dados encontrados ou criados
    const token = jwt.sign(
      { id: user.id, tipo_perfil: user.tipo_perfil },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Devolve exatamente a mesma estrutura do login normal
    res.status(200).json({
      message: 'Login via Google realizado com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo_perfil: user.tipo_perfil,
      }
    });

  } catch (error) {
    console.error('Erro no login via Google:', error.message);
    res.status(401).json({ error: 'Token do Google inválido ou expirado.', detalhe: error.message });
  }
};

module.exports = { register, login, googleLogin };