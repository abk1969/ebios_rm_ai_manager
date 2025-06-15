/**
 * 🔒 SERVICE DE CHIFFREMENT
 * Chiffrement AES-256-GCM au repos et en transit, gestion des clés
 */

import * as crypto from 'crypto';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecureLogger } from '@/services/logging/SecureLogger';

export interface EncryptionConfig {
  atRest: {
    algorithm: string;
    keyRotationDays: number;
    backupEncryption: boolean;
  };
  inTransit: {
    tlsVersion: string;
    cipherSuites: string[];
    hsts: {
      maxAge: number;
      includeSubDomains: boolean;
      preload: boolean;
    };
  };
  sensitiveData: {
    fields: string[];
    algorithm: string;
    keyDerivation: string;
  };
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
  keyId: string;
  algorithm: string;
  timestamp: string;
}

export interface KeyMetadata {
  id: string;
  algorithm: string;
  createdAt: Date;
  rotatedAt?: Date;
  status: 'active' | 'rotating' | 'deprecated' | 'revoked';
  usage: number;
}

export class EncryptionService {
  private logger = SecureLogger.getInstance();
  private config: EncryptionConfig;
  private keyCache = new Map<string, Buffer>();
  private keyMetadata = new Map<string, KeyMetadata>();
  private masterKey?: Buffer;

  constructor(config: EncryptionConfig) {
    this.config = config;

    try {
      this.initializeMasterKey();
    } catch (error) {
      console.error('⚠️ Erreur lors de l\'initialisation du chiffrement:', error);
      console.warn('🔓 Le chiffrement sera désactivé pour cette session');
      // Ne pas bloquer l'application, continuer sans chiffrement
    }

    this.startKeyRotationScheduler();
  }

  // 🔑 INITIALISATION DE LA CLÉ MAÎTRE
  private initializeMasterKey(): void {
    const masterKeyHex = import.meta.env.VITE_MASTER_ENCRYPTION_KEY;

    // En mode développement, désactiver le chiffrement par défaut
    if (import.meta.env.DEV && !masterKeyHex) {
      console.warn('🔓 Mode développement: Chiffrement désactivé');
      this.masterKey = undefined;
      return;
    }

    if (!masterKeyHex) {
      console.warn('⚠️ VITE_MASTER_ENCRYPTION_KEY non définie, chiffrement désactivé');
      this.masterKey = undefined;
      return;
    }

    try {
      this.masterKey = Buffer.from(masterKeyHex, 'hex');
      if (this.masterKey.length !== 32) {
        throw new Error('La clé maître doit faire 256 bits (32 bytes)');
      }

      this.logger.info('Service de chiffrement initialisé', {
        algorithm: this.config.atRest.algorithm,
        keyRotationDays: this.config.atRest.keyRotationDays
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la clé maître:', error);
      this.masterKey = undefined;
    }
  }

  // 🔒 CHIFFREMENT DES DONNÉES
  public async encrypt(data: any, userId?: string): Promise<string> {
    try {
      // Vérifier si le chiffrement est disponible
      if (!this.masterKey) {
        console.warn('🔓 Chiffrement non disponible, retour des données en base64');
        const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
        return Buffer.from(plaintext, 'utf8').toString('base64');
      }

      const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
      const keyId = await this.getCurrentKeyId(userId);
      const key = await this.getOrCreateKey(keyId);

      // Générer un IV aléatoire
      const iv = crypto.randomBytes(12); // 96 bits pour GCM

      // Chiffrer les données
      const cipher = crypto.createCipherGCM('aes-256-gcm');
      cipher.setAAD(Buffer.from(keyId)); // Données authentifiées additionnelles
      
      let encrypted = cipher.update(plaintext, 'utf8');
      cipher.final();
      
      const tag = cipher.getAuthTag();

      const encryptedData: EncryptedData = {
        data: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        keyId,
        algorithm: 'aes-256-gcm',
        timestamp: new Date().toISOString()
      };

      // Incrémenter l'usage de la clé
      await this.incrementKeyUsage(keyId);

      return Buffer.from(JSON.stringify(encryptedData)).toString('base64');

    } catch (error) {
      this.logger.error('Erreur lors du chiffrement', {
        userId,
        error: error.message
      });
      throw new Error('Échec du chiffrement des données');
    }
  }

  // 🔓 DÉCHIFFREMENT DES DONNÉES
  public async decrypt(encryptedDataString: string, userId?: string): Promise<any> {
    try {
      // Vérifier si le chiffrement est disponible
      if (!this.masterKey) {
        console.warn('🔓 Chiffrement non disponible, décodage base64 simple');
        try {
          return Buffer.from(encryptedDataString, 'base64').toString('utf8');
        } catch {
          // Si ce n'est pas du base64 valide, retourner tel quel
          return encryptedDataString;
        }
      }

      const encryptedData: EncryptedData = JSON.parse(
        Buffer.from(encryptedDataString, 'base64').toString('utf8')
      );

      const key = await this.getKey(encryptedData.keyId);
      if (!key) {
        throw new Error('Clé de déchiffrement introuvable');
      }

      // Reconstituer les composants
      const iv = Buffer.from(encryptedData.iv, 'base64');
      const tag = Buffer.from(encryptedData.tag, 'base64');
      const encrypted = Buffer.from(encryptedData.data, 'base64');

      // Déchiffrer les données
      const decipher = crypto.createDecipherGCM('aes-256-gcm');
      decipher.setAAD(Buffer.from(encryptedData.keyId));
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encrypted);
      decipher.final();

      const plaintext = decrypted.toString('utf8');

      // Tenter de parser en JSON, sinon retourner la chaîne
      try {
        return JSON.parse(plaintext);
      } catch {
        return plaintext;
      }

    } catch (error) {
      this.logger.error('Erreur lors du déchiffrement', {
        userId,
        error: error.message
      });
      throw new Error('Échec du déchiffrement des données');
    }
  }

  // 🔐 CHIFFREMENT DES CHAMPS SENSIBLES
  public async encryptSensitiveFields(data: any, userId?: string): Promise<any> {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const result = { ...data };
    const sensitiveFields = this.config.sensitiveData.fields;

    for (const field of sensitiveFields) {
      if (result[field] !== undefined && result[field] !== null) {
        result[field] = await this.encrypt(result[field], userId);
      }
    }

    // Traitement récursif pour les objets imbriqués
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = await this.encryptSensitiveFields(value, userId);
      }
    }

