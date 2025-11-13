import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AIJyotishScreen } from '../AIJyotish/AIJyotishScreen';
import { ExpertJyotishScreen } from '../ExpertJyotish/ExpertJyotishScreen';
import { theme } from '../../theme/theme';
import { ThemedText } from '../../components/ui';

type GuidanceTab = 'ai' | 'expert';

export const GuidanceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GuidanceTab>('ai');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="h2" style={styles.title}>
          Guided Support
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
          Switch between instant AI insights or schedule time with a human expert
        </ThemedText>
      </View>

      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'ai' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('ai')}
        >
          <ThemedText
            variant="body"
            color={activeTab === 'ai' ? 'textInverse' : 'text'}
            weight={activeTab === 'ai' ? 'semiBold' : 'regular'}
          >
            AI Jyotish
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'expert' && styles.toggleButtonActive]}
          onPress={() => setActiveTab('expert')}
        >
          <ThemedText
            variant="body"
            color={activeTab === 'expert' ? 'textInverse' : 'text'}
            weight={activeTab === 'expert' ? 'semiBold' : 'regular'}
          >
            Human Expert
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'ai' ? <AIJyotishScreen /> : <ExpertJyotishScreen />}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    lineHeight: theme.typography.lineHeights.relaxed,
  },
  toggleGroup: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  contentContainer: {
    flex: 1,
  },
});
