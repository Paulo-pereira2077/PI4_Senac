import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

interface ImagePickerButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export default function ImagePickerButton({ onPress, style }: ImagePickerButtonProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.8}>
      <Feather name="camera" size={28} color={theme.colors.primaryLight} style={styles.icon} />
      <Text style={styles.text}>Adicionar imagem</Text>
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
    // Sombras para dar a profundidade igual ao design
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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