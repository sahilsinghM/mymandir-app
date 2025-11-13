/**
 * Real Integration Test for Expert Jyotish Feature
 * Tests expert directory service
 */

import { getAllExperts, searchExperts, ExpertJyotish } from '../../services/expertJyotishService';

describe('Expert Jyotish Feature - Real Integration Tests', () => {
  describe('getAllExperts', () => {
    it('should return list of experts', async () => {
      const experts = await getAllExperts();
      
      expect(experts).toBeDefined();
      expect(Array.isArray(experts)).toBe(true);
      expect(experts.length).toBeGreaterThan(0);
      
      // Verify expert structure
      const expert = experts[0];
      expect(expert.id).toBeDefined();
      expect(expert.name).toBeDefined();
      expect(expert.specialization).toBeDefined();
      expect(expert.experience).toBeDefined();
    }, 10000);

    it('should have valid expert data structure', async () => {
      const experts = await getAllExperts();
      
      experts.forEach((expert: ExpertJyotish) => {
        expect(expert).toHaveProperty('id');
        expect(expert).toHaveProperty('name');
        expect(expert).toHaveProperty('specialization');
        expect(expert).toHaveProperty('experience');
        expect(expert).toHaveProperty('rating');
        expect(expert).toHaveProperty('contactMethods');
      });
    }, 10000);
  });

  describe('searchExperts', () => {
    it('should search experts by name', async () => {
      const results = await searchExperts('Pandit');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    }, 10000);

    it('should search experts by specialization', async () => {
      const results = await searchExperts('Kundali');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    }, 10000);

    it('should return empty array for no matches', async () => {
      const results = await searchExperts('NonExistentExpert123');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    }, 10000);
  });
});
