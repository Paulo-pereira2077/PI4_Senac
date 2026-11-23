require('dotenv').config(); // Garante que o .env seja lido antes
const { MercadoPagoConfig } = require('mercadopago');

console.log('Token MP carregado:', process.env.MP_ACCESS_TOKEN ? 'SIM' : 'VAZIO');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

module.exports = client;    