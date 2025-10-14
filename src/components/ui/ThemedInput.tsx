import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import ThemedText from './ThemedText';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outlined',
  size = 'md',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.input,
    styles[variant],
    styles[`size_${size}`],
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    isFocused && styles.containerFocused,
    error && styles.containerError,
  ];

  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText variant="caption" color="text" weight="medium" style={styles.label}>
          {label}
        </ThemedText>
      )}
      
      <View style={containerStyle}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={getIconSize(size)} 
            color={theme.colors.textSecondary} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textLight}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
            <Ionicons 
              name={rightIcon} 
              size={getIconSize(size)} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <ThemedText variant="caption" color="error" style={styles.errorText}>
          {error}
        </ThemedText>
      )}
      
      {helperText && !error && (
        <ThemedText variant="caption" color="textSecondary" style={styles.helperText}>
          {helperText}
        </ThemedText>
      )}
    </View>
  );
};

const getIconSize = (size: string): number => {
  switch (size) {
    case 'sm':
      return 16;
    case 'md':
      return 20;
    case 'lg':
      return 24;
    default:
      return 20;
  }
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  container_default: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  container_outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  container_filled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 0,
  },
  containerFocused: {
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  containerError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontFamily: theme.typography.fonts.primary,
  },
  default: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  outlined: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filled: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  size_sm: {
    fontSize: theme.typography.sizes.sm,
    paddingVertical: theme.spacing.xs,
  },
  size_md: {
    fontSize: theme.typography.sizes.base,
    paddingVertical: theme.spacing.sm,
  },
  size_lg: {
    fontSize: theme.typography.sizes.lg,
    paddingVertical: theme.spacing.md,
  },
  focused: {
    // Additional focused styles can be added here
  },
  error: {
    // Additional error styles can be added here
  },
  leftIcon: {
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  rightIconContainer: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  errorText: {
    marginTop: theme.spacing.xs,
  },
  helperText: {
    marginTop: theme.spacing.xs,
  },
});

export default ThemedInput;
