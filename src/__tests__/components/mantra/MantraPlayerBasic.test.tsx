import React from 'react';
import { render } from '../../utils/testUtils';

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

describe('MantraPlayer Basic Tests', () => {
  it('should render MantraPlayer', () => {
    const MantraPlayer = require('../../../components/mantra/MantraPlayer').MantraPlayer;
    const { UNSAFE_root } = render(<MantraPlayer />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
