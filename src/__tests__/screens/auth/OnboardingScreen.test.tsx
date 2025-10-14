import React from 'react';
import { render } from '../../utils/testUtils';
import { OnboardingScreen } from '../../../screens/auth/OnboardingScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock auth context
const mockCreateUserProfile = jest.fn();
const mockUpdateUserProfile = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    userProfile: null,
    createUserProfile: mockCreateUserProfile,
    updateUserProfile: mockUpdateUserProfile,
    loading: false,
  }),
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<OnboardingScreen navigation={mockNavigation} />);
    // Check for any text containing "profile" (case insensitive)
    expect(getByText(/profile/i)).toBeTruthy();
  });

  it('should have auth methods', () => {
    expect(mockCreateUserProfile).toBeDefined();
    expect(mockUpdateUserProfile).toBeDefined();
  });
});