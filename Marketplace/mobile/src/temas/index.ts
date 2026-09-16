export const theme = {
  colors: {
    primary: '#2563EB',
    background: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textPlaceholder: '#9CA3AF',
    border: '#E5E7EB',
    inputBackground: '#FAFAFA',
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
    },
    weight: {
      regular: '400' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    }
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  }
};