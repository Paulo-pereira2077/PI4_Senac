import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';
import { useRouter } from 'expo-router'; // <-- Importando o hook de rotas do Expo

export default function Footer() {
  const router = useRouter(); // <-- Inicializando o router

  return (
    <View style={styles.footerContainer}>
      {/* Botão Home */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')} // <-- Rota para a tela inicial
      >
        <Feather name="home" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Pesquisar */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')} // <-- Exemplo de rota
      >
        <Feather name="search" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Central (+) - Ir para adicionar anúncio */}
      <TouchableOpacity 
        style={styles.centerButton} 
        activeOpacity={0.8}
        onPress={() => router.navigate('/vendedor/adicionar')} // <-- Rota da tela que criamos!
      >
        <Feather name="plus" size={32} color={theme.colors.cardBackground} />
      </TouchableOpacity>

      {/* Botão Perfil */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')} // <-- Exemplo de rota
      >
        <Feather name="user" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Configurações */}
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')} // <-- Exemplo de rota
      >
        <Feather name="settings" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 20, 
  },
  iconButton: {
    padding: 10,
  },
  centerButton: {
    backgroundColor: theme.colors.primaryLight,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});