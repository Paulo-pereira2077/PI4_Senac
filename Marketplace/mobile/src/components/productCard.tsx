import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: any; // Pode ser string se for URL web, ou require() se for local
  onEdit: () => void;
  onDelete: () => void;
  onPause: () => void;
}

export default function ProductCard({ title, price, imageUrl, onEdit, onDelete, onPause }: ProductCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Imagem do Produto */}
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.image} resizeMode="contain" />
      </View>

      {/* Informações do Produto */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.price}>{price}</Text>
      </View>

      {/* Ações (Ícones) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Feather name="edit-2" size={16} color={theme.colors.primaryLight} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Feather name="trash-2" size={16} color={theme.colors.danger} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPause} style={styles.actionButton}>
          <Feather name="pause" size={16} color={theme.colors.primaryLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    elevation: 2, // Sombra para Android
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6', // Cor de fundo caso a imagem seja transparente
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
    padding: 4, // Área de toque maior para facilitar no mobile
  },
});