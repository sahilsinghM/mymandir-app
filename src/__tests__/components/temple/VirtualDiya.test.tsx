import React from 'react';
import { render, fireEvent } from '../../utils/testUtils';
import { VirtualDiya } from '../../../components/temple/VirtualDiya';

describe('VirtualDiya', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<VirtualDiya />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should have light diya button', () => {
    const { getByText } = render(<VirtualDiya />);
    expect(getByText(/light diya/i)).toBeTruthy();
  });

  it('should toggle diya state when pressed', () => {
    const { getByText } = render(<VirtualDiya />);
    const lightButton = getByText(/light diya/i);
    fireEvent.press(lightButton);
    // After lighting, button should change to "Extinguish Diya"
    expect(getByText(/extinguish diya/i)).toBeTruthy();
  });

  it('should show prayer message when diya is lit', () => {
    const { getByText } = render(<VirtualDiya />);
    const lightButton = getByText(/light diya/i);
    fireEvent.press(lightButton);
    expect(getByText(/may this light/i)).toBeTruthy();
  });
});
