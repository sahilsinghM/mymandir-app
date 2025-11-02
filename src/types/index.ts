/**
 * TypeScript type definitions for MyMandir app
 */

// User types
export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Auth types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Streak types
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastCheckIn: Date | null;
  karmaPoints: number;
}

// Daily Devotion types
export interface DailyShloka {
  id: string;
  verse: string;
  translation: string;
  meaning: string;
  chapter: number;
  verseNumber: number;
  date: Date;
}

// Mantra types
export interface Mantra {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number;
  isFavorite?: boolean;
}

// Horoscope types
export interface Horoscope {
  sign: ZodiacSign;
  date: string;
  prediction: string;
  type: 'daily' | 'weekly' | 'monthly';
}

export type ZodiacSign = 
  | 'Aries' 
  | 'Taurus' 
  | 'Gemini' 
  | 'Cancer' 
  | 'Leo' 
  | 'Virgo' 
  | 'Libra' 
  | 'Scorpio' 
  | 'Sagittarius' 
  | 'Capricorn' 
  | 'Aquarius' 
  | 'Pisces';

// Panchang types
export interface Panchang {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  auspiciousTimings: AuspiciousTiming[];
}

export interface AuspiciousTiming {
  name: string;
  start: string;
  end: string;
}

// AI Jyotish types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// YouTube/Temple Feed types
export interface DevotionalContent {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoId: string;
  category: 'mantra' | 'bhajan' | 'kirtan' | 'lecture' | 'meditation' | 'prayer';
  channelTitle: string;
  duration?: string;
}

// Shloka Generator types
export interface ShlokaRequest {
  emotion: string;
  situation?: string;
  language?: 'english' | 'hindi' | 'sanskrit';
}

export interface GeneratedShloka {
  verse: string;
  translation: string;
  meaning: string;
  source?: string;
}

// Notification types
export interface NotificationConfig {
  dailyDevotion: boolean;
  streakReminder: boolean;
  mantraReminder: boolean;
  horoscopeUpdate: boolean;
}

