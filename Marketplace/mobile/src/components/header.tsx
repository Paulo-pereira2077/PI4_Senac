// Caminho do arquivo: components/header.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';
import { router } from 'expo-router';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  onMenuPress?: () => void;
  onProfilePress?: () => void;
  onLogout?: () => void;
  variant?: 'vendedor' | 'cliente';
  onFavoritesPress?: () => void;
  onCartPress?: () => void;
  onSearchSubmit?: () => void;
  cartBadgeCount?: number;
}

export default function Header({
  searchValue,
  onSearchChange,
  onMenuPress,
  onProfilePress,
  onLogout,
  variant = 'vendedor',
  onFavoritesPress,
  onCartPress,
  onSearchSubmit,
  cartBadgeCount = 0,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    router.navigate('/');
  };

  const handleFavorites = () => {
    if (onFavoritesPress) {
      onFavoritesPress();
    } else if (variant === 'cliente') {
      router.navigate('/cliente/favoritos');
    }
  };

  const handleCart = () => {
    if (onCartPress) {
      onCartPress();
    } else if (variant === 'cliente') {
      router.navigate('/cliente/carrinho');
    }
  };

  const handleProfile = () => {
    if (onProfilePress) {
      onProfilePress();
    } else if (variant === 'cliente') {
      router.navigate('/cliente/historico');
    }
  };

  return (
    <View style={[styles.header, variant === 'cliente' && styles.headerClient]}>
      {/* Topo: Logo e Menu */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.navigate(variant === 'cliente' ? '/cliente/home' : '/vendedor/anuncios')
          }
        >
          <Text style={styles.logoText}>Mercadinho</Text>
          <Text style={styles.logoSubText}>DO POVO</Text>
        </TouchableOpacity>

        {/* Container do ícone e do Dropdown */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => {
              if (onMenuPress) {
                onMenuPress();
              }
              setIsMenuOpen(!isMenuOpen);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={variant === 'cliente' ? 'list' : 'menu'}
              size={24}
              color={theme.colors.primaryLight}
            />
          </TouchableOpacity>

          {isMenuOpen && (
            <View style={styles.dropdown}>
              {variant === 'cliente' && (
                <>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setIsMenuOpen(false);
                      router.navigate('/cliente/destaques');
                    }}
                  >
                    <Feather name="star" size={16} color={theme.colors.primary} />
                    <Text style={styles.dropdownItemText}>Destaques</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setIsMenuOpen(false);
                      router.navigate('/cliente/historico');
                    }}
                  >
                    <Feather name="shopping-bag" size={16} color={theme.colors.primary} />
                    <Text style={styles.dropdownItemText}>Meus Pedidos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setIsMenuOpen(false);
                      router.navigate('/cliente/endereco');
                    }}
                  >
                    <Feather name="map-pin" size={16} color={theme.colors.primary} />
                    <Text style={styles.dropdownItemText}>Endereço</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                <Feather name="log-out" size={16} color={theme.colors.danger} />
                <Text style={styles.dropdownText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Barra de Pesquisa e Ações */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar produtos"
            placeholderTextColor={theme.colors.textPlaceholder}
            value={searchValue}
            onChangeText={onSearchChange}
            onSubmitEditing={onSearchSubmit}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          style={styles.searchIconBox}
          activeOpacity={0.7}
          onPress={onSearchSubmit}
        >
          <Feather name="search" size={16} color={theme.colors.cardBackground} />
        </TouchableOpacity>

        {variant === 'cliente' && (
          <>
            <TouchableOpacity
              onPress={handleFavorites}
              style={styles.actionIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="heart" size={20} color={theme.colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCart}
              style={styles.actionIcon}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="shopping-cart" size={20} color={theme.colors.primary} />
              {cartBadgeCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartBadgeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={handleProfile}
          style={styles.profileIcon}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="user" size={22} color={theme.colors.primary} />
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
    backgroundColor: theme.colors.cardBackground,
    zIndex: 10,
  },
  headerClient: {
    paddingHorizontal: theme.spacing.m,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
    zIndex: 11,
  },
  logoText: {
    fontSize: theme.fonts.size.header,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
  logoSubText: {
    fontSize: theme.fonts.size.tiny,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.primaryLight,
  },
  menuContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.s,
    minWidth: 160,
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
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
  },
  dropdownItemText: {
    marginLeft: theme.spacing.s,
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  dropdownText: {
    marginLeft: theme.spacing.s,
    fontSize: theme.fonts.size.body,
    color: theme.colors.danger,
    fontWeight: theme.fonts.weight.bold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceGray,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.m,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
  },
  searchIconBox: {
    backgroundColor: theme.colors.primary,
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  actionIcon: {
    marginLeft: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: theme.colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: theme.colors.cardBackground,
    fontSize: 9,
    fontWeight: theme.fonts.weight.bold,
  },
  profileIcon: {
    marginLeft: 12,
  },
});