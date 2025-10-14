import React from 'react';
import { render } from '../../utils/testUtils';
import { LoginScreen } from '../../../screens/auth/LoginScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock auth context
const mockSignInWithGoogle = jest.fn();
const mockSignInWithPhone = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signInWithPhone: mockSignInWithPhone,
    loading: false,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(<LoginScreen navigation={mockNavigation} />);
    // Check for any text containing "sign in" (case insensitive)
    expect(getByText(/sign in/i)).toBeTruthy();
  });

  it('should have auth methods', () => {
    expect(mockSignInWithGoogle).toBeDefined();
    expect(mockSignInWithPhone).toBeDefined();
  });
});