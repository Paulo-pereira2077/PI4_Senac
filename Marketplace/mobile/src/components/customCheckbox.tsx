import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@/temas';

interface CustomCheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  containerStyle?: ViewStyle;
}

export default function CustomCheckbox({ 
  label, 
  value, 
  onValueChange,
  containerStyle 
}: CustomCheckboxProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, containerStyle]} 
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value && <View style={styles.innerCheck} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
    // Removido o alignSelf: 'flex-end' para torná-lo reutilizável globalmente
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
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