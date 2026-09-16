const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', 
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'O total não pode ser menor que 0'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('Pendente', 'Pago', 'Cancelado'),
      allowNull: false,
      defaultValue: 'Pendente',
      validate: {
        isIn: {
          args: [['Pendente', 'Pago', 'Cancelado']],
          msg: 'O status informado não é válido'
        }
      }
    }
  },
  {
    timestamps: true,
    tableName: 'pedidos'
  }
);

module.exports = Pedido;
