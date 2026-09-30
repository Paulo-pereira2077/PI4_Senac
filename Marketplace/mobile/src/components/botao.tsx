// Caminho do arquivo: components/botao.tsx
import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  TextStyle,
} from 'react-native';
import { theme } from '@/temas';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'success' | 'secondary';
  rounded?: boolean;
  textStyle?: TextStyle;
}

export default function PrimaryButton({
  title,
  isLoading = false,
  disabled,
  variant = 'primary',
  rounded = false,
  style,
  textStyle,
  ...rest
}: PrimaryButtonProps) {
  const getVariantStyle = () => {
    if (variant === 'success') return styles.successButton;
    if (variant === 'secondary') return styles.secondaryButton;
    return styles.primaryButton;
  };

  const getTextVariantStyle = () => {
    if (variant === 'secondary') return styles.secondaryButtonText;
    return styles.primaryButtonText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getVariantStyle(),
        rounded && styles.roundedButton,
        disabled && styles.disabledButton,
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={
            variant === 'secondary'
              ? theme.colors.textPrimary
              : theme.colors.cardBackground
          }
        />
      ) : (
        <Text style={[getTextVariantStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  successButton: {
    backgroundColor: theme.colors.success,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondaryButton,
  },
  roundedButton: {
    borderRadius: 28,
  },
  disabledButton: {
    backgroundColor: theme.colors.textPlaceholder,
    opacity: 0.7,
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.semiBold,
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.regular,
  },
});