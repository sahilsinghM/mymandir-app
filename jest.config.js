module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|firebase|@firebase|@firebase/util|@firebase/component|@firebase/app|@firebase/auth|@firebase/firestore|@firebase/storage|react-native-gesture-handler)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**'
  ],
  // Handle Firebase ESM modules - let jest-expo handle it
  // The transformIgnorePatterns should handle Firebase modules
};