/**
 * Real Integration Tests for Firebase Helper Utilities
 * NO MOCKS - Uses actual Firestore
 */

import {
  saveUserProfile,
  getUserProfile,
  isFirebaseConfigured,
} from '../../utils/firebaseHelper';

describe('firebaseHelper - Real Integration Tests', () => {
  const testUserId = `test-user-${Date.now()}`;
  const testUser = {
    id: testUserId,
    email: `test-${Date.now()}@example.com`,
    displayName: 'Test User',
    photoURL: undefined,
    createdAt: new Date(),
    lastLoginAt: undefined,
  };

  beforeAll(() => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      console.warn('⚠️ Firebase not configured - skipping integration tests');
    }
  });

  describe('saveUserProfile', () => {
    it('should save user profile to real Firestore', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      try {
        await saveUserProfile(testUser);
        
        // Verify it was saved by reading it back
        const savedUser = await getUserProfile(testUserId);
        expect(savedUser).toBeDefined();
        expect(savedUser?.id).toBe(testUserId);
        expect(savedUser?.email).toBe(testUser.email);
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    });
  });

  describe('getUserProfile', () => {
    it('should retrieve user profile from real Firestore', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      // First save a user
      try {
        await saveUserProfile(testUser);
        
        // Then retrieve it
        const retrievedUser = await getUserProfile(testUserId);
        
        expect(retrievedUser).toBeDefined();
        expect(retrievedUser?.id).toBe(testUserId);
        expect(retrievedUser?.email).toBe(testUser.email);
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    });

    it('should return null for non-existent user', async () => {
      if (!isFirebaseConfigured()) {
        console.warn('⚠️ Skipping test - Firebase not configured');
        return;
      }

      try {
        const user = await getUserProfile('non-existent-user-id');
        expect(user).toBeNull();
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - add credentials to .env');
          return;
        }
        throw error;
      }
    });
  });

  describe('isFirebaseConfigured', () => {
    it('should correctly detect Firebase configuration status', () => {
      const isConfigured = isFirebaseConfigured();
      
      expect(typeof isConfigured).toBe('boolean');
      
      if (isConfigured) {
        console.log('✅ Firebase is properly configured');
      } else {
        console.warn('⚠️ Firebase is not configured - check .env file');
      }
    });
  });
});


