// services/carrinhoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const obterSessao = async () => {
    const userStorage = await AsyncStorage.getItem('@MeuApp:user');
    if (!userStorage) {
        return null;
    }

    const user = JSON.parse(userStorage);
    const token = user?.token || user?.accessToken;
    const userId = user?.id || user?.usuario?.id;

    return { user, userId, token };
};

export const adicionarAoCarrinho = async (produto_id, quantidade = 1) => {
    try {
        const sessao = await obterSessao();
        if (!sessao || !sessao.token) {
            throw new Error('Faça login para adicionar produtos ao carrinho.');
        }

        const response = await api.post(
            '/api/carrinho',
            {
                cliente_id: sessao.userId,
                produto_id: Number(produto_id),
                quantidade: Number(quantidade),
            },
            {
                headers: {
                    Authorization: `Bearer ${sessao.token}`,
                },
            }
        );

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
        const sessao = await obterSessao();
        if (!sessao || !sessao.token) return [];

        const response = await api.get(`/api/carrinho/${sessao.userId}`, {
            headers: {
                Authorization: `Bearer ${sessao.token}`,
            },
        });
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
        const sessao = await obterSessao();
        if (!sessao || !sessao.token) {
            throw new Error('Faça login para remover itens do carrinho.');
        }

        const response = await api.delete(`/api/carrinho/${id}`, {
            headers: {
                Authorization: `Bearer ${sessao.token}`,
            },
        });
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