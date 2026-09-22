import React, { useState } from 'react';
<<<<<<< HEAD
=======
import {useRouter} from 'expo-router';

>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
<<<<<<< HEAD
=======
  Alert,
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
} from 'react-native';

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import { theme } from '@/temas';
import { Link, router } from 'expo-router';
<<<<<<< HEAD
=======
import api from '@/services/api';
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
=======
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
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
<<<<<<< HEAD
          
=======
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
          <Text style={styles.title}>Bem vindo de volta!</Text>

          <View style={styles.formContainer}>
            <CustomInput
              label="Email ou numero de telefone"
<<<<<<< HEAD
              placeholder="Entre com seu email ou numero de telefone"
=======
              placeholder="Entre com seu email"
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
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
<<<<<<< HEAD
              secureTextEntry // Oculta a senha
=======
              secureTextEntry
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
            />

            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <View style={styles.loginButtonWrapper}>
<<<<<<< HEAD
              <PrimaryButton 
                title="Login" 
                onPress={() => router.navigate('/vendedor/anuncios')} 
              />
=======
              <PrimaryButton title="Login" onPress={handleLogin} />
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
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
<<<<<<< HEAD
            <TouchableOpacity onPress={() => console.log('Ir para Registro')}>
              <Link style={styles.footerLink} href="/cadastro">Registre agora</Link>
            </TouchableOpacity>
          </View>

=======
            <Link style={styles.footerLink} href="/cadastro">
              Registre agora
            </Link>
          </View>
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 90012446721ba69795c9a13f7d23bb8afcfc02a8
});