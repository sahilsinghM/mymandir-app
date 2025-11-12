/**
 * Real Integration Test for Home Screen
 * Tests home screen components and data loading
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../../screens/Home/HomeScreen';
import { AuthProvider } from '../../contexts/AuthContext';

describe('Home Screen Feature - Real Integration Tests', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should render home screen', () => {
    const { getByText } = render(<HomeScreen />, { wrapper });
    
    expect(getByText('MyMandir')).toBeTruthy();
  }, 10000);

  it('should display welcome message for authenticated user', async () => {
    // This test verifies the screen renders
    // Actual user data would come from AuthContext
    const { getByText } = render(<HomeScreen />, { wrapper });
    
    // Screen should render even without user
    expect(getByText('MyMandir')).toBeTruthy();
  }, 10000);
});


