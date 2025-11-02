import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../theme/theme';
import { ThemedText, ThemedCard, ThemedButton } from '../../components/ui';
import { StreakCard } from '../../components/profile/StreakCard';

export const ProfileScreen: React.FC = () => {
  const { user, signOut, isGuest } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ThemedCard style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <ThemedText variant="h1" color="primary">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </ThemedText>
          </View>
          <ThemedText variant="h3" style={styles.name}>
            {user?.displayName || 'User'}
          </ThemedText>
          {user?.email && (
            <ThemedText variant="body" color="textSecondary">
              {user.email}
            </ThemedText>
          )}
          {isGuest && (
            <ThemedCard style={styles.guestBadge}>
              <ThemedText variant="caption" color="primary" weight="semiBold">
                Guest Mode - Sign in to save your progress
              </ThemedText>
            </ThemedCard>
          )}
        </View>
      </ThemedCard>

      <StreakCard />

      <ThemedCard style={styles.menuCard}>
        <ThemedText variant="h3" style={styles.sectionTitle}>
          Settings
        </ThemedText>
        
        <ThemedButton
          title="Notifications Settings"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon')}
          style={styles.menuItem}
        />
        
        <ThemedButton
          title="About"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() => Alert.alert('MyMandir', 'Version 1.0.0\nYour daily dose of divinity')}
          style={styles.menuItem}
        />
      </ThemedCard>

      {user && (
        <ThemedButton
          title="Sign Out"
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      )}
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
  profileCard: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  name: {
    marginBottom: theme.spacing.xs,
  },
  guestBadge: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  menuCard: {
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    marginBottom: theme.spacing.sm,
    justifyContent: 'flex-start',
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
});

