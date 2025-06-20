/**
 * 🗄️ ADAPTATEURS DE STOCKAGE POUR DONNÉES FORMATION
 * Implémentations pour LocalStorage, IndexedDB, Firebase, etc.
 */

import { StorageAdapter } from '../../domain/services/UnifiedDataManager';

/**
 * 🌐 ADAPTATEUR LOCALSTORAGE
 * Pour stockage local navigateur
 */
export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'ebios_training_') {
    this.prefix = prefix;
  }

  async get(key: string): Promise<any> {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`❌ LocalStorage get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`❌ LocalStorage set error for key ${key}:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.prefix + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`❌ LocalStorage remove error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.keys();
      for (const key of keys) {
        await this.remove(key);
      }
    } catch (error) {
      console.error('❌ LocalStorage clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
      return keys;
    } catch (error) {
      console.error('❌ LocalStorage keys error:', error);
      return [];
    }
  }
}

/**
 * 🗃️ ADAPTATEUR INDEXEDDB
 * Pour stockage local avancé avec support offline
 */
export class IndexedDBAdapter implements StorageAdapter {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string = 'EbiosTrainingDB', storeName: string = 'training_data', version: number = 1) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async get(key: string): Promise<any> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
      });
    } catch (error) {
      console.error(`❌ IndexedDB get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.put({
          key,
          value,
          timestamp: new Date().toISOString()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error(`❌ IndexedDB set error for key ${key}:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error(`❌ IndexedDB remove error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('❌ IndexedDB clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result as string[]);
      });
    } catch (error) {
      console.error('❌ IndexedDB keys error:', error);
      return [];
    }
  }
}

/**
 * 🔥 ADAPTATEUR FIREBASE
 * Pour stockage cloud avec synchronisation temps réel
 */
export class FirebaseAdapter implements StorageAdapter {
  private firestore: any; // Type Firebase Firestore
  private collection: string;
  private userId: string;

  constructor(firestore: any, userId: string, collection: string = 'training_sessions') {
    this.firestore = firestore;
    this.collection = collection;
    this.userId = userId;
  }

  async get(key: string): Promise<any> {
    try {
      const docRef = this.firestore.collection(this.collection).doc(`${this.userId}_${key}`);
      const doc = await docRef.get();
      
      if (doc.exists) {
        const data = doc.data();
        return data.value;
      }
      return null;
    } catch (error) {
      console.error(`❌ Firebase get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collection).doc(`${this.userId}_${key}`);
      await docRef.set({
        key,
        value,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        lastModified: new Date()
      });
    } catch (error) {
      console.error(`❌ Firebase set error for key ${key}:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const docRef = this.firestore.collection(this.collection).doc(`${this.userId}_${key}`);
      await docRef.delete();
    } catch (error) {
      console.error(`❌ Firebase remove error for key ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collection)
        .where('userId', '==', this.userId)
        .get();
      
      const batch = this.firestore.batch();
      querySnapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('❌ Firebase clear error:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const querySnapshot = await this.firestore
        .collection(this.collection)
        .where('userId', '==', this.userId)
        .get();
      
      return querySnapshot.docs.map((doc: any) => doc.data().key);
    } catch (error) {
      console.error('❌ Firebase keys error:', error);
      return [];
    }
  }
}

/**
 * 💾 ADAPTATEUR MÉMOIRE
 * Pour tests et développement
 */
export class MemoryAdapter implements StorageAdapter {
  private storage: Map<string, any> = new Map();

  async get(key: string): Promise<any> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: any): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

/**
 * 🔄 ADAPTATEUR HYBRIDE
 * Combine plusieurs adaptateurs avec fallback
 */
export class HybridAdapter implements StorageAdapter {
  private primary: StorageAdapter;
  private fallback: StorageAdapter;

  constructor(primary: StorageAdapter, fallback: StorageAdapter) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async get(key: string): Promise<any> {
    try {
      const result = await this.primary.get(key);
      if (result !== null) return result;
      
      // Fallback si primary ne retourne rien
      return await this.fallback.get(key);
    } catch (error) {
      console.warn(`⚠️ Primary storage failed for get ${key}, using fallback:`, error);
      return await this.fallback.get(key);
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.primary.set(key, value);
      // Sync vers fallback en arrière-plan
      this.fallback.set(key, value).catch(err => 
        console.warn('⚠️ Fallback sync failed:', err)
      );
    } catch (error) {
      console.warn(`⚠️ Primary storage failed for set ${key}, using fallback:`, error);
      await this.fallback.set(key, value);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await this.primary.remove(key);
      this.fallback.remove(key).catch(err => 
        console.warn('⚠️ Fallback remove failed:', err)
      );
    } catch (error) {
      console.warn(`⚠️ Primary storage failed for remove ${key}, using fallback:`, error);
      await this.fallback.remove(key);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.primary.clear();
      this.fallback.clear().catch(err => 
        console.warn('⚠️ Fallback clear failed:', err)
      );
    } catch (error) {
      console.warn('⚠️ Primary storage failed for clear, using fallback:', error);
      await this.fallback.clear();
    }
  }

  async keys(): Promise<string[]> {
    try {
      return await this.primary.keys();
    } catch (error) {
      console.warn('⚠️ Primary storage failed for keys, using fallback:', error);
      return await this.fallback.keys();
    }
  }
}

/**
 * 🏭 FACTORY POUR CRÉER ADAPTATEURS
 */
export class StorageAdapterFactory {
  static createAdapter(type: 'localStorage' | 'indexedDB' | 'firebase' | 'memory' | 'hybrid', options?: any): StorageAdapter {
    switch (type) {
      case 'localStorage':
        return new LocalStorageAdapter(options?.prefix);
      
      case 'indexedDB':
        return new IndexedDBAdapter(options?.dbName, options?.storeName, options?.version);
      
      case 'firebase':
        if (!options?.firestore || !options?.userId) {
          throw new Error('Firebase adapter requires firestore and userId');
        }
        return new FirebaseAdapter(options.firestore, options.userId, options.collection);
      
      case 'memory':
        return new MemoryAdapter();
      
      case 'hybrid':
        if (!options?.primary || !options?.fallback) {
          throw new Error('Hybrid adapter requires primary and fallback adapters');
        }
        return new HybridAdapter(options.primary, options.fallback);
      
      default:
        throw new Error(`Unknown adapter type: ${type}`);
    }
  }

  static createRecommendedAdapter(userId?: string, firestore?: any): StorageAdapter {
    // Configuration recommandée selon l'environnement
    if (typeof window === 'undefined') {
      // Environnement serveur
      return new MemoryAdapter();
    }

    // Environnement navigateur
    const hasIndexedDB = 'indexedDB' in window;
    const hasLocalStorage = 'localStorage' in window;

    if (firestore && userId) {
      // Firebase + IndexedDB pour offline
      const firebase = new FirebaseAdapter(firestore, userId);
      const indexedDB = hasIndexedDB ? new IndexedDBAdapter() : new LocalStorageAdapter();
      return new HybridAdapter(firebase, indexedDB);
    }

    if (hasIndexedDB) {
      // IndexedDB + LocalStorage fallback
      const indexedDB = new IndexedDBAdapter();
      const localStorage = hasLocalStorage ? new LocalStorageAdapter() : new MemoryAdapter();
      return new HybridAdapter(indexedDB, localStorage);
    }

    if (hasLocalStorage) {
      return new LocalStorageAdapter();
    }

    // Fallback mémoire
    return new MemoryAdapter();
  }
}
