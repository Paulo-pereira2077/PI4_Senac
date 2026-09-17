import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router'; // Importação do Expo Router

// IMPORTANTE: Ajuste o caminho de importação conforme a sua estrutura de pastas!
import PrimaryButton from '@/components/botao'; 
import { theme } from '@/temas';

export default function WelcomeScreen() {
  const router = useRouter(); // Inicializando o roteador

  const handleNavigateToLogin = () => {
    // Navega para o arquivo login.tsx (ou pasta login/index.tsx)
    router.push('/login');
  };

  const handleNavigateToRegister = () => {
    // Navega para o arquivo cadastro.tsx (ou pasta cadastro/index.tsx)
    router.push('/cadastro');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.content}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🛒</Text>
          </View>

          <Text style={styles.title}>Bem-vindo ao Mercadinho do Povo!</Text>
          <Text style={styles.subtitle}>
            Faça login em sua conta para continuar comprando ou cadastre-se para explorar nossas ofertas.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <PrimaryButton 
              title="Fazer Login" 
              onPress={handleNavigateToLogin} 
            />
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleNavigateToRegister}
            activeOpacity={0.7}
          >
            <Text style={styles.registerButtonText}>Criar uma nova conta</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#F0F4FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D1321',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    paddingBottom: 40,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  registerButton: {
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#2F64FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    color: '#2F64FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});