import React from 'react';
import { render } from '../../utils/testUtils';

// Mock Geeta API
const mockGeetaVerse = {
  verse: 'Test Sanskrit verse',
  translation: 'Test English translation',
  chapter: 2,
  verseNumber: 3,
};

jest.mock('../../../services/geetaApi', () => ({
  GeetaAPI: {
    getRandomVerse: jest.fn(() => Promise.resolve(mockGeetaVerse)),
  },
}));

describe('DailyShlokaCard Basic Tests', () => {
  it('should render DailyShlokaCard', () => {
    const DailyShlokaCard = require('../../../components/home/DailyShlokaCard').DailyShlokaCard;
    const { UNSAFE_root } = render(<DailyShlokaCard />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
