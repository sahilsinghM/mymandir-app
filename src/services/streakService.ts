import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivity: Date;
  totalDays: number;
  streakStartDate: Date;
}

export class StreakService {
  private static db = getFirestore();

  /**
   * Calculate streak based on last activity date
   */
  public static calculateStreak(lastActivity: Date): number {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const lastActivityDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    // If last activity was today or yesterday, continue streak
    if (lastActivityDate.getTime() === todayDate.getTime() || 
        lastActivityDate.getTime() === yesterdayDate.getTime()) {
      return 1; // At least 1 day streak
    }

    // If last activity was more than 1 day ago, streak is broken
    return 0;
  }

  /**
   * Get user's streak data
   */
  public static async getStreakData(userId: string): Promise<StreakData | null> {
    try {
      const streakDoc = await getDoc(doc(this.db, 'streaks', userId));
      
      if (streakDoc.exists()) {
        const data = streakDoc.data();
        return {
          currentStreak: data.currentStreak || 0,
          longestStreak: data.longestStreak || 0,
          lastActivity: data.lastActivity?.toDate() || new Date(),
          totalDays: data.totalDays || 0,
          streakStartDate: data.streakStartDate?.toDate() || new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting streak data:', error);
      throw error;
    }
  }

  /**
   * Update user's streak
   */
  public static async updateStreak(userId: string, newStreak: number): Promise<void> {
    try {
      const today = new Date();
      const streakData = {
        currentStreak: newStreak,
        lastActivity: Timestamp.fromDate(today),
        updatedAt: Timestamp.fromDate(today),
      };

      // Get current streak data to update longest streak
      const currentData = await this.getStreakData(userId);
      if (currentData) {
        streakData.longestStreak = Math.max(currentData.longestStreak, newStreak);
        streakData.totalDays = currentData.totalDays + 1;
        
        // If streak is starting fresh, update start date
        if (newStreak === 1 && currentData.currentStreak === 0) {
          streakData.streakStartDate = Timestamp.fromDate(today);
        } else {
          streakData.streakStartDate = currentData.streakStartDate;
        }
      } else {
        // First time user
        streakData.longestStreak = newStreak;
        streakData.totalDays = 1;
        streakData.streakStartDate = Timestamp.fromDate(today);
      }

      await setDoc(doc(this.db, 'streaks', userId), streakData, { merge: true });
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  /**
   * Reset user's streak
   */
  public static async resetStreak(userId: string): Promise<void> {
    try {
      const today = new Date();
      const streakData = {
        currentStreak: 0,
        lastActivity: Timestamp.fromDate(today),
        updatedAt: Timestamp.fromDate(today),
      };

      await setDoc(doc(this.db, 'streaks', userId), streakData, { merge: true });
    } catch (error) {
      console.error('Error resetting streak:', error);
      throw error;
    }
  }

  /**
   * Check and update streak based on user activity
   */
  public static async checkAndUpdateStreak(userId: string): Promise<number> {
    try {
      const streakData = await this.getStreakData(userId);
      
      if (!streakData) {
        // First time user, start with 1 day streak
        await this.updateStreak(userId, 1);
        return 1;
      }

      const calculatedStreak = this.calculateStreak(streakData.lastActivity);
      
      if (calculatedStreak === 0) {
        // Streak is broken, reset to 0
        await this.resetStreak(userId);
        return 0;
      } else {
        // Continue streak
        const newStreak = streakData.currentStreak + 1;
        await this.updateStreak(userId, newStreak);
        return newStreak;
      }
    } catch (error) {
      console.error('Error checking and updating streak:', error);
      throw error;
    }
  }

  /**
   * Get streak achievements
   */
  public static getStreakAchievements(currentStreak: number): string[] {
    const achievements: string[] = [];

    if (currentStreak >= 1) achievements.push('🌅 First Day');
    if (currentStreak >= 3) achievements.push('🔥 Three Day Streak');
    if (currentStreak >= 7) achievements.push('⭐ Week Warrior');
    if (currentStreak >= 15) achievements.push('🏆 Half Month Hero');
    if (currentStreak >= 30) achievements.push('👑 Month Master');
    if (currentStreak >= 60) achievements.push('💎 Diamond Devotee');
    if (currentStreak >= 100) achievements.push('🌟 Century Sage');
    if (currentStreak >= 365) achievements.push('🎯 Year Yogi');

    return achievements;
  }

  /**
   * Calculate karma points based on streak
   */
  public static calculateKarmaPoints(streak: number): number {
    // Base points for each day
    let points = streak * 10;
    
    // Bonus points for milestones
    if (streak >= 7) points += 50; // Week bonus
    if (streak >= 30) points += 200; // Month bonus
    if (streak >= 100) points += 500; // Century bonus
    
    return points;
  }
}
