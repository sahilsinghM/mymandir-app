import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';
import { ThemedText } from '../../components/ui';
import { DailyShlokaCard } from '../../components/home/DailyShlokaCard';

export const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh will be handled by DailyShlokaCard
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <ThemedText variant="h1" color="primary">
          MyMandir
        </ThemedText>
        {user && (
          <ThemedText variant="body" color="textSecondary">
            Welcome, {user.displayName || 'Devotee'}
          </ThemedText>
        )}
      </View>

      <DailyShlokaCard />

      {/* Placeholder for additional home content */}
      <View style={styles.section}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Explore More
        </ThemedText>
        <ThemedText variant="body" color="textSecondary">
          Discover horoscopes, mantras, AI Jyotish, and more from the navigation below.
        </ThemedText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  section: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
});

