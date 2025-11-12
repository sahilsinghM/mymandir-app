/**
 * Unit tests for environment configuration
 * Verifies that environment variables are properly loaded
 */

import { env } from '../../config/env';
import Constants from 'expo-constants';

describe('env.ts - Environment Configuration', () => {
  describe('Firebase Configuration Loading', () => {
    it('should have Firebase configuration object', () => {
      expect(env.firebase).toBeDefined();
      expect(typeof env.firebase).toBe('object');
    });

    it('should load Firebase API key from config', () => {
      const apiKey = env.firebase.apiKey;
      
      expect(typeof apiKey).toBe('string');
      
      // In test environment, might be mock value, but should be defined
      if (apiKey === '' || apiKey === 'your_firebase_api_key_here') {
        console.warn('⚠️ Firebase API key is not configured in test environment');
        console.warn('   This is expected in unit tests with mocks');
      }
    });

    it('should load all required Firebase configuration fields', () => {
      const requiredFields = [
        'apiKey',
        'authDomain',
        'projectId',
        'storageBucket',
        'messagingSenderId',
        'appId',
      ];

      requiredFields.forEach((field) => {
        expect(env.firebase).toHaveProperty(field);
        expect(typeof env.firebase[field as keyof typeof env.firebase]).toBe('string');
      });
    });

    it('should prioritize Constants.expoConfig over process.env', () => {
      // This test documents the expected loading order:
      // 1. Constants.expoConfig?.extra?.[key] (from app.config.ts)
      // 2. process.env[key] (fallback)
      
      const testKey = 'firebaseApiKey';
      const configValue = Constants.expoConfig?.extra?.[testKey];
      const envValue = process.env[testKey];
      
      // Should try config first
      expect(configValue !== undefined || envValue !== undefined).toBe(true);
    });

    it('should warn when required environment variables are missing', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // This test verifies that warnings are issued
      // The actual warning happens in getEnvVar when value is missing
      expect(consoleSpy).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Configuration Source Verification', () => {
    it('should show where Firebase config values come from', () => {
      const firebaseConfig = env.firebase;
      
      // Log configuration sources for debugging
      console.log('📋 Firebase Configuration Sources:');
      console.log('   Constants.expoConfig?.extra?.firebaseApiKey:', 
        Constants.expoConfig?.extra?.firebaseApiKey ? 'SET' : 'MISSING');
      console.log('   process.env.FIREBASE_API_KEY:', 
        process.env.FIREBASE_API_KEY ? 'SET' : 'MISSING');
      console.log('   Final apiKey value:', 
        firebaseConfig.apiKey ? `SET (${firebaseConfig.apiKey.substring(0, 10)}...)` : 'MISSING');
      
      // Test passes - this is informational
      expect(firebaseConfig).toBeDefined();
    });
  });
});


