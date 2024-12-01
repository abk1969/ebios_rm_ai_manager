import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updatePassword,
  deleteUser,
  type UserCredential,
  type User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthErrorCode = 
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/requires-recent-login'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id';

export class AuthError extends Error {
  constructor(message: string, public code?: AuthErrorCode) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleAuthError = (error: unknown): never => {
  const firebaseError = error as { code?: string; message: string };
  console.error('Auth error:', error);
  throw new AuthError(
    firebaseError.message,
    firebaseError.code as AuthErrorCode
  );
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (profileError) {
        console.warn('Failed to set display name:', profileError);
        // Continue since the account was created successfully
      }
    }
    
    return user;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    handleAuthError(error);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleAuthError(error);
  }
};

export const sendEmailVerification = async (user: User): Promise<void> => {
  try {
    await firebaseSendEmailVerification(user);
  } catch (error) {
    handleAuthError(error);
  }
};

export const updateUserPassword = async (
  user: User, 
  newPassword: string
): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    handleAuthError(error);
  }
};

export const updateUserProfile = async (
  user: User,
  profile: {
    displayName?: string | null;
    photoURL?: string | null;
  }
): Promise<void> => {
  try {
    await updateProfile(user, profile);
  } catch (error) {
    handleAuthError(error);
  }
};

export const deleteUserAccount = async (user: User): Promise<void> => {
  try {
    await deleteUser(user);
  } catch (error) {
    handleAuthError(error);
  }
};