import { NotificationService } from '../../services/notificationService';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should request notification permissions', async () => {
    const { requestPermissionsAsync } = require('expo-notifications');
    requestPermissionsAsync.mockResolvedValue({ status: 'granted' });

    const result = await NotificationService.requestPermissions();
    expect(result).toBe(true);
    expect(requestPermissionsAsync).toHaveBeenCalled();
  });

  it('should schedule daily devotion notification', async () => {
    const { scheduleNotificationAsync } = require('expo-notifications');
    scheduleNotificationAsync.mockResolvedValue('notification-id');

    const result = await NotificationService.scheduleDailyDevotion();
    expect(result).toBe('notification-id');
    expect(scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('should schedule streak reminder notification', async () => {
    const { scheduleNotificationAsync } = require('expo-notifications');
    scheduleNotificationAsync.mockResolvedValue('notification-id');

    const result = await NotificationService.scheduleStreakReminder();
    expect(result).toBe('notification-id');
    expect(scheduleNotificationAsync).toHaveBeenCalled();
  });

  it('should cancel all notifications', async () => {
    const { cancelAllScheduledNotificationsAsync } = require('expo-notifications');
    cancelAllScheduledNotificationsAsync.mockResolvedValue(undefined);

    await NotificationService.cancelAllNotifications();
    expect(cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });
});
