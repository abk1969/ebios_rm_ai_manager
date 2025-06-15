/**
 * 🔥 CONFIGURATION FIREBASE POUR TESTS AVEC DONNÉES RÉELLES
 * Configuration pour utiliser une vraie instance Firebase de test
 */

import { db, auth } from '@/lib/firebase';

// Utiliser la configuration Firebase existante pour les tests
// Cela évite les problèmes de permissions et utilise le vrai projet
export const testDb = db;
export const testAuth = auth;

// Configuration pour l'émulateur Firebase (développement local)
const useEmulator = process.env.NODE_ENV === 'test' && process.env.USE_FIREBASE_EMULATOR === 'true';

// Note: Émulateur non utilisé car nous utilisons la vraie base de données

/**
 * Utilitaires pour les tests avec données réelles
 */
export class FirebaseTestUtils {
  
  /**
   * Nettoie les données de test
   */
  static async cleanupTestData(): Promise<void> {
    // Cette fonction sera implémentée pour nettoyer les données de test
    // après chaque suite de tests
    console.log('🧹 Nettoyage des données de test...');
  }

  /**
   * Initialise les données de test
   */
  static async setupTestData(): Promise<void> {
    // Cette fonction sera implémentée pour créer des données de test
    // avant chaque suite de tests
    console.log('🏗️ Initialisation des données de test...');
  }

  /**
   * Vérifie la connexion Firebase (règles temporaires permettent l'accès libre)
   */
  static async checkConnection(): Promise<boolean> {
    try {
      // Test simple de connexion avec Firebase v9+ syntax
      const { doc, setDoc, deleteDoc } = await import('firebase/firestore');
      const testDocRef = doc(testDb, '_test', 'connection');
      await setDoc(testDocRef, { timestamp: new Date(), test: true });
      await deleteDoc(testDocRef);
      console.log('✅ Connexion Firebase testée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion Firebase:', error);
      return false;
    }
  }
}

export default {
  testDb,
  testAuth,
  FirebaseTestUtils
};
