import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  auth,
  firestore,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '../services/firebase';
import { UserProfile, COLLECTIONS } from '../types/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  createUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDocRef = doc(firestore, COLLECTIONS.USERS, firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create one
      const userDocRef = doc(firestore, COLLECTIONS.USERS, result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await createUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      } else {
        // Update last visit
        await updateDoc(userDocRef, {
          lastVisit: new Date(),
        });
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    // TODO: Implement phone authentication
    // This requires RecaptchaVerifier which needs DOM elements
    // Will be implemented with actual screens
    throw new Error('Phone authentication not yet implemented');
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  const createUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const now = new Date();
    const profile: UserProfile = {
      uid: data.uid || user.uid,
      email: data.email || user.email,
      displayName: data.displayName || user.displayName,
      photoURL: data.photoURL || user.photoURL,
      deityPreference: data.deityPreference || 'Krishna',
      language: data.language || 'english',
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      createdAt: now,
      lastVisit: now,
      streakCount: 0,
      karmaPoints: 0,
      notificationsEnabled: true,
      prayerReminderTime: data.prayerReminderTime,
    };

    const userDocRef = doc(firestore, COLLECTIONS.USERS, profile.uid);
    await setDoc(userDocRef, profile);
    setUserProfile(profile);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const userDocRef = doc(firestore, COLLECTIONS.USERS, user.uid);
    await updateDoc(userDocRef, { ...data, lastVisit: new Date() });
    
    // Refresh user profile
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      setUserProfile(userDoc.data() as UserProfile);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithPhone,
    signOut,
    updateUserProfile,
    createUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

