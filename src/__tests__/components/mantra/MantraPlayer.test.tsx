import React from 'react';
import { render, fireEvent } from '../../utils/testUtils';
import { MantraPlayer } from '../../../components/mantra/MantraPlayer';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn(() => ({
      loadAsync: jest.fn(() => Promise.resolve()),
      playAsync: jest.fn(() => Promise.resolve()),
      pauseAsync: jest.fn(() => Promise.resolve()),
      stopAsync: jest.fn(() => Promise.resolve()),
      setPositionAsync: jest.fn(() => Promise.resolve()),
      setVolumeAsync: jest.fn(() => Promise.resolve()),
      setIsLoopingAsync: jest.fn(() => Promise.resolve()),
      unloadAsync: jest.fn(() => Promise.resolve()),
    })),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

describe('MantraPlayer', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<MantraPlayer />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should have play button', () => {
    const { getByText } = render(<MantraPlayer />);
    expect(getByText(/play/i)).toBeTruthy();
  });

  it('should have mantra list', () => {
    const { getByText } = render(<MantraPlayer />);
    expect(getByText(/om namah shivaya/i)).toBeTruthy();
  });

  it('should toggle play/pause when play button is pressed', () => {
    const { getByText } = render(<MantraPlayer />);
    const playButton = getByText(/play/i);
    fireEvent.press(playButton);
    expect(getByText(/pause/i)).toBeTruthy();
  });
});
