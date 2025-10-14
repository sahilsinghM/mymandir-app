import React from 'react';
import { render } from '../../utils/testUtils';

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

describe('ProfileSettings Basic Tests', () => {
  it('should render ProfileSettings', () => {
    const ProfileSettings = require('../../../components/profile/ProfileSettings').default;
    const { UNSAFE_root } = render(<ProfileSettings />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
