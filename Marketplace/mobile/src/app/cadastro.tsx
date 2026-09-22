import React, { useState } from 'react';
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

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import CustomCheckbox from '@/components/customCheckbox';
import { theme } from '@/temas';
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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const handleRegister = async () => {
    try {
      if (!username || !email || !confirmEmail || !password || !confirmPassword) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }

      if (email !== confirmEmail) {
        Alert.alert('Erro', 'Os e-mails não coincidem.');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }

      const tipo_perfil = isSeller ? 'VENDEDOR' : 'CLIENTE';

      const response = await api.post('/auth/register', {
        nome: username,
        email,
        senha: password,
        tipo_perfil,
        cpf, 
      });

      console.log('Resposta cadastro:', response.data);

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error?.response?.data || error.message);
      Alert.alert(
        'Erro',
        error?.response?.data?.error || 'Não foi possível realizar o cadastro.'
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
              placeholder="Entre com seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Confirmar Email"
              placeholder="Confirme seu email"
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
              placeholder="Confirme sua senha"
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
              <PrimaryButton title="Cadastrar" onPress={handleRegister} />
            </View>
          </View>

          <DividerWithText text="Ou faça cadastro com" />

          <View style={styles.socialContainer}>
            <SocialButton iconName="f" onPress={() => console.log('Facebook')} />
            <SocialButton iconName="G" onPress={() => console.log('Google')} />
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