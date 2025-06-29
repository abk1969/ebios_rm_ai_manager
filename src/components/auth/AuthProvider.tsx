/**
 * 🔐 COMPOSANT FOURNISSEUR D'AUTHENTIFICATION
 * Composant React pour la gestion de l'authentification
 * Séparé du hook useAuth pour respecter les conventions
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 🎯 TYPES
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  permissions: string[];
  organization?: string;
  mfaVerified: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

// 🎯 CONTEXTE D'AUTHENTIFICATION
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * 🎯 COMPOSANT FOURNISSEUR D'AUTHENTIFICATION
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Enrichir l'utilisateur avec des données supplémentaires
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'admin', // À récupérer depuis Firestore
          permissions: ['*'], // À récupérer depuis Firestore
          organization: 'default', // À récupérer depuis Firestore
          mfaVerified: true // À vérifier
        };
        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
