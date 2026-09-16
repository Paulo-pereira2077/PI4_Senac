const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', 
  {
    vendedor_id: {
      type: DataTypes.INTEGER, 
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT, 
      allowNull: false
    },
    preco_unidade: { 
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O valor de cada unidade não pode ser menor que 0'
        }
      }
    }
  },
  {
    timestamps: true,
    tableName: 'produtos'
  }
);

module.exports = Produto;
