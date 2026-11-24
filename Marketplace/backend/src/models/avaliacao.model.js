// backend/src/models/avaliacao.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avaliacao = sequelize.define(
  'Avaliacao',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    autor_nome: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Cliente',
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
  },
  {
    tableName: 'avaliacoes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['produto_id', 'usuario_id'],
      },
    ],
  }
);

module.exports = Avaliacao;