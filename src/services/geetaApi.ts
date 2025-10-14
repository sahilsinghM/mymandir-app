// Geeta API service for fetching Bhagavad Gita verses
export interface GeetaVerse {
  verse: string;
  translation: string;
  chapter: number;
  verseNumber: number;
  transliteration?: string;
  wordMeanings?: string;
}

export class GeetaAPI {
  private static readonly BASE_URL = 'https://bhagavadgita.io/api/v1';

  /**
   * Fetch a random verse from Bhagavad Gita
   */
  static async getRandomVerse(): Promise<GeetaVerse> {
    try {
      const response = await fetch(`${this.BASE_URL}/random`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching random verse:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific verse by chapter and verse number
   */
  static async getVerse(chapter: number, verseNumber: number): Promise<GeetaVerse> {
    try {
      const response = await fetch(`${this.BASE_URL}/chapter/${chapter}/verse/${verseNumber}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  }

  /**
   * Fetch all verses from a specific chapter
   */
  static async getChapter(chapter: number): Promise<GeetaVerse[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/chapter/${chapter}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.verses || [];
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  }

  /**
   * Search verses by keyword
   */
  static async searchVerses(keyword: string): Promise<GeetaVerse[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching verses:', error);
      throw error;
    }
  }

  /**
   * Get verse with transliteration and word meanings
   */
  static async getVerseWithDetails(chapter: number, verseNumber: number): Promise<GeetaVerse> {
    try {
      const response = await fetch(`${this.BASE_URL}/chapter/${chapter}/verse/${verseNumber}/transliteration`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching verse details:', error);
      throw error;
    }
  }
}
