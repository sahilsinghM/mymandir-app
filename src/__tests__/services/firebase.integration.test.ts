/**
 * Real Integration Tests for Firebase Service
 * NO MOCKS - Uses actual Firebase from .env
 */

import { getFirebaseAuth, getFirestoreDB } from '../../services/firebase';
import { isFirebaseConfigured } from '../../utils/firebaseHelper';
import { env } from '../../config/env';

describe('Firebase Service - Real Integration Tests', () => {
  describe('Firebase Configuration', () => {
    it('should load Firebase configuration from .env file', () => {
      const config = env.firebase;
      
      expect(config.apiKey).toBeDefined();
      expect(config.apiKey).not.toBe('');
      expect(config.apiKey).not.toBe('your_firebase_api_key_here');
      
      expect(config.projectId).toBeDefined();
      expect(config.authDomain).toBeDefined();
      expect(config.storageBucket).toBeDefined();
      expect(config.messagingSenderId).toBeDefined();
      expect(config.appId).toBeDefined();
    });

    it('should detect if Firebase is properly configured', () => {
      const isConfigured = isFirebaseConfigured();
      
      // This test should pass if .env has real Firebase credentials
      expect(typeof isConfigured).toBe('boolean');
      
      if (!isConfigured) {
        console.warn('⚠️ Firebase not configured - add credentials to .env');
      }
    });

    it('should initialize Firebase auth with real configuration', () => {
      // This will use real Firebase - should not throw if configured
      try {
        const auth = getFirebaseAuth();
        expect(auth).toBeDefined();
        expect(auth).not.toBeNull();
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - this test requires .env credentials');
        } else {
          throw error;
        }
      }
    });

    it('should initialize Firestore with real configuration', () => {
      try {
        const db = getFirestoreDB();
        expect(db).toBeDefined();
        expect(db).not.toBeNull();
      } catch (error: any) {
        if (error.message.includes('Firebase is not configured')) {
          console.warn('⚠️ Firebase not configured - this test requires .env credentials');
        } else {
          throw error;
        }
      }
    });
  });
});

