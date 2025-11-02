/**
 * Mantra Service
 * Provides mantra data and favorites management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mantra } from '../types';

const FAVORITES_STORAGE_KEY = '@mymandir:favorites';
const MANTRA_STORAGE_KEY = '@mymandir:mantras';

/**
 * Sample mantras data (can be replaced with API or Firebase)
 */
const sampleMantras: Mantra[] = [
  {
    id: 'om-namah-shivaya',
    title: 'Om Namah Shivaya',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder - replace with actual URLs
    duration: 600,
    isFavorite: false,
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 720,
    isFavorite: false,
  },
  {
    id: 'hare-krishna',
    title: 'Hare Krishna Maha Mantra',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 900,
    isFavorite: false,
  },
  {
    id: 'om-mani-padme-hum',
    title: 'Om Mani Padme Hum',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 480,
    isFavorite: false,
  },
  {
    id: 'mahamrityunjaya',
    title: 'Mahamrityunjaya Mantra',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 540,
    isFavorite: false,
  },
];

/**
 * Get all mantras
 */
export const getAllMantras = async (): Promise<Mantra[]> => {
  try {
    // Try to load from storage first
    const stored = await AsyncStorage.getItem(MANTRA_STORAGE_KEY);
    if (stored) {
      const mantras = JSON.parse(stored);
      const favorites = await getFavorites();
      
      // Update favorite status
      return mantras.map((mantra: Mantra) => ({
        ...mantra,
        isFavorite: favorites.includes(mantra.id),
      }));
    }
    
    // Return sample mantras
    const favorites = await getFavorites();
    return sampleMantras.map((mantra) => ({
      ...mantra,
      isFavorite: favorites.includes(mantra.id),
    }));
  } catch (error) {
    console.error('Error getting mantras:', error);
    return sampleMantras;
  }
};

/**
 * Get favorite mantras
 */
export const getFavoriteMantras = async (): Promise<Mantra[]> => {
  try {
    const allMantras = await getAllMantras();
    return allMantras.filter((mantra) => mantra.isFavorite);
  } catch (error) {
    console.error('Error getting favorite mantras:', error);
    return [];
  }
};

/**
 * Get favorites list
 */
export const getFavorites = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Add to favorites
 */
export const addToFavorites = async (mantraId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(mantraId)) {
      favorites.push(mantraId);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

/**
 * Remove from favorites
 */
export const removeFromFavorites = async (mantraId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(mantraId);
    if (index > -1) {
      favorites.splice(index, 1);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (mantraId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(mantraId);
    
    if (isFavorite) {
      await removeFromFavorites(mantraId);
      return false;
    } else {
      await addToFavorites(mantraId);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

/**
 * Get mantra by ID
 */
export const getMantraById = async (id: string): Promise<Mantra | null> => {
  try {
    const mantras = await getAllMantras();
    return mantras.find((mantra) => mantra.id === id) || null;
  } catch (error) {
    console.error('Error getting mantra by ID:', error);
    return null;
  }
};

