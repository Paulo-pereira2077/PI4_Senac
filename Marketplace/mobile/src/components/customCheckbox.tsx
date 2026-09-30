// Caminho do arquivo: components/customCheckbox.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '@/temas';

interface CustomCheckboxProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  containerStyle?: ViewStyle;
}

export default function CustomCheckbox({
  label,
  value,
  onValueChange,
  containerStyle,
}: CustomCheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.container, !label && styles.containerNoLabel, containerStyle]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <View style={styles.innerCheck} />}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  containerNoLabel: {
    marginBottom: 0,
  },
  box: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
  },
  boxChecked: {
    borderColor: theme.colors.primary,
  },
  innerCheck: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
  },
});