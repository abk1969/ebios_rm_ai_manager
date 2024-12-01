import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import credentials from '../../firebase-credentials.json';

const app = initializeApp({
  credential: cert(credentials as any),
});

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

export default app;