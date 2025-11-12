/**
 * Real Integration Test for Streak Tracking Feature
 * Tests streak service functionality
 */

import { updateStreak, getStreak, resetStreak } from '../../services/streakService';
import { getFirestoreDB } from '../../services/firebase';
import { isFirebaseConfigured } from '../../utils/firebaseHelper';

describe('Streak Tracking Feature - Real Integration Tests', () => {
  const testUserId = `test-user-${Date.now()}`;

  beforeAll(() => {
    if (!isFirebaseConfigured()) {
      console.warn('⚠️ Firebase not configured - skipping streak tests');
    }
  });

  describe('updateStreak', () => {
    it('should update user streak', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      try {
        const streak = await updateStreak(testUserId);
        
        expect(streak).toBeDefined();
        expect(streak.currentStreak).toBeGreaterThanOrEqual(0);
        expect(streak.longestStreak).toBeGreaterThanOrEqual(0);
        expect(streak.lastCheckIn).toBeDefined();
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    }, 15000);
  });

  describe('getStreak', () => {
    it('should retrieve user streak data', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      try {
        // First update streak to ensure data exists
        await updateStreak(testUserId);
        
        const streak = await getStreak(testUserId);
        
        expect(streak).toBeDefined();
        expect(streak.currentStreak).toBeGreaterThanOrEqual(0);
        expect(streak.totalCheckIns).toBeGreaterThanOrEqual(0);
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    }, 15000);
  });

  describe('resetStreak', () => {
    it('should reset user streak', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      try {
        // First create a streak
        await updateStreak(testUserId);
        
        // Then reset it
        await resetStreak(testUserId);
        
        // Verify streak is reset
        const streak = await getStreak(testUserId);
        expect(streak.currentStreak).toBe(0);
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    }, 15000);
  });
});


