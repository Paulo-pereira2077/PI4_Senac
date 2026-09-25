import api from './api'; // Sua instância do Axios configurada

import AsyncStorage from '@react-native-async-storage/async-storage';


export const realizarCadastro = async (nome, email, senha, tipo_perfil) => {
    try{
        const response = await api.post("/api/auth/register", {nome, email, senha, tipo_perfil})

        return response.data;
    }
    catch (error){
        const mensagemErro = error.response?.data?.message || 'Erro ao criar a conta. Tente novamente.';
        throw new Error(mensagemErro);
    }
}

export const realizarLogin = async (email, senha) => {
    try {
        const response = await api.post("/api/auth/login", { email, senha });

        // Supondo que sua API retorne algo como: { token: "...", user: { id: 1, name: "...", email: "..." } }
        const { user } = response.data;

        // 2. Salva os dados públicos do usuário (pode ser no AsyncStorage ou gerenciar via Context)
        if (user) {
            await AsyncStorage.setItem('@MeuApp:user', JSON.stringify(user));
        }

        // Retorna os dados para onde chamou a função (caso queira atualizar o estado global)
        return response.data;
    }
    catch (error) {
        // Corrigida a mensagem de erro para refletir login em vez de criação de conta
        const mensagemErro = error.response?.data?.message || 'Erro ao realizar login. Tente novamente.';
        throw new Error(mensagemErro);
    }
};



