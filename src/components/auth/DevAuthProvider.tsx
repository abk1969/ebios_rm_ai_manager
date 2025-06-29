/**
 * 🧪 PROVIDER D'AUTHENTIFICATION DE DÉVELOPPEMENT
 * Contourne l'authentification Firebase pour les tests locaux
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { AuthUser, AuthContextType } from './AuthProvider';

// Context pour l'authentification de développement
const DevAuthContext = createContext<AuthContextType | null>(null);

export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (!context) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
};

interface DevAuthProviderProps {
  children: React.ReactNode;
}

export const DevAuthProvider: React.FC<DevAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un délai d'authentification
    const timer = setTimeout(() => {
      // Créer un utilisateur de test automatiquement
      const devUser: AuthUser = {
        uid: 'dev-user-123',
        email: 'dev@ebios.local',
        displayName: 'Développeur Test',
        photoURL: null,
        role: 'admin',
        permissions: ['*'],
        organization: 'CHU Métropolitain (Dev)',
        mfaVerified: true
      };
      
      setUser(devUser);
      setLoading(false);
      
      console.log('🧪 Mode développement - Utilisateur automatiquement connecté:', devUser);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    // Simuler une connexion réussie
    console.log('🧪 Mode dev - Simulation de connexion pour:', credentials.email);
    
    const devUser: AuthUser = {
      uid: 'dev-user-' + Date.now(),
      email: credentials.email,
      displayName: 'Utilisateur Dev',
      photoURL: null,
      role: 'admin',
      permissions: ['*'],
      organization: 'CHU Métropolitain (Dev)',
      mfaVerified: true
    };
    
    setUser(devUser);
    return Promise.resolve();
  };

  const signOut = async () => {
    console.log('🧪 Mode dev - Déconnexion simulée');
    setUser(null);
    return Promise.resolve();
  };

  return (
    <DevAuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </DevAuthContext.Provider>
  );
};

export default DevAuthProvider;
