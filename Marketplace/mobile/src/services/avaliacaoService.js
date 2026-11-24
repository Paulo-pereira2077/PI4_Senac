// services/avaliacaoService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const obterSessao = async () => {
  const userStorage = await AsyncStorage.getItem('@MeuApp:user');
  if (!userStorage) return null;

  const user = JSON.parse(userStorage);
  const token = user?.token || user?.accessToken;
  const userId = user?.id || user?.usuario?.id || user?.user?.id;
  const nome = user?.nome || user?.usuario?.nome || user?.user?.nome || 'Cliente';

  return { user, userId, token, nome };
};

export const listarAvaliacoesProduto = async (produtoId) => {
  try {
    const response = await api.get(`/api/avaliacoes/produto/${produtoId}`);
    return response.data;
  } catch (error) {
    const mensagemErro =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Erro ao carregar avaliações.';
    throw new Error(mensagemErro);
  }
};

export const enviarAvaliacaoProduto = async (produtoId, nota, comentario = '') => {
  try {
    const sessao = await obterSessao();
    if (!sessao || !sessao.token || !sessao.userId) {
      throw new Error('Faça login para avaliar este produto.');
    }

    const response = await api.post(
      '/api/avaliacoes',
      {
        produto_id: Number(produtoId),
        usuario_id: Number(sessao.userId),
        autor_nome: sessao.nome,
        nota: Number(nota),
        comentario,
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
      'Erro ao salvar avaliação.';
    throw new Error(mensagemErro);
  }
};