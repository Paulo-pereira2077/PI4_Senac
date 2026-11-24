// backend/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const usuarioRoutes = require('./routes/usuario.routes');
const produtoRoutes = require('./routes/produto.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const carrinhoRoutes = require('./routes/carrinho.routes');
const itensPedidoRoutes = require('./routes/itens_pedido.routes');
const pagamentoRoutes = require('./routes/pagamento.routes');
const avaliacaoRoutes = require('./routes/avaliacao.routes');
const cupomRoutes = require('./routes/cupom.routes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/itens-pedido', itensPedidoRoutes);
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/cupons', cupomRoutes);
app.use('/pagamentos', pagamentoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Marketplace funcionando!' });
});

module.exports = app;