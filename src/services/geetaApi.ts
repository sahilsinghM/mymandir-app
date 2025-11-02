/**
 * Bhagavad Gita API Service
 * Fetches verses from the Bhagavad Gita
 */

import { DailyShloka } from '../types';

const GITA_API_BASE = 'https://bhagavad-gita-api.vercel.app';

export interface GitaVerse {
  chapter_number: number;
  verse_number: number;
  text: string;
  transliteration: string;
  word_meanings: string;
  translation: string;
  commentary: string;
}

/**
 * Get a random verse from Bhagavad Gita
 */
export const getRandomVerse = async (): Promise<DailyShloka> => {
  try {
    // Get random chapter (1-18)
    const chapter = Math.floor(Math.random() * 18) + 1;
    
    // First, get chapter info to know how many verses it has
    const chapterResponse = await fetch(`${GITA_API_BASE}/chapters/${chapter}`);
    if (!chapterResponse.ok) {
      throw new Error('Failed to fetch chapter info');
    }
    const chapterData = await chapterResponse.json();
    const verseCount = chapterData.verses_count;
    
    // Get random verse from that chapter
    const verseNumber = Math.floor(Math.random() * verseCount) + 1;
    
    // Fetch the specific verse
    const verseResponse = await fetch(
      `${GITA_API_BASE}/chapters/${chapter}/verses/${verseNumber}`
    );
    
    if (!verseResponse.ok) {
      throw new Error('Failed to fetch verse');
    }
    
    const verseData: GitaVerse = await verseResponse.json();
    
    return {
      id: `${chapter}-${verseNumber}`,
      verse: verseData.text,
      translation: verseData.translation,
      meaning: verseData.commentary || verseData.word_meanings,
      chapter: verseData.chapter_number,
      verseNumber: verseData.verse_number,
      date: new Date(),
    };
  } catch (error) {
    console.error('Error fetching random verse:', error);
    // Return a fallback verse
    return getFallbackVerse();
  }
};

/**
 * Get a specific verse by chapter and verse number
 */
export const getVerse = async (
  chapter: number,
  verse: number
): Promise<DailyShloka> => {
  try {
    const response = await fetch(
      `${GITA_API_BASE}/chapters/${chapter}/verses/${verse}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }
    
    const verseData: GitaVerse = await response.json();
    
    return {
      id: `${chapter}-${verse}`,
      verse: verseData.text,
      translation: verseData.translation,
      meaning: verseData.commentary || verseData.word_meanings,
      chapter: verseData.chapter_number,
      verseNumber: verseData.verse_number,
      date: new Date(),
    };
  } catch (error) {
    console.error('Error fetching verse:', error);
    return getFallbackVerse();
  }
};

/**
 * Fallback verse when API fails
 */
const getFallbackVerse = (): DailyShloka => {
  return {
    id: 'fallback-1',
    verse: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥',
    translation: 'Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.',
    meaning: 'Be steady in yoga, perform your duties, and abandon all attachment to success or failure. This evenness of mind is called yoga.',
    chapter: 2,
    verseNumber: 48,
    date: new Date(),
  };
};

/**
 * Get chapter information
 */
export const getChapter = async (chapterNumber: number) => {
  try {
    const response = await fetch(`${GITA_API_BASE}/chapters/${chapterNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chapter');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return null;
  }
};

