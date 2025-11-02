/**
 * Streak Service
 * Manages user streak tracking, daily check-ins, and karma points
 */

import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestoreDB } from './firebase';
import { StreakData } from '../types';

const STREAK_STORAGE_KEY = '@mymandir:streak';
const STREAK_FIRESTORE_COLLECTION = 'streaks';

/**
 * Check if two dates are on the same day
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Check if a date is yesterday
 */
const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

/**
 * Get streak data from AsyncStorage (for guest mode)
 */
const getStreakFromStorage = async (): Promise<StreakData | null> => {
  try {
    const data = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        lastCheckIn: parsed.lastCheckIn ? new Date(parsed.lastCheckIn) : null,
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading streak from storage:', error);
    return null;
  }
};

/**
 * Save streak data to AsyncStorage (for guest mode)
 */
const saveStreakToStorage = async (streakData: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
  } catch (error) {
    console.error('Error saving streak to storage:', error);
  }
};

/**
 * Get streak data from Firestore (for authenticated users)
 */
const getStreakFromFirestore = async (userId: string): Promise<StreakData | null> => {
  try {
    const db = getFirestoreDB();
    const streakRef = doc(db, STREAK_FIRESTORE_COLLECTION, userId);
    const streakSnap = await getDoc(streakRef);

    if (streakSnap.exists()) {
      const data = streakSnap.data();
      return {
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        totalDays: data.totalDays || 0,
        lastCheckIn: data.lastCheckIn?.toDate() || null,
        karmaPoints: data.karmaPoints || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading streak from Firestore:', error);
    // Fall back to storage if Firestore fails
    return getStreakFromStorage();
  }
};

/**
 * Save streak data to Firestore (for authenticated users)
 */
const saveStreakToFirestore = async (userId: string, streakData: StreakData): Promise<void> => {
  try {
    const db = getFirestoreDB();
    const streakRef = doc(db, STREAK_FIRESTORE_COLLECTION, userId);
    await setDoc(streakRef, {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalDays: streakData.totalDays,
      lastCheckIn: streakData.lastCheckIn ? Timestamp.fromDate(streakData.lastCheckIn) : null,
      karmaPoints: streakData.karmaPoints,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving streak to Firestore:', error);
    // Fall back to storage if Firestore fails
    await saveStreakToStorage(streakData);
  }
};

/**
 * Get user streak data
 */
export const getStreakData = async (userId?: string, isGuest: boolean = false): Promise<StreakData> => {
  let streakData: StreakData | null = null;

  if (isGuest || !userId || userId === 'guest-user') {
    // Guest mode - use AsyncStorage
    streakData = await getStreakFromStorage();
  } else {
    // Authenticated user - try Firestore first
    try {
      streakData = await getStreakFromFirestore(userId);
    } catch (error) {
      // If Firestore fails, fall back to storage
      streakData = await getStreakFromStorage();
    }
  }

  // Return default if no data exists
  if (!streakData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      lastCheckIn: null,
      karmaPoints: 0,
    };
  }

  return streakData;
};

/**
 * Record a daily check-in
 */
export const recordCheckIn = async (
  userId?: string,
  isGuest: boolean = false
): Promise<{ streakData: StreakData; isNewCheckIn: boolean; karmaEarned: number }> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streakData = await getStreakData(userId, isGuest);

  // Check if already checked in today
  if (streakData.lastCheckIn) {
    const lastCheckIn = new Date(streakData.lastCheckIn);
    lastCheckIn.setHours(0, 0, 0, 0);

    if (isSameDay(lastCheckIn, today)) {
      // Already checked in today
      return {
        streakData,
        isNewCheckIn: false,
        karmaEarned: 0,
      };
    }

    // Check if continuing streak or breaking it
    if (isYesterday(lastCheckIn)) {
      // Continuing streak
      streakData.currentStreak += 1;
    } else {
      // Streak broken, start over
      streakData.currentStreak = 1;
    }
  } else {
    // First check-in
    streakData.currentStreak = 1;
  }

  // Update longest streak
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;
  }

  // Update totals
  streakData.totalDays += 1;
  streakData.lastCheckIn = today;

  // Calculate karma points earned
  // Base: 10 points per check-in
  // Bonus: +5 points per day of current streak (capped at 50 bonus)
  const streakBonus = Math.min(streakData.currentStreak * 5, 50);
  const karmaEarned = 10 + streakBonus;
  streakData.karmaPoints += karmaEarned;

  // Save updated streak data
  if (isGuest || !userId || userId === 'guest-user') {
    await saveStreakToStorage(streakData);
  } else {
    try {
      await saveStreakToFirestore(userId, streakData);
    } catch (error) {
      await saveStreakToStorage(streakData);
    }
  }

  return {
    streakData,
    isNewCheckIn: true,
    karmaEarned,
  };
};

/**
 * Add karma points manually (for other activities)
 */
export const addKarmaPoints = async (
  userId: string | undefined,
  points: number,
  isGuest: boolean = false
): Promise<StreakData> => {
  let streakData = await getStreakData(userId, isGuest);
  streakData.karmaPoints += points;

  if (isGuest || !userId || userId === 'guest-user') {
    await saveStreakToStorage(streakData);
  } else {
    try {
      await saveStreakToFirestore(userId, streakData);
    } catch (error) {
      await saveStreakToStorage(streakData);
    }
  }

  return streakData;
};

/**
 * Check if user has checked in today
 */
export const hasCheckedInToday = async (
  userId?: string,
  isGuest: boolean = false
): Promise<boolean> => {
  const streakData = await getStreakData(userId, isGuest);
  
  if (!streakData.lastCheckIn) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCheckIn = new Date(streakData.lastCheckIn);
  lastCheckIn.setHours(0, 0, 0, 0);

  return isSameDay(lastCheckIn, today);
};

