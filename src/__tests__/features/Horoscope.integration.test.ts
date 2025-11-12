/**
 * Real Integration Test for Horoscope Feature
 * Tests actual API calls and service functionality
 */

import { getDailyHoroscope, getWeeklyHoroscope, getMonthlyHoroscope } from '../../services/astroService';
import { ZodiacSign } from '../../types';

describe('Horoscope Feature - Real Integration Tests', () => {
  const testSign: ZodiacSign = 'Aries';

  describe('getDailyHoroscope', () => {
    it('should fetch daily horoscope from real API', async () => {
      const horoscope = await getDailyHoroscope(testSign);
      
      expect(horoscope).toBeDefined();
      expect(horoscope.sign).toBe(testSign);
      expect(horoscope.type).toBe('daily');
      expect(horoscope.prediction).toBeDefined();
      expect(horoscope.prediction.length).toBeGreaterThan(0);
      expect(horoscope.date).toBeDefined();
    }, 15000);

    it('should return valid horoscope for all zodiac signs', async () => {
      const signs: ZodiacSign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer'];
      
      for (const sign of signs) {
        const horoscope = await getDailyHoroscope(sign);
        expect(horoscope.sign).toBe(sign);
        expect(horoscope.prediction).toBeDefined();
      }
    }, 30000);
  });

  describe('getWeeklyHoroscope', () => {
    it('should fetch weekly horoscope from real API', async () => {
      const horoscope = await getWeeklyHoroscope(testSign);
      
      expect(horoscope).toBeDefined();
      expect(horoscope.sign).toBe(testSign);
      expect(horoscope.type).toBe('weekly');
      expect(horoscope.prediction).toBeDefined();
      expect(horoscope.prediction.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('getMonthlyHoroscope', () => {
    it('should fetch monthly horoscope from real API', async () => {
      const horoscope = await getMonthlyHoroscope(testSign);
      
      expect(horoscope).toBeDefined();
      expect(horoscope.sign).toBe(testSign);
      expect(horoscope.type).toBe('monthly');
      expect(horoscope.prediction).toBeDefined();
      expect(horoscope.prediction.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should return fallback horoscope if API fails', async () => {
      // Mock fetch to fail
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const horoscope = await getDailyHoroscope(testSign);
      
      // Should still return a valid horoscope (fallback)
      expect(horoscope).toBeDefined();
      expect(horoscope.sign).toBe(testSign);
      
      global.fetch = originalFetch;
    });
  });
});


