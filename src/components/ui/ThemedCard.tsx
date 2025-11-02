import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

interface ThemedCardProps extends ViewProps {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: keyof typeof theme.spacing;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  elevation = 'md',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const getElevationStyle = () => {
    if (elevation === 'none') return {};
    return theme.shadows[elevation];
  };

  return (
    <View
      style={[
        styles.card,
        {
          padding: theme.spacing[padding],
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.borderRadius.lg,
        },
        getElevationStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

