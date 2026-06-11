// src/utils/theme.ts
export const Colors = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#FF8F00',
  error: '#D32F2F',
  warning: '#FFA000',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

export const Typography = {
  headlineLarge: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
};