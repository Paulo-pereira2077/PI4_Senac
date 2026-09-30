const { Sequelize } = require('sequelize');
const path = require('path');

// Cria uma instância do Sequelize apontando para o seu banco SQLite atual
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../marketplace.db'), // Aponta para o seu arquivo .db
  logging: false // Mude para console.log se quiser ver o SQL gerado no terminal
});

module.exports = sequelize;