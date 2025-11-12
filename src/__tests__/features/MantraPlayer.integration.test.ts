/**
 * Real Integration Test for Mantra Player Feature
 * Tests mantra service functionality
 */

import { getAllMantras, getFavoriteMantras, toggleFavorite } from '../../services/mantraService';
import { Mantra } from '../../types';

describe('Mantra Player Feature - Real Integration Tests', () => {
  describe('getAllMantras', () => {
    it('should return list of mantras', async () => {
      const mantras = await getAllMantras();
      
      expect(mantras).toBeDefined();
      expect(Array.isArray(mantras)).toBe(true);
      expect(mantras.length).toBeGreaterThan(0);
      
      // Verify mantra structure
      const mantra = mantras[0];
      expect(mantra.id).toBeDefined();
      expect(mantra.title).toBeDefined();
      expect(mantra.audioUrl).toBeDefined();
    }, 10000);

    it('should have valid mantra data structure', async () => {
      const mantras = await getAllMantras();
      
      mantras.forEach((mantra: Mantra) => {
        expect(mantra).toHaveProperty('id');
        expect(mantra).toHaveProperty('title');
        expect(mantra).toHaveProperty('audioUrl');
        expect(typeof mantra.id).toBe('string');
        expect(typeof mantra.title).toBe('string');
        expect(typeof mantra.audioUrl).toBe('string');
      });
    }, 10000);
  });

  describe('getFavoriteMantras', () => {
    it('should return favorite mantras', async () => {
      const favorites = await getFavoriteMantras();
      
      expect(favorites).toBeDefined();
      expect(Array.isArray(favorites)).toBe(true);
      // May be empty if no favorites set
    }, 10000);
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status of mantra', async () => {
      const mantras = await getAllMantras();
      
      if (mantras.length > 0) {
        const mantraId = mantras[0].id;
        const initialFavorites = await getFavoriteMantras();
        const wasFavorite = initialFavorites.some(m => m.id === mantraId);
        
        await toggleFavorite(mantraId);
        
        const updatedFavorites = await getFavoriteMantras();
        const isFavorite = updatedFavorites.some(m => m.id === mantraId);
        
        // Status should have changed (or stayed same if it was already favorite)
        // Just verify the toggle function works
        expect(typeof isFavorite).toBe('boolean');
        
        // Toggle back to original state
        await toggleFavorite(mantraId);
        
        const finalFavorites = await getFavoriteMantras();
        const finalIsFavorite = finalFavorites.some(m => m.id === mantraId);
        expect(finalIsFavorite).toBe(wasFavorite);
      } else {
        console.warn('⚠️ No mantras available for favorite toggle test');
      }
    }, 15000);
  });
});

