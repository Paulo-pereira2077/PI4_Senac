// src/services/authService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @param {string} nome
 * @param {string} email
 * @param {string} senha
 * @param {string} tipo_perfil
 * @param {string} [cpf]
 */
export const realizarCadastro = async (nome, email, senha, tipo_perfil, cpf = '') => {
    try {
        const response = await api.post('/api/auth/register', {
            nome,
            email,
            senha,
            tipo_perfil,
            cpf: cpf || null,
        });

        return response.data;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Erro ao criar a conta. Tente novamente.';
        throw new Error(mensagemErro);
    }
};

/**
 * @param {string} email
 * @param {string} senha
 */
export const realizarLogin = async (email, senha) => {
    try {
        const response = await api.post('/api/auth/login', { email, senha });
        const user = response.data;

        if (user) {
            await AsyncStorage.setItem('@MeuApp:user', JSON.stringify(user));
        }

        return user;
    } catch (error) {
        const mensagemErro =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Erro ao realizar login. Tente novamente.';
        throw new Error(mensagemErro);
    }
};

export const obterUsuarioLogado = async () => {
    const userStorage = await AsyncStorage.getItem('@MeuApp:user');
    return userStorage ? JSON.parse(userStorage) : null;
};