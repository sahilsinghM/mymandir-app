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
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
            lastLoginAt: firebaseUser.metadata.lastSignInTime
              ? new Date(firebaseUser.metadata.lastSignInTime)
              : undefined,
          });
          setIsGuest(false);
        } else {
          // Only clear user if not in guest mode
          if (!isGuest) {
            setUser(null);
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
      setError(null);
      setLoading(true);
      setIsGuest(false);
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      setIsGuest(false);
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
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
      // TODO: Implement Google sign-in with Expo Google auth
      // This will require @react-native-google-signin/google-signin or expo-auth-session
      throw new Error('Google sign-in not yet implemented');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setIsGuest(false);
      
      // Try to sign out from Firebase if authenticated
      try {
        const auth = getFirebaseAuth();
        await firebaseSignOut(auth);
      } catch (err) {
        // Firebase not configured or not signed in - just clear guest state
        console.log('Signing out from guest mode');
      }
      
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
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

