// backend/src/config/database.js
// Configuração do Sequelize com SQLite local
const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', '..', process.env.DB_STORAGE || './marketplace.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = sequelize;
