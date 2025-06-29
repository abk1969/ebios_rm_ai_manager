/**
 * 🔐 GESTIONNAIRE DE CLÉS DE CHIFFREMENT ROBUSTE
 * Architecture sécurisée pour la gestion des clés de chiffrement
 */

export interface KeyValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  keyLength: number;
  keyStrength: 'weak' | 'medium' | 'strong';
}

export interface EncryptionKey {
  bytes: Uint8Array;
  hex: string;
  algorithm: string;
  createdAt: Date;
  isDefault: boolean;
}

/**
 * Gestionnaire centralisé des clés de chiffrement
 */
export class KeyManager {
  private static instance: KeyManager;
  private keys: Map<string, EncryptionKey> = new Map();

  private constructor() {}

  public static getInstance(): KeyManager {
    if (!KeyManager.instance) {
      KeyManager.instance = new KeyManager();
    }
    return KeyManager.instance;
  }

  /**
   * Génère une clé de chiffrement sécurisée de 256 bits
   */
  public generateSecureKey(): EncryptionKey {
    const keyBytes = new Uint8Array(32); // 256 bits
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Utilisation de l'API Web Crypto pour la génération sécurisée
      crypto.getRandomValues(keyBytes);
    } else {
      // Fallback pour les environnements sans Web Crypto
      console.warn('⚠️ Web Crypto API non disponible, utilisation d\'un générateur moins sécurisé');
      for (let i = 0; i < keyBytes.length; i++) {
        keyBytes[i] = Math.floor(Math.random() * 256);
      }
    }

