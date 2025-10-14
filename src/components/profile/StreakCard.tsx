import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { StreakData } from '../../services/streakService';

interface StreakCardProps {
  streakData: StreakData | null;
  onUpdateStreak?: () => void;
}

const StreakCard: React.FC<StreakCardProps> = ({ streakData, onUpdateStreak }) => {
  if (!streakData) {
    return (
      <LinearGradient
        colors={[colors.cardBackground, colors.background]}
        style={styles.card}
      >
        <Text style={styles.loadingText}>Loading streak data...</Text>
      </LinearGradient>
    );
  }

  const achievements = StreakService.getStreakAchievements(streakData.currentStreak);
  const karmaPoints = StreakService.calculateKarmaPoints(streakData.currentStreak);

  return (
    <LinearGradient
      colors={[colors.cardBackground, colors.background]}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Spiritual Streak</Text>
        <TouchableOpacity onPress={onUpdateStreak} style={styles.updateButton}>
          <Ionicons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.streakContainer}>
        <View style={styles.streakNumber}>
          <Text style={styles.streakCount}>{streakData.currentStreak}</Text>
          <Text style={styles.streakLabel}>Days</Text>
        </View>
        
        <View style={styles.streakInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="trophy" size={16} color={colors.accent} />
            <Text style={styles.infoText}>Longest: {streakData.longestStreak} days</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="star" size={16} color={colors.accent} />
            <Text style={styles.infoText}>Total: {streakData.totalDays} days</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="diamond" size={16} color={colors.accent} />
            <Text style={styles.infoText}>Karma: {karmaPoints} points</Text>
          </View>
        </View>
      </View>

      {achievements.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievement}>
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.motivationContainer}>
        <Text style={styles.motivationText}>
          {streakData.currentStreak === 0 
            ? 'Start your spiritual journey today!'
            : streakData.currentStreak < 7
            ? 'Keep going! You\'re building a great habit.'
            : streakData.currentStreak < 30
            ? 'Amazing! You\'re on a roll.'
            : 'Incredible! You\'re a spiritual warrior!'
          }
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  updateButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    ...shadows.small,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    alignItems: 'center',
    marginRight: 20,
  },
  streakCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    lineHeight: 50,
  },
  streakLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  streakInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  achievementsContainer: {
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievement: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.secondary,
  },
  motivationContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  motivationText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default StreakCard;
