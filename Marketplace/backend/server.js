// backend/server.js
// Entry point — Express + Sequelize + SQLite
require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');

// Importa os modelos para garantir que o Sequelize registre as tabelas antes de sincronizar
require('./src/models/usuarios.model');
require('./src/models/produtos.model');
require('./src/models/pedidos.model');
require('./src/models/itens_pedido.model');

const PORT = process.env.PORT || 3000;

// Sincroniza os modelos com o banco de dados SQLite e inicia o servidor
sequelize.sync()
  .then(() => {
    console.log('✅ Banco de dados SQLite sincronizado com sucesso! (marketplace.db)');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Marketplace rodando na porta ${PORT}!`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ou sincronizar o SQLite:', error);
  });