    const hex = Array.from(keyBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      bytes: keyBytes,
      hex,
      algorithm: 'AES-256-GCM',
      createdAt: new Date(),
      isDefault: false
    };
  }

  /**
   * Crée une clé de développement déterministe
   */
  public createDevelopmentKey(): EncryptionKey {
    // Clé de développement déterministe mais sécurisée
    const seed = 'EBIOS_AI_MANAGER_DEV_KEY_2025';
    const keyBytes = new Uint8Array(32);
    
    // Génération déterministe basée sur le seed
    for (let i = 0; i < 32; i++) {
      let hash = 0;
      const str = seed + i.toString();
      for (let j = 0; j < str.length; j++) {
        const char = str.charCodeAt(j);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      keyBytes[i] = Math.abs(hash) % 256;
    }

    const hex = Array.from(keyBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return {
      bytes: keyBytes,
      hex,
      algorithm: 'AES-256-GCM',
      createdAt: new Date(),
      isDefault: true
    };
  }

  /**
   * Valide une clé de chiffrement hexadécimale
   */
  public validateHexKey(hexKey: string): KeyValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de base
    if (!hexKey) {
      errors.push('Clé de chiffrement vide');
      return {
        isValid: false,
        errors,
        warnings,
        keyLength: 0,
        keyStrength: 'weak'
      };
    }

    // Validation du format hexadécimal
    if (!/^[0-9a-fA-F]+$/.test(hexKey)) {
      errors.push('Format hexadécimal invalide (caractères non-hex détectés)');
    }

    // Validation de la longueur
    const keyLength = hexKey.length;
    if (keyLength % 2 !== 0) {
      errors.push('Longueur hexadécimale invalide (doit être paire)');
    }

    const byteLength = keyLength / 2;
    
    // Validation de la taille de clé
    if (byteLength < 16) {
      errors.push(`Clé trop courte: ${byteLength} bytes (minimum 16 bytes pour AES-128)`);
    } else if (byteLength < 24) {
      warnings.push(`Clé de 128 bits détectée, recommandation: 256 bits`);
    } else if (byteLength < 32) {
      warnings.push(`Clé de 192 bits détectée, recommandation: 256 bits`);
    } else if (byteLength > 32) {
      warnings.push(`Clé de ${byteLength * 8} bits (plus longue que nécessaire)`);
    }

    // Validation de la force de la clé
    let keyStrength: 'weak' | 'medium' | 'strong' = 'weak';
    
    if (byteLength >= 32) {
      // Analyse de l'entropie pour les clés 256 bits
      const entropy = this.calculateEntropy(hexKey);
      if (entropy > 0.9) {
        keyStrength = 'strong';
      } else if (entropy > 0.7) {
        keyStrength = 'medium';
        warnings.push('Entropie de clé modérée, considérez une régénération');
      } else {
        keyStrength = 'weak';
        errors.push('Entropie de clé faible, régénération requise');
      }
    } else if (byteLength >= 24) {
      keyStrength = 'medium';
    }

    // Détection de patterns faibles
    if (this.hasWeakPatterns(hexKey)) {
      warnings.push('Patterns répétitifs détectés dans la clé');
      if (keyStrength === 'strong') keyStrength = 'medium';
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      keyLength: byteLength,
      keyStrength
    };
  }

  /**
   * Convertit une clé hexadécimale en Uint8Array
   */
  public hexToBytes(hexKey: string): Uint8Array {
    const validation = this.validateHexKey(hexKey);
    if (!validation.isValid) {
      throw new Error(`Clé invalide: ${validation.errors.join(', ')}`);
    }

    const keyBytes = new Uint8Array(hexKey.length / 2);
    for (let i = 0; i < hexKey.length; i += 2) {
      keyBytes[i / 2] = parseInt(hexKey.substr(i, 2), 16);
    }

    return keyBytes;
  }

  /**
   * Crée une clé de chiffrement à partir d'une chaîne hex ou génère une nouvelle
   */
  public createOrGenerateKey(hexKey?: string, isDevelopment: boolean = false): EncryptionKey {
    if (hexKey) {
      const validation = this.validateHexKey(hexKey);
      
      if (!validation.isValid) {
        console.error('❌ Clé fournie invalide:', validation.errors);
        throw new Error(`Clé de chiffrement invalide: ${validation.errors.join(', ')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️ Avertissements clé de chiffrement:', validation.warnings);
      }

      return {
        bytes: this.hexToBytes(hexKey),
        hex: hexKey.toLowerCase(),
        algorithm: 'AES-256-GCM',
        createdAt: new Date(),
        isDefault: false
      };
    }

    // Génération automatique
    if (isDevelopment) {
      console.info('🔧 Génération d\'une clé de développement déterministe');
      return this.createDevelopmentKey();
    } else {
      console.info('🔐 Génération d\'une nouvelle clé sécurisée');
      return this.generateSecureKey();
    }
  }

  /**
   * Calcule l'entropie d'une chaîne hexadécimale
   */
  private calculateEntropy(hexString: string): number {
    const frequency: { [key: string]: number } = {};
    
    // Compter la fréquence de chaque caractère
    for (const char of hexString.toLowerCase()) {
      frequency[char] = (frequency[char] || 0) + 1;
    }

    // Calculer l'entropie de Shannon
    const length = hexString.length;
    let entropy = 0;

    for (const count of Object.values(frequency)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }

    // Normaliser par l'entropie maximale possible (log2(16) pour hex)
    return entropy / Math.log2(16);
  }

  /**
   * Détecte les patterns faibles dans une clé
   */
  private hasWeakPatterns(hexKey: string): boolean {
    const key = hexKey.toLowerCase();
    
    // Détection de répétitions
    const patterns = [
      /(.{2})\1{3,}/, // Répétition de 2 caractères 4+ fois
      /(.{4})\1{2,}/, // Répétition de 4 caractères 3+ fois
      /(0{8,})|(f{8,})/, // Séquences de 0 ou F
      /0123456789abcdef/, // Séquence croissante
      /fedcba9876543210/, // Séquence décroissante
    ];

    return patterns.some(pattern => pattern.test(key));
  }

  /**
   * Stocke une clé avec un identifiant
   */
  public storeKey(id: string, key: EncryptionKey): void {
    this.keys.set(id, key);
  }

  /**
   * Récupère une clé stockée
   */
  public getKey(id: string): EncryptionKey | undefined {
    return this.keys.get(id);
  }

  /**
   * Supprime une clé stockée
   */
  public removeKey(id: string): boolean {
    return this.keys.delete(id);
  }

  /**
   * Liste toutes les clés stockées (sans exposer les données sensibles)
   */
  public listKeys(): Array<{ id: string; algorithm: string; createdAt: Date; isDefault: boolean }> {
    return Array.from(this.keys.entries()).map(([id, key]) => ({
      id,
      algorithm: key.algorithm,
      createdAt: key.createdAt,
      isDefault: key.isDefault
    }));
  }
}
