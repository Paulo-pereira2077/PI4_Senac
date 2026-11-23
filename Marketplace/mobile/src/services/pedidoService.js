// src/services/pedidoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const obterSessao = async () => {
    const userStorage = await AsyncStorage.getItem('@MeuApp:user');
    if (!userStorage) {
        return null;
    }

    const user = JSON.parse(userStorage);
    const token = user?.token || user?.accessToken;
    const userId = user?.id || user?.usuario?.id || user?.user?.id;

    return { user, userId, token };
};

/**
 * @param {{
 *   endereco_entrega_id?: number | null,
 *   total: number,
 *   metodo_pagamento?: string,
 *   itens: Array<{ produto_id: number, quantidade: number, preco_unidade: number }>
 * }} dadosPedido
 */
export const finalizarCompra = async (dadosPedido) => {
    try {
        const sessao = await obterSessao();
        if (!sessao || !sessao.userId) {
            throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const headers = sessao.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.post(
            '/api/pedidos/checkout',
            {
                cliente_id: sessao.userId,
                endereco_entrega_id: dadosPedido.endereco_entrega_id ?? null,
                total: Number(dadosPedido.total) || 0,
                metodo_pagamento: dadosPedido.metodo_pagamento || 'Cartão de Crédito',
                itens: dadosPedido.itens,
            },
            { headers }
        );

        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao finalizar o pedido.';
        throw new Error(mensagemErro);
    }
};

export const listarHistoricoCliente = async () => {
    try {
        const sessao = await obterSessao();
        if (!sessao || !sessao.userId) return [];

        const headers = sessao.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.get(`/api/pedidos/historico/${sessao.userId}`, {
            headers,
        });
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao buscar histórico.';
        throw new Error(mensagemErro);
    }
};

export const listarItensPedido = async () => {
    try {
        const sessao = await obterSessao();
        const headers = sessao?.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.get('/api/itens-pedido', { headers });
        return response.data;
    } catch (error) {
        return [];
    }
};