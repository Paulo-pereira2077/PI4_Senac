// services/produtoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

export const getImagemUrl = (imagem_url) => {
    if (!imagem_url || imagem_url === '/uploads/produtos/produto-padrao.jpg') {
        return null;
    }

    const urlLimpa = String(imagem_url).trim();

    if (
        urlLimpa.startsWith('blob:') ||
        urlLimpa.startsWith('data:') ||
        urlLimpa.startsWith('file:')
    ) {
        return urlLimpa;
    }

    const baseUrl = api.defaults.baseURL?.replace(/\/$/, '') || '';

    if (urlLimpa.startsWith('http://localhost:3000') || urlLimpa.startsWith('http://127.0.0.1:3000')) {
        const caminhoSemHost = urlLimpa.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
        return baseUrl ? `${baseUrl}${caminhoSemHost.startsWith('/') ? '' : '/'}${caminhoSemHost}` : caminhoSemHost;
    }

    if (urlLimpa.startsWith('http')) {
        return urlLimpa;
    }

    return baseUrl ? `${baseUrl}${urlLimpa.startsWith('/') ? '' : '/'}${urlLimpa}` : urlLimpa;
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
        const sessao = await obterSessao();

        if (!sessao || !sessao.userId) {
            throw new Error('Usuário não encontrado no dispositivo.');
        }

        const headers = sessao.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.get(`/api/produtos/vendedor/${sessao.userId}`, {
            headers,
        });

        return response.data;
    } catch (error) {
        const mensagemErro = error.response?.data?.message || error.message || 'Erro ao buscar os produtos.';
        throw new Error(mensagemErro);
    }
};

export const cadastrarProduto = async (nome, descricao, preco_unidade, estoque, imagem) => {
    try {
        const sessao = await obterSessao();

        if (!sessao || !sessao.userId) {
            throw new Error('Usuário não encontrado. Faça login novamente.');
        }

        const formData = new FormData();
        formData.append('vendedor_id', String(sessao.userId));
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco_unidade', String(preco_unidade));
        formData.append('estoque', String(Number(estoque) || 0));

        await anexarImagemNoFormData(formData, imagem);

        const headers = {};
        if (sessao.token) {
            headers.Authorization = `Bearer ${sessao.token}`;
        }
        if (Platform.OS !== 'web') {
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.post('/api/produtos', formData, { headers });
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao cadastrar produto.';
        throw new Error(mensagemErro);
    }
};

export const alterarProduto = async (produto_id, nome, descricao, preco_unidade, estoque, imagem) => {
    try {
        const sessao = await obterSessao();

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco_unidade', String(preco_unidade));
        formData.append('estoque', String(Number(estoque) || 0));

        await anexarImagemNoFormData(formData, imagem);

        const headers = {};
        if (sessao?.token) {
            headers.Authorization = `Bearer ${sessao.token}`;
        }
        if (Platform.OS !== 'web') {
            headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await api.put(`/api/produtos/${produto_id}`, formData, { headers });
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao alterar produto.';
        throw new Error(mensagemErro);
    }
};

export const deletarProduto = async (produto_id) => {
    try {
        const sessao = await obterSessao();
        const headers = sessao?.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.delete(`/api/produtos/${produto_id}`, { headers });
        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao deletar produto.';
        throw new Error(mensagemErro);
    }
};

export const alterarAtivacaoProduto = async (produto_id, ativo) => {
    try {
        const sessao = await obterSessao();
        const headers = sessao?.token
            ? { Authorization: `Bearer ${sessao.token}` }
            : {};

        const response = await api.put(
            `/api/produtos/${produto_id}`,
            { ativo },
            { headers }
        );

        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            'Erro ao alterar status do produto.';
        throw new Error(mensagemErro);
    }
};