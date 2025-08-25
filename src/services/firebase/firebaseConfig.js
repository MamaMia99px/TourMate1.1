import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment } from '../../config/environment';
import { ErrorHandler } from '../../utils/ErrorHandler';

// Validate Firebase configuration
if (!Environment.isConfigurationValid()) {
  throw new Error('Firebase configuration is invalid. Please check your environment variables.');
}

// Firebase configuration from environment variables
const firebaseConfig = Environment.FIREBASE_CONFIG;

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  ErrorHandler.logError(error, 'Firebase App Initialization');
  throw new Error('Failed to initialize Firebase app: ' + error.message);
}

// Initialize Firebase Authentication with AsyncStorage persistence
let auth;
try {
  // Check if AsyncStorage is available before using persistence
  if (AsyncStorage && getReactNativePersistence) {
    const persistence = getReactNativePersistence(AsyncStorage);
    if (persistence) {
      auth = initializeAuth(app, {
        persistence: persistence
      });
      console.log('Firebase Auth initialized with persistence');
    } else {
      console.warn('React Native persistence not available, using default auth');
      auth = initializeAuth(app);
    }
  } else {
    console.warn('AsyncStorage not available, using default auth');
    auth = initializeAuth(app);
  }
} catch (error) {
  // If initializeAuth fails (e.g., already initialized), get the existing auth instance
  console.log('Auth already initialized or failed, using existing instance:', error.message);
  try {
    auth = getAuth(app);
  } catch (getAuthError) {
    ErrorHandler.logError(getAuthError, 'Firebase Auth Fallback');
    // Fallback to basic auth initialization
    auth = initializeAuth(app);
  }
}

// Initialize Cloud Firestore with error handling
let db;
try {
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  ErrorHandler.logError(error, 'Firestore Initialization');
  throw new Error('Failed to initialize Firestore: ' + error.message);
}

// Initialize Firebase Storage with error handling
let storage;
try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  ErrorHandler.logError(error, 'Firebase Storage Initialization');
  throw new Error('Failed to initialize Firebase Storage: ' + error.message);
}

export { auth, db, storage, app }; 