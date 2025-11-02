import { useState, useEffect, useCallback } from 'react';
import {
  requestNotificationPermissions,
  hasNotificationPermissions,
  setupNotifications,
  getScheduledNotifications,
  sendTestNotification,
  scheduleStreakReminder,
  scheduleDailyDevotionReminder,
  scheduleMantraReminder,
  scheduleHoroscopeReminder,
  cancelAllNotifications,
} from '../services/notificationService';
import { NotificationConfig } from '../types';

export interface UseNotificationsReturn {
  hasPermission: boolean;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  setup: (config: NotificationConfig) => Promise<void>;
  sendTest: () => Promise<void>;
  getScheduled: () => Promise<void>;
  scheduledCount: number;
  error: string | null;
}

/**
 * Hook for managing notifications
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      const permission = await hasNotificationPermissions();
      setHasPermission(permission);
      
      if (permission) {
        const scheduled = await getScheduledNotifications();
        setScheduledCount(scheduled.length);
      }
    } catch (err: any) {
      setError(err.message || 'Error checking notification permissions');
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const granted = await requestNotificationPermissions();
      setHasPermission(granted);
      
      if (granted) {
        const scheduled = await getScheduledNotifications();
        setScheduledCount(scheduled.length);
      }
      
      return granted;
    } catch (err: any) {
      setError(err.message || 'Error requesting notification permissions');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setup = useCallback(async (config: NotificationConfig) => {
    try {
      setLoading(true);
      setError(null);
      await setupNotifications(config);
      
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (err: any) {
      setError(err.message || 'Error setting up notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await sendTestNotification();
    } catch (err: any) {
      setError(err.message || 'Error sending test notification');
    } finally {
      setLoading(false);
    }
  }, []);

  const getScheduled = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
    } catch (err: any) {
      setError(err.message || 'Error getting scheduled notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hasPermission,
    loading,
    requestPermission,
    setup,
    sendTest,
    getScheduled,
    scheduledCount,
    error,
  };
};

