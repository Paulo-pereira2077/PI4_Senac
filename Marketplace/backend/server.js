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
