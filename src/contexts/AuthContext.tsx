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
    createdAt: undefined,
    updatedAt: undefined,
    role: 'user' as const
  };

  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    if (userData) {
      return {
        ...baseUser,
        createdAt: userData.createdAt || undefined,
        updatedAt: userData.updatedAt || undefined,
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
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
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

    // Firebase authentication avec persistance
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!mounted) return;
        
        try {
          const mappedUser = firebaseUser ? await mapFirebaseUser(firebaseUser) : null;
          setUser(mappedUser);
          // 🔧 CORRECTION: Logs seulement en développement
          if (import.meta.env.DEV) {
            console.log('🔐 État d\'authentification Firebase:', mappedUser ? 'Connecté' : 'Déconnecté');
            if (mappedUser) {
              console.log('👤 Utilisateur connecté:', mappedUser.displayName || mappedUser.email);
            }
          }
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
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('🔑 Tentative de connexion Firebase pour:', email);
      }
      await firebaseSignIn(email, password);
      if (import.meta.env.DEV) {
        console.log('✅ Connexion Firebase réussie');
      }
      // onAuthStateChanged se chargera de la mise à jour de l'état
    } catch (err: any) {
      console.error('❌ Erreur de connexion Firebase:', err);
      let errorMessage = 'Échec de la connexion';
      if (err.code === 'auth/invalid-credentials' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = 'Email ou mot de passe invalide';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.';
      } else if (err.code === 'auth/configuration-not-found') {
        errorMessage = 'Erreur de configuration Firebase. Vérifiez votre connexion.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Erreur de réseau. Vérifiez votre connexion internet.';
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
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('📝 Création de compte Firebase pour:', email);
      }
      const user = await firebaseSignUp(email, password, displayName);
      
      // Ajouter les données supplémentaires dans Firestore
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
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('✅ Compte Firebase créé avec succès');
      }
      // onAuthStateChanged se chargera de la mise à jour de l'état
    } catch (err: any) {
      console.error('❌ Erreur de création de compte Firebase:', err);
      let errorMessage = 'Échec de la création du compte';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      }
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('🚪 Déconnexion Firebase');
      }
      await firebaseSignOut();
      if (import.meta.env.DEV) {
        console.log('✅ Déconnexion réussie');
      }
      // onAuthStateChanged se chargera de la mise à jour de l'état
    } catch (err: any) {
      console.error('❌ Erreur de déconnexion:', err);
      setError(err.message || 'Échec de la déconnexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('🔄 Reset mot de passe Firebase pour:', email);
      }
      await firebaseResetPassword(email);
      if (import.meta.env.DEV) {
        console.log('✅ Email de reset envoyé');
      }
    } catch (err: any) {
      console.error('❌ Erreur reset mot de passe:', err);
      let errorMessage = 'Échec de l\'envoi de l\'email de réinitialisation';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('📧 Vérification email Firebase pour:', auth.currentUser.email);
      }
      await sendEmailVerification(auth.currentUser);
      if (import.meta.env.DEV) {
        console.log('✅ Email de vérification envoyé');
      }
    } catch (err: any) {
      console.error('❌ Erreur vérification email:', err);
      setError(err.message || 'Échec de l\'envoi de l\'email de vérification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!auth.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('🔑 Mise à jour mot de passe Firebase pour:', auth.currentUser.email);
      }
      await updateUserPassword(auth.currentUser, newPassword);
      if (import.meta.env.DEV) {
        console.log('✅ Mot de passe mis à jour');
      }
    } catch (err: any) {
      console.error('❌ Erreur mise à jour mot de passe:', err);
      setError(err.message || 'Échec de la mise à jour du mot de passe');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    if (!user || !auth.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('👤 Mise à jour profil Firebase pour:', user.email);
      }
      await updateUserProfile(auth.currentUser, profile);
      await setDoc(doc(db, 'users', user.uid), 
        { 
          ...profile,
          updatedAt: Timestamp.now()
        }, 
        { merge: true }
      );
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('✅ Profil mis à jour');
      }
    } catch (err: any) {
      console.error('❌ Erreur mise à jour profil:', err);
      setError(err.message || 'Échec de la mise à jour du profil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) {
      throw new Error('Aucun utilisateur connecté');
    }
    try {
      setError(null);
      setLoading(true);
      
      // 🔧 CORRECTION: Logs seulement en développement
      if (import.meta.env.DEV) {
        console.log('🗑️ Suppression compte Firebase pour:', auth.currentUser.email);
      }
      await deleteUserAccount(auth.currentUser);
      if (import.meta.env.DEV) {
        console.log('✅ Compte supprimé');
      }
    } catch (err: any) {
      console.error('❌ Erreur suppression compte:', err);
      setError(err.message || 'Échec de la suppression du compte');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

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