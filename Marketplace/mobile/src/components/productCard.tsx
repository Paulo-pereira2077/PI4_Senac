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
  category?: string;
  stockCount?: number;
  outOfStock?: boolean;
  rating?: number;
  reviewCount?: number;
  // Props da visão do Vendedor
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
  category,
  stockCount,
  outOfStock = false,
  rating = 0,
  reviewCount = 0,
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
  const semEstoque =
    outOfStock || (stockCount !== undefined && Number(stockCount) <= 0);

  const notaSegura = Math.max(0, Math.min(5, Number(rating) || 0));
  const estrelasCheias = Math.round(notaSegura);

  const renderEstrelas = () => (
    <View style={styles.ratingRow}>
      <View style={styles.starsGroup}>
        {[1, 2, 3, 4, 5].map((estrela) => (
          <Text
            key={estrela}
            style={[
              styles.starSymbol,
              estrela <= estrelasCheias ? styles.starFilled : styles.starEmpty,
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {notaSegura > 0 ? notaSegura.toFixed(1) : '0.0'}
        {reviewCount > 0 ? ` (${reviewCount})` : ''}
      </Text>
    </View>
  );

  if (variant === 'cliente') {
    const cleanPrice = price.replace(/^R\$\s?/, '');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.clientCardContainer,
          isSelected && styles.clientCardSelected,
          semEstoque && styles.clientCardOutOfStock,
          style,
        ]}
      >
        {/* Imagem à esquerda */}
        <View style={styles.clientImageWrapper}>
          <Image
            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
            style={[styles.clientImage, semEstoque && styles.imageDisabled]}
            resizeMode="contain"
          />
          {semEstoque && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockBadgeText}>Esgotado</Text>
            </View>
          )}
        </View>

        {/* Informações à direita */}
        <View style={styles.clientInfoContainer}>
          <View style={styles.clientTopRow}>
            {category ? (
              <Text style={styles.clientCategory} numberOfLines={1}>
                {category}
              </Text>
            ) : (
              <View />
            )}

            <TouchableOpacity
              onPress={onToggleFavorite}
              style={styles.favoriteButton}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Feather
                name="heart"
                size={16}
                color={
                  isFavorite ? theme.colors.error : theme.colors.textSecondary
                }
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.clientTitle} numberOfLines={2}>
            {title}
          </Text>

          {renderEstrelas()}

          <View style={styles.clientBottomRow}>
            <Text style={styles.clientPriceRow} numberOfLines={1}>
              <Text style={styles.currencySymbol}>R$ </Text>
              <Text style={styles.clientPriceValue}>{cleanPrice}</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.addButton,
                semEstoque && styles.addButtonDisabled,
              ]}
              disabled={semEstoque}
              onPress={onAddToCart}
              activeOpacity={0.8}
            >
              <Feather
                name={semEstoque ? 'slash' : 'shopping-cart'}
                size={12}
                color={theme.colors.cardBackground}
              />
              <Text style={styles.addButtonText}>
                {semEstoque ? 'Sem estoque' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.cardContainer, !estaAtivo && styles.cardPaused, style]}>
      <View style={styles.imageContainer}>
        <Image
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {category ? <Text style={styles.categoryTag}>{category}</Text> : null}
        {renderEstrelas()}
        <Text style={styles.price}>{price}</Text>
      </View>

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
            color={
              estaAtivo ? theme.colors.primaryLight : theme.colors.textSecondary
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- Visão Vendedor ---
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
    width: 84,
    height: 84,
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
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.medium,
  },
  categoryTag: {
    fontSize: 11,
    color: theme.colors.primaryLight,
    fontWeight: theme.fonts.weight.semiBold,
    marginTop: 2,
  },
  price: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.bold,
    marginTop: 4,
  },
  actionsContainer: {
    justifyContent: 'space-between',
    height: 84,
    paddingVertical: 4,
  },
  actionButton: {
    padding: 4,
  },

  // --- Estrelas ---
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 4,
  },
  starsGroup: {
    flexDirection: 'row',
    marginRight: 4,
  },
  starSymbol: {
    fontSize: 12,
    marginRight: 1,
  },
  starFilled: {
    color: theme.colors.warning,
  },
  starEmpty: {
    color: theme.colors.border,
  },
  ratingText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
  },

  // --- Visão Cliente (Horizontal: imagem à esquerda, informações à direita) ---
  clientCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  clientCardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  clientCardOutOfStock: {
    opacity: 0.85,
  },
  clientImageWrapper: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  clientImage: {
    width: '100%',
    height: '100%',
  },
  imageDisabled: {
    opacity: 0.4,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  outOfStockBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: theme.fonts.weight.bold,
  },
  clientInfoContainer: {
    flex: 1,
    paddingLeft: theme.spacing.m,
    justifyContent: 'space-between',
    minHeight: 96,
  },
  clientTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientCategory: {
    fontSize: 10,
    color: theme.colors.primaryLight,
    fontWeight: theme.fonts.weight.bold,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 2,
  },
  clientTitle: {
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weight.semiBold,
    marginTop: 2,
  },
  clientBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  clientPriceRow: {
    flexShrink: 1,
  },
  currencySymbol: {
    fontSize: 11,
    color: theme.colors.priceGreen,
    fontWeight: theme.fonts.weight.bold,
  },
  clientPriceValue: {
    fontSize: theme.fonts.size.button,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weight.bold,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.secondaryButton,
  },
  addButtonText: {
    color: theme.colors.cardBackground,
    fontSize: 11,
    fontWeight: theme.fonts.weight.bold,
    marginLeft: 4,
  },
});