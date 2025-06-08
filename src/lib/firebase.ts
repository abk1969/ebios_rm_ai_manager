import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Configuration Firebase réelle
const firebaseConfig = {
  apiKey: "AIzaSyCN4GaNMnshiDw0Z0dgGnhmgbokVyd7LmA",
  authDomain: "ebiosdatabase.firebaseapp.com",
  projectId: "ebiosdatabase",
  storageBucket: "ebiosdatabase.firebasestorage.app",
  messagingSenderId: "1065555617003",
  appId: "1:1065555617003:web:876f78760b435289a74aae",
  measurementId: "G-WSY1EEH01H"
};

// 🔧 CORRECTION: Logs seulement en développement
if (import.meta.env.DEV) {
  console.log('🔥 Initialisation Firebase avec la configuration réelle');
  console.log('📊 Projet :', firebaseConfig.projectId);
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Initialiser Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // 🔧 CORRECTION: Logs seulement en développement
  if (import.meta.env.DEV) {
    console.log('✅ Firebase initialisé avec succès');
    console.log('🔑 Mode : Production (Firebase réel)');
  }

} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Firebase:', error);
  throw error;
}

export { app, auth, db, storage };

// Helper functions
export const isInitialized = () => {
  return !!app && !!auth && !!db && !!storage;
};

export const isProduction = () => {
  return true; // Toujours en mode production avec Firebase réel
};

export const getEnvironmentInfo = () => {
  return {
    mode: 'production',
    projectId: firebaseConfig.projectId,
    hasValidConfig: true,
    isFirebaseReal: true
  };
};