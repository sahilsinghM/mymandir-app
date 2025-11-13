import { Platform } from 'react-native';

/**
 * MyMandir Color Palette
 * Saffron/Gold theme for spiritual app
 */

export const colors = {
  // Primary colors
  primary: '#FF6F00', // Saffron
  primaryDark: '#E65100',
  primaryLight: '#FFB74D',
  gradientLight: '#FFE0B2',
  
  // Secondary colors
  secondary: '#FFFFFF',
  secondaryDark: '#F5F5F5',
  surface: '#FFFFFF',
  cardBackground: '#FFF3E0',
  
  // Accent colors
  accent: '#FFD700', // Gold
  accentDark: '#FFA000',
  
  // Background colors
  background: '#FFF8E1', // Cream
  backgroundSecondary: '#FFFFFF',
  
  // Text colors
  text: '#2E2E2E',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  textInverse: '#FFFFFF',
  
  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Devotional colors
  devotional: '#8B4513', // Brown for temple/religious elements
  devotionalLight: '#D2B48C',
} as const;

type ShadowConfig = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spreadRadius?: number;
  opacity: number;
  elevation: number;
};

const createShadowStyle = ({
  offsetX,
  offsetY,
  blurRadius,
  spreadRadius = 0,
  opacity,
  elevation,
}: ShadowConfig) => {
  if (Platform.OS === 'web') {
    const rgba = `rgba(0, 0, 0, ${opacity})`;
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgba}`,
    } as const;
  }

  return {
    shadowColor: '#000000',
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blurRadius,
    elevation,
  } as const;
};

export const shadows = {
  small: createShadowStyle({
    offsetX: 0,
    offsetY: 1,
    blurRadius: 3,
    opacity: 0.18,
    elevation: 1,
  }),
  medium: createShadowStyle({
    offsetX: 0,
    offsetY: 2,
    blurRadius: 6,
    opacity: 0.2,
    elevation: 4,
  }),
  large: createShadowStyle({
    offsetX: 0,
    offsetY: 4,
    blurRadius: 10,
    spreadRadius: 1,
    opacity: 0.25,
    elevation: 8,
  }),
} as const;

export type Colors = typeof colors;
