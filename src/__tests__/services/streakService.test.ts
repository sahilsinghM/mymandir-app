import { StreakService } from '../../services/streakService';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({
    exists: jest.fn(() => false),
    data: jest.fn(() => ({})),
  })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
  Timestamp: {
    fromDate: jest.fn((date) => ({ toDate: () => date })),
  },
}));

describe('StreakService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate streak from last activity', () => {
    const lastActivity = new Date();
    lastActivity.setDate(lastActivity.getDate() - 2); // 2 days ago
    
    const streak = StreakService.calculateStreak(lastActivity);
    expect(streak).toBe(0); // Should be 0 if more than 1 day ago
  });

  it('should calculate streak for today', () => {
    const lastActivity = new Date();
    
    const streak = StreakService.calculateStreak(lastActivity);
    expect(streak).toBe(1); // Should be 1 for today
  });

  it('should calculate streak for consecutive days', () => {
    const lastActivity = new Date();
    lastActivity.setDate(lastActivity.getDate() - 1); // Yesterday
    
    const streak = StreakService.calculateStreak(lastActivity);
    expect(streak).toBe(1); // Should be 1 for consecutive days (yesterday)
  });

  it('should update user streak', async () => {
    const { setDoc } = require('firebase/firestore');
    setDoc.mockResolvedValue(undefined);

    await StreakService.updateStreak('user-id', 5);
    expect(setDoc).toHaveBeenCalled();
  });

  it('should reset streak when broken', async () => {
    const { setDoc } = require('firebase/firestore');
    setDoc.mockResolvedValue(undefined);

    await StreakService.resetStreak('user-id');
    expect(setDoc).toHaveBeenCalled();
  });
});
