import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '@/temas';

interface CustomInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
}

export default function CustomInput({ 
  label, 
  errorMessage, 
  containerStyle, 
  ...textInputProps 
}: CustomInputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Text style={styles.inputLabel}>{label}</Text>
      
      <TextInput
        style={[
          styles.inputField,
          errorMessage ? styles.inputFieldError : null
        ]}
        placeholderTextColor={theme.colors.textPlaceholder}
        {...textInputProps}
      />
      
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  inputField: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: 14,
    fontSize: theme.fonts.size.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.inputBackground,
  },
  inputFieldError: {
    borderColor: 'red', // Substitua por theme.colors.error se existir
  },
  errorText: {
    color: 'red', // Substitua por theme.colors.error se existir
    fontSize: 12,
    marginTop: 4,
  }
});