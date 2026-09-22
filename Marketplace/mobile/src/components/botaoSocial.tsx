import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps
} from 'react-native';
import { theme } from '@/temas';

interface SocialButtonProps extends TouchableOpacityProps {
  iconName: string;
}

export default function SocialButton({ iconName, style, ...rest }: SocialButtonProps) {
  return (
    <TouchableOpacity style={[styles.socialButton, style]} {...rest} activeOpacity={0.7}>
      <Text style={styles.socialIconPlaceholder}>{iconName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconPlaceholder: {
    fontSize: 20,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
});
