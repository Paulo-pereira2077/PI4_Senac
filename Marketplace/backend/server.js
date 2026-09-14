const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas de exemplo
// const authRoutes = require('./src/routes/auth');
// app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando!' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});

console.log('ARQUIVO CERTO EXECUTADO');
console.log('Porta definida:', 3005);
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

