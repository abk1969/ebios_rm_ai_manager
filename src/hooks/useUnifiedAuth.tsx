/**
 * 🔐 HOOK D'AUTHENTIFICATION UNIFIÉ
 * Détecte automatiquement le mode (dev/prod) et utilise le bon provider
 */

import { useContext } from 'react';
import { useAuth as useProductionAuth } from './useAuth';

// Import conditionnel du DevAuthProvider
let useDevAuth: any = null;
try {
  const devModule = require('@/components/auth/DevAuthProvider');
  useDevAuth = devModule.useDevAuth;
} catch (error) {
  // DevAuthProvider non disponible
}

export const useUnifiedAuth = () => {
  // Détecter le mode
  const isDevelopment = import.meta.env.DEV && window.location.hostname === 'localhost';
  
  if (isDevelopment && useDevAuth) {
    console.log('🧪 Utilisation de l\'authentification de développement');
    try {
      return useDevAuth();
    } catch (error) {
      console.warn('⚠️ Erreur avec DevAuth, fallback vers auth normale:', error);
      return useProductionAuth();
    }
  } else {
    console.log('🔐 Utilisation de l\'authentification Firebase');
    return useProductionAuth();
  }
};

export default useUnifiedAuth;
