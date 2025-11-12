import Constants from 'expo-constants';

type RawEnvKey =
  | 'firebaseApiKey'
  | 'firebaseAuthDomain'
  | 'firebaseProjectId'
  | 'firebaseStorageBucket'
  | 'firebaseMessagingSenderId'
  | 'firebaseAppId'
  | 'openaiApiKey'
  | 'deepseekApiKey'
  | 'astroApiKey'
  | 'astrologyApiKey'
  | 'divineApiKey'
  | 'youtubeApiKey'
  | 'prokeralaClientId'
  | 'prokeralaClientSecret'
  | 'huggingfaceApiKey'
  | 'cohereApiKey'
  | 'anthropicApiKey'
  | 'googleClientId';

export const getEnvVar = (key: RawEnvKey | string, defaultValue?: string): string => {
  const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;
  const configValue = extra[key as string];
  const envValue = process.env[key as string];
  const value = configValue || envValue || defaultValue || '';

  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
  }

  return value;
};

const rawEnv = {
  firebaseApiKey: getEnvVar('firebaseApiKey'),
  firebaseAuthDomain: getEnvVar('firebaseAuthDomain'),
  firebaseProjectId: getEnvVar('firebaseProjectId'),
  firebaseStorageBucket: getEnvVar('firebaseStorageBucket'),
  firebaseMessagingSenderId: getEnvVar('firebaseMessagingSenderId'),
  firebaseAppId: getEnvVar('firebaseAppId'),
  openaiApiKey: getEnvVar('openaiApiKey'),
  deepseekApiKey: getEnvVar('deepseekApiKey'),
  astroApiKey: getEnvVar('astroApiKey'),
  astrologyApiKey: getEnvVar('astrologyApiKey'),
  divineApiKey: getEnvVar('divineApiKey'),
  youtubeApiKey: getEnvVar('youtubeApiKey'),
  prokeralaClientId: getEnvVar('prokeralaClientId'),
  prokeralaClientSecret: getEnvVar('prokeralaClientSecret'),
  huggingfaceApiKey: getEnvVar('huggingfaceApiKey'),
  cohereApiKey: getEnvVar('cohereApiKey'),
  anthropicApiKey: getEnvVar('anthropicApiKey'),
  googleClientId: getEnvVar('googleClientId'),
};

export const env = {
  firebase: {
    apiKey: rawEnv.firebaseApiKey,
    authDomain: rawEnv.firebaseAuthDomain,
    projectId: rawEnv.firebaseProjectId,
    storageBucket: rawEnv.firebaseStorageBucket,
    messagingSenderId: rawEnv.firebaseMessagingSenderId,
    appId: rawEnv.firebaseAppId,
  },
  openai: {
    apiKey: rawEnv.openaiApiKey,
  },
  deepseek: {
    apiKey: rawEnv.deepseekApiKey,
  },
  astrology: {
    astroApiKey: rawEnv.astroApiKey,
    divineApiKey: rawEnv.divineApiKey,
    astrologyApiKey: rawEnv.astrologyApiKey,
    prokeralaClientId: rawEnv.prokeralaClientId,
    prokeralaClientSecret: rawEnv.prokeralaClientSecret,
  },
  youtube: {
    apiKey: rawEnv.youtubeApiKey,
  },
  ai: {
    huggingfaceApiKey: rawEnv.huggingfaceApiKey,
    cohereApiKey: rawEnv.cohereApiKey,
    anthropicApiKey: rawEnv.anthropicApiKey,
  },
  google: {
    clientId: rawEnv.googleClientId,
  },
  app: {
    isDevelopment: __DEV__,
  },
  raw: rawEnv,
} as const;
