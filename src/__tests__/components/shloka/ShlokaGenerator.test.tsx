import React from 'react';
import { render, fireEvent } from '../../utils/testUtils';
import { ShlokaGenerator } from '../../../components/shloka/ShlokaGenerator';

// Mock OpenAI service
jest.mock('../../../services/openaiService', () => ({
  OpenAIService: {
    generateShloka: jest.fn(() => Promise.resolve({
      sanskrit: 'Test Sanskrit shloka',
      translation: 'Test English translation',
      meaning: 'Test spiritual meaning'
    })),
  },
}));

describe('ShlokaGenerator', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<ShlokaGenerator />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should have emotion input', () => {
    const { getByPlaceholderText } = render(<ShlokaGenerator />);
    expect(getByPlaceholderText(/enter your emotion/i)).toBeTruthy();
  });

  it('should have generate button', () => {
    const { getByText } = render(<ShlokaGenerator />);
    expect(getByText(/generate shloka/i)).toBeTruthy();
  });

  it('should show generated shloka when generate is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(<ShlokaGenerator />);
    const emotionInput = getByPlaceholderText(/enter your emotion/i);
    const generateButton = getByText(/generate shloka/i);
    
    fireEvent.changeText(emotionInput, 'peace');
    fireEvent.press(generateButton);
    
    // Wait for async content to load
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(getByText(/test sanskrit shloka/i)).toBeTruthy();
  });
});
