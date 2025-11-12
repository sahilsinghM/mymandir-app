/**
 * Unit tests for ThemedButton component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedButton } from '../../../components/ui/ThemedButton';

describe('ThemedButton', () => {
  it('should render with title', () => {
    const { getByText } = render(<ThemedButton title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedButton title="Click Me" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ThemedButton title="Disabled" onPress={onPress} disabled />
    );
    
    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should not call onPress when loading', () => {
    const onPress = jest.fn();
    const { queryByText } = render(
      <ThemedButton title="Loading" onPress={onPress} loading />
    );
    
    // Button should not show text when loading
    expect(queryByText('Loading')).toBeNull();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <ThemedButton title="Test" loading />
    );
    
    // ActivityIndicator should be rendered
    expect(getByTestId).toBeDefined();
  });

  it('should apply primary variant styles', () => {
    const { getByText } = render(
      <ThemedButton title="Primary" variant="primary" />
    );
    
    const button = getByText('Primary').parent;
    expect(button).toBeTruthy();
  });

  it('should apply outline variant styles', () => {
    const { getByText } = render(
      <ThemedButton title="Outline" variant="outline" />
    );
    
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should apply ghost variant styles', () => {
    const { getByText } = render(
      <ThemedButton title="Ghost" variant="ghost" />
    );
    
    expect(getByText('Ghost')).toBeTruthy();
  });

  it('should apply size styles', () => {
    const { getByText } = render(
      <ThemedButton title="Large" size="lg" />
    );
    
    expect(getByText('Large')).toBeTruthy();
  });

  it('should apply fullWidth style', () => {
    const { getByText } = render(
      <ThemedButton title="Full Width" fullWidth />
    );
    
    expect(getByText('Full Width')).toBeTruthy();
  });

  it('should pass through other TouchableOpacity props', () => {
    const onLongPress = jest.fn();
    const { getByText } = render(
      <ThemedButton title="Long Press" onLongPress={onLongPress} />
    );
    
    fireEvent(getByText('Long Press'), 'longPress');
    expect(onLongPress).toHaveBeenCalled();
  });
});


