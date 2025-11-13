/**
 * Firebase Helper Utilities
 * Provides helper functions for Firebase operations
 */

import { getFirestoreDB } from '../services/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

/**
 * Create or update user profile in Firestore
 */
export const saveUserProfile = async (user: User): Promise<void> => {
  try {
    const db = getFirestoreDB();
    const userRef = doc(db, 'users', user.id);
    
    await setDoc(
      userRef,
      {
        ...user,
        phoneNumber: user.phoneNumber || null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const db = getFirestoreDB();
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: data.id,
        email: data.email,
        displayName: data.displayName,
        phoneNumber: data.phoneNumber,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Check if Firebase is configured and ready
 */
export const isFirebaseConfigured = (): boolean => {
  try {
    const { env } = require('../config/env');
    return (
      env.firebase.apiKey &&
      env.firebase.apiKey !== 'your_firebase_api_key_here' &&
      env.firebase.apiKey.trim().length > 0 &&
      env.firebase.projectId &&
      env.firebase.projectId !== 'your_project_id'
    );
  } catch (error) {
    return false;
  }
};
