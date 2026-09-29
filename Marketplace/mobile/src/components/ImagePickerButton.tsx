import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, Image, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

interface ImagePickerButtonProps {
  onPress: () => void;
  imageUri?: string | null; // Nova prop para receber a foto selecionada ou vinda da API
  style?: ViewStyle;
}

export default function ImagePickerButton({ onPress, imageUri, style }: ImagePickerButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, imageUri ? styles.containerWithImage : null, style]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          {/* Ícone discreto no canto indicando que pode tocar para trocar a foto */}
          <View style={styles.editBadge}>
            <Feather name="camera" size={14} color="#FFF" />
          </View>
        </>
      ) : (
        <>
          <Feather name="camera" size={28} color={theme.colors.primaryLight} style={styles.icon} />
          <Text style={styles.text}>Adicionar imagem</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground, // Fundo branco
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
    overflow: 'hidden', // Garante que a foto respeite as bordas arredondadas (borderRadius: 12)
    // Sombras para dar a profundidade igual ao design
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  containerWithImage: {
    padding: 0, // Remove o espaçamento interno quando há foto para ela preencher todo o quadrado
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 20,
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weight.medium,
    textAlign: 'center',
  },
});