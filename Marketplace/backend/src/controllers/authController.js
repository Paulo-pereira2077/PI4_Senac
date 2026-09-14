// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo_perfil } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const newUser = await userRepository.createUser(nome, email, senhaHash, tipo_perfil);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar. Email pode já existir.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await userRepository.findUserByEmail(email);

    if (user && await bcrypt.compare(senha, user.senha_hash)) {
      // Retorna o tipo_perfil para o frontend decidir qual tela renderizar (Dashboard ou Home)
      res.json({ id: user.id, nome: user.nome, tipo_perfil: user.tipo_perfil });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

module.exports = { register, login };