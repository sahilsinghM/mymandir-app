import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // Merge config properly to avoid duplicates
  const mergedConfig: ExpoConfig = {
    ...config,
    name: "MyMandir",
    slug: "mymandir",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#FF9933",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mymandir.app",
    },
    android: {
      package: "com.mymandir.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FF9933",
      },
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "NOTIFICATIONS",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-font", "expo-av", "expo-notifications"],
    extra: {
      ...config.extra,
      eas: {
        projectId: "2b733a97-9761-4922-ace4-142c092d38b0",
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      openaiApiKey: process.env.OPENAI_API_KEY || "", // Add your key here directly if .env doesn't work: 'sk-...'
      deepseekApiKey: process.env.DEEPSEEK_API_KEY || "", // Add your DeepSeek key here directly if .env doesn't work: 'sk-...'
      astroApiKey: process.env.ASTRO_API_KEY || "",
    },
  };

  return mergedConfig;
};
