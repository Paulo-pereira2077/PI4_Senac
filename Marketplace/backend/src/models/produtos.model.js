// backend/src/models/produtos.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('produtos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vendedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preco_unidade: {
    type: DataTypes.REAL,
    allowNull: false,
    defaultValue: 0,
  },
  imagem_url: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '/uploads/produtos/produto-padrao.jpg', 
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, 
  },
});

module.exports = Produto;