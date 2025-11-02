import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedButton, ThemedCard } from '../../components/ui';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingScreenProps {
  navigation: OnboardingScreenNavigationProp;
}

const onboardingSteps = [
  {
    title: 'Daily Devotion',
    description: 'Start your day with spiritual wisdom from Bhagavad Gita',
    emoji: '📿',
  },
  {
    title: 'AI Jyotish',
    description: 'Get personalized astrological guidance powered by AI',
    emoji: '🔮',
  },
  {
    title: 'Horoscope & Panchang',
    description: 'Discover your daily horoscope and auspicious timings',
    emoji: '⭐',
  },
  {
    title: 'Mantra Player',
    description: 'Listen to devotional mantras and enhance your spiritual practice',
    emoji: '🎵',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedButton
          title="Skip"
          variant="ghost"
          size="sm"
          onPress={handleSkip}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.emojiContainer}>
            <ThemedText style={styles.emoji}>{currentStepData.emoji}</ThemedText>
          </View>

          <ThemedText variant="h2" style={styles.title}>
            {currentStepData.title}
          </ThemedText>

          <ThemedText variant="body" color="textSecondary" style={styles.description}>
            {currentStepData.description}
          </ThemedText>

          {/* Progress indicators */}
          <View style={styles.progressContainer}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title={currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    marginBottom: theme.spacing.xl,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
});

