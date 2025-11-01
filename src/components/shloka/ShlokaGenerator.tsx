import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { FreeAIService, ShlokaGeneration } from '../../services/freeAIService';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile as AppUserProfile } from '../../types/firestore';

interface ShlokaGeneratorProps {
  onShlokaGenerated?: (shloka: ShlokaGeneration) => void;
}

const EMOTION_SUGGESTIONS = [
  'Peace', 'Love', 'Gratitude', 'Courage', 'Wisdom', 'Forgiveness',
  'Compassion', 'Joy', 'Hope', 'Strength', 'Humility', 'Devotion'
];

export const ShlokaGenerator: React.FC<ShlokaGeneratorProps> = ({
  onShlokaGenerated,
}) => {
  const { userProfile } = useAuth();
  const [emotion, setEmotion] = useState('');
  const [generatedShloka, setGeneratedShloka] = useState<ShlokaGeneration | null>(null);
  const [loading, setLoading] = useState(false);

  const buildProfilePayload = (profile: AppUserProfile | null | undefined) => ({
    deityPreference: profile?.deityPreference,
    language: profile?.language,
  });

  const formatCategory = (category: ShlokaGeneration['category']) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  const generateShloka = async () => {
    if (!emotion.trim()) {
      Alert.alert('Error', 'Please enter an emotion to generate a shloka');
      return;
    }

    try {
      setLoading(true);
      setGeneratedShloka(null);

      const result = await FreeAIService.generateShloka(
        emotion.trim(),
        buildProfilePayload(userProfile)
      );

      setGeneratedShloka(result);
      onShlokaGenerated?.(result);
    } catch (error) {
      console.error('Error generating shloka:', error);
      Alert.alert('Error', 'Failed to generate shloka. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSuggestion = (suggestion: string) => {
    setEmotion(suggestion);
  };

  const shareShloka = async () => {
    if (!generatedShloka) return;

    try {
      const sections = [
        generatedShloka.sanskrit,
        generatedShloka.transliteration ? `Transliteration: ${generatedShloka.transliteration}` : null,
        generatedShloka.translation ? `Translation: ${generatedShloka.translation}` : null,
        generatedShloka.meaning ? `Meaning: ${generatedShloka.meaning}` : null,
        generatedShloka.deity ? `Deity: ${generatedShloka.deity}` : null,
        generatedShloka.category ? `Category: ${formatCategory(generatedShloka.category)}` : null,
      ].filter(Boolean);

      const shareText = sections.join('\n\n');
      
      // TODO: Implement sharing functionality
      console.log('Sharing shloka:', shareText);
      Alert.alert('Share', 'Shloka copied to clipboard');
    } catch (error) {
      console.error('Error sharing shloka:', error);
      Alert.alert('Error', 'Failed to share shloka');
    }
  };

  const saveShloka = () => {
    if (!generatedShloka) return;

    // TODO: Implement save to favorites functionality
    console.log('Saving shloka:', generatedShloka);
    Alert.alert('Saved', 'Shloka saved to your favorites');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Shloka Generator</Text>
          <Text style={styles.subtitle}>
            Generate personalized Sanskrit verses based on your emotions
          </Text>
        </View>

        {/* Emotion Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>What emotion are you feeling?</Text>
          <TextInput
            style={styles.emotionInput}
            placeholder="Enter your emotion (e.g., peace, love, gratitude)"
            value={emotion}
            onChangeText={setEmotion}
            multiline
            maxLength={100}
          />
        </View>

        {/* Emotion Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick Suggestions</Text>
          <View style={styles.suggestionsGrid}>
            {EMOTION_SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionButton,
                  emotion === suggestion && styles.selectedSuggestion,
                ]}
                onPress={() => handleEmotionSuggestion(suggestion)}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    emotion === suggestion && styles.selectedSuggestionText,
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, (!emotion.trim() || loading) && styles.generateButtonDisabled]}
          onPress={generateShloka}
          disabled={!emotion.trim() || loading}
        >
          <LinearGradient
            colors={(!emotion.trim() || loading) ? [colors.textLight, colors.textLight] : [colors.primary, colors.accent]}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.secondary} />
            ) : (
              <Ionicons name="sparkles" size={20} color={colors.secondary} />
            )}
            <Text style={styles.generateButtonText}>
              {loading ? 'Generating...' : 'Generate Shloka'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Generated Shloka */}
        {generatedShloka && (
          <View style={styles.shlokaContainer}>
            <LinearGradient
              colors={[colors.cardBackground, colors.background]}
              style={styles.shlokaGradient}
            >
              <View style={styles.shlokaHeader}>
                <Text style={styles.shlokaTitle}>Generated Shloka</Text>
                <Text style={styles.shlokaSubtitle}>For: {emotion}</Text>
              </View>

              <View style={styles.shlokaContent}>
                <Text style={styles.sanskritText}>{generatedShloka.sanskrit}</Text>
                {generatedShloka.transliteration ? (
                  <Text style={styles.transliterationText}>{generatedShloka.transliteration}</Text>
                ) : null}
                {generatedShloka.translation ? (
                  <Text style={styles.translationText}>{generatedShloka.translation}</Text>
                ) : null}
                {generatedShloka.meaning ? (
                  <Text style={styles.meaningText}>{generatedShloka.meaning}</Text>
                ) : null}
                {(generatedShloka.deity || generatedShloka.category) && (
                  <View style={styles.metadataContainer}>
                    {generatedShloka.deity ? (
                      <View style={styles.metadataChip}>
                        <Text style={styles.metadataLabel}>Deity</Text>
                        <Text style={styles.metadataValue}>{generatedShloka.deity}</Text>
                      </View>
                    ) : null}
                    {generatedShloka.category ? (
                      <View style={styles.metadataChip}>
                        <Text style={styles.metadataLabel}>Category</Text>
                        <Text style={styles.metadataValue}>{formatCategory(generatedShloka.category)}</Text>
                      </View>
                    ) : null}
                  </View>
                )}
              </View>

              <View style={styles.shlokaActions}>
                <TouchableOpacity style={styles.actionButton} onPress={shareShloka}>
                  <Ionicons name="share-outline" size={20} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton} onPress={saveShloka}>
                  <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            Our AI analyzes your emotion and generates a personalized Sanskrit shloka 
            with English translation and spiritual meaning. Each shloka is crafted to 
            resonate with your current emotional state and provide spiritual guidance.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emotionInput: {
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
    ...shadows.small,
  },
  suggestionsContainer: {
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },
  selectedSuggestion: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  suggestionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedSuggestionText: {
    color: colors.secondary,
  },
  generateButton: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
    ...shadows.medium,
  },
  generateButtonDisabled: {
    ...shadows.small,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  shlokaContainer: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  shlokaGradient: {
    padding: 20,
  },
  shlokaHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shlokaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  shlokaSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  shlokaContent: {
    marginBottom: 20,
  },
  sanskritText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  transliterationText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  meaningText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  metadataChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.small,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 6,
  },
  metadataValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  shlokaActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.small,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 16,
    ...shadows.small,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ShlokaGenerator;
