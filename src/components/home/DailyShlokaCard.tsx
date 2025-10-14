import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { GeetaAPI, GeetaVerse } from '../../services/geetaApi';
import * as Sharing from 'expo-sharing';

interface DailyShlokaCardProps {
  onSave?: (verse: GeetaVerse) => void;
}

export const DailyShlokaCard: React.FC<DailyShlokaCardProps> = ({ onSave }) => {
  const [verse, setVerse] = useState<GeetaVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomVerse = await GeetaAPI.getRandomVerse();
      setVerse(randomVerse);
    } catch (err) {
      setError('Failed to load verse');
      console.error('Error loading verse:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!verse) return;

    try {
      const shareText = `${verse.verse}\n\n${verse.translation}\n\n- Bhagavad Gita ${verse.chapter}.${verse.verseNumber}`;
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareText);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing verse:', error);
      Alert.alert('Error', 'Failed to share verse');
    }
  };

  const handleSave = () => {
    if (verse && onSave) {
      onSave(verse);
      Alert.alert('Saved', 'Verse saved to your favorites');
    }
  };

  const handleRefresh = () => {
    loadDailyVerse();
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading daily verse...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colors.cardBackground, colors.background]}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Shloka</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Verse Content */}
        <View style={styles.content}>
          <Text style={styles.sanskritVerse}>{verse.verse}</Text>
          <Text style={styles.translation}>{verse.translation}</Text>
          <Text style={styles.reference}>
            Bhagavad Gita {verse.chapter}.{verse.verseNumber}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    marginBottom: 20,
  },
  sanskritVerse: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  translation: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  actions: {
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
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  retryButtonText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DailyShlokaCard;
