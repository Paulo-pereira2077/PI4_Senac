// backend/src/models/carrinho.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrinho = sequelize.define('Carrinho', {
    cliente_id: { type: DataTypes.INTEGER, allowNull: false },
    produto_id: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
    tableName: 'itens_carrinho',
    timestamps: true
});

module.exports = Carrinho;