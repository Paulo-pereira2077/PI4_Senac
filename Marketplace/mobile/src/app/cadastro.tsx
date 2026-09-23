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
import { router } from 'expo-router'; // 1. Importando o router do Expo
import realizarCadastro from '../services/authService';

import CustomInput from '@/components/input';
import PrimaryButton from '@/components/botao';
import SocialButton from '@/components/botaoSocial';
import CustomCheckbox from '@/components/customCheckbox'; // Importando o novo Checkbox
import { theme } from '@/temas';

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{text}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}


export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false); // Estado do checkbox

  const handleRegister = async () => {
    if(!username || !cpf || !email || !password || !isSeller ){
      Alert.alert('Aviso', 'Por favor, preencha todos os campos!');
      return;
    }
    
    if( email  != confirmEmail || password != confirmPassword ){
      Alert.alert('Aviso', 'Campos incorretos');
      return;
    }

    try {
      await realizarCadastro(username, email, password, isSeller==true?"Vendedor":"Cliente");

      Alert.alert('Sucesso!', 'Sua conta foi criada.');

      router.navigate('/login')

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
          
          {/* Botão de voltar usando o router.back() */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
             <Text style={styles.backButtonText}>{"< Voltar"}</Text>
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

            {/* Novo componente de Checkbox */}
            <CustomCheckbox 
              label="Sou vendedor" 
              value={isSeller} 
              onValueChange={setIsSeller} 
            />

            <View style={styles.registerButtonWrapper}>
              <PrimaryButton 
                title="Cadastrar" 
                onPress={handleRegister} 
              />
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