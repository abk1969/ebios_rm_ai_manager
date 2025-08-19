/**
 * 🏠 FICHIER ADAPTÉ POUR MODE LOCAL EBIOS
 * Firebase remplacé par système PostgreSQL local
 * Modifié automatiquement par fix-firebase-imports-v2.cjs
 */

/**
 * Adapter Firebase - DÉSACTIVÉ - Mode local uniquement
 * Tous les appels Firebase sont désactivés
 */
export class FirebaseAdapter {
  static async createDocument<T>(
    collectionName: string,
    data: T
  ): Promise<string> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }

  static async getDocument<T>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }

  static async updateDocument<T>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }

  static async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }

  static async getCollection<T>(
    collectionName: string,
    ...queryConstraints: any[]
  ): Promise<T[]> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }

  static async queryDocuments<T>(
    collectionName: string,
    field: string,
    operator: any,
    value: any
  ): Promise<T[]> {
    throw new Error('Firebase désactivé - utilisez le mode local uniquement');
  }
}

// 🚨 FIREBASE COMPLÈTEMENT DÉSACTIVÉ
console.warn('🚨 Firebase Adapter désactivé - Mode local uniquement');