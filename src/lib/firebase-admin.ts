import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const credentials = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  clientEmail: import.meta.env.VITE_FIREBASE_CLIENT_EMAIL,
  privateKey: import.meta.env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app = initializeApp({
  credential: cert(credentials),
});

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);