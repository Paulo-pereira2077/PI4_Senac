// Caminho do arquivo: components/input.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/temas';

interface CustomInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  leftIcon?: keyof typeof Feather.glyphMap;
  leftIconColor?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function CustomInput({
  label,
  errorMessage,
  containerStyle,
  leftIcon,
  leftIconColor = theme.colors.iconPurple,
  rightIcon,
  onRightIconPress,
  rightElement,
  style,
  ...textInputProps
}: CustomInputProps) {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          errorMessage ? styles.inputFieldError : null,
          rightElement ? styles.inputWrapperWithElement : null,
        ]}
      >
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={16}
            color={leftIconColor}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.inputField, style]}
          placeholderTextColor={theme.colors.textPlaceholder}
          {...textInputProps}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
          >
            <Feather name={rightIcon} size={16} color={theme.colors.primaryLight} />
          </TouchableOpacity>
        )}

        {rightElement}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.m,
  },
  inputLabel: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.inputBackground,
    minHeight: 44,
  },
  inputWrapperWithElement: {
    paddingRight: 0,
    overflow: 'hidden',
  },
  leftIcon: {
    marginRight: theme.spacing.s,
  },
  inputField: {
    flex: 1,
    paddingVertical: 10,
    fontSize: theme.fonts.size.small,
    color: theme.colors.textPrimary,
  },
  rightIconButton: {
    paddingLeft: theme.spacing.s,
  },
  inputFieldError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.fonts.size.small,
    marginTop: 4,
  },
});