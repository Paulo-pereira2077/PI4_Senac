// services/cupomService.js
import api from './api';

export const validarCupomNoServidor = async (codigo, subtotal, frete = 4.99) => {
  try {
    const response = await api.post('/api/cupons/validar', {
      codigo: String(codigo || '').trim().toUpperCase(),
      subtotal: Number(subtotal) || 0,
      frete: Number(frete) || 0,
    });
    return response.data;
  } catch (error) {
    const mensagemErro =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Cupom inválido.';
    throw new Error(mensagemErro);
  }
};