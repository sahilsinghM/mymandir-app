import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { getFirebaseAuth } from '../services/firebase';
import { User, AuthState } from '../types';
import { saveUserProfile } from '../utils/firebaseHelper';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Try to initialize Firebase, but don't fail if it's not configured
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
            lastLoginAt: firebaseUser.metadata.lastSignInTime
              ? new Date(firebaseUser.metadata.lastSignInTime)
              : undefined,
          };
          
          console.log('✅ Auth state changed - User logged in:', {
            id: userData.id,
            email: userData.email,
          });
          setUser(userData);
          setIsGuest(false);
          
          // Save user profile to Firestore
          try {
            await saveUserProfile(userData);
            console.log('✅ User profile saved to Firestore');
          } catch (error) {
            console.error('❌ Error saving user profile:', error);
            // Continue even if saving fails
          }
        } else {
          // When Firebase user is null (signed out), clear local state
          // But respect guest mode - if isGuest is true, keep the guest user
          console.log('🟡 Firebase auth state changed - user is null');
          // Don't clear user here if in guest mode - let signOut() handle it explicitly
          // This prevents race conditions during sign out
          if (!isGuest) {
            console.log('🟡 Clearing user state (not guest mode)');
            setUser(null);
            setIsGuest(false);
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      // Firebase not configured - allow guest mode
      console.log('Firebase not configured, guest mode available');
      setLoading(false);
    }
  }, [isGuest]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔵 Starting email sign-in...', { email });
      setError(null);
      setLoading(true);
      setIsGuest(false);
      const auth = getFirebaseAuth();
      console.log('🟡 Signing in with email/password...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Sign-in successful');
    } catch (err: any) {
      console.error('❌ Sign-in error:', err.message);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔵 Starting email sign-up...', { email });
      setError(null);
      setLoading(true);
      setIsGuest(false);
      
      // Check Firebase configuration first
      console.log('🔍 Checking Firebase configuration...');
      let auth;
      try {
        auth = getFirebaseAuth();
        console.log('✅ Firebase auth initialized:', !!auth);
      } catch (firebaseError: any) {
        console.error('❌ Firebase initialization error:', firebaseError);
        throw new Error(`Firebase error: ${firebaseError.message}`);
      }
      
      console.log('🟡 Creating user with email/password...');
      console.log('🟡 Calling createUserWithEmailAndPassword with:', { 
        email, 
        passwordLength: password.length,
        authInitialized: !!auth 
      });
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ User created successfully:', userCredential.user.uid);
      
      // User profile will be saved by onAuthStateChanged listener
      // But we can also save it explicitly here if needed
      if (userCredential.user) {
        const userData: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || undefined,
          displayName: userCredential.user.displayName || undefined,
          photoURL: userCredential.user.photoURL || undefined,
          createdAt: new Date(userCredential.user.metadata.creationTime || Date.now()),
        };
        
        try {
          await saveUserProfile(userData);
        } catch (profileError) {
          console.error('Error saving user profile on signup:', profileError);
          // Continue even if profile save fails
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = () => {
    setError(null);
    setIsGuest(true);
    setUser({
      id: 'guest-user',
      displayName: 'Guest User',
      email: 'guest@mymandir.app',
      createdAt: new Date(),
    });
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      setIsGuest(false);
      
      console.log('🔵 Starting Google sign-in...');
      
      // Import Google auth service
      const { signInToFirebaseWithGoogle } = await import('../services/googleAuthService');
      
      // Sign in to Firebase with Google
      await signInToFirebaseWithGoogle();
      
      console.log('✅ Google sign-in completed, waiting for auth state change...');
      
      // Wait a moment for Firebase auth state to update
      // The user will be set automatically by onAuthStateChanged listener
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err: any) {
      console.error('❌ Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
      throw err;
    }
    // Don't set loading to false here - let onAuthStateChanged handle it
  };

  const signOut = async () => {
    try {
      console.log('🔵 signOut() called in AuthContext');
      setError(null);
      
      // Clear guest mode FIRST, then clear user
      // This ensures onAuthStateChanged doesn't keep user if guest mode was on
      setIsGuest(false);
      
      // Clear user state IMMEDIATELY to trigger navigation change
      // Do this before Firebase sign out to ensure navigation happens even if Firebase fails
      console.log('🟡 Setting user to null immediately...');
      setUser(null);
      
      // Try to sign out from Firebase if authenticated (async, but we've already cleared state)
      try {
        console.log('🟡 Attempting Firebase sign out...');
        const auth = getFirebaseAuth();
        await firebaseSignOut(auth);
        console.log('✅ Firebase sign out successful');
      } catch (err: any) {
        // Firebase not configured or not signed in - just clear guest state
        console.log('⚠️ Firebase sign out skipped:', err.message || 'Guest mode or Firebase not configured');
        // User state already cleared above, so we're good
      }
      
      console.log('✅ Sign out complete - navigation should update');
    } catch (err: any) {
      console.error('❌ Sign out error:', err);
      setError(err.message || 'Failed to sign out');
      // Even on error, ensure user is cleared
      setUser(null);
      setIsGuest(false);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signInAsGuest,
    signOut,
    isGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

