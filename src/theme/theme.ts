import { colors, shadows } from './colors';

export const theme = {
  colors,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      body: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      caption: 14,
      xxxl: 32,
      display: 64,
    },
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      black: '900' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: shadows.small,
    md: shadows.medium,
    lg: shadows.large,
  },
} as const;

export type Theme = typeof theme;
