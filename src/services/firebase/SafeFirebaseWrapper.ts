/**
 * 🏠 FICHIER ADAPTÉ POUR MODE LOCAL EBIOS
 * Firebase remplacé par système PostgreSQL local
 * Modifié automatiquement par fix-firebase-imports-v2.cjs
 */

/**
 * 🛡️ WRAPPER SÉCURISÉ POUR LES SERVICES FIREBASE - DÉSACTIVÉ
 * Mode local uniquement
 */

// 🛡️ FONCTION UTILITAIRE - DÉSACTIVÉE
export const safeFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string
): Promise<T> => {
  console.warn(`🏠 Mode local - ${operationName} ignorée, utilisation de la valeur par défaut`);
  return fallbackValue;
};

// 🎯 WRAPPERS SPÉCIFIQUES - DÉSACTIVÉS
export const safeGetCollection = async <T>(
  collectionName: string,
  missionId: string,
  operation: () => Promise<T[]>
): Promise<T[]> => {
  console.warn(`🏠 Mode local - Collection ${collectionName} ignorée`);
  return [];
};

export const safeCreateDocument = async <T>(
  collectionName: string,
  data: any,
  operation: () => Promise<T>
): Promise<T | null> => {
  console.warn(`🏠 Mode local - Création document dans ${collectionName} ignorée`);
  return null;
};

export const safeUpdateDocument = async <T>(
  collectionName: string,
  docId: string,
  operation: () => Promise<T>
): Promise<T | null> => {
  console.warn(`🏠 Mode local - Mise à jour document ${docId} dans ${collectionName} ignorée`);
  return null;
};

export const safeDeleteDocument = async (
  collectionName: string,
  docId: string,
  operation: () => Promise<void>
): Promise<void> => {
  console.warn(`🏠 Mode local - Suppression document ${docId} dans ${collectionName} ignorée`);
};

// 🔄 FACTORY POUR CRÉER DES SERVICES FIREBASE SÉCURISÉS - DÉSACTIVÉ
export const createSafeFirebaseService = <T>(collectionName: string) => {
  return {
    getAll: async (missionId: string): Promise<T[]> => {
      console.warn(`🏠 Mode local - Service Firebase pour ${collectionName} désactivé`);
      return [];
    },

    create: async (data: Omit<T, 'id'>): Promise<T | null> => {
      console.warn(`🏠 Mode local - Service Firebase pour ${collectionName} désactivé`);
      return null;
    },

    update: async (id: string, data: Partial<T>): Promise<T | null> => {
      console.warn(`🏠 Mode local - Service Firebase pour ${collectionName} désactivé`);
      return null;
    },

    delete: async (id: string): Promise<void> => {
      console.warn(`🏠 Mode local - Service Firebase pour ${collectionName} désactivé`);
    }
  };
};

// 🚨 FIREBASE COMPLÈTEMENT DÉSACTIVÉ
console.warn('🚨 SafeFirebaseWrapper désactivé - Mode local uniquement');