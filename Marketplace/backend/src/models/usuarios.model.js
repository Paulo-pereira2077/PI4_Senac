// backend/src/models/usuarios.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo_perfil: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Usuario;
