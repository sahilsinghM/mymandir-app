import React from 'react';
import { render } from '../../utils/testUtils';
import { WelcomeScreen } from '../../../screens/auth/WelcomeScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('WelcomeScreen', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(<WelcomeScreen navigation={mockNavigation} />);
    expect(getByTestId('deity-image')).toBeTruthy();
  });

  it('should render welcome content', () => {
    const { getByText } = render(<WelcomeScreen navigation={mockNavigation} />);
    // Check for any text containing "Welcome" (case insensitive)
    expect(getByText(/welcome/i)).toBeTruthy();
  });
});