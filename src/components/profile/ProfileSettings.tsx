import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications, useStreak } from '../../hooks/useNotifications';
import StreakCard from './StreakCard';

const ProfileSettings: React.FC = () => {
  const { user, userProfile, updateUserProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { notificationsEnabled, loading: notificationLoading, requestPermissions, disableNotifications } = useNotifications();
  const { streakData, loading: streakLoading, updateStreak } = useStreak();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleUpdateProfile = async (updates: any) => {
    try {
      await updateUserProfile(updates);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const ProfileInfoCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const ActionButton = ({ title, onPress, icon, color = colors.primary }: { title: string; onPress: () => void; icon: string; color?: string }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.gradientLight, colors.background]} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.gradientLight, colors.background]} style={styles.gradient}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={60} color={colors.primary} />
            </View>
            <Text style={styles.userName}>{userProfile.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>

          {/* Streak Card */}
          <StreakCard 
            streakData={streakData} 
            onUpdateStreak={updateStreak}
          />

          {/* Profile Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.streakCount}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.karmaPoints}</Text>
              <Text style={styles.statLabel}>Karma Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.deityPreference}</Text>
              <Text style={styles.statLabel}>Deity</Text>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <ProfileInfoCard
              title="Deity Preference"
              value={userProfile.deityPreference}
              icon="leaf"
            />
            <ProfileInfoCard
              title="Language"
              value={userProfile.language}
              icon="language"
            />
            <ProfileInfoCard
              title="Member Since"
              value={new Date(userProfile.createdAt).toLocaleDateString()}
              icon="calendar"
            />
          </View>

          {/* Settings Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <ActionButton
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              icon="create"
            />
            <ActionButton
              title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
              onPress={notificationsEnabled ? disableNotifications : requestPermissions}
              icon={notificationsEnabled ? "notifications-off" : "notifications"}
            />
            <ActionButton
              title="Privacy Settings"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon.')}
              icon="shield"
            />
            <ActionButton
              title="Help & Support"
              onPress={() => Alert.alert('Coming Soon', 'Help & support will be available soon.')}
              icon="help-circle"
            />
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <ActionButton
              title="Sign Out"
              onPress={handleSignOut}
              icon="log-out"
              color={colors.error}
            />
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>MyMandir v1.0.0</Text>
            <Text style={styles.appDescription}>Your daily dose of divinity</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    ...shadows.medium,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    minWidth: 80,
    ...shadows.small,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadows.small,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 10,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 34,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    ...shadows.small,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 5,
  },
  appDescription: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
});

export default ProfileSettings;
