/**
 * 🔐 HOOK D'AUTHENTIFICATION
 * Hook pour accéder au contexte d'authentification
 * Séparé du composant AuthProvider pour respecter les conventions
 */

import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/auth/AuthProvider';

/**
 * 🎯 HOOK D'AUTHENTIFICATION
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


