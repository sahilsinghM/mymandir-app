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
};

