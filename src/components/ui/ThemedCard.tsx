import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/theme';

interface ThemedCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  style,
  ...props
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    styles[`padding_${padding}`],
    style,
  ];

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[theme.colors.cardBackground, theme.colors.background]}
        style={cardStyle}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.cardBackground,
  },
  default: {
    ...theme.shadows.sm,
  },
  elevated: {
    ...theme.shadows.lg,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.none,
  },
  gradient: {
    ...theme.shadows.md,
  },
  glow: {
    ...theme.shadows.glow,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: theme.spacing.sm,
  },
  padding_md: {
    padding: theme.spacing.md,
  },
  padding_lg: {
    padding: theme.spacing.lg,
  },
  padding_xl: {
    padding: theme.spacing.xl,
  },
});

export default ThemedCard;
