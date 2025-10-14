import React from 'react';
import { render } from '../../utils/testUtils';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('Auth Screens', () => {
  it('should import WelcomeScreen without errors', () => {
    const WelcomeScreen = require('../../../screens/auth/WelcomeScreen').WelcomeScreen;
    expect(WelcomeScreen).toBeDefined();
  });

  it('should import LoginScreen without errors', () => {
    const LoginScreen = require('../../../screens/auth/LoginScreen').LoginScreen;
    expect(LoginScreen).toBeDefined();
  });

  it('should import OnboardingScreen without errors', () => {
    const OnboardingScreen = require('../../../screens/auth/OnboardingScreen').OnboardingScreen;
    expect(OnboardingScreen).toBeDefined();
  });
});
