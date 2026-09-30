// backend/src/models/pedidos.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
    cliente_id: { type: DataTypes.INTEGER, allowNull: false },
    endereco_entrega_id: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pendente' },
    metodo_pagamento: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'pedidos',
    timestamps: true
});

module.exports = Pedido;