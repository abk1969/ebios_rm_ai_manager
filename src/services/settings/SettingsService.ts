/**
 * ⚙️ SERVICE DE GESTION DES PARAMÈTRES
 * Configuration sécurisée des paramètres système et utilisateur
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecurityService } from '@/services/security/SecurityService';
import { EncryptionService } from '@/services/security/EncryptionService';
import { SecureLogger } from '@/services/logging/SecureLogger';

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  costPer1kTokens: number;
  capabilities: string[];
  isActive: boolean;
}

export interface SecuritySettings {
  mfaRequired: {
    admin: boolean;
    auditor: boolean;
    analyst: boolean;
    user: boolean;
  };
  sessionSettings: {
    maxDuration: number; // en minutes
    inactivityTimeout: number; // en minutes
    concurrentSessions: number;
    requireMfaForSensitive: boolean;
  };
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number; // en jours
    historyCount: number;
    lockoutAttempts: number;
    lockoutDuration: number; // en minutes
  };
  auditSettings: {
    enabled: boolean;
    retentionDays: number;
    realTimeAlerts: boolean;
    exportEnabled: boolean;
  };
  encryptionSettings: {
    enabled: boolean;
    algorithm: string;
    keyRotationDays: number;
    backupEncryption: boolean;
  };
  monitoringSettings: {
    enabled: boolean;
    anomalyDetection: boolean;
    alertThresholds: {
      failedLogins: number;
      suspiciousActivity: number;
      dataExfiltration: number;
    };
  };
}

export interface AISettings {
  provider: 'openrouter' | 'direct';
  selectedModel: string;
  apiKeys: {
    openrouter?: string;
    gemini?: string;
    anthropic?: string;
    mistral?: string;
    openai?: string;
  };
  modelSettings: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  fallbackModel?: string;
  rateLimiting: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface GeneralSettings {
  organizationName: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    browser: boolean;
    slack: boolean;
  };
  dataRetention: {
    missions: number; // en jours
    reports: number;
    logs: number;
  };
}

export interface AppSettings {
  general: GeneralSettings;
  security: SecuritySettings;
  ai: AISettings;
  lastUpdated: Date;
  updatedBy: string;
  version: string;
}

export class SettingsService {
  private static instance: SettingsService;
  private securityService = SecurityService.getInstance();
  private encryptionService = new EncryptionService({
    atRest: { algorithm: 'aes-256-gcm', keyRotationDays: 90, backupEncryption: true },
    inTransit: { tlsVersion: '1.3', cipherSuites: [], hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } },
    sensitiveData: { fields: ['apiKeys'], algorithm: 'aes-256-gcm', keyDerivation: 'pbkdf2' }
  });
  private logger = SecureLogger.getInstance();
  private db = db;

  private constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  // 🤖 MODÈLES LLM DISPONIBLES
  public getAvailableLLMModels(): LLMModel[] {
    return [
      {
        id: 'google/gemini-2.5-flash-preview-05-20',
        name: 'Gemini Flash 2.5',
        provider: 'Google',
        description: 'Modèle rapide et efficace pour l\'analyse EBIOS RM',
        maxTokens: 1000000,
        costPer1kTokens: 0.075,
        capabilities: ['text', 'analysis', 'reasoning'],
        isActive: true // Par défaut
      },
      {
        id: 'mistralai/mistral-large-2407',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        description: 'Modèle français avancé pour l\'analyse de risques',
        maxTokens: 128000,
        costPer1kTokens: 3.0,
        capabilities: ['text', 'analysis', 'french', 'reasoning'],
        isActive: false
      },
      {
        id: 'anthropic/claude-4-sonnet',
        name: 'Claude Sonnet 4',
        provider: 'Anthropic',
        description: 'Dernière génération Claude pour l\'analyse structurée et la conformité',
        maxTokens: 200000,
        costPer1kTokens: 3.0,
        capabilities: ['text', 'analysis', 'structured', 'compliance', 'reasoning'],
        isActive: false
      },
      {
        id: 'anthropic/claude-4-opus',
        name: 'Claude Opus 4',
        provider: 'Anthropic',
        description: 'Modèle Claude le plus avancé pour les analyses expertes complexes',
        maxTokens: 200000,
        costPer1kTokens: 15.0,
        capabilities: ['text', 'analysis', 'complex-reasoning', 'expert', 'advanced-logic'],
        isActive: false
      },
      {
        id: 'qwen/qwen-2.5-72b-instruct',
        name: 'Qwen 2.5 72B',
        provider: 'Alibaba',
        description: 'Modèle multilingue performant',
        maxTokens: 32768,
        costPer1kTokens: 0.9,
        capabilities: ['text', 'multilingual', 'analysis'],
        isActive: false
      },
      {
        id: 'deepseek/deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        description: 'Modèle optimisé pour le raisonnement logique',
        maxTokens: 64000,
        costPer1kTokens: 0.14,
        capabilities: ['text', 'reasoning', 'logic', 'analysis'],
        isActive: false
      }
    ];
  }

  // 📖 RÉCUPÉRATION DES PARAMÈTRES
  public async getSettings(): Promise<AppSettings> {
    try {
      const settingsDoc = await getDoc(doc(db, 'app_settings', 'global'));
      
      if (!settingsDoc.exists()) {
        // Créer les paramètres par défaut
        const defaultSettings = this.getDefaultSettings();
        await this.saveSettings(defaultSettings, 'system');
        return defaultSettings;
      }

      const data = settingsDoc.data() as AppSettings;

      // Déchiffrer les clés API si le chiffrement est activé
      if (data.ai.apiKeys && data.security.encryptionSettings.enabled) {
        console.log('🔓 Déchiffrement des clés API');
        data.ai.apiKeys = await this.decryptApiKeysDirectly(data.ai.apiKeys);
      } else {
        console.log('🔓 Lecture des clés API en clair');
      }

      return data;
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des paramètres', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  // 💾 SAUVEGARDE DES PARAMÈTRES
  public async saveSettings(settings: AppSettings, userId: string): Promise<void> {
    try {
      console.log('🔄 Début de la sauvegarde des paramètres', { userId });

      // Chiffrer les clés API avant sauvegarde si le chiffrement est activé
      const settingsToSave = { ...settings };
      if (settingsToSave.ai.apiKeys && settings.security.encryptionSettings.enabled) {
        console.log('🔐 Chiffrement des clés API activé');
        settingsToSave.ai.apiKeys = await this.encryptApiKeysDirectly(settingsToSave.ai.apiKeys);
      } else {
        console.log('🔓 Chiffrement des clés API désactivé');
      }

      settingsToSave.lastUpdated = new Date();
      settingsToSave.updatedBy = userId;
      settingsToSave.version = '1.0';

      await setDoc(doc(db, 'app_settings', 'global'), settingsToSave);

      // Audit de la modification
      await this.securityService.logSecurityEvent({
        type: 'system',
        action: 'settings_updated',
        userId,
        result: 'success',
        severity: 'medium',
        timestamp: new Date(),
        details: {
          sections: Object.keys(settings),
          hasApiKeys: !!settings.ai.apiKeys
        }
      });

      this.logger.info('Paramètres sauvegardés', {
        userId,
        sections: Object.keys(settings)
      });

    } catch (error) {
      this.logger.error('Erreur lors de la sauvegarde des paramètres', {
        userId,
        error: (error as Error).message
      });
      throw error;
    }
  }

  // 🔧 PARAMÈTRES PAR DÉFAUT
  private getDefaultSettings(): AppSettings {
    return {
      general: {
        organizationName: '',
        language: 'fr',
        timezone: 'Europe/Paris',
        theme: 'light',
        notifications: {
          email: true,
          browser: true,
          slack: false
        },
        dataRetention: {
          missions: 365, // 1 an par défaut
          reports: 365,
          logs: 365
        }
      },
      security: {
        mfaRequired: {
          admin: false,
          auditor: false,
          analyst: false,
          user: false
        },
        sessionSettings: {
          maxDuration: 480, // 8 heures
          inactivityTimeout: 120, // 2 heures
          concurrentSessions: 5,
          requireMfaForSensitive: false
        },
        passwordPolicy: {
          minLength: 8,
          requireUppercase: false,
          requireLowercase: true,
          requireNumbers: false,
          requireSpecialChars: false,
          maxAge: 365,
          historyCount: 3,
          lockoutAttempts: 10,
          lockoutDuration: 5
        },
        auditSettings: {
          enabled: false,
          retentionDays: 365, // 1 an par défaut
          realTimeAlerts: false,
          exportEnabled: true
        },
        encryptionSettings: {
          enabled: false,
          algorithm: 'AES-256-GCM',
          keyRotationDays: 90,
          backupEncryption: false
        },
        monitoringSettings: {
          enabled: false,
          anomalyDetection: false,
          alertThresholds: {
            failedLogins: 10,
            suspiciousActivity: 20,
            dataExfiltration: 5
          }
        }
      },
      ai: {
        provider: 'openrouter',
        selectedModel: 'google/gemini-2.5-flash-preview-05-20', // Par défaut
        apiKeys: {},
        modelSettings: {
          temperature: 0.7,
          maxTokens: 4000,
          topP: 0.9,
          frequencyPenalty: 0,
          presencePenalty: 0
        },
        fallbackModel: 'google/gemini-2.5-flash-preview-05-20',
        rateLimiting: {
          requestsPerMinute: 60,
          tokensPerMinute: 100000
        }
      },
      lastUpdated: new Date(),
      updatedBy: 'system',
      version: '1.0'
    };
  }

  // 🔐 CHIFFREMENT DES CLÉS API (conditionnel)
  private async encryptApiKeys(apiKeys: any): Promise<any> {
    // Vérifier si le chiffrement est activé
    const currentSettings = await this.getSettings();
    const encryptionEnabled = currentSettings.security.encryptionSettings.enabled;

    if (!encryptionEnabled) {
      console.log('🔓 Chiffrement désactivé, stockage des clés en clair');
      return apiKeys; // Retourner les clés en clair si chiffrement désactivé
    }

    const encrypted: any = {};

    for (const [provider, key] of Object.entries(apiKeys)) {
      if (key && typeof key === 'string') {
        try {
          encrypted[provider] = await this.encryptionService.encrypt(key);
        } catch (error) {
          this.logger.warn('Erreur de chiffrement, stockage en clair', {
            provider,
            error: (error as Error).message
          });
          encrypted[provider] = key; // Fallback en clair
        }
      }
    }

    return encrypted;
  }

  // 🔓 DÉCHIFFREMENT DES CLÉS API (conditionnel)
  private async decryptApiKeys(encryptedApiKeys: any): Promise<any> {
    // Vérifier si le chiffrement est activé
    const currentSettings = await this.getSettings();
    const encryptionEnabled = currentSettings.security.encryptionSettings.enabled;

    if (!encryptionEnabled) {
      console.log('🔓 Chiffrement désactivé, lecture des clés en clair');
      return encryptedApiKeys; // Retourner les clés telles quelles si chiffrement désactivé
    }

    const decrypted: any = {};

    for (const [provider, encryptedKey] of Object.entries(encryptedApiKeys)) {
      if (encryptedKey && typeof encryptedKey === 'string') {
        try {
          // Tenter de déchiffrer
          decrypted[provider] = await this.encryptionService.decrypt(encryptedKey);
        } catch (error) {
          // Si échec, considérer que c'est déjà en clair
          this.logger.info('Clé API probablement en clair', {
            provider
          });
          decrypted[provider] = encryptedKey;
        }
      } else {
        decrypted[provider] = encryptedKey;
      }
    }

    return decrypted;
  }

  // ✅ VALIDATION DES PARAMÈTRES
  public validateSettings(settings: AppSettings): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation des paramètres de sécurité
    if (settings.security.passwordPolicy.minLength < 8) {
      errors.push('La longueur minimale du mot de passe doit être d\'au moins 8 caractères');
    }

    if (settings.security.sessionSettings.maxDuration < 30) {
      errors.push('La durée maximale de session doit être d\'au moins 30 minutes');
    }

    if (settings.security.sessionSettings.inactivityTimeout < 5) {
      errors.push('Le timeout d\'inactivité doit être d\'au moins 5 minutes');
    }

    // Validation des paramètres IA
    const availableModels = this.getAvailableLLMModels();
    const modelExists = availableModels.some(model => model.id === settings.ai.selectedModel);
    if (!modelExists) {
      errors.push('Le modèle IA sélectionné n\'est pas disponible');
    }

    // Validation des clés API
    if (settings.ai.provider === 'openrouter' && !settings.ai.apiKeys.openrouter) {
      errors.push('La clé API OpenRouter est requise');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 🧪 TEST DE CONNEXION API
  public async testApiConnection(provider: string, apiKey: string): Promise<{ success: boolean; message: string }> {
    try {
      // Test basique de la clé API selon le provider
      switch (provider) {
        case 'openrouter':
          // Test avec OpenRouter
          const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            return { success: true, message: 'Connexion OpenRouter réussie' };
          } else {
            return { success: false, message: 'Clé API OpenRouter invalide' };
          }

        default:
          return { success: false, message: 'Provider non supporté pour le test' };
      }
    } catch (error) {
      return { success: false, message: `Erreur de connexion: ${(error as Error).message}` };
    }
  }

  // 📊 STATISTIQUES DES PARAMÈTRES
  public async getSettingsStats(): Promise<any> {
    try {
      const settings = await this.getSettings();
      
      return {
        security: {
          mfaEnabled: Object.values(settings.security.mfaRequired).some(Boolean),
          encryptionEnabled: settings.security.encryptionSettings.enabled,
          auditEnabled: settings.security.auditSettings.enabled,
          monitoringEnabled: settings.security.monitoringSettings.enabled
        },
        ai: {
          provider: settings.ai.provider,
          selectedModel: settings.ai.selectedModel,
          hasApiKeys: Object.keys(settings.ai.apiKeys).length > 0
        },
        lastUpdated: settings.lastUpdated,
        updatedBy: settings.updatedBy
      };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des statistiques', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  // 🔐 CHIFFREMENT DIRECT DES CLÉS API (sans récursion)
  private async encryptApiKeysDirectly(apiKeys: any): Promise<any> {
    const encrypted: any = {};

    for (const [provider, key] of Object.entries(apiKeys)) {
      if (key && typeof key === 'string') {
        try {
          encrypted[provider] = await this.encryptionService.encrypt(key);
        } catch (error) {
          this.logger.warn('Erreur de chiffrement, stockage en clair', {
            provider,
            error: (error as Error).message
          });
          encrypted[provider] = key; // Fallback en clair
        }
      } else {
        encrypted[provider] = key;
      }
    }

    return encrypted;
  }

  // 🔓 DÉCHIFFREMENT DIRECT DES CLÉS API (sans récursion)
  private async decryptApiKeysDirectly(encryptedApiKeys: any): Promise<any> {
    const decrypted: any = {};

    for (const [provider, encryptedKey] of Object.entries(encryptedApiKeys)) {
      if (encryptedKey && typeof encryptedKey === 'string') {
        try {
          // Tenter de déchiffrer
          decrypted[provider] = await this.encryptionService.decrypt(encryptedKey);
        } catch (error) {
          // Si échec, considérer que c'est déjà en clair
          this.logger.info('Clé API probablement en clair', {
            provider
          });
          decrypted[provider] = encryptedKey;
        }
      } else {
        decrypted[provider] = encryptedKey;
      }
    }

    return decrypted;
  }

  // 🧪 MÉTHODE DE TEST POUR DÉBOGUER
  public async testSaveSettings(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 Test de sauvegarde - Début');

      // Test 1: Vérifier la connexion Firebase
      const testDoc = doc(this.db, 'test', 'connection');
      await setDoc(testDoc, { timestamp: new Date(), test: true });
      console.log('✅ Test 1: Connexion Firebase OK');

      // Test 2: Vérifier l'accès à la collection settings
      const settingsRef = doc(this.db, 'settings', userId);
      const settingsDoc = await getDoc(settingsRef);
      console.log('✅ Test 2: Accès collection settings OK', { exists: settingsDoc.exists() });

      // Test 3: Tenter une sauvegarde simple
      const testSettings = {
        general: { organizationName: 'Test', language: 'fr' },
        timestamp: new Date()
      };
      await setDoc(settingsRef, testSettings, { merge: true });
      console.log('✅ Test 3: Sauvegarde simple OK');

      return { success: true, message: 'Tous les tests sont passés' };

    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      return { success: false, message: `Erreur: ${(error as Error).message}` };
    }
  }
}
