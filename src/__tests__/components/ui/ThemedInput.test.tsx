/**
 * Unit tests for ThemedInput component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemedInput } from '../../../components/ui/ThemedInput';

describe('ThemedInput', () => {
  it('should render with label', () => {
    const { getByText } = render(<ThemedInput label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('should render with placeholder', () => {
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Enter email" />
    );
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('should update value on text change', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Test" onChangeText={onChangeText} />
    );
    
    const input = getByPlaceholderText('Test');
    fireEvent.changeText(input, 'new text');
    
    expect(onChangeText).toHaveBeenCalledWith('new text');
  });

  it('should show error message', () => {
    const { getByText } = render(
      <ThemedInput label="Email" error="Invalid email" />
    );
    
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('should show helper text', () => {
    const { getByText } = render(
      <ThemedInput label="Password" helperText="Must be 8 characters" />
    );
    
    expect(getByText('Must be 8 characters')).toBeTruthy();
  });

  it('should not show helper text when error is present', () => {
    const { queryByText } = render(
      <ThemedInput
        label="Password"
        helperText="Helper text"
        error="Error message"
      />
    );
    
    expect(queryByText('Helper text')).toBeNull();
    expect(queryByText('Error message')).toBeTruthy();
  });

  it('should call onFocus when focused', () => {
    const onFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Test" onFocus={onFocus} />
    );
    
    fireEvent(getByPlaceholderText('Test'), 'focus');
    expect(onFocus).toHaveBeenCalled();
  });

  it('should call onBlur when blurred', () => {
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Test" onBlur={onBlur} />
    );
    
    fireEvent(getByPlaceholderText('Test'), 'blur');
    expect(onBlur).toHaveBeenCalled();
  });

  it('should render with secureTextEntry', () => {
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Password" secureTextEntry />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should render with left icon', () => {
    const leftIcon = <React.Fragment>Icon</React.Fragment>;
    const { getByPlaceholderText } = render(
      <ThemedInput placeholder="Test" leftIcon={leftIcon} />
    );
    
    expect(getByPlaceholderText('Test')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const rightIcon = <React.Fragment>Icon</React.Fragment>;
    const { getByPlaceholderText } = render(
      <ThemedInput
        placeholder="Test"
        rightIcon={rightIcon}
      />
    );
    
    expect(getByPlaceholderText('Test')).toBeTruthy();
  });
});

