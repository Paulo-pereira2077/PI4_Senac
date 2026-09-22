import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';
import { router } from 'expo-router';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  onMenuPress?: () => void; // Mantido caso você queira usar para outra coisa
  onProfilePress?: () => void;
  onLogout?: () => void; // <-- Nova propriedade para a ação de Sair
}

export default function Header({ 
  searchValue, 
  onSearchChange, 
  onMenuPress, 
  onProfilePress,
  onLogout
}: HeaderProps) {
  // Estado para controlar se o dropdown está aberto ou fechado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false); // Fecha o menu
    if (onLogout) {
        router.navigate('/')
      onLogout(); // Executa a função de sair passada pela tela
    }
    router.navigate('/')
  };

  return (
    <View style={styles.header}>
      {/* Topo: Logo e Menu */}
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.logoText}>Mercadinho</Text>
          <Text style={styles.logoSubText}>DO POVO</Text>
        </View>

        {/* Container do ícone e do Dropdown */}
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            onPress={() => setIsMenuOpen(!isMenuOpen)} // Alterna entre abrir/fechar
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {/* Troquei 'list' por 'menu' para ser as clássicas "três barrinhas" */}
            <Feather name="menu" size={24} color={theme.colors.primaryLight} />
          </TouchableOpacity>

          {/* O Dropdown flutuante */}
          {isMenuOpen && (
            <View style={styles.dropdown}>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                <Feather name="log-out" size={18} color={theme.colors.danger} />
                <Text style={styles.dropdownText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Barra de Pesquisa e Perfil */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Pesquisar produtos" 
            placeholderTextColor={theme.colors.textSecondary}
            value={searchValue}
            onChangeText={onSearchChange}
          />
          <TouchableOpacity style={styles.searchIconBox} activeOpacity={0.7}>
            <Feather name="search" size={16} color={theme.colors.cardBackground} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={onProfilePress} style={styles.profileIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="user" size={24} color={theme.colors.primaryLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.m,
    // Importante para o dropdown flutuar por cima da barra de pesquisa no iOS:
    zIndex: 10, 
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    zIndex: 11, // Importante para o iOS não cortar a sombra do dropdown
  },
  logoText: {
    fontSize: 20,
    fontWeight: theme.fonts.weight.bold,
    color: '#000',
  },
  logoSubText: {
    fontSize: 10,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
  },
  
  // --- Estilos novos do Dropdown ---
  menuContainer: {
    position: 'relative', // Define que os itens absolutos dentro dele se guiarão por ele
  },
  dropdown: {
    position: 'absolute',
    top: 30, // Posiciona a caixinha logo abaixo do ícone
    right: 0, // Alinha à direita
    backgroundColor: theme.colors.cardBackground, // Fundo branco
    borderRadius: 8,
    padding: theme.spacing.s,
    minWidth: 120, // Garante uma largura mínima bonita
    // Sombras
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
  },
  dropdownText: {
    marginLeft: theme.spacing.s,
    fontSize: theme.fonts.size.body,
    color: theme.colors.danger, // Usando o vermelho/laranja do tema
    fontWeight: theme.fonts.weight.bold,
  },
  // ---------------------------------

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1, // Fica abaixo do headerTop
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingLeft: theme.spacing.m,
    paddingRight: 4,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
  },
  searchIconBox: {
    backgroundColor: theme.colors.primaryLight,
    padding: 6,
    borderRadius: 16,
  },
  profileIcon: {
    marginLeft: theme.spacing.m,
  },
});