    return result;
  }

  // 🔓 DÉCHIFFREMENT DES CHAMPS SENSIBLES
  public async decryptSensitiveFields(data: any, userId?: string): Promise<any> {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const result = { ...data };
    const sensitiveFields = this.config.sensitiveData.fields;

    for (const field of sensitiveFields) {
      if (result[field] && typeof result[field] === 'string') {
        try {
          result[field] = await this.decrypt(result[field], userId);
        } catch (error) {
          this.logger.warn('Impossible de déchiffrer le champ', {
            field,
            userId,
            error: error.message
          });
        }
      }
    }

    // Traitement récursif pour les objets imbriqués
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = await this.decryptSensitiveFields(value, userId);
      }
    }

    return result;
  }

  // 🔑 GESTION DES CLÉS
  private async getCurrentKeyId(userId?: string): Promise<string> {
    const prefix = userId ? `user_${userId}` : 'global';
    return `${prefix}_${Date.now()}`;
  }

  private async getOrCreateKey(keyId: string): Promise<Buffer> {
    // Vérifier le cache
    if (this.keyCache.has(keyId)) {
      return this.keyCache.get(keyId)!;
    }

    // Vérifier en base de données
    let key = await this.getKey(keyId);
    
    if (!key) {
      // Créer une nouvelle clé
      key = await this.createKey(keyId);
    }

    // Mettre en cache
    this.keyCache.set(keyId, key);
    return key;
  }

  private async createKey(keyId: string): Promise<Buffer> {
    try {
      // Générer une clé dérivée à partir de la clé maître
      const key = crypto.pbkdf2Sync(this.masterKey, keyId, 100000, 32, 'sha256');

      // Stocker les métadonnées de la clé
      const metadata: KeyMetadata = {
        id: keyId,
        algorithm: 'aes-256-gcm',
        createdAt: new Date(),
        status: 'active',
        usage: 0
      };

      await setDoc(doc(db, 'encryption_keys', keyId), {
        ...metadata,
        keyHash: crypto.createHash('sha256').update(key).digest('hex')
      });

      this.keyMetadata.set(keyId, metadata);

      this.logger.info('Nouvelle clé de chiffrement créée', {
        keyId,
        algorithm: metadata.algorithm
      });

      return key;

    } catch (error) {
      this.logger.error('Erreur lors de la création de clé', {
        keyId,
        error: error.message
      });
      throw error;
    }
  }

  private async getKey(keyId: string): Promise<Buffer | null> {
    try {
      // Vérifier le cache
      if (this.keyCache.has(keyId)) {
        return this.keyCache.get(keyId)!;
      }

      // Vérifier en base de données
      const keyDoc = await getDoc(doc(db, 'encryption_keys', keyId));
      if (!keyDoc.exists()) {
        return null;
      }

      const keyData = keyDoc.data();
      if (keyData.status === 'revoked') {
        throw new Error('Clé révoquée');
      }

      // Régénérer la clé à partir de la clé maître
      const key = crypto.pbkdf2Sync(this.masterKey, keyId, 100000, 32, 'sha256');

      // Vérifier l'intégrité
      const keyHash = crypto.createHash('sha256').update(key).digest('hex');
      if (keyHash !== keyData.keyHash) {
        throw new Error('Intégrité de la clé compromise');
      }

      // Mettre en cache
      this.keyCache.set(keyId, key);
      return key;

    } catch (error) {
      this.logger.error('Erreur lors de la récupération de clé', {
        keyId,
        error: error.message
      });
      return null;
    }
  }

  private async incrementKeyUsage(keyId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'encryption_keys', keyId), {
        usage: (this.keyMetadata.get(keyId)?.usage || 0) + 1,
        lastUsed: new Date()
      });

      const metadata = this.keyMetadata.get(keyId);
      if (metadata) {
        metadata.usage++;
        this.keyMetadata.set(keyId, metadata);
      }

    } catch (error) {
      this.logger.warn('Impossible de mettre à jour l\'usage de la clé', {
        keyId,
        error: error.message
      });
    }
  }

  // 🔄 ROTATION DES CLÉS
  public async rotateKeys(): Promise<void> {
    try {
      this.logger.info('Début de la rotation des clés');

      // Identifier les clés à faire tourner
      const keysToRotate = await this.getKeysForRotation();

      for (const keyId of keysToRotate) {
        await this.rotateKey(keyId);
      }

      this.logger.info('Rotation des clés terminée', {
        rotatedKeys: keysToRotate.length
      });

    } catch (error) {
      this.logger.error('Erreur lors de la rotation des clés', {
        error: error.message
      });
      throw error;
    }
  }

  private async getKeysForRotation(): Promise<string[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.atRest.keyRotationDays);

    const keysToRotate: string[] = [];

    for (const [keyId, metadata] of this.keyMetadata.entries()) {
      if (metadata.createdAt < cutoffDate && metadata.status === 'active') {
        keysToRotate.push(keyId);
      }
    }

    return keysToRotate;
  }

  private async rotateKey(keyId: string): Promise<void> {
    try {
      // Marquer la clé comme en cours de rotation
      await updateDoc(doc(db, 'encryption_keys', keyId), {
        status: 'rotating',
        rotationStarted: new Date()
      });

      // Créer une nouvelle clé
      const newKeyId = `${keyId}_rotated_${Date.now()}`;
      await this.createKey(newKeyId);

      // Marquer l'ancienne clé comme dépréciée
      await updateDoc(doc(db, 'encryption_keys', keyId), {
        status: 'deprecated',
        rotatedAt: new Date(),
        replacedBy: newKeyId
      });

      // Supprimer du cache
      this.keyCache.delete(keyId);

      this.logger.info('Clé rotée avec succès', {
        oldKeyId: keyId,
        newKeyId
      });

    } catch (error) {
      this.logger.error('Erreur lors de la rotation de clé', {
        keyId,
        error: error.message
      });
      throw error;
    }
  }

  // ⏰ PLANIFICATEUR DE ROTATION
  private startKeyRotationScheduler(): void {
    // Rotation quotidienne à 2h du matin
    const rotationInterval = 24 * 60 * 60 * 1000; // 24 heures
    
    setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 2) { // 2h du matin
        try {
          await this.rotateKeys();
        } catch (error) {
          this.logger.error('Erreur lors de la rotation automatique des clés', {
            error: error.message
          });
        }
      }
    }, rotationInterval);
  }

  // 🔍 VALIDATION DE L'INTÉGRITÉ
  public async validateDataIntegrity(encryptedData: string): Promise<boolean> {
    try {
      const data: EncryptedData = JSON.parse(
        Buffer.from(encryptedData, 'base64').toString('utf8')
      );

      // Vérifier la structure
      if (!data.data || !data.iv || !data.tag || !data.keyId) {
        return false;
      }

      // Vérifier que la clé existe
      const key = await this.getKey(data.keyId);
      return key !== null;

    } catch (error) {
      return false;
    }
  }

  // 📊 STATISTIQUES DE CHIFFREMENT
  public getEncryptionStats(): any {
    return {
      cachedKeys: this.keyCache.size,
      totalKeys: this.keyMetadata.size,
      algorithm: this.config.atRest.algorithm,
      keyRotationDays: this.config.atRest.keyRotationDays
    };
  }

  // 🎲 GÉNÉRATION DE CLÉ ALÉATOIRE COMPATIBLE NAVIGATEUR
  private generateRandomKey(): Buffer {
    try {
      // Essayer d'utiliser l'API Web Crypto si disponible
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return Buffer.from(array);
      }

      // Fallback pour Node.js ou environnements sans Web Crypto
      if (typeof require !== 'undefined') {
        const crypto = require('crypto');
        return crypto.randomBytes(32);
      }

      // Fallback ultime avec Math.random (moins sécurisé, pour dev uniquement)
      console.warn('⚠️ Utilisation de Math.random pour la génération de clé (développement uniquement)');
      const array = new Uint8Array(32);
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return Buffer.from(array);

    } catch (error) {
      console.error('Erreur lors de la génération de clé aléatoire:', error);
      // Fallback d'urgence
      const array = new Uint8Array(32);
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return Buffer.from(array);
    }
  }
}
