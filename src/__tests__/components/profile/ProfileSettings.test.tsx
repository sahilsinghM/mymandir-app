import React from 'react';
import { render, fireEvent } from '../../utils/testUtils';
import { ProfileSettings } from '../../../components/profile/ProfileSettings';

// Mock auth context
const mockUpdateUserProfile = jest.fn();
const mockSignOut = jest.fn();

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
    updateUserProfile: mockUpdateUserProfile,
    signOut: mockSignOut,
    loading: false,
  }),
}));

describe('ProfileSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<ProfileSettings />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should display user profile information', () => {
    const { getByText } = render(<ProfileSettings />);
    expect(getByText(/krishna/i)).toBeTruthy();
    expect(getByText(/english/i)).toBeTruthy();
    expect(getByText(/5/i)).toBeTruthy();
    expect(getByText(/100/i)).toBeTruthy();
  });

  it('should have sign out button', () => {
    const { getByText } = render(<ProfileSettings />);
    expect(getByText(/sign out/i)).toBeTruthy();
  });

  it('should call signOut when sign out button is pressed', () => {
    const { getByText } = render(<ProfileSettings />);
    const signOutButton = getByText(/sign out/i);
    fireEvent.press(signOutButton);
    expect(mockSignOut).toHaveBeenCalled();
  });
});
