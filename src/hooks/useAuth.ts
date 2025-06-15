/**
 * 🔐 HOOK D'AUTHENTIFICATION
 * Gestion de l'état d'authentification et des permissions
 */

import { useState, useEffect, useContext, createContext } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthUser extends User {
  role?: string;
  permissions?: string[];
  mfaVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ici vous pouvez enrichir l'utilisateur avec des données supplémentaires
        const authUser: AuthUser = {
          ...firebaseUser,
          role: 'admin', // À récupérer depuis Firestore
          permissions: ['*'], // À récupérer depuis Firestore
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

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
