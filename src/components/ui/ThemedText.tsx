import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: keyof typeof theme.colors;
  weight?: keyof typeof theme.typography.weights;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    h1: {
      fontSize: theme.typography.sizes.xxxl,
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.sizes.xxxl * theme.typography.lineHeights.tight,
    },
    h2: {
      fontSize: theme.typography.sizes.xxl,
      fontWeight: theme.typography.weights.bold,
      lineHeight: theme.typography.sizes.xxl * theme.typography.lineHeights.tight,
    },
    h3: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.semiBold,
      lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.normal,
    },
    body: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights[weight],
      lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
    },
    caption: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights[weight],
      lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    },
    label: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
    },
  };

  return (
    <Text
      style={[
        variantStyles[variant],
        { color: theme.colors[color] },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

