import api from './api';
import { obterUsuarioLogado } from './authService';

const obterHeadersAuth = async () => {
  const usuario = await obterUsuarioLogado();
  const token = usuario?.token || usuario?.accessToken;

  if (!token) {
    throw new Error('Sessão expirada. Faça login novamente para continuar.');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const criarPreferenciaPagamento = async (pedidoId, itens) => {
  const headers = await obterHeadersAuth();

  const response = await api.post(
    '/pagamentos/criar-preferencia',
    { pedidoId, itens },
    { headers }
  );

  return response.data;
};

export const atualizarStatusPagamento = async (pedidoId, statusMP) => {
  const headers = await obterHeadersAuth();

  const response = await api.patch(
    '/pagamentos/status',
    { pedidoId, statusMP },
    { headers }
  );

  return response.data;
};