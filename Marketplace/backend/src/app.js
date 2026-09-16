// backend/src/app.js
// Configuração do Express com CORS e todas as rotas
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de autenticação (contrato com o app mobile)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rotas CRUD (backend do colega)
const usuarioRoutes = require('./routes/usuario.routes');
const produtoRoutes = require('./routes/produto.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const itensPedidoRoutes = require('./routes/itens_pedido.routes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/itens-pedido', itensPedidoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Marketplace funcionando!' });
});

// EXPORTAÇÃO OBRIGATÓRIA:
module.exports = app;
