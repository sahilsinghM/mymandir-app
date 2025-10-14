import { Platform } from 'react-native';

// Color palette based on saffron, white, and gold theme
export const colors = {
  // Primary saffron/orange colors
  primary: '#FF6F00', // Main saffron
  primaryLight: '#FF8F00', // Light saffron
  primaryDark: '#E65100', // Dark saffron
  
  // Secondary white colors
  secondary: '#FFFFFF', // Pure white
  secondaryLight: '#FAFAFA', // Off-white
  secondaryDark: '#F5F5F5', // Light gray
  
  // Accent gold colors
  accent: '#FFD700', // Gold
  accentLight: '#FFF59D', // Light gold
  accentDark: '#F57F17', // Dark gold
  
  // Background colors
  background: '#FFF8E1', // Cream/off-white
  backgroundLight: '#FFFFFF', // Pure white
  backgroundDark: '#F5F5DC', // Beige
  
  // Card and surface colors
  cardBackground: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#F5F5F5',
  
  // Text colors
  text: '#2E2E2E', // Dark gray
  textSecondary: '#666666', // Medium gray
  textLight: '#999999', // Light gray
  textDisabled: '#CCCCCC', // Very light gray
  
  // Border colors
  border: '#E0E0E0', // Light gray
  borderLight: '#F0F0F0', // Very light gray
  borderDark: '#BDBDBD', // Medium gray
  
  // Status colors
  success: '#4CAF50', // Green
  warning: '#FF9800', // Orange
  error: '#F44336', // Red
  info: '#2196F3', // Blue
  
  // Social media colors
  googleBlue: '#4285F4',
  phoneGreen: '#25D366',
  whatsappGreen: '#25D366',
  
  // Gradient colors
  gradientStart: '#FFD700', // Light gold
  gradientEnd: '#FF6F00', // Saffron
  gradientLight: '#FFF8E1', // Cream
  gradientDark: '#FF6F00', // Saffron
  
  // Shadow color
  shadow: '#000000',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
};

// Typography system
export const typography = {
  // Font families
  fonts: {
    primary: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    secondary: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'sans-serif',
    }),
    sanskrit: Platform.select({
      ios: 'NotoSansDevanagari-Regular',
      android: 'NotoSansDevanagari-Regular',
      default: 'NotoSansDevanagari-Regular',
    }),
    mono: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
    '6xl': 48,
    '7xl': 56,
    '8xl': 64,
  },
  
  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Spacing system (based on 8px grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow system
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glowGold: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Z-index system
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Theme object that combines all design tokens
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
};

export default theme;
