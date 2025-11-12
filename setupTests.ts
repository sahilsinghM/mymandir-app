import '@testing-library/jest-native/extend-expect';

// Mock fetch globally for API tests (only if needed)
global.fetch = jest.fn();

// Mock expo modules that are not available in test environment
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn(),
    Sound: jest.fn(() => ({
      loadAsync: jest.fn(),
      playAsync: jest.fn(),
      pauseAsync: jest.fn(),
      stopAsync: jest.fn(),
      setPositionAsync: jest.fn(),
      setVolumeAsync: jest.fn(),
      unloadAsync: jest.fn(),
    })),
  },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  setNotificationHandler: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  return {
    ...actual,
    Portal: ({ children }: any) => children,
  };
});

// NO FIREBASE MOCKS - Use real Firebase with actual configuration
// Tests will use real Firebase from .env file
console.log('🧪 Running tests with REAL Firebase (no mocks)');
console.log('   Make sure .env file has Firebase credentials');

// Mock Constants to use real env vars from .env file
jest.mock('expo-constants', () => {
  require('dotenv/config');
  const realEnv = process.env;

  const withFallback = (envKey: string, fallback: string) => realEnv[envKey] || fallback;
  const setCamelCase = (envKey: string, camelKey: string, fallback: string) => {
    const value = withFallback(envKey, fallback);
    process.env[camelKey] = value;
    return value;
  };

  return {
    default: {
      expoConfig: {
        extra: {
          firebaseApiKey: setCamelCase('FIREBASE_API_KEY', 'firebaseApiKey', 'test-firebase-api-key'),
          firebaseAuthDomain: setCamelCase('FIREBASE_AUTH_DOMAIN', 'firebaseAuthDomain', 'test-auth-domain'),
          firebaseProjectId: setCamelCase('FIREBASE_PROJECT_ID', 'firebaseProjectId', 'test-project-id'),
          firebaseStorageBucket: setCamelCase('FIREBASE_STORAGE_BUCKET', 'firebaseStorageBucket', 'test-storage-bucket'),
          firebaseMessagingSenderId: setCamelCase('FIREBASE_MESSAGING_SENDER_ID', 'firebaseMessagingSenderId', 'test-messaging-sender-id'),
          firebaseAppId: setCamelCase('FIREBASE_APP_ID', 'firebaseAppId', 'test-firebase-app-id'),
          openaiApiKey: setCamelCase('OPENAI_API_KEY', 'openaiApiKey', 'test-openai-key'),
          deepseekApiKey: setCamelCase('DEEPSEEK_API_KEY', 'deepseekApiKey', 'test-deepseek-key'),
          astroApiKey: setCamelCase('ASTRO_API_KEY', 'astroApiKey', 'test-astro-key'),
          astrologyApiKey: setCamelCase('ASTROLOGY_API_KEY', 'astrologyApiKey', 'test-astrology-key'),
          divineApiKey: setCamelCase('DIVINE_API_KEY', 'divineApiKey', 'test-divine-key'),
          youtubeApiKey: setCamelCase('YOUTUBE_API_KEY', 'youtubeApiKey', 'test-youtube-key'),
          prokeralaClientId: setCamelCase('PROKERALA_CLIENT_ID', 'prokeralaClientId', 'test-prokerala-client'),
          prokeralaClientSecret: setCamelCase('PROKERALA_CLIENT_SECRET', 'prokeralaClientSecret', 'test-prokerala-secret'),
          huggingfaceApiKey: setCamelCase('HUGGINGFACE_API_KEY', 'huggingfaceApiKey', 'test-hf-key'),
          cohereApiKey: setCamelCase('COHERE_API_KEY', 'cohereApiKey', 'test-cohere-key'),
          anthropicApiKey: setCamelCase('ANTHROPIC_API_KEY', 'anthropicApiKey', 'test-anthropic-key'),
          googleClientId: setCamelCase('GOOGLE_CLIENT_ID', 'googleClientId', 'test-google-client-id'),
        },
      },
    },
  };
});

// Global test timeout
jest.setTimeout(30000); // Increased timeout for real Firebase operations
