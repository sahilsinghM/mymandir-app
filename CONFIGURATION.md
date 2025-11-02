# MyMandir Configuration Guide

This guide will help you set up all the necessary services and configurations for the MyMandir app.

## 🔧 Environment Setup

### 1. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "MyMandir"
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider:
   - Add your app's SHA-1 fingerprint (for Android)
   - Add your app's bundle identifier (for iOS)
5. Enable "Phone" provider:
   - Add your app's SHA-1 fingerprint (for Android)

#### Set up Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

#### Configure Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

#### Get Configuration Keys
1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select your platform
4. Copy the configuration object
5. Add the keys to your `.env` file

### 2. OpenAI Configuration

#### Get API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and add to `.env` file

#### Set Usage Limits
1. Go to "Usage" section
2. Set monthly spending limits
3. Monitor usage to avoid unexpected charges

### 3. Astrology API Configuration

#### Option 1: Prokerala API
1. Go to [Prokerala API](https://www.prokerala.com/api/)
2. Sign up for an account
3. Get your API key
4. Add to `.env` file

#### Option 2: Aztro API
1. Go to [Aztro API](https://aztro.sameerkumar.website/)
2. No API key required
3. Update `astroService.ts` to use this API

#### Option 3: AstroAPI
1. Go to [AstroAPI](https://astroapi.io/)
2. Sign up for an account
3. Get your API key
4. Add to `.env` file

### 4. Bhagavad Gita API

#### No Configuration Required
- The app uses the public Bhagavad Gita API
- No API key needed
- Rate limits apply (100 requests per hour)

## 📱 App Configuration

### 1. Update app.json

```json
{
  "expo": {
    "name": "MyMandir",
    "slug": "mymandir",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFF8E1"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.mymandir"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFF8E1"
      },
      "package": "com.yourcompany.mymandir"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "firebaseApiKey": "your_firebase_api_key",
      "firebaseAuthDomain": "your_project.firebaseapp.com",
      "firebaseProjectId": "your_project_id",
      "firebaseStorageBucket": "your_project.appspot.com",
      "firebaseMessagingSenderId": "your_sender_id",
      "firebaseAppId": "your_app_id",
      "openaiApiKey": "your_openai_api_key",
      "astroApiKey": "your_astro_api_key"
    }
  }
}
```

### 2. Update expo.json

```json
{
  "expo": {
    "name": "MyMandir",
    "slug": "mymandir",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFF8E1"
    },
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.mymandir",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFF8E1"
      },
      "package": "com.yourcompany.mymandir",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#FF6F00"
    },
    "plugins": [
      "expo-notifications",
      "expo-av",
      "expo-sharing",
      "expo-linear-gradient"
    ]
  }
}
```

## 🔐 Security Configuration

### 1. Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Streaks are user-specific
    match /streaks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public content (horoscopes, etc.)
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only upload to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public content
    match /public/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

### 2. API Rate Limiting

#### OpenAI Rate Limits
- Free tier: 3 requests per minute
- Paid tier: 60 requests per minute
- Implement retry logic with exponential backoff

#### Bhagavad Gita API Rate Limits
- 100 requests per hour
- Implement caching for frequently accessed verses

## 🚀 Deployment Configuration

### 1. iOS Deployment

#### App Store Connect
1. Create app in App Store Connect
2. Set bundle identifier: `com.yourcompany.mymandir`
3. Configure app information and metadata
4. Upload screenshots and app icon
5. Submit for review

#### TestFlight
1. Build with `expo build:ios`
2. Upload to TestFlight
3. Invite beta testers
4. Test push notifications

### 2. Android Deployment

#### Google Play Console
1. Create app in Google Play Console
2. Set package name: `com.yourcompany.mymandir`
3. Configure app information and metadata
4. Upload screenshots and app icon
5. Submit for review

#### Internal Testing
1. Build with `expo build:android`
2. Upload to Google Play Console
3. Create internal testing track
4. Test push notifications

### 3. Web Deployment

#### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables
4. Deploy with `vercel --prod`

#### Netlify
1. Connect GitHub repository
2. Set build command: `expo build:web`
3. Set publish directory: `web-build`
4. Configure environment variables

## 📊 Analytics Configuration

### 1. Firebase Analytics

#### Enable Analytics
1. Go to Firebase Console
2. Navigate to "Analytics"
3. Click "Get started"
4. Follow the setup instructions

#### Custom Events
```typescript
// Track user actions
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();
logEvent(analytics, 'user_engagement', {
  screen_name: 'home',
  action: 'view_daily_shloka'
});
```

### 2. Crashlytics

#### Enable Crashlytics
1. Go to Firebase Console
2. Navigate to "Crashlytics"
3. Click "Get started"
4. Follow the setup instructions

## 🔔 Push Notifications Configuration

### 1. iOS Notifications

#### Apple Developer Account
1. Enable Push Notifications capability
2. Generate APNs certificate or key
3. Upload to Firebase Console

#### Firebase Configuration
1. Go to "Project settings"
2. Navigate to "Cloud Messaging"
3. Upload APNs certificate/key
4. Test notifications

### 2. Android Notifications

#### Firebase Configuration
1. Go to "Project settings"
2. Navigate to "Cloud Messaging"
3. Download `google-services.json`
4. Place in `android/app/` directory

#### Testing
```typescript
// Test notification
import * as Notifications from 'expo-notifications';

await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Test Notification',
    body: 'This is a test notification',
  },
  trigger: { seconds: 2 },
});
```

## 🧪 Testing Configuration

### 1. Unit Testing

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|firebase|@firebase|@firebase/util|@firebase/component|@firebase/app|react-native-gesture-handler)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### 2. E2E Testing

#### Detox Configuration
```javascript
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyMandir.app',
      build: 'xcodebuild -workspace ios/MyMandir.xcworkspace -scheme MyMandir -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
  },
};
```

## 📝 Environment Variables

### 1. Development (.env.development)
```env
# Firebase Configuration
FIREBASE_API_KEY=your_dev_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_dev_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_dev_project_id
FIREBASE_STORAGE_BUCKET=your_dev_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
FIREBASE_APP_ID=your_dev_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Astrology API Configuration
ASTRO_API_KEY=your_astro_api_key

# App Configuration
APP_ENV=development
DEBUG=true
```

### 2. Production (.env.production)
```env
# Firebase Configuration
FIREBASE_API_KEY=your_prod_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_prod_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_prod_project_id
FIREBASE_STORAGE_BUCKET=your_prod_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_prod_sender_id
FIREBASE_APP_ID=your_prod_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Astrology API Configuration
ASTRO_API_KEY=your_astro_api_key

# App Configuration
APP_ENV=production
DEBUG=false
```

## 🎯 Performance Optimization

### 1. Image Optimization
- Use WebP format for images
- Implement lazy loading
- Cache images locally

### 2. Bundle Size Optimization
- Use dynamic imports for large components
- Remove unused dependencies
- Optimize images and assets

### 3. Memory Management
- Implement proper cleanup in useEffect
- Use React.memo for expensive components
- Optimize list rendering with FlatList

## 🔍 Monitoring and Debugging

### 1. Error Tracking
- Use Firebase Crashlytics
- Implement error boundaries
- Log errors to console in development

### 2. Performance Monitoring
- Use Firebase Performance Monitoring
- Track app startup time
- Monitor network requests

### 3. User Analytics
- Track user engagement
- Monitor feature usage
- Analyze user retention

---

This configuration guide should help you set up the MyMandir app successfully. For any questions or issues, please refer to the main README or create an issue in the repository.

