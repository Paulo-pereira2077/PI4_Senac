// Caminho do arquivo: components/productCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: any;
  // Props da visão do Vendedor (opcionais quando variant === 'cliente')
  onEdit?: () => void;
  onDelete?: () => void;
  onPause?: () => void;
  ativo?: boolean;
  isPaused?: boolean;
  // Props da visão do Cliente
  variant?: 'vendedor' | 'cliente';
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  onPress?: () => void;
  isFavorite?: boolean;
  isSelected?: boolean;
  style?: ViewStyle;
}

export default function ProductCard({
  title,
  price,
  imageUrl,
  onEdit,
  onDelete,
  onPause,
  ativo,
  isPaused,
  variant = 'vendedor',
  onAddToCart,
  onToggleFavorite,
  onPress,
  isFavorite = false,
  isSelected = false,
  style,
}: ProductCardProps) {
  const estaAtivo = ativo !== undefined ? ativo : !isPaused;

  if (variant === 'cliente') {
    // Separa o prefixo "R$" do valor numérico para estilizar o R$ em verde e o número em azul
    const cleanPrice = price.replace(/^R\$\s?/, '');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.clientCardContainer,
          isSelected && styles.clientCardSelected,
          style,
        ]}
      >
        <View style={styles.clientImageWrapper}>
          <Image
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
            style={styles.clientImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.clientTitle} numberOfLines={2}>
          {title}
        </Text>

        <Text style={styles.clientPriceRow} numberOfLines={1}>
          <Text style={styles.currencySymbol}>R$ </Text>
          <Text style={styles.clientPriceValue}>{cleanPrice}</Text>
        </Text>

        <View style={styles.clientActionsRow}>
          <TouchableOpacity
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Feather
              name="heart"
              size={14}
              color={isFavorite ? theme.colors.error : theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddToCart}
            activeOpacity={0.8}
          >
            <Feather
              name="shopping-cart"
              size={10}
              color={theme.colors.cardBackground}
            />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.cardContainer, !estaAtivo && styles.cardPaused, style]}>
      {/* Imagem do Produto */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Informações do Produto */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      {/* Ações (Ícones do Vendedor) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Feather name="edit-2" size={16} color={theme.colors.primaryLight} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Feather name="trash-2" size={16} color={theme.colors.danger} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPause} style={styles.actionButton}>
          <Feather
            name={estaAtivo ? 'pause' : 'play'}
            size={16}
            color={estaAtivo ? theme.colors.primaryLight : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Estilos Visão Vendedor ---
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPaused: {
    opacity: 0.6,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    justifyContent: 'space-between',
    height: 70,
  },
  title: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  price: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.bold,
    marginTop: 4,
  },
  actionsContainer: {
    justifyContent: 'space-between',
    height: 80,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 4,
  },

  // --- Estilos Visão Cliente (Card Vertical Grid) ---
  clientCardContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: 'space-between',
  },
  clientCardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  clientImageWrapper: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.cardBackground,
  },
  clientImage: {
    width: '100%',
    height: '100%',
  },
  clientTitle: {
    fontSize: 10,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
    minHeight: 26,
    marginBottom: 4,
  },
  clientPriceRow: {
    marginBottom: 6,
  },
  currencySymbol: {
    fontSize: 9,
    color: theme.colors.priceGreen,
    fontWeight: theme.fonts.weight.bold,
  },
  clientPriceValue: {
    fontSize: theme.fonts.size.small,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  clientActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    paddingRight: 4,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: theme.colors.cardBackground,
    fontSize: 9,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 3,
  },
});