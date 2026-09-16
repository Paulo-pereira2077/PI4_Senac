const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './marketplace.db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite conectado e operante!');
  } catch (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
    process.exit(1);
  }
};

module.exports = sequelize;
module.exports.connectDB = connectDB;
