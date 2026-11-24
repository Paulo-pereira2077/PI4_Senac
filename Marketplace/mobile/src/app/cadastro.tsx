// Caminho do arquivo: src/app/cadastro.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { realizarCadastro, loginComGoogle } from '@/services/authService';

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import CustomCheckbox from '@/components/customCheckbox';
import { theme } from '@/temas';

WebBrowser.maybeCompleteAuthSession();

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(false);

  // Garante que o Google redirecione exatamente para http://localhost:8081/cadastro
  const redirectUri = AuthSession.makeRedirectUri({
    path: 'cadastro',
  });

  // useIdTokenAuthRequest devolve o id_token exigido pelo seu authController.js
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
  });

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  useEffect(() => {
    if (!response) return;

    console.log('Retorno do Google:', response);

    if (response.type === 'success') {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (idToken) {
        finalizarCadastroGoogle(idToken);
      } else {
        mostrarAlerta('Erro', 'O Google não retornou o idToken.');
      }
    } else if (response.type === 'error') {
      mostrarAlerta('Erro', 'Falha ao autenticar com o Google.');
    }
  }, [response]);

  const finalizarCadastroGoogle = async (idToken: string) => {
    try {
      setLoading(true);
      const tipoPerfil = isSeller ? 'Vendedor' : 'Cliente';
      const data = await loginComGoogle(idToken, tipoPerfil);

      const perfil = data?.usuario?.tipo_perfil?.toLowerCase();
      mostrarAlerta('Sucesso', 'Conta conectada com o Google!');
      router.replace(perfil === 'vendedor' ? '/vendedor/dashboard' : '/cliente/home');
    } catch (error: any) {
      mostrarAlerta('Ops!', error.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = async () => {
    if (!request) {
      mostrarAlerta(
        'Configuração pendente',
        'Client ID do Google não carregado. Verifique o mobile/.env e reinicie com npx expo start -c.'
      );
      return;
    }

    await promptAsync();
  };

  const handleRegister = async () => {
    if (!username.trim() || !cpf.trim() || !email.trim() || !password.trim()) {
      mostrarAlerta('Aviso', 'Por favor, preencha todos os campos!');
      return;
    }

    if (email.trim() !== confirmEmail.trim() || password !== confirmPassword) {
      mostrarAlerta('Aviso', 'Emails ou senhas não conferem.');
      return;
    }

    try {
      setLoading(true);
      const tipoPerfil = isSeller ? 'Vendedor' : 'Cliente';
      await realizarCadastro(username.trim(), email.trim(), password, tipoPerfil, cpf.trim());

      mostrarAlerta('Sucesso', 'Conta criada com sucesso! Faça seu login.');
      router.navigate('/login');
    } catch (error: any) {
      mostrarAlerta('Ops!', error.message || 'Erro ao cadastrar no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Voltar'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Criar Conta</Text>

          <View style={styles.formContainer}>
            <CustomInput
              label="Username"
              placeholder="Digite seu username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <CustomInput
              label="CPF"
              placeholder="Digite seu CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
            />

            <CustomInput
              label="Email"
              placeholder="Entre com seu email ou numero de telefone"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Confirmar Email"
              placeholder="Entre com seu email ou numero de telefone"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Senha"
              placeholder="Entre com sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomInput
              label="Confirmar Senha"
              placeholder="Entre com sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <CustomCheckbox
              label="Sou vendedor"
              value={isSeller}
              onValueChange={setIsSeller}
            />

            <View style={styles.registerButtonWrapper}>
              <PrimaryButton
                title={loading ? 'Cadastrando...' : 'Cadastrar'}
                onPress={handleRegister}
              />
            </View>
          </View>

          <DividerWithText text="Ou faça cadastro com" />

          <View style={styles.socialContainer}>
            <SocialButton iconName="f" onPress={() => console.log('Facebook')} />
            <SocialButton iconName="G" onPress={handleGooglePress} />
            <SocialButton iconName="A" onPress={() => console.log('Apple')} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex1: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.l,
    paddingTop: 20,
    paddingBottom: theme.spacing.l,
  },
  backButton: {
    marginBottom: theme.spacing.m,
  },
  backButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.body,
  },
  title: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.extraBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.l,
  },
  formContainer: {
    marginBottom: theme.spacing.l,
  },
  registerButtonWrapper: {
    marginTop: theme.spacing.s,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.m,
    color: theme.colors.textPlaceholder,
    fontSize: theme.fonts.size.small,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
});