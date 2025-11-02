import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton, ThemedInput } from '../ui';
import { GeneratedShloka } from '../../types';
import { generateShloka } from '../../services/freeAIService';

const emotions = [
  'Peace',
  'Strength',
  'Happiness',
  'Courage',
  'Love',
  'Wisdom',
  'Gratitude',
  'Healing',
  'Protection',
  'Blessing',
];

interface ShlokaGeneratorProps {
  onGenerateComplete?: (shloka: GeneratedShloka) => void;
}

export const ShlokaGenerator: React.FC<ShlokaGeneratorProps> = ({
  onGenerateComplete,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [situation, setSituation] = useState('');
  const [generatedShloka, setGeneratedShloka] = useState<GeneratedShloka | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedEmotion) {
      setError('Please select an emotion');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setGeneratedShloka(null);

      const result = await generateShloka(selectedEmotion, situation || undefined);
      const shloka: GeneratedShloka = {
        verse: result.verse,
        translation: result.translation,
        meaning: result.meaning,
        source: 'AI Generated',
      };

      setGeneratedShloka(shloka);
      onGenerateComplete?.(shloka);
    } catch (err: any) {
      setError(err.message || 'Failed to generate shloka. Please try again.');
      console.error('Error generating shloka:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedCard style={styles.card}>
        <ThemedText variant="h3" style={styles.title}>
          Generate a Shloka
        </ThemedText>
        <ThemedText variant="body" color="textSecondary" style={styles.subtitle}>
          Select how you're feeling and get a personalized Sanskrit verse
        </ThemedText>

        <View style={styles.emotionContainer}>
          <ThemedText variant="label" style={styles.label}>
            How are you feeling?
          </ThemedText>
          <View style={styles.emotionGrid}>
            {emotions.map((emotion) => (
              <ThemedButton
                key={emotion}
                title={emotion}
                variant={selectedEmotion === emotion ? 'primary' : 'outline'}
                size="sm"
                onPress={() => {
                  setSelectedEmotion(emotion);
                  setError(null);
                }}
                style={styles.emotionButton}
              />
            ))}
          </View>
        </View>

        <View style={styles.situationContainer}>
          <ThemedInput
            placeholder="Optional: Describe your situation..."
            value={situation}
            onChangeText={setSituation}
            multiline
            numberOfLines={3}
            style={styles.situationInput}
          />
        </View>

        {error && (
          <ThemedText variant="caption" color="error" style={styles.errorText}>
            {error}
          </ThemedText>
        )}

        <ThemedButton
          title={loading ? 'Generating...' : 'Generate Shloka'}
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleGenerate}
          disabled={!selectedEmotion || loading}
          style={styles.generateButton}
        />
      </ThemedCard>

      {loading && (
        <ThemedCard style={styles.loadingCard}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <ThemedText variant="body" color="textSecondary" style={styles.loadingText}>
            Generating your personalized shloka...
          </ThemedText>
        </ThemedCard>
      )}

      {generatedShloka && !loading && (
        <ThemedCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <ThemedText variant="h3" color="primary">
              Your Shloka
            </ThemedText>
            {generatedShloka.source && (
              <ThemedText variant="caption" color="textSecondary">
                {generatedShloka.source}
              </ThemedText>
            )}
          </View>

          <View style={styles.verseContainer}>
            <ThemedText variant="h2" style={styles.verse}>
              {generatedShloka.verse}
            </ThemedText>
          </View>

          {generatedShloka.translation && (
            <View style={styles.translationContainer}>
              <ThemedText variant="label" color="textSecondary" style={styles.translationLabel}>
                Translation:
              </ThemedText>
              <ThemedText variant="body" style={styles.translation}>
                {generatedShloka.translation}
              </ThemedText>
            </View>
          )}

          {generatedShloka.meaning && (
            <View style={styles.meaningContainer}>
              <ThemedText variant="label" color="textSecondary" style={styles.meaningLabel}>
                Meaning:
              </ThemedText>
              <ThemedText variant="body" style={styles.meaning}>
                {generatedShloka.meaning}
              </ThemedText>
            </View>
          )}
        </ThemedCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    marginBottom: theme.spacing.lg,
  },
  emotionContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  emotionButton: {
    flex: 1,
    minWidth: '30%',
  },
  situationContainer: {
    marginBottom: theme.spacing.lg,
  },
  situationInput: {
    minHeight: 80,
  },
  errorText: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  generateButton: {
    marginTop: theme.spacing.sm,
  },
  loadingCard: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
  },
  resultCard: {
    marginTop: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  verseContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
  },
  verse: {
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.h2,
  },
  translationContainer: {
    marginBottom: theme.spacing.md,
  },
  translationLabel: {
    marginBottom: theme.spacing.xs,
  },
  translation: {
    fontStyle: 'italic',
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.body,
  },
  meaningContainer: {
    marginTop: theme.spacing.md,
  },
  meaningLabel: {
    marginBottom: theme.spacing.xs,
  },
  meaning: {
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.body,
    textAlign: 'justify',
  },
});

