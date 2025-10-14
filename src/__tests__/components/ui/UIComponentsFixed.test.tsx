import React from 'react';
import { render } from '../../utils/testUtils';
import { ThemedText, ThemedButton, ThemedCard, ThemedInput } from '../../../components/ui';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
}));

describe('UI Components', () => {
  describe('ThemedText', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ThemedText>Test Text</ThemedText>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { UNSAFE_root } = render(<ThemedText variant="h1">Heading</ThemedText>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with different colors', () => {
      const { UNSAFE_root } = render(<ThemedText color="primary">Colored Text</ThemedText>);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('ThemedButton', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ThemedButton>Test Button</ThemedButton>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { UNSAFE_root } = render(<ThemedButton variant="secondary">Secondary Button</ThemedButton>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with icon', () => {
      const { UNSAFE_root } = render(<ThemedButton icon="heart">Button with Icon</ThemedButton>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render loading state', () => {
      const { UNSAFE_root } = render(<ThemedButton loading>Loading Button</ThemedButton>);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('ThemedCard', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ThemedCard>Test Card</ThemedCard>);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with different variants', () => {
      const { UNSAFE_root } = render(<ThemedCard variant="elevated">Elevated Card</ThemedCard>);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('ThemedInput', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ThemedInput placeholder="Test Input" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with label', () => {
      const { UNSAFE_root } = render(<ThemedInput label="Test Label" placeholder="Test Input" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with error', () => {
      const { UNSAFE_root } = render(<ThemedInput error="Test Error" placeholder="Test Input" />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
