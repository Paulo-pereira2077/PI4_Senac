import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

import { theme } from '@/temas';

interface CustomInputProps extends TextInputProps {
  label: string;
}

export default function CustomInput({ label, ...textInputProps }: CustomInputProps){
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.inputField}
        placeholderTextColor={theme.colors.textPlaceholder} // Cor do placeholder via tema
        {...textInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20, // Mantido (o espaçamento 'l' é 24, mas mantive 20 para preservar o layout exato)
  },
  inputLabel: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s, // 8
  },
  inputField: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m, // 16
    paddingVertical: 14, // Mantido valor original
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.inputBackground,
  },
});