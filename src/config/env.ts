import Constants from 'expo-constants';

/**
 * Environment configuration
 * Reads from app.config.ts extra fields or environment variables
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || defaultValue || '';
};

export const env = {
  // Firebase
  firebase: {
    apiKey: getEnvVar('firebaseApiKey'),
    authDomain: getEnvVar('firebaseAuthDomain'),
    projectId: getEnvVar('firebaseProjectId'),
    storageBucket: getEnvVar('firebaseStorageBucket'),
    messagingSenderId: getEnvVar('firebaseMessagingSenderId'),
    appId: getEnvVar('firebaseAppId'),
  },
  
  // OpenAI
  openai: {
    apiKey: getEnvVar('openaiApiKey'),
  },
  
  // DeepSeek
  deepseek: {
    apiKey: getEnvVar('deepseekApiKey'),
  },
  
  // Astrology APIs
  astrology: {
    astroApiKey: getEnvVar('astroApiKey'),
    prokeralaClientId: getEnvVar('prokeralaClientId'),
    prokeralaClientSecret: getEnvVar('prokeralaClientSecret'),
    divineApiKey: getEnvVar('divineApiKey'),
    astrologyApiKey: getEnvVar('astrologyApiKey'),
  },
  
  // YouTube
  youtube: {
    apiKey: getEnvVar('youtubeApiKey'),
  },
  
  // Free AI Alternatives
  ai: {
    huggingfaceApiKey: getEnvVar('huggingfaceApiKey'),
    cohereApiKey: getEnvVar('cohereApiKey'),
    anthropicApiKey: getEnvVar('anthropicApiKey'),
  },
  
  // App config
  app: {
    isDevelopment: __DEV__,
  },
} as const;

