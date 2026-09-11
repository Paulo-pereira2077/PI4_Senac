import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '@/temas';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
}

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps){
  return (
    <TouchableOpacity style={styles.primaryButton} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary, // Usa o Azul Principal
    borderRadius: 12,
    paddingVertical: theme.spacing.m,      // Usa o espaçamento 16
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: theme.colors.background,        // Usa o Branco do fundo
    fontSize: theme.fonts.size.button,     // Usa o tamanho de fonte 16
    fontWeight: theme.fonts.weight.bold,   // Usa o peso '700'
  },
});