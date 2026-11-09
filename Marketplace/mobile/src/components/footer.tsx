// Caminho do arquivo: components/footer.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';
import { useRouter } from 'expo-router';

interface FooterProps {
  variant?: 'vendedor' | 'cliente';
  activeTab?: 'home' | 'search' | 'orders' | 'profile' | 'settings';
}

export default function Footer({
  variant = 'vendedor',
  activeTab = 'home',
}: FooterProps) {
  const router = useRouter();

  if (variant === 'cliente') {
    return (
      <View style={styles.footerContainer}>
        {/* Botão Home */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.navigate('/cliente/home')}
        >
          <Feather
            name="home"
            size={22}
            color={
              activeTab === 'home'
                ? theme.colors.iconPurple
                : theme.colors.primary
            }
          />
        </TouchableOpacity>

        {/* Botão Destaques / Pesquisar */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.navigate('/cliente/destaques')}
        >
          <Feather
            name="search"
            size={22}
            color={
              activeTab === 'search'
                ? theme.colors.iconPurple
                : theme.colors.primary
            }
          />
        </TouchableOpacity>

        {/* Botão Central (Sacola / Histórico de Compras) */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.navigate('/cliente/historico')}
        >
          <Feather
            name="shopping-bag"
            size={22}
            color={
              activeTab === 'orders'
                ? theme.colors.iconPurple
                : theme.colors.primary
            }
          />
        </TouchableOpacity>

        {/* Botão Perfil / Endereço */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.navigate('/cliente/endereco')}
        >
          <Feather
            name="user"
            size={22}
            color={
              activeTab === 'profile'
                ? theme.colors.iconPurple
                : theme.colors.primary
            }
          />
        </TouchableOpacity>

        {/* Botão Configurações / Favoritos */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.navigate('/cliente/favoritos')}
        >
          <Feather
            name="settings"
            size={22}
            color={
              activeTab === 'settings'
                ? theme.colors.iconPurple
                : theme.colors.primary
            }
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.footerContainer}>
      {/* Botão Home */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')}
      >
        <Feather name="home" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Pesquisar */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')}
      >
        <Feather name="search" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Central (+) - Ir para adicionar anúncio */}
      <TouchableOpacity
        style={styles.centerButton}
        activeOpacity={0.8}
        onPress={() => router.navigate('/vendedor/adicionar')}
      >
        <Feather name="plus" size={32} color={theme.colors.cardBackground} />
      </TouchableOpacity>

      {/* Botão Perfil */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')}
      >
        <Feather name="user" size={24} color={theme.colors.primaryLight} />
      </TouchableOpacity>

      {/* Botão Configurações */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.navigate('/vendedor/anuncios')}
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