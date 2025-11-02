import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedButton } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { signInAsGuest } = useAuth();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Logo/Icon area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <ThemedText variant="h1" color="primary" style={styles.logoText}>
              ॐ
            </ThemedText>
          </View>
        </View>

        {/* Welcome text */}
        <View style={styles.textContainer}>
          <ThemedText variant="h1" style={styles.title}>
            Welcome to MyMandir
          </ThemedText>
          <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
            Your daily dose of divinity
          </ThemedText>
          <ThemedText variant="body" color="textSecondary" style={styles.description}>
            Discover spiritual wisdom, daily horoscopes, mantras, and connect with your inner self.
          </ThemedText>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Get Started"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => navigation.navigate('Login')}
            style={styles.primaryButton}
          />
          <ThemedButton
            title="Continue as Guest"
            variant="ghost"
            size="lg"
            fullWidth
            onPress={signInAsGuest}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  logoText: {
    fontSize: 64,
  },
  textContainer: {
    marginBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    fontSize: theme.typography.sizes.lg,
  },
  description: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  primaryButton: {
    marginBottom: theme.spacing.sm,
  },
});

