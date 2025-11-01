import Constants from 'expo-constants';

interface EnvConfig {
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  openaiApiKey: string;
  astroApiKey: string;
  astrologyApiKey: string;
  divineApiKey: string;
  youtubeApiKey: string;
  prokeralaClientId: string;
  prokeralaClientSecret: string;
  huggingfaceApiKey: string;
  cohereApiKey: string;
  anthropicApiKey: string;
}

export const getEnvVar = (key: keyof EnvConfig): string => {
  const value = Constants.expoConfig?.extra?.[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value;
};

export const env: EnvConfig = {
  firebaseApiKey: getEnvVar('firebaseApiKey'),
  firebaseAuthDomain: getEnvVar('firebaseAuthDomain'),
  firebaseProjectId: getEnvVar('firebaseProjectId'),
  firebaseStorageBucket: getEnvVar('firebaseStorageBucket'),
  firebaseMessagingSenderId: getEnvVar('firebaseMessagingSenderId'),
  firebaseAppId: getEnvVar('firebaseAppId'),
  openaiApiKey: getEnvVar('openaiApiKey'),
  astroApiKey: getEnvVar('astroApiKey'),
  astrologyApiKey: getEnvVar('astrologyApiKey'),
  divineApiKey: getEnvVar('divineApiKey'),
  youtubeApiKey: getEnvVar('youtubeApiKey'),
  prokeralaClientId: getEnvVar('prokeralaClientId'),
  prokeralaClientSecret: getEnvVar('prokeralaClientSecret'),
  huggingfaceApiKey: getEnvVar('huggingfaceApiKey'),
  cohereApiKey: getEnvVar('cohereApiKey'),
  anthropicApiKey: getEnvVar('anthropicApiKey'),
};

