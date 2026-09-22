// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// // Rotas de exemplo
// // const authRoutes = require('./src/routes/auth');
// // app.use('/api/auth', authRoutes);

// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'API funcionando!' });
// });

// app.listen(port, () => {
//   console.log(`🚀 Servidor rodando na porta ${port}`);
// });

// backend/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

// Inicialização explícita do banco de dados
require('./src/database');

const app = express();
app.use(cors());
app.use(express.json());

// Injeção das rotas
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando!' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
// backend/server.js
// Entry point unificado — merge do seu backend com o do colega
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
    console.log('Banco de dados SQLite sincronizado com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor Marketplace rodando na porta ${PORT}!`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ou sincronizar o SQLite:', error);
  });
//const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
