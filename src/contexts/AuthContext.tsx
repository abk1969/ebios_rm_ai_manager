import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  type User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  signIn as firebaseSignIn, 
  signOut as firebaseSignOut,
  signUp as firebaseSignUp,
  resetPassword as firebaseResetPassword,
  sendEmailVerification,
  updateUserPassword,
  updateUserProfile,
  deleteUserAccount
} from '@/services/firebase/auth';
import type { User, SignInCredentials, SignUpCredentials } from '@/types/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const baseUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    emailVerified: firebaseUser.emailVerified,
    createdAt: null,
    updatedAt: null,
    role: 'user' as const
  };

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    if (userData) {
      return {
        ...baseUser,
        createdAt: userData.createdAt?.toDate?.() || null,
        updatedAt: userData.updatedAt?.toDate?.() || null,
        role: userData.role || 'user'
      };
    }

    // If no user document exists, create one
    const newUser = {
      ...baseUser,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return {
      ...newUser,
      createdAt: newUser.createdAt.toDate(),
      updatedAt: newUser.updatedAt.toDate()
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return baseUser;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return;
        
        try {
          const mappedUser = firebaseUser ? await mapFirebaseUser(firebaseUser) : null;
          setUser(mappedUser);
        } catch (error) {
          console.error('Error mapping user:', error);
          setError('Failed to load user data');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        if (!mounted) return;
        console.error('Auth state change error:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      setError(null);
      setLoading(true);
      await firebaseSignIn(email, password);
    } catch (err: any) {
      let errorMessage = 'Failed to sign in';
      if (err.code === 'auth/invalid-credentials') {
        errorMessage = 'Email ou mot de passe invalide';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ 
    email, 
    password, 
    displayName, 
    company, 
    firstName, 
    lastName, 
    role = 'user' 
  }: SignUpCredentials) => {
    try {
      setError(null);
      setLoading(true);
      const user = await firebaseSignUp(email, password, displayName);
      
      // Store additional user data in Firestore
      const userData: Partial<User> = {
        company,
        firstName,
        lastName,
        role,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      await firebaseSignOut();
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await firebaseResetPassword(email);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!user) {
      throw new Error('No user signed in');
    }
    try {
      setError(null);
      setLoading(true);
      await sendEmailVerification(user as FirebaseUser);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) {
      throw new Error('No user signed in');
    }
    try {
      setError(null);
      setLoading(true);
      await updateUserPassword(user as FirebaseUser, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    if (!user) {
      throw new Error('No user signed in');
    }
    try {
      setError(null);
      setLoading(true);
      await updateUserProfile(user as FirebaseUser, profile);
      // Update Firestore user data
      await setDoc(doc(db, 'users', user.uid), 
        { 
          ...profile,
          updatedAt: Timestamp.now()
        }, 
        { merge: true }
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) {
      throw new Error('No user signed in');
    }
    try {
      setError(null);
      setLoading(true);
      await deleteUserAccount(user as FirebaseUser);
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyEmail,
    updatePassword,
    updateProfile,
    deleteAccount,
    clearError
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        verifyEmail,
        updatePassword,
        updateProfile,
        deleteAccount,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;