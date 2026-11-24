// backend/src/models/cupom.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cupom = sequelize.define(
  'Cupom',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipo_desconto: {
      type: DataTypes.STRING, // 'porcentagem' | 'valor_fixo' | 'frete_gratis'
      allowNull: false,
      defaultValue: 'porcentagem',
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    valor_minimo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: 'cupons',
    timestamps: true,
  }
);

module.exports = Cupom;