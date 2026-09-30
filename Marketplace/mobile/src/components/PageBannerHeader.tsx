// Caminho do arquivo: components/PageBannerHeader.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/temas';

interface PageBannerHeaderProps {
  title: string;
}

export default function PageBannerHeader({ title }: PageBannerHeaderProps) {
  return (
    <View style={styles.bannerWrapper}>
      <View style={styles.topBand} />
      <View style={styles.middleBand}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.bottomBand} />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    width: '100%',
    marginBottom: theme.spacing.s,
  },
  topBand: {
    height: 10,
    backgroundColor: theme.colors.primary,
  },
  middleBand: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBand: {
    height: 14,
    backgroundColor: theme.colors.primarySoft,
    opacity: 0.7,
  },
  title: {
    fontSize: theme.fonts.size.body,
    fontWeight: theme.fonts.weight.bold,
    color: theme.colors.textPrimary,
  },
});