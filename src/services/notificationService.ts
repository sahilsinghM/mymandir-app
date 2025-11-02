/**
 * Notification Service
 * Manages push notifications, scheduling, and permissions
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationConfig } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }

    // Configure Android channel for notifications
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6F00',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Check if notification permissions are granted
 */
export const hasNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a daily notification
 */
export const scheduleDailyNotification = async (
  title: string,
  body: string,
  hour: number = 8,
  minute: number = 0
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Cancel any existing daily notifications with the same identifier
    const identifier = `daily-${title.toLowerCase().replace(/\s+/g, '-')}`;
    await Notifications.cancelScheduledNotificationAsync(identifier);

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    return null;
  }
};

/**
 * Schedule a streak reminder notification
 */
export const scheduleStreakReminder = async (
  hour: number = 20,
  minute: number = 0
): Promise<string | null> => {
  return scheduleDailyNotification(
    'Continue Your Spiritual Journey',
    "Don't break your streak! Check in today to continue your spiritual practice.",
    hour,
    minute
  );
};

/**
 * Schedule a daily devotion reminder
 */
export const scheduleDailyDevotionReminder = async (
  hour: number = 7,
  minute: number = 0
): Promise<string | null> => {
  return scheduleDailyNotification(
    'Daily Devotion',
    'Start your day with spiritual wisdom. Read today\'s Bhagavad Gita verse.',
    hour,
    minute
  );
};

/**
 * Schedule a mantra reminder
 */
export const scheduleMantraReminder = async (
  hour: number = 18,
  minute: number = 0
): Promise<string | null> => {
  return scheduleDailyNotification(
    'Mantra Meditation',
    'Time for your daily mantra practice. Find peace and clarity.',
    hour,
    minute
  );
};

/**
 * Schedule a horoscope update reminder
 */
export const scheduleHoroscopeReminder = async (
  hour: number = 9,
  minute: number = 0
): Promise<string | null> => {
  return scheduleDailyNotification(
    'Daily Horoscope',
    'Check your daily horoscope and discover what the stars have in store for you.',
    hour,
    minute
  );
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (identifier: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 */
export const getScheduledNotifications = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Setup notifications based on user configuration
 */
export const setupNotifications = async (
  config: NotificationConfig
): Promise<void> => {
  try {
    // Cancel all existing notifications first
    await cancelAllNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted, skipping setup');
      return;
    }

    // Schedule notifications based on config
    if (config.dailyDevotion) {
      await scheduleDailyDevotionReminder(7, 0);
    }

    if (config.streakReminder) {
      await scheduleStreakReminder(20, 0);
    }

    if (config.mantraReminder) {
      await scheduleMantraReminder(18, 0);
    }

    if (config.horoscopeUpdate) {
      await scheduleHoroscopeReminder(9, 0);
    }
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

/**
 * Send a one-time notification immediately (for testing)
 */
export const sendTestNotification = async (): Promise<void> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from MyMandir',
        sound: 'default',
      },
      trigger: {
        seconds: 2,
      },
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

