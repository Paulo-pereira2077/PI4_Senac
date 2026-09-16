import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { theme } from '@/temas';

interface SocialButtonProps {
  iconName: string; 
  onPress: () => void;
}

export default function SocialButton({ iconName, onPress }: SocialButtonProps){
  return (
    <TouchableOpacity style={styles.socialButton} onPress={onPress}>
      <Text style={styles.socialIconPlaceholder}>{iconName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border, // Substituído pela cor de borda do tema
    borderRadius: 12,
    paddingVertical: 14,              // Mantido valor original
    marginHorizontal: 6,              // Mantido valor original
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconPlaceholder: {
    fontSize: 20,                        // Mantido valor original (ver nota abaixo)
    fontWeight: theme.fonts.weight.bold, // Substituído pelo peso bold (700) do tema
    color: theme.colors.textPrimary,     // Substituído pela cor escura principal
  },
});