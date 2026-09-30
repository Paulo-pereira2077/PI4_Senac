// Caminho do arquivo: temas/index.ts
export const theme = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    primarySoft: '#DBEAFE',
    bannerGradientTop: '#3B82F6',
    bannerGradientBottom: '#EFF6FF',
    background: '#F8F9FA',
    cardBackground: '#FFFFFF',
    surfaceGray: '#F3F4F6',
    secondaryButton: '#D1D5DB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textPlaceholder: '#9CA3AF',
    border: '#E5E7EB',
    inputBackground: '#FFFFFF',
    iconPurple: '#8B5CF6',
    priceGreen: '#10B981',

    // Cores específicas para o modal e ações
    success: '#05A66B', // Verde dos botões principais do cliente ("Seguir para o pagamento", "Salvar")
    danger: '#F97316',  // Laranja do botão "Não" e alertas
    error: '#EF4444',   // Vermelho para exclusão/erros
    warning: '#F59E0B', // Amarelo para status em andamento
    modalOverlay: 'rgba(0, 0, 0, 0.4)', // Fundo escuro do modal
  },
  fonts: {
    family: {
      regular: 'Outfit_400Regular',
      semiBold: 'Outfit_600SemiBold',
      bold: 'Outfit_700Bold',
      extraBold: 'Outfit_800ExtraBold',
    },
    size: {
      tiny: 10,
      small: 12,
      body: 14,
      button: 16,
      sectionTitle: 18,
      header: 20,
      title: 28,
    },
    weight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
};