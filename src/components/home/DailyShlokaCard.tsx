import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedCard, ThemedText } from '../ui';
import { theme } from '../../theme/theme';
import { DailyShloka } from '../../types';
import { getRandomVerse } from '../../services/geetaApi';

export const DailyShlokaCard: React.FC = () => {
  const [shloka, setShloka] = useState<DailyShloka | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShloka();
  }, []);

  const loadShloka = async () => {
    try {
      setLoading(true);
      setError(null);
      const verse = await getRandomVerse();
      setShloka(verse);
    } catch (err: any) {
      setError(err.message || 'Failed to load verse');
      console.error('Error loading shloka:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedCard>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
            Loading today's wisdom...
          </ThemedText>
        </View>
      </ThemedCard>
    );
  }

  if (error || !shloka) {
    return (
      <ThemedCard>
        <ThemedText variant="body" color="error">
          {error || 'Unable to load verse'}
        </ThemedText>
      </ThemedCard>
    );
  }

  return (
    <ThemedCard style={styles.card}>
      <View style={styles.header}>
        <ThemedText variant="h3" color="primary">
          Daily Shloka
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary">
          Bhagavad Gita - Chapter {shloka.chapter}, Verse {shloka.verseNumber}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText variant="body" style={styles.verse} color="devotional">
          {shloka.verse}
        </ThemedText>

        <View style={styles.translationContainer}>
          <ThemedText variant="label" color="textSecondary" style={styles.translationLabel}>
            Translation:
          </ThemedText>
          <ThemedText variant="body" color="text" style={styles.translation}>
            {shloka.translation}
          </ThemedText>
        </View>

        {shloka.meaning && (
          <View style={styles.meaningContainer}>
            <ThemedText variant="label" color="textSecondary" style={styles.meaningLabel}>
              Meaning:
            </ThemedText>
            <ThemedText variant="body" color="textSecondary" style={styles.meaning}>
              {shloka.meaning}
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  content: {
    gap: theme.spacing.md,
  },
  verse: {
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.relaxed,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.md,
  },
  translationContainer: {
    marginTop: theme.spacing.md,
  },
  translationLabel: {
    marginBottom: theme.spacing.xs,
  },
  translation: {
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
  },
  meaningContainer: {
    marginTop: theme.spacing.sm,
  },
  meaningLabel: {
    marginBottom: theme.spacing.xs,
  },
  meaning: {
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.relaxed,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
});

