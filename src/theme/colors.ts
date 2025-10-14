// Theme colors for MyMandir app
export const colors = {
  // Primary colors
  primary: '#FF9933', // Saffron
  secondary: '#FFFFFF', // White
  accent: '#FFD700', // Gold
  
  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  cardBackground: '#FFF8F0', // Light saffron tint
  
  // Text colors
  text: '#000000',
  textSecondary: '#666666',
  textLight: '#999999',
  onSurface: '#000000',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // UI colors
  border: '#E0E0E0',
  placeholder: '#999999',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  
  // Notification
  notification: '#FF9933',
  
  // Gradients
  gradientStart: '#FF9933',
  gradientEnd: '#FFD700',
  gradientLight: '#FFF8F0',
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

// Typography
export const typography = {
  // Font families
  primary: 'System', // Will be replaced with Noto Sans Devanagari
  secondary: 'System', // Will be replaced with Poppins
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 16,
  caption: 14,
  small: 12,
  
  // Font weights
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  
  // Line heights
  lineHeight: {
    h1: 40,
    h2: 36,
    h3: 32,
    h4: 28,
    h5: 24,
    h6: 22,
    body: 24,
    caption: 20,
    small: 18,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 50,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
