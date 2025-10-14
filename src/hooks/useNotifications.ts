import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { NotificationService } from '../services/notificationService';
import { StreakService, StreakData } from '../services/streakService';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const granted = await NotificationService.requestPermissions();
      setNotificationsEnabled(granted);
      
      if (granted) {
        await NotificationService.scheduleAllNotifications();
        Alert.alert('Success', 'Notifications enabled! You\'ll receive daily spiritual reminders.');
      } else {
        Alert.alert('Permission Denied', 'Notifications are disabled. You can enable them in Settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert('Error', 'Failed to enable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const disableNotifications = useCallback(async () => {
    setLoading(true);
    try {
      await NotificationService.cancelAllNotifications();
      setNotificationsEnabled(false);
      Alert.alert('Success', 'Notifications disabled.');
    } catch (error) {
      console.error('Error disabling notifications:', error);
      Alert.alert('Error', 'Failed to disable notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      const enabled = await NotificationService.areNotificationsEnabled();
      setNotificationsEnabled(enabled);
    };
    
    checkPermissions();
  }, []);

  return {
    notificationsEnabled,
    loading,
    requestPermissions,
    disableNotifications,
  };
};

export const useStreak = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStreakData = useCallback(async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const data = await StreakService.getStreakData(user.uid);
      setStreakData(data);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const updateStreak = useCallback(async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      const newStreak = await StreakService.checkAndUpdateStreak(user.uid);
      await loadStreakData(); // Reload data
      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, loadStreakData]);

  const resetStreak = useCallback(async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      await StreakService.resetStreak(user.uid);
      await loadStreakData(); // Reload data
    } catch (error) {
      console.error('Error resetting streak:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid, loadStreakData]);

  const getAchievements = useCallback(() => {
    if (!streakData) return [];
    return StreakService.getStreakAchievements(streakData.currentStreak);
  }, [streakData]);

  const getKarmaPoints = useCallback(() => {
    if (!streakData) return 0;
    return StreakService.calculateKarmaPoints(streakData.currentStreak);
  }, [streakData]);

  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  return {
    streakData,
    loading,
    loadStreakData,
    updateStreak,
    resetStreak,
    getAchievements,
    getKarmaPoints,
  };
};
