import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Configuration Firebase sécurisée via variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validation de la configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Configuration Firebase incomplète. Vérifiez vos variables d\'environnement VITE_FIREBASE_*');
  throw new Error('Configuration Firebase manquante');
}

// 🔧 CORRECTION: Logs seulement en développement
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  console.log('🔥 Initialisation Firebase avec la configuration réelle');
  console.log('📊 Projet :', firebaseConfig.projectId);
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Initialiser Firebase avec la configuration officielle
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Log uniquement en développement
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
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

// Fonctions utilitaires pour gérer la connectivité
export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    console.log('🌐 Réseau Firestore activé');
    return true;
  } catch (error) {
    console.warn('⚠️ Impossible d\'activer le réseau Firestore:', error);
    return false;
  }
};

export const disableFirestoreNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('📱 Mode offline Firestore activé');
    return true;
  } catch (error) {
    console.warn('⚠️ Impossible de désactiver le réseau Firestore:', error);
    return false;
  }
};

export const checkFirebaseConnectivity = async () => {
  try {
    // Tentative de connexion simple
    const testDoc = await import('firebase/firestore').then(({ doc, getDoc }) =>
      getDoc(doc(db, 'test', 'connectivity'))
    );
    return true;
  } catch (error) {
    console.warn('⚠️ Firebase hors ligne:', error);
    return false;
  }
};