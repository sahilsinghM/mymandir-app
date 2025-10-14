import React from 'react';
import { render } from '../../utils/testUtils';
import { ProfileScreen } from '../../../screens/Profile/ProfileScreen';

// Mock auth context
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', email: 'test@example.com' },
    userProfile: {
      uid: 'test-uid',
      deityPreference: 'Krishna',
      language: 'english',
      streakCount: 5,
      karmaPoints: 100,
    },
    updateUserProfile: jest.fn(),
    signOut: jest.fn(),
    loading: false,
  }),
}));

describe('ProfileScreen Basic Tests', () => {
  it('should render ProfileScreen', () => {
    const { UNSAFE_root } = render(<ProfileScreen />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
