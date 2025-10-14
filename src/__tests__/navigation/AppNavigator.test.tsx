import React from 'react';
import { render } from '../utils/testUtils';
import { AppNavigator } from '../../navigation/AppNavigator';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock auth context
const mockUser = { uid: 'test-uid' };
const mockUserProfile = {
  uid: 'test-uid',
  deityPreference: 'Krishna',
  language: 'english',
  streakCount: 5,
  karmaPoints: 100,
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    userProfile: mockUserProfile,
    loading: false,
  }),
}));

describe('AppNavigator', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<AppNavigator />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should have navigation structure', () => {
    expect(mockNavigation.navigate).toBeDefined();
  });
});
