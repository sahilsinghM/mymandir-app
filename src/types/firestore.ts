// User Profile
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  deityPreference: string; // 'Krishna', 'Shiva', 'Ganesha', 'Hanuman', 'Durga', etc.
  language: 'sanskrit' | 'hindi' | 'english';
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  createdAt: Date;
  lastVisit: Date;
  streakCount: number;
  karmaPoints: number;
  notificationsEnabled: boolean;
  prayerReminderTime?: string; // HH:MM format
}

// Daily Content
export interface DailyContent {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'shloka' | 'quote' | 'bhajan';
  content: string;
  translation?: string;
  source: string; // 'geeta' | 'openai' | 'manual'
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Astrologer Profile
export interface AstrologerProfile {
  id: string;
  name: string;
  photoURL: string;
  specialization: string[];
  rating: number;
  reviewCount: number;
  experience: number; // years
  languages: string[];
  consultationFee: number;
  available: boolean;
  bio: string;
  createdAt: Date;
}

// User Activity
export interface UserActivity {
  userId: string;
  date: string; // YYYY-MM-DD
  diyasLit: number;
  mantrasPlayed: string[];
  shlokasGenerated: string[];
  jyotishChats: number;
  visitedTemples: string[];
  createdAt: Date;
}

// Saved Shloka
export interface SavedShloka {
  id: string;
  userId: string;
  emotion: string;
  shloka: string;
  translation: string;
  createdAt: Date;
}

// Favorite Mantra
export interface FavoriteMantra {
  userId: string;
  mantraId: string;
  mantraName: string;
  addedAt: Date;
}

// Notification
export interface NotificationSchedule {
  userId: string;
  type: 'prayer' | 'muhurat' | 'festival' | 'streak';
  scheduledTime: string; // HH:MM
  enabled: boolean;
  metadata?: Record<string, any>;
}

// Firestore Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  DAILY_CONTENT: 'daily_content',
  ASTROLOGERS: 'astrologers',
  USER_ACTIVITY: 'user_activity',
  SAVED_SHLOKAS: 'saved_shlokas',
  FAVORITE_MANTRAS: 'favorite_mantras',
  NOTIFICATIONS: 'notifications',
} as const;

