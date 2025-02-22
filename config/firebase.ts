// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import Constants from 'expo-constants';

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const config = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId,
    measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId
  };

  const missingKeys = Object.entries(config)
    .filter(([key, value]) => !value && key !== 'measurementId') // measurementId is optional
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase configuration keys: ${missingKeys.join(', ')}. ` +
      'Make sure your environment variables are properly configured in app.config.js'
    );
  }

  return config;
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = validateFirebaseConfig();

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize Analytics conditionally
let analytics: Analytics | null = null;

// Function to initialize analytics
const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.log('Firebase Analytics is not supported in this environment');
    }
  } catch (error) {
    console.log('Failed to initialize Firebase Analytics:', error);
  }
};

// Initialize analytics without blocking
initializeAnalytics().catch(console.error);

// Initialize Firestore
let db;
try {
  db = getFirestore(app);
} catch (error) {
  console.error('Error initializing Firestore:', error);
  throw error;
}

// Helper function to safely access analytics
const getAnalyticsInstance = () => analytics;

export { db, getAnalyticsInstance };


