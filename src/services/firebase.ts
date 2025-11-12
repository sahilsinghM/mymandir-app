import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { env } from '../config/env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
};

// Initialize Firebase
export const initializeFirebase = (): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
} => {
  if (!app) {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }

  return {
    app,
    auth: auth!,
    db: db!,
    storage: storage!,
  };
};

// Get Firebase services (will initialize if needed)
export const getFirebaseAuth = (): Auth => {
  console.log('🔍 getFirebaseAuth called', { authExists: !!auth });
  
  if (!auth) {
    console.log('🔍 Firebase auth not initialized, checking config...');
    console.log('🔍 Firebase config check:', {
      apiKey: env.firebase.apiKey ? 'SET' : 'MISSING',
      apiKeyLength: env.firebase.apiKey?.length || 0,
      isPlaceholder: env.firebase.apiKey === 'your_firebase_api_key_here',
      projectId: env.firebase.projectId ? 'SET' : 'MISSING',
    });
    
    // Check if Firebase config is available
    if (!env.firebase.apiKey || env.firebase.apiKey === 'your_firebase_api_key_here' || env.firebase.apiKey.trim().length === 0) {
      const error = new Error('Firebase is not configured. Please set up Firebase credentials in .env file.');
      console.error('❌ Firebase configuration error:', error.message);
      throw error;
    }
    
    console.log('🟡 Initializing Firebase...');
    try {
      initializeFirebase();
      console.log('✅ Firebase initialized successfully');
    } catch (initError: any) {
      console.error('❌ Firebase initialization failed:', initError);
      throw new Error(`Failed to initialize Firebase: ${initError.message}`);
    }
  }
  
  console.log('✅ Returning Firebase auth instance');
  return auth!;
};

export const getFirestoreDB = (): Firestore => {
  if (!db) {
    if (!env.firebase.apiKey || env.firebase.apiKey === 'your_firebase_api_key_here') {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    initializeFirebase();
  }
  return db!;
};

export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    if (!env.firebase.apiKey || env.firebase.apiKey === 'your_firebase_api_key_here') {
      throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    }
    initializeFirebase();
  }
  return storage!;
};

// Initialize on module load if config is available
if (env.firebase.apiKey && env.firebase.apiKey !== 'your_firebase_api_key_here') {
  try {
    initializeFirebase();
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

