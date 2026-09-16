const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', 
  {
    nome: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: {
        isEmail: true 
      }
    },
    senha_hash: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    tipo_perfil: {
      type: DataTypes.ENUM('Cliente', 'Vendedor', 'Admin'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Cliente', 'Vendedor', 'Admin']],
          msg: "O tipo_perfil não é válido" 
        }
      }
    }
  },
  {
    timestamps: true,
    tableName: 'usuarios' 
  }
);

module.exports = Usuario; 
