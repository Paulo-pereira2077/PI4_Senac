import React, { useState } from 'react';
import {useRouter} from 'expo-router';

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

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import { theme } from '@/temas';
import { Link, router } from 'expo-router';
import api from '@/services/api';

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
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Preencha e-mail e senha.');
        return;
      }

      const response = await api.post('/auth/login', {
        email,
        senha: password,
      });

      console.log('Resposta login:', response.data);

      const { nome, tipo_perfil } = response.data;

      Alert.alert('Bem-vindo!', `Olá, ${nome}`);

      if (tipo_perfil === 'VENDEDOR') {
        router.replace('/homeAdm');
      } else {
        router.replace('/explore');
      }
    } catch (error: any) {
      console.error('Erro no login:', error?.response?.data || error.message);
      Alert.alert(
        'Erro',
        error?.response?.data?.error || 'E-mail ou senha incorretos.'
      );
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
              placeholder="Entre com seu email"
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
              <PrimaryButton title="Login" onPress={handleLogin} />
            </View>
          </View>

          <DividerWithText text="Ou faça login com" />

          <View style={styles.socialContainer}>
            <SocialButton iconName="f" onPress={() => console.log('Facebook')} />
            <SocialButton iconName="G" onPress={() => console.log('Google')} />
            <SocialButton iconName="A" onPress={() => console.log('Apple')} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta? </Text>
            <Link style={styles.footerLink} href="/cadastro">
              Registre agora
            </Link>
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