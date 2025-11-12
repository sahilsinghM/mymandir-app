# Firebase Setup Guide for MyMandir

This guide will help you set up Firebase for your MyMandir app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `MyMandir` (or your preferred name)
4. **Disable** Google Analytics (optional, can enable later)
5. Click **"Create project"**

## Step 2: Register Your App

### For Web (Expo Web):
1. In Firebase Console, click the **Web icon** (`</>`)
2. Register app name: `MyMandir Web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object

You'll get something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### For Android (Optional, for APK):
1. Click **Android icon** (or add later)
2. Package name: `com.mymandir.app` (must match app.config.ts)
3. Download `google-services.json` (we'll configure later)

## Step 3: Enable Firebase Services

### Authentication:
1. Go to **Authentication** → **Get started**
2. Enable **Email/Password** provider:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
3. (Optional) Enable **Google Sign-In**:
   - Click "Google"
   - Toggle "Enable"
   - Add support email
   - Click "Save"

### Firestore Database:
1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (for development)
3. Choose a location (closest to your users)
4. Click **"Enable"**

**⚠️ Important:** Update security rules after setup!

Test mode rules (for development only):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage (Optional):
1. Go to **Storage** → **Get started**
2. Start in **test mode**
3. Choose a location
4. Click **"Done"**

## Step 4: Add Firebase Credentials to App

### Option 1: Update .env file (Recommended)

Edit `.env` file in project root:

```env
# Firebase Configuration
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Option 2: Update app.config.ts (Alternative)

If `.env` doesn't work, edit `app.config.ts` directly:

```typescript
extra: {
  // ... other config
  firebaseApiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  firebaseAuthDomain: "your-project.firebaseapp.com",
  firebaseProjectId: "your-project-id",
  firebaseStorageBucket: "your-project.appspot.com",
  firebaseMessagingSenderId: "123456789012",
  firebaseAppId: "1:123456789012:web:abcdef1234567890",
}
```

## Step 5: Firestore Security Rules

After enabling Firestore, update rules to secure your data:

1. Go to **Firestore Database** → **Rules**
2. Replace with production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only read/write their own
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Streaks - users can only read/write their own
    match /streaks/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Expert Jyotish - public read, admin write
    match /experts/{expertId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }
    
    // Mantra favorites - users can only read/write their own
    match /mantraFavorites/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Test Firebase Connection

1. **Restart your Expo server:**
   ```bash
   npm start
   ```

2. **Test Authentication:**
   - Try signing up with a test email
   - Check Firebase Console → Authentication → Users
   - You should see the new user

3. **Test Firestore:**
   - Sign in and check your streak
   - Go to Firebase Console → Firestore Database
   - You should see `streaks/{userId}` document created

## Step 7: Initialize Expert Data (Optional)

To populate expert Jyotish data in Firestore:

1. Go to **Firestore Database**
2. Create collection: `experts`
3. Add documents with expert data (see `expertJyotishService.ts` for structure)

Or use the app - it currently uses mock data that will work fine.

## Troubleshooting

### "Firebase not configured" error:
- Check `.env` file has correct values
- Restart Expo server after updating `.env`
- Check `app.config.ts` has proper imports

### Authentication not working:
- Verify Email/Password provider is enabled in Firebase Console
- Check Firebase Console → Authentication → Settings → Authorized domains
- Make sure your domain is authorized

### Firestore permission denied:
- Check Firestore security rules
- Verify user is authenticated (`request.auth != null`)
- Check user ID matches document path

### Storage errors:
- Verify Storage is enabled in Firebase Console
- Check Storage security rules
- Ensure proper file permissions

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Add credentials to `.env` or `app.config.ts`
3. ✅ Enable Authentication (Email/Password)
4. ✅ Enable Firestore Database
5. ✅ Update security rules
6. ✅ Test sign-up/sign-in
7. ✅ Verify streak data is saved

## Production Checklist

Before going to production:
- [ ] Update Firestore rules (remove test mode)
- [ ] Update Storage rules
- [ ] Enable email verification
- [ ] Set up backup strategy
- [ ] Configure proper error logging
- [ ] Test with multiple users
- [ ] Set up Firebase Analytics (optional)
- [ ] Configure Firebase Performance Monitoring (optional)

---

Need help? Check [Firebase Documentation](https://firebase.google.com/docs)

