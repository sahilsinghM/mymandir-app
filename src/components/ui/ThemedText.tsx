import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'sanskrit';
  color?: keyof typeof theme.colors;
  weight?: keyof typeof theme.typography.weights;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    { color: theme.colors[color] },
    { fontWeight: theme.typography.weights[weight] },
    { textAlign: align },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: theme.typography.fonts.primary,
  },
  h1: {
    fontSize: theme.typography.sizes['4xl'],
    lineHeight: theme.typography.sizes['4xl'] * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
  },
  h2: {
    fontSize: theme.typography.sizes['3xl'],
    lineHeight: theme.typography.sizes['3xl'] * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
  },
  h3: {
    fontSize: theme.typography.sizes['2xl'],
    lineHeight: theme.typography.sizes['2xl'] * theme.typography.lineHeights.normal,
    fontWeight: theme.typography.weights.semibold,
  },
  h4: {
    fontSize: theme.typography.sizes.xl,
    lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.normal,
    fontWeight: theme.typography.weights.semibold,
  },
  h5: {
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    fontWeight: theme.typography.weights.medium,
  },
  h6: {
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
    fontWeight: theme.typography.weights.medium,
  },
  body: {
    fontSize: theme.typography.sizes.base,
    lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
  },
  caption: {
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * theme.typography.lineHeights.normal,
  },
  sanskrit: {
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.normal,
    fontFamily: theme.typography.fonts.sanskrit,
  },
});

export default ThemedText;
