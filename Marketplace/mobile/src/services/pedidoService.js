// src/services/pedidoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        if (!userStorage) {
            throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const user = JSON.parse(userStorage);

        const response = await api.post('/api/pedidos/checkout', {
            cliente_id: user.id,
            endereco_entrega_id: dadosPedido.endereco_entrega_id ?? null,
            total: dadosPedido.total,
            metodo_pagamento: dadosPedido.metodo_pagamento || 'Cartão de Crédito',
            itens: dadosPedido.itens,
        });

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
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        if (!userStorage) return [];

        const user = JSON.parse(userStorage);
        const response = await api.get(`/api/pedidos/historico/${user.id}`);
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
        const response = await api.get('/api/itens-pedido');
        return response.data;
    } catch (error) {
        return [];
    }
};