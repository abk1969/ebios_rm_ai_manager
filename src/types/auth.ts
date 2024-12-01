import type { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  company?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  role?: 'user' | 'admin';
  isActive?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignUpCredentials extends Omit<SignInCredentials, 'remember'> {
  displayName?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin';
}

export interface AuthError {
  code: string;
  message: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
}