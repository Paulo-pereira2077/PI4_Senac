export const theme = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textPlaceholder: '#9CA3AF',
    border: '#E5E7EB',
    inputBackground: '#FFFFFF',

    // Cores específicas para o modal
    success: '#10B981',
    danger: '#F97316',
    modalOverlay: 'rgba(0, 0, 0, 0.4)',
  },
  fonts: {
    family: {
      regular: 'Outfit_400Regular',
      semiBold: 'Outfit_600SemiBold',
      bold: 'Outfit_700Bold',
      extraBold: 'Outfit_800ExtraBold',
    },
    size: {
      small: 12,
      body: 14,
      button: 16,
      title: 28,
      header: 20
    },
    weight: {
      regular: '400' as const,
      semiBold: '600' as const,
      medium: '500' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    }
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32, 
  }
};
