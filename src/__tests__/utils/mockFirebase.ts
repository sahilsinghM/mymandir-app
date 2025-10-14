// Mock Firebase configuration
export const mockFirebaseConfig = {
  apiKey: 'mock-api-key',
  authDomain: 'mock-project.firebaseapp.com',
  projectId: 'mock-project',
  storageBucket: 'mock-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'mock-app-id',
};

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
};

// Mock Firestore
export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      onSnapshot: jest.fn(),
    })),
    add: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    get: jest.fn(),
  })),
  doc: jest.fn(),
  batch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(),
  })),
  runTransaction: jest.fn(),
};

// Mock Firebase Storage
export const mockStorage = {
  ref: jest.fn(() => ({
    put: jest.fn(),
    getDownloadURL: jest.fn(),
    delete: jest.fn(),
  })),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
};

// Mock Firebase initialization
export const mockInitializeApp = jest.fn(() => ({
  auth: () => mockAuth,
  firestore: () => mockFirestore,
  storage: () => mockStorage,
}));

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: mockInitializeApp,
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  RecaptchaVerifier: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => mockStorage),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

// Basic test to ensure the module loads
describe('Mock Firebase', () => {
  it('should export mock Firebase objects', () => {
    expect(mockFirebaseConfig).toBeDefined();
    expect(mockAuth).toBeDefined();
    expect(mockFirestore).toBeDefined();
    expect(mockStorage).toBeDefined();
  });

  it('should have mock Firebase methods', () => {
    expect(mockAuth.signInWithEmailAndPassword).toBeDefined();
    expect(mockAuth.signOut).toBeDefined();
    expect(mockFirestore.collection).toBeDefined();
    expect(mockStorage.ref).toBeDefined();
  });
});