import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  /**
   * Request notification permissions from the user
   */
  public static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  public static async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule daily devotion notification
   */
  public static async scheduleDailyDevotion(): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Daily Devotion',
          body: 'Your daily dose of divinity awaits! Start your spiritual journey.',
          sound: true,
        },
        trigger: {
          hour: 7, // 7 AM
          minute: 0,
          repeats: true,
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling daily devotion notification:', error);
      throw error;
    }
  }

  /**
   * Schedule streak reminder notification
   */
  public static async scheduleStreakReminder(): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 Keep Your Streak Alive!',
          body: 'Don\'t break your spiritual streak. Visit MyMandir now!',
          sound: true,
        },
        trigger: {
          hour: 20, // 8 PM
          minute: 0,
          repeats: true,
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling streak reminder notification:', error);
      throw error;
    }
  }

  /**
   * Schedule mantra practice reminder
   */
  public static async scheduleMantraReminder(): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🕉️ Mantra Practice Time',
          body: 'Take a moment for peaceful meditation with sacred mantras.',
          sound: true,
        },
        trigger: {
          hour: 18, // 6 PM
          minute: 0,
          repeats: true,
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling mantra reminder notification:', error);
      throw error;
    }
  }

  /**
   * Schedule horoscope notification
   */
  public static async scheduleHoroscopeReminder(): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '⭐ Your Daily Horoscope',
          body: 'Discover what the stars have in store for you today.',
          sound: true,
        },
        trigger: {
          hour: 8, // 8 AM
          minute: 0,
          repeats: true,
        },
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling horoscope reminder notification:', error);
      throw error;
    }
  }

  /**
   * Schedule all default notifications
   */
  public static async scheduleAllNotifications(): Promise<string[]> {
    try {
      const notificationIds = await Promise.all([
        this.scheduleDailyDevotion(),
        this.scheduleStreakReminder(),
        this.scheduleMantraReminder(),
        this.scheduleHoroscopeReminder(),
      ]);
      return notificationIds;
    } catch (error) {
      console.error('Error scheduling all notifications:', error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  public static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
      throw error;
    }
  }

  /**
   * Cancel specific notification by ID
   */
  public static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }
}
