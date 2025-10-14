import React from 'react';
import { render, fireEvent, waitFor } from '../../utils/testUtils';
import { DailyShlokaCard } from '../../../components/home/DailyShlokaCard';

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

describe('DailyShlokaCard', () => {
  it('should render without crashing', () => {
    const { UNSAFE_root } = render(<DailyShlokaCard />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should display verse content', async () => {
    const { getByText } = render(<DailyShlokaCard />);
    
    await waitFor(() => {
      expect(getByText(/test sanskrit verse/i)).toBeTruthy();
    });
  });

  it('should have share button', async () => {
    const { getByText } = render(<DailyShlokaCard />);
    
    await waitFor(() => {
      expect(getByText(/share/i)).toBeTruthy();
    });
  });

  it('should have save button', async () => {
    const { getByText } = render(<DailyShlokaCard />);
    
    await waitFor(() => {
      expect(getByText(/save/i)).toBeTruthy();
    });
  });
});
