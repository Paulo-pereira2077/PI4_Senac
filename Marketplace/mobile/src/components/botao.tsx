import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@/temas';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
}

export default function PrimaryButton({ 
  title, 
  isLoading = false, 
  disabled, 
  style, 
  ...rest 
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.primaryButton, 
        disabled && styles.disabledButton,
        style
      ]} 
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colors.background} />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.textPlaceholder, // Ou theme.colors.disabled se existir
    opacity: 0.7,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: theme.fonts.size.button,
    fontWeight: theme.fonts.weight.bold,
  },
});