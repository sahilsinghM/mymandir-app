import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../ui';
import { StreakData } from '../../types';
import { getStreakData, recordCheckIn, hasCheckedInToday } from '../../services/streakService';
import { useAuth } from '../../contexts/AuthContext';

export const StreakCard: React.FC = () => {
  const { user, isGuest } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  useEffect(() => {
    loadStreakData();
    checkTodayStatus();
  }, [user, isGuest]);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const data = await getStreakData(user?.id, isGuest);
      setStreakData(data);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTodayStatus = async () => {
    try {
      const checkedIn = await hasCheckedInToday(user?.id, isGuest);
      setAlreadyCheckedIn(checkedIn);
    } catch (error) {
      console.error('Error checking today status:', error);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      const result = await recordCheckIn(user?.id, isGuest);
      
      if (result.isNewCheckIn) {
        setStreakData(result.streakData);
        setAlreadyCheckedIn(true);
        // Show a brief success message
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error recording check-in:', error);
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <ThemedCard style={styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </ThemedCard>
    );
  }

  if (!streakData) {
    return null;
  }

  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 30) return '⚡️';
    if (streak < 100) return '🌟';
    return '✨';
  };

  const getKarmaLevel = (karma: number): string => {
    if (karma < 100) return 'Beginner';
    if (karma < 500) return 'Devoted';
    if (karma < 1000) return 'Enlightened';
    if (karma < 5000) return 'Sage';
    return 'Master';
  };

  return (
    <ThemedCard style={styles.card}>
      <View style={styles.header}>
        <ThemedText variant="h3" style={styles.title}>
          Your Spiritual Journey
        </ThemedText>
        <ThemedText variant="caption" color="textSecondary">
          Continue your daily practice
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={styles.statValueContainer}>
            <ThemedText variant="h1" color="primary" style={styles.statValue}>
              {streakData.currentStreak}
            </ThemedText>
            <ThemedText variant="h2" style={styles.emoji}>
              {getStreakEmoji(streakData.currentStreak)}
            </ThemedText>
          </View>
          <ThemedText variant="caption" color="textSecondary" style={styles.statLabel}>
            Day Streak
          </ThemedText>
          {streakData.longestStreak > streakData.currentStreak && (
            <ThemedText variant="caption" color="textLight" style={styles.bestStreak}>
              Best: {streakData.longestStreak} days
            </ThemedText>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <ThemedText variant="h2" color="primary" style={styles.statValue}>
            {streakData.karmaPoints}
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary" style={styles.statLabel}>
            Karma Points
          </ThemedText>
          <ThemedText variant="caption" color="accent" style={styles.karmaLevel}>
            {getKarmaLevel(streakData.karmaPoints)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.checkInContainer}>
        {alreadyCheckedIn ? (
          <View style={styles.checkedInBox}>
            <ThemedText variant="body" color="success" style={styles.checkedInText}>
              ✓ Checked in today!
            </ThemedText>
            <ThemedText variant="caption" color="textSecondary">
              Come back tomorrow to continue your streak
            </ThemedText>
          </View>
        ) : (
          <ThemedButton
            title={checkingIn ? 'Checking In...' : 'Check In Today'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleCheckIn}
            disabled={checkingIn}
            style={styles.checkInButton}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <ThemedText variant="caption" color="textSecondary" style={styles.infoText}>
          Total days: {streakData.totalDays} • Earn karma by checking in daily
        </ThemedText>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.lg,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    marginRight: theme.spacing.xs,
  },
  emoji: {
    fontSize: 32,
  },
  statLabel: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  bestStreak: {
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  karmaLevel: {
    marginTop: theme.spacing.xs,
    fontWeight: theme.typography.weights.semiBold,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  checkInContainer: {
    marginBottom: theme.spacing.md,
  },
  checkInButton: {
    marginBottom: theme.spacing.sm,
  },
  checkedInBox: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  checkedInText: {
    fontWeight: theme.typography.weights.semiBold,
    marginBottom: theme.spacing.xs,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    textAlign: 'center',
  },
});

