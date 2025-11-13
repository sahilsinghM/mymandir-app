/**
 * Unit tests for astroService
 */

import { getDailyHoroscope, getWeeklyHoroscope, getMonthlyHoroscope } from '../../services/astroService';
import { ZodiacSign } from '../../types';

const testSign: ZodiacSign = 'Aries';

// Mock fetch
global.fetch = jest.fn();

describe('astroService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDailyHoroscope', () => {
    it('should fetch daily horoscope data successfully', async () => {
      const mockData = {
        date_range: 'Jan 1 - Jan 31',
        current_date: 'January 1, 2024',
        description: 'Test horoscope',
        compatibility: 'Leo',
        lucky_number: '7',
        lucky_time: '10:00 AM',
        color: 'Gold',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getDailyHoroscope(testSign);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('aztro.sameerkumar.website'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toBeDefined();
      expect(result.sign).toBe(testSign);
      expect(result.prediction).toBe('Test horoscope');
    });

    it('should handle API errors and return fallback', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Should fallback to mock data
      const result = await getDailyHoroscope(testSign);
      expect(result).toBeDefined();
      expect(result.sign).toBe(testSign);
    });

    it('should handle network errors and return fallback', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Should fallback to mock data
      const result = await getDailyHoroscope(testSign);
      expect(result).toBeDefined();
      expect(result.sign).toBe(testSign);
    });
  });

  describe('getWeeklyHoroscope', () => {
    it('should get weekly horoscope', async () => {
      const mockData = {
        date_range: 'This week',
        description: 'This week\'s horoscope',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getWeeklyHoroscope(testSign);

      expect(result).toBeDefined();
      expect(result.sign).toBe(testSign);
    });
  });

  describe('getMonthlyHoroscope', () => {
    it('should get monthly horoscope', async () => {
      const mockData = {
        date_range: 'This month',
        description: 'This month\'s horoscope',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getMonthlyHoroscope(testSign);

      expect(result).toBeDefined();
      expect(result.sign).toBe(testSign);
    });
  });
});
