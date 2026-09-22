// backend/src/models/itens_pedido.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemPedido = sequelize.define('itens_pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  preco_uni: {
    type: DataTypes.REAL,
    allowNull: false,
  },
});

module.exports = ItemPedido;
