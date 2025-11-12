/**
 * Real Integration Tests for AuthContext
 * NO MOCKS - Uses actual Firebase authentication
 * 
 * TDD: This test defines what signUp SHOULD do
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

describe('AuthContext - Real Integration Tests', () => {
  // Test user credentials - use unique email for each test run
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testPassword123';

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('signUp - Real Firebase Integration', () => {
    it('should create a real user in Firebase', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 10000 });

      await act(async () => {
        try {
          await result.current.signUp(testEmail, testPassword);
          
          // Verify user was created
          expect(result.current.user).toBeDefined();
          expect(result.current.user?.email).toBe(testEmail);
          expect(result.current.error).toBeNull();
        } catch (error: any) {
          // If Firebase is not configured, that's expected
          if (error.message.includes('Firebase is not configured')) {
            console.warn('⚠️ Firebase not configured - add credentials to .env');
            return;
          }
          throw error;
        }
      });
    });

    it('should handle sign-up errors when email already exists', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 10000 });

      // First sign up
      await act(async () => {
        try {
          await result.current.signUp(testEmail, testPassword);
        } catch (error: any) {
          if (error.message.includes('Firebase is not configured')) {
            console.warn('⚠️ Firebase not configured - skipping test');
            return;
          }
        }
      });

      // Try to sign up again with same email - should fail
      await act(async () => {
        try {
          await result.current.signUp(testEmail, testPassword);
          // Should not reach here
          expect(true).toBe(false);
        } catch (error: any) {
          expect(error.message).toContain('email-already-in-use');
        }
      });
    });

    it('should sign in with created credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 10000 });

      await act(async () => {
        try {
          await result.current.signIn(testEmail, testPassword);
          
          expect(result.current.user).toBeDefined();
          expect(result.current.user?.email).toBe(testEmail);
        } catch (error: any) {
          if (error.message.includes('Firebase is not configured')) {
            console.warn('⚠️ Firebase not configured - skipping test');
            return;
          }
          if (error.message.includes('user-not-found')) {
            // User doesn't exist yet - sign up first
            await result.current.signUp(testEmail, testPassword);
            await result.current.signIn(testEmail, testPassword);
            expect(result.current.user?.email).toBe(testEmail);
            return;
          }
          throw error;
        }
      });
    });
  });
});


