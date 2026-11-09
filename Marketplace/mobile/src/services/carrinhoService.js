// services/carrinhoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const adicionarAoCarrinho = async (produto_id, quantidade = 1) => {
    try {
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        if (!userStorage) {
            throw new Error('Faça login para adicionar produtos ao carrinho.');
        }

        const user = JSON.parse(userStorage);
        const response = await api.post('/api/carrinho', {
            cliente_id: user.id,
            produto_id: Number(produto_id),
            quantidade: Number(quantidade),
        });

        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao adicionar item ao carrinho.';
        throw new Error(mensagemErro);
    }
};

export const listarCarrinho = async () => {
    try {
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        if (!userStorage) return [];

        const user = JSON.parse(userStorage);
        const response = await api.get(`/api/carrinho/${user.id}`);
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao buscar carrinho.';
        throw new Error(mensagemErro);
    }
};

export const removerDoCarrinho = async (id) => {
    try {
        const response = await api.delete(`/api/carrinho/${id}`);
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao remover item do carrinho.';
        throw new Error(mensagemErro);
    }
};