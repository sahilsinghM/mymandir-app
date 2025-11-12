import { ExpoConfig, ConfigContext } from 'expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const mergedConfig: ExpoConfig = {
    ...config,
    name: 'MyMandir',
    slug: 'mymandir',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FF9933',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mymandir.app',
    },
    android: {
      package: 'com.mymandir.app',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'com.mymandir.app',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF9933',
      },
      permissions: [
        'CAMERA',
        'RECORD_AUDIO',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'NOTIFICATIONS',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    scheme: 'com.mymandir.app',
    plugins: [
      'expo-font',
      'expo-av',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#FF9933',
        },
      ],
      'expo-web-browser',
    ],
    extra: {
      ...config.extra,
      eas: {
        projectId: '2b733a97-9761-4922-ace4-142c092d38b0',
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
      astroApiKey: process.env.ASTRO_API_KEY || '',
      astrologyApiKey: process.env.ASTROLOGY_API_KEY || '',
      divineApiKey: process.env.DIVINE_API_KEY || '',
      youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
      prokeralaClientId: process.env.PROKERALA_CLIENT_ID || '',
      prokeralaClientSecret: process.env.PROKERALA_CLIENT_SECRET || '',
      huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
      cohereApiKey: process.env.COHERE_API_KEY || '',
      anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
      googleClientId:
        process.env.GOOGLE_CLIENT_ID ||
        '146352979259-cv2f4dj37trjlsflgo2elannchg6jbdm.apps.googleusercontent.com',
    },
  };

  return mergedConfig;
};
