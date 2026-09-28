import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOVO: Busca um único produto pelo ID no banco
export const getById = async (produto_id) => {
    try {
        const response = await api.get(`/api/produtos/${produto_id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao buscar o produto.';
        throw new Error(mensagemErro);
    }
};

export const acessarProdutos = async () => {
    try {
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        
        if (!userStorage) {
            throw new Error('Usuário não encontrado no dispositivo.');
        }

        const user = JSON.parse(userStorage);
        const response = await api.get(`/api/produtos/vendedor/${user.id}`);

        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao buscar os produtos.';
        throw new Error(mensagemErro);
    }
};

// CORRIGIDO: Pega o vendedor_id direto do user.id salvo no AsyncStorage
export const cadastrarProduto = async (nome, descricao, preco_unidade) => {
    try {
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        
        if (!userStorage) {
            throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const user = JSON.parse(userStorage);

        const response = await api.post('/api/produtos', {
            vendedor_id: user.id,
            nome,
            descricao,
            preco_unidade
        });

        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao cadastrar produto.';
        throw new Error(mensagemErro);
    }
};

export const alterarProduto = async (produto_id, nome, descricao, preco_unidade) => {
    try {
        const response = await api.put(`/api/produtos/${produto_id}`, {
            nome,
            descricao,
            preco_unidade
        });

        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao alterar produto.';
        throw new Error(mensagemErro);
    }
};

export const deletarProduto = async (produto_id) => {
    try {       
        const response = await api.delete(`/api/produtos/${produto_id}`);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao deletar produto.';
        throw new Error(mensagemErro);
    }
};

export const alterarAtivacaoProduto = async (produto_id, ativo) => {
    try {
        const response = await api.put(`/api/produtos/${produto_id}`, {
            ativo
        });

        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao alterar status do produto.';
        throw new Error(mensagemErro);
    }
};