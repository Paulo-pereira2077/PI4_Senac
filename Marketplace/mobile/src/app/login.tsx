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

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import { theme } from '@/temas';
import { Link, router } from 'expo-router';
import { realizarLogin } from '@/services/authService';

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if(!email || !password){
      Alert.alert('Aviso', 'Por favor, preencha todos os campos!');
      return;
    }

    try {
      await realizarLogin(email, password);

      router.navigate('/vendedor/anuncios')

    } catch (error) {
      Alert.alert('Ops!', "Erro no servidor ");
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
              secureTextEntry // Oculta a senha
            />

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <View style={styles.loginButtonWrapper}>
              <PrimaryButton 
                title="Login" 
                onPress={() => handleLogin()} 
              />
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
            <TouchableOpacity onPress={() => console.log('Ir para Registro')}>
              <Link style={styles.footerLink} href="/cadastro">Registre agora</Link>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// 3. ESTILOS
// ==========================================

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
        paddingHorizontal: theme.spacing.l, // 24
        paddingTop: 60, // Mantido fixo, não há correspondente exato no tema
        paddingBottom: theme.spacing.l, // 24
        justifyContent: 'center',
    },
    title: {
        fontSize: theme.fonts.size.title, // 28
        fontWeight: theme.fonts.weight.extraBold, // 800
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xl, // 40
    },
    formContainer: {
        marginBottom: theme.spacing.l, // 24
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: theme.spacing.l, // 24
    },
    forgotPasswordText: {
        color: theme.colors.primary, // Azul
        fontSize: theme.fonts.size.body, // 14
        fontWeight: theme.fonts.weight.semiBold, // 600
    },
    loginButtonWrapper: {
        marginTop: theme.spacing.s, // 8
    },
    // Estilos do Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.l, // 24
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border, // Substituído para a cor de borda do tema
    },
    dividerText: {
        marginHorizontal: theme.spacing.m, // 16
        color: theme.colors.textPlaceholder, // 9CA3AF
        fontSize: theme.fonts.size.small, // 12
    },
    // Estilos da área social
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl, // 40
    },
    // Estilos do Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto', 
        paddingTop: 20, // Mantido fixo
    },
    footerText: {
        color: theme.colors.textSecondary, // 6B7280
        fontSize: theme.fonts.size.body, // 14
    },
    footerLink: {
        color: theme.colors.primary, // 3B82F6 (Azul do tema)
        fontSize: theme.fonts.size.body, // 14
        fontWeight: theme.fonts.weight.semiBold, // 600
    },
});