// Caminho do arquivo: src/app/login.tsx
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
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { Link, router } from 'expo-router';

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import { theme } from '@/temas';
import { realizarLogin, loginComGoogle } from '@/services/authService';

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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectUri = AuthSession.makeRedirectUri({
    path: 'login',
  });

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

    if (response.type === 'success') {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (idToken) {
        finalizarLoginGoogle(idToken);
      } else {
        mostrarAlerta('Erro', 'O Google não retornou o idToken.');
      }
    } else if (response.type === 'error') {
      mostrarAlerta('Erro', 'Falha ao autenticar com o Google.');
    }
  }, [response]);

  const finalizarLoginGoogle = async (idToken: string) => {
    try {
      setLoading(true);
      const user = await loginComGoogle(idToken, 'Cliente');

      const perfil = String(user.usuario?.tipo_perfil || '').toLowerCase();
      if (perfil === 'vendedor') {
        router.replace('/vendedor/anuncios');
      } else {
        router.replace('/cliente/home');
      }
    } catch (error: any) {
      mostrarAlerta('Ops!', error.message || 'Erro ao fazer login com o Google.');
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      mostrarAlerta('Aviso', 'Por favor, preencha todos os campos!');
      return;
    }

    try {
      setLoading(true);
      const user = await realizarLogin(email.trim(), password);

      const perfil = String(user.usuario?.tipo_perfil || '').toLowerCase();
      if (perfil === 'vendedor') {
        router.replace('/vendedor/anuncios');
      } else {
        console.log(user);
        router.replace('/cliente/home');
      }
    } catch (error: any) {
      mostrarAlerta('Ops!', error.message || 'Credenciais inválidas ou erro no servidor.');
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
          <Text style={styles.title}>Bem vindo de volta!</Text>

          <View style={styles.formContainer}>
            <CustomInput
              label="Email ou numero de telefone"
              placeholder="Entre com seu email ou numero de telefone"
              value={email}
              onChangeText={setEmail}
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

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <View style={styles.loginButtonWrapper}>
              <PrimaryButton
                title={loading ? 'Entrando...' : 'Login'}
                onPress={handleLogin}
              />
            </View>
          </View>

          <DividerWithText text="Ou faça login com" />

          <View style={styles.socialContainer}>
            <SocialButton iconName="f" onPress={() => console.log('Facebook')} />
            <SocialButton iconName="G" onPress={handleGooglePress} />
            <SocialButton iconName="A" onPress={() => console.log('Apple')} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <TouchableOpacity>
              <Link style={styles.footerLink} href="/cadastro">Registre agora</Link>
            </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: theme.spacing.l,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fonts.size.title,
    fontWeight: theme.fonts.weight.extraBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    marginBottom: theme.spacing.l,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.l,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.semiBold,
  },
  loginButtonWrapper: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.size.body,
  },
  footerLink: {
    color: theme.colors.primary,
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.semiBold,
  },
});