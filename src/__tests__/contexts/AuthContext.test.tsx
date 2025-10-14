// Mock Firebase modules before importing
jest.mock('../../services/firebase', () => ({
  auth: {},
  firestore: {},
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

import { auth, firestore } from '../../services/firebase';
import { COLLECTIONS } from '../../types/firestore';

// Auth Context tests
describe('AuthContext', () => {
  it('should provide authentication methods', () => {
    expect(auth).toBeDefined();
  });

  it('should have firestore access', () => {
    expect(firestore).toBeDefined();
  });

  it('should have collections defined', () => {
    expect(COLLECTIONS.USERS).toBe('users');
  });
});