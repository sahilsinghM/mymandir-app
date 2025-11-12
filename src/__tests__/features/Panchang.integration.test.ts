/**
 * Real Integration Test for Panchang Feature
 * Tests actual Panchang service functionality
 */

import { getPanchang } from '../../services/panchangService';

describe('Panchang Feature - Real Integration Tests', () => {
  const testDate = new Date();

  describe('getPanchang', () => {
    it('should fetch panchang data for today', async () => {
      const panchang = await getPanchang(testDate);
      
      expect(panchang).toBeDefined();
      expect(panchang.date).toBeDefined();
      expect(panchang.tithi).toBeDefined();
      expect(panchang.nakshatra).toBeDefined();
      expect(panchang.yoga).toBeDefined();
      expect(panchang.karana).toBeDefined();
      expect(panchang.sunrise).toBeDefined();
      expect(panchang.sunset).toBeDefined();
    }, 15000);

    it('should include auspicious timings', async () => {
      const panchang = await getPanchang(testDate);
      
      expect(panchang.auspiciousTimings).toBeDefined();
      expect(Array.isArray(panchang.auspiciousTimings)).toBe(true);
      
      if (panchang.auspiciousTimings.length > 0) {
        const timing = panchang.auspiciousTimings[0];
        expect(timing.name).toBeDefined();
        expect(timing.start).toBeDefined();
        expect(timing.end).toBeDefined();
      }
    }, 15000);

    it('should handle different dates', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const panchang = await getPanchang(tomorrow);
      
      expect(panchang).toBeDefined();
      expect(panchang.date).toBeDefined();
    }, 15000);
  });
});


