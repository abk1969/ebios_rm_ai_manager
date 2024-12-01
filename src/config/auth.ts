import { User } from '@/types/auth';

export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo123',
  uid: 'demo-user',
  displayName: 'Demo User',
};

export const getDemoUser = (): User => {
  return {
    uid: DEMO_CREDENTIALS.uid,
    email: DEMO_CREDENTIALS.email,
    displayName: DEMO_CREDENTIALS.displayName,
    photoURL: null,
    emailVerified: false
  };
};