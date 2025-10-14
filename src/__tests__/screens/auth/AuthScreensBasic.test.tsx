import React from 'react';
import { render } from '../../utils/testUtils';

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

describe('Auth Screens Basic Tests', () => {
  it('should render WelcomeScreen', () => {
    const WelcomeScreen = require('../../../screens/auth/WelcomeScreen').WelcomeScreen;
    const { UNSAFE_root } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render LoginScreen', () => {
    const LoginScreen = require('../../../screens/auth/LoginScreen').LoginScreen;
    const { UNSAFE_root } = render(<LoginScreen navigation={mockNavigation} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render OnboardingScreen', () => {
    const OnboardingScreen = require('../../../screens/auth/OnboardingScreen').OnboardingScreen;
    const { UNSAFE_root } = render(<OnboardingScreen navigation={mockNavigation} />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
