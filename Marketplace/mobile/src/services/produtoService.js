// services/produtoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const getImagemUrl = (imagem_url) => {
    if (!imagem_url || imagem_url === '/uploads/produtos/produto-padrao.jpg') {
        return null;
    }

    if (imagem_url.startsWith('http')) return imagem_url;

    const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || '';
    return `${baseUrl}${imagem_url.startsWith('/') ? '' : '/'}${imagem_url}`;
};

const anexarImagemNoFormData = async (formData, imagem) => {
    if (!imagem) return;

    const uri = typeof imagem === 'string' ? imagem : imagem.uri;

    if (!uri || uri.startsWith('/uploads') || uri.startsWith('http://localhost:3000/uploads')) {
        return;
    }

    if (Platform.OS === 'web') {
        if (imagem.file) {
            formData.append('imagem', imagem.file);
        } else {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('imagem', blob, `produto-${Date.now()}.jpg`);
        }
        return;
    }

    const nomeArquivo = imagem.fileName || uri.split('/').pop() || `produto-${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(nomeArquivo);
    const tipo = imagem.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');

    formData.append('imagem', {
        uri,
        name: nomeArquivo,
        type: tipo,
    });
};

// Lista todos os produtos ativos para a vitrine do cliente (GET /api/produtos)
export const listarTodosProdutos = async () => {
    try {
        const response = await api.get('/api/produtos');
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao listar produtos.';
        throw new Error(mensagemErro);
    }
};

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

export const cadastrarProduto = async (nome, descricao, preco_unidade, imagem) => {
    try {
        const userStorage = await AsyncStorage.getItem('@MeuApp:user');
        
        if (!userStorage) {
            throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const user = JSON.parse(userStorage);

        const formData = new FormData();
        formData.append('vendedor_id', String(user.id));
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco_unidade', String(preco_unidade));

        await anexarImagemNoFormData(formData, imagem);

        const config = Platform.OS === 'web' 
            ? {} 
            : { headers: { 'Content-Type': 'multipart/form-data' } };

        const response = await api.post('/api/produtos', formData, config);
        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao cadastrar produto.';
        throw new Error(mensagemErro);
    }
};

export const alterarProduto = async (produto_id, nome, descricao, preco_unidade, imagem) => {
    try {
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco_unidade', String(preco_unidade));

        await anexarImagemNoFormData(formData, imagem);

        const config = Platform.OS === 'web' 
            ? {} 
            : { headers: { 'Content-Type': 'multipart/form-data' } };

        const response = await api.put(`/api/produtos/${produto_id}`, formData, config);
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