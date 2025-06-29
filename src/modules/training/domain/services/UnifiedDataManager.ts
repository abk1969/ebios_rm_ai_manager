/**
 * 💾 GESTIONNAIRE UNIFIÉ DES DONNÉES FORMATION
 * Système centralisé pour persistance et synchronisation des données
 */

import { UnifiedMetrics } from './UnifiedMetricsManager';

// 🎯 TYPES POUR GESTION DONNÉES UNIFIÉES
export interface TrainingSession {
  sessionId: string;
  userId: string;
  startTime: string;
  lastActivity: string;
  currentMode: string;
  totalDuration: number;
  status: 'active' | 'paused' | 'completed' | 'expired';
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  userAgent: string;
  ipAddress?: string;
  location?: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browserInfo: string;
  referrer?: string;
}

export interface TrainingData {
  sessionId: string;
  userId: string;
  metrics: UnifiedMetrics;
  modeData: { [key: string]: ModeData };
  userPreferences: UserPreferences;
  progressHistory: ProgressSnapshot[];
  lastSyncTime: string;
  version: string;
}

export interface ModeData {
  modeId: string;
  data: any;
  lastModified: string;
  version: number;
  checksum: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  dataRetention: number; // days
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  shareProgress: boolean;
  allowCookies: boolean;
  dataProcessingConsent: boolean;
  consentDate: string;
}

export interface ProgressSnapshot {
  timestamp: string;
  globalProgress: number;
  modeProgresses: { [key: string]: number };
  achievements: string[];
  totalTime: number;
  sessionCount: number;
}

export interface DataSyncResult {
  success: boolean;
  timestamp: string;
  syncedItems: number;
  conflicts: DataConflict[];
  errors: string[];
}

export interface DataConflict {
  type: 'version_mismatch' | 'data_corruption' | 'concurrent_modification';
  item: string;
  localVersion: any;
  remoteVersion: any;
  resolution: 'local_wins' | 'remote_wins' | 'merge' | 'manual_required';
}

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

/**
 * 🎯 CLASSE PRINCIPALE GESTIONNAIRE DONNÉES
 */
export class UnifiedDataManager {
  
  private static instance: UnifiedDataManager;
  private storageAdapter: StorageAdapter;
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private syncQueue: Array<{ key: string; data: any; timestamp: string }> = [];
  
  // 📊 DONNÉES EN MÉMOIRE
  private memoryCache: Map<string, any> = new Map();
  private lastSyncTimes: Map<string, string> = new Map();
  
  constructor(storageAdapter: StorageAdapter) {
    this.storageAdapter = storageAdapter;
  }

  // 🏭 SINGLETON PATTERN
  static getInstance(storageAdapter?: StorageAdapter): UnifiedDataManager {
    if (!UnifiedDataManager.instance) {
      if (!storageAdapter) {
        throw new Error('StorageAdapter required for first initialization');
      }
      UnifiedDataManager.instance = new UnifiedDataManager(storageAdapter);
    }
    return UnifiedDataManager.instance;
  }

  // 💾 SAUVEGARDE SESSION COMPLÈTE
  async saveTrainingSession(sessionId: string, data: TrainingData): Promise<void> {
    try {
      const key = `training_session_${sessionId}`;
      const enrichedData = {
        ...data,
        lastSyncTime: new Date().toISOString(),
        version: '1.0.0'
      };

      // Calcul checksum pour intégrité
      enrichedData.modeData = Object.fromEntries(
        Object.entries(enrichedData.modeData).map(([modeId, modeData]) => [
          modeId,
          {
            ...modeData,
            checksum: this.calculateChecksum(modeData.data),
            lastModified: new Date().toISOString()
          }
        ])
      );

      // Sauvegarde en cache et storage
      this.memoryCache.set(key, enrichedData);
      await this.storageAdapter.set(key, enrichedData);
      this.lastSyncTimes.set(key, enrichedData.lastSyncTime);

      console.log(`✅ Session ${sessionId} sauvegardée`);
    } catch (error) {
      console.error(`❌ Erreur sauvegarde session ${sessionId}:`, error);
      throw error;
    }
  }

  // 📖 CHARGEMENT SESSION
  async loadTrainingSession(sessionId: string): Promise<TrainingData | null> {
    try {
      const key = `training_session_${sessionId}`;
      
      // Vérifier cache mémoire d'abord
      if (this.memoryCache.has(key)) {
        const cachedData = this.memoryCache.get(key);
        console.log(`📋 Session ${sessionId} chargée depuis cache`);
        return cachedData;
      }

      // Charger depuis storage
      const data = await this.storageAdapter.get(key);
      if (data) {
        // Vérifier intégrité des données
        const isValid = await this.validateDataIntegrity(data);
        if (!isValid) {
          console.warn(`⚠️ Intégrité compromise pour session ${sessionId}`);
          return null;
        }

        this.memoryCache.set(key, data);
        this.lastSyncTimes.set(key, data.lastSyncTime);
        console.log(`📖 Session ${sessionId} chargée depuis storage`);
        return data;
      }

      console.log(`❌ Session ${sessionId} non trouvée`);
      return null;
    } catch (error) {
      console.error(`❌ Erreur chargement session ${sessionId}:`, error);
      return null;
    }
  }

  // 🔄 SAUVEGARDE AUTOMATIQUE
  startAutoSave(sessionId: string, intervalSeconds: number = 30): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    this.autoSaveInterval = setInterval(async () => {
      try {
        const key = `training_session_${sessionId}`;
        const cachedData = this.memoryCache.get(key);
        
        if (cachedData) {
          await this.saveTrainingSession(sessionId, cachedData);
          console.log(`🔄 Auto-save session ${sessionId}`);
        }
      } catch (error) {
        console.error(`❌ Erreur auto-save session ${sessionId}:`, error);
      }
    }, intervalSeconds * 1000);

    console.log(`⏰ Auto-save activé pour session ${sessionId} (${intervalSeconds}s)`);
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('⏹️ Auto-save arrêté');
    }
  }

  // 📊 MISE À JOUR DONNÉES MODE SPÉCIFIQUE
  async updateModeData(sessionId: string, modeId: string, data: any): Promise<void> {
    try {
      const key = `training_session_${sessionId}`;
      let sessionData = this.memoryCache.get(key);
      
      if (!sessionData) {
        sessionData = await this.loadTrainingSession(sessionId);
        if (!sessionData) {
          throw new Error(`Session ${sessionId} non trouvée`);
        }
      }

      // Mise à jour données mode
      sessionData.modeData[modeId] = {
        modeId,
        data,
        lastModified: new Date().toISOString(),
        version: (sessionData.modeData[modeId]?.version || 0) + 1,
        checksum: this.calculateChecksum(data)
      };

      // Mise à jour cache
      this.memoryCache.set(key, sessionData);
      
      // Ajouter à la queue de sync
      this.syncQueue.push({
        key: `${sessionId}_${modeId}`,
        data: sessionData.modeData[modeId],
        timestamp: new Date().toISOString()
      });

      console.log(`📝 Données mode ${modeId} mises à jour pour session ${sessionId}`);
    } catch (error) {
      console.error(`❌ Erreur mise à jour mode ${modeId}:`, error);
      throw error;
    }
  }

  // 🔄 SYNCHRONISATION DONNÉES
  async syncData(sessionId: string): Promise<DataSyncResult> {
    const result: DataSyncResult = {
      success: true,
      timestamp: new Date().toISOString(),
      syncedItems: 0,
      conflicts: [],
      errors: []
    };

    try {
      const key = `training_session_${sessionId}`;
      const localData = this.memoryCache.get(key);
      const remoteData = await this.storageAdapter.get(key);

      if (!localData) {
        result.errors.push('Aucune donnée locale à synchroniser');
        result.success = false;
        return result;
      }

      // Détection conflits
      if (remoteData && remoteData.lastSyncTime > localData.lastSyncTime) {
        const conflicts = this.detectConflicts(localData, remoteData);
        result.conflicts = conflicts;

        // Résolution automatique des conflits
        const resolvedData = this.resolveConflicts(localData, remoteData, conflicts);
        await this.saveTrainingSession(sessionId, resolvedData);
        result.syncedItems = 1;
      } else {
        // Pas de conflit, sauvegarde directe
        await this.saveTrainingSession(sessionId, localData);
        result.syncedItems = 1;
      }

      // Traitement queue de sync
      for (const item of this.syncQueue) {
        try {
          await this.storageAdapter.set(`sync_${item.key}`, item);
          result.syncedItems++;
        } catch (error) {
          result.errors.push(`Erreur sync ${item.key}: ${error}`);
        }
      }

      this.syncQueue = []; // Vider la queue
      console.log(`🔄 Synchronisation terminée: ${result.syncedItems} éléments`);

    } catch (error) {
      result.success = false;
      result.errors.push(`Erreur synchronisation: ${error}`);
      console.error('❌ Erreur synchronisation:', error);
    }

    return result;
  }

  // 🔍 DÉTECTION CONFLITS
  private detectConflicts(localData: TrainingData, remoteData: TrainingData): DataConflict[] {
    const conflicts: DataConflict[] = [];

    // Vérifier conflits par mode
    Object.keys(localData.modeData).forEach(modeId => {
      const localMode = localData.modeData[modeId];
      const remoteMode = remoteData.modeData[modeId];

      if (remoteMode) {
        if (localMode.version !== remoteMode.version) {
          conflicts.push({
            type: 'version_mismatch',
            item: `mode_${modeId}`,
            localVersion: localMode,
            remoteVersion: remoteMode,
            resolution: 'merge' // Par défaut
          });
        }

        if (localMode.checksum !== remoteMode.checksum) {
          conflicts.push({
            type: 'data_corruption',
            item: `mode_${modeId}_data`,
            localVersion: localMode.data,
            remoteVersion: remoteMode.data,
            resolution: 'local_wins' // Privilégier local par défaut
          });
        }
      }
    });

    return conflicts;
  }

  // 🔧 RÉSOLUTION CONFLITS
  private resolveConflicts(localData: TrainingData, remoteData: TrainingData, conflicts: DataConflict[]): TrainingData {
    const resolvedData = { ...localData };

    conflicts.forEach(conflict => {
      switch (conflict.resolution) {
        case 'local_wins':
          // Garder données locales
          break;
        case 'remote_wins':
          // Utiliser données distantes
          if (conflict.item.startsWith('mode_')) {
            const modeId = conflict.item.split('_')[1];
            resolvedData.modeData[modeId] = conflict.remoteVersion;
          }
          break;
        case 'merge':
          // Fusionner données (logique simple)
          if (conflict.item.startsWith('mode_')) {
            const modeId = conflict.item.split('_')[1];
            resolvedData.modeData[modeId] = {
              ...conflict.localVersion,
              version: Math.max(conflict.localVersion.version, conflict.remoteVersion.version),
              lastModified: new Date().toISOString()
            };
          }
          break;
      }
    });

    return resolvedData;
  }

  // 🔐 VALIDATION INTÉGRITÉ
  private async validateDataIntegrity(data: TrainingData): Promise<boolean> {
    try {
      // Vérifier structure de base
      if (!data.sessionId || !data.userId || !data.metrics) {
        return false;
      }

      // Vérifier checksums des modes
      for (const [modeId, modeData] of Object.entries(data.modeData)) {
        const calculatedChecksum = this.calculateChecksum(modeData.data);
        if (calculatedChecksum !== modeData.checksum) {
          console.warn(`⚠️ Checksum invalide pour mode ${modeId}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('❌ Erreur validation intégrité:', error);
      return false;
    }
  }

  // 🔢 CALCUL CHECKSUM
  private calculateChecksum(data: any): string {
    // Implémentation simple - en production utiliser crypto
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // 🧹 NETTOYAGE DONNÉES EXPIRÉES
  async cleanupExpiredData(retentionDays: number = 30): Promise<number> {
    try {
      const keys = await this.storageAdapter.keys();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      let cleanedCount = 0;

      for (const key of keys) {
        if (key.startsWith('training_session_')) {
          const data = await this.storageAdapter.get(key);
          if (data && new Date(data.lastSyncTime) < cutoffDate) {
            await this.storageAdapter.remove(key);
            this.memoryCache.delete(key);
            cleanedCount++;
          }
        }
      }

      console.log(`🧹 ${cleanedCount} sessions expirées nettoyées`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Erreur nettoyage:', error);
      return 0;
    }
  }

  // 📊 STATISTIQUES STOCKAGE
  async getStorageStats(): Promise<any> {
    try {
      const keys = await this.storageAdapter.keys();
      const trainingKeys = keys.filter(k => k.startsWith('training_session_'));
      
      let totalSize = 0;
      const sessionStats = [];

      for (const key of trainingKeys) {
        const data = await this.storageAdapter.get(key);
        const size = JSON.stringify(data).length;
        totalSize += size;
        
        sessionStats.push({
          sessionId: key.replace('training_session_', ''),
          size,
          lastSync: data?.lastSyncTime,
          modesCount: Object.keys(data?.modeData || {}).length
        });
      }

      return {
        totalSessions: trainingKeys.length,
        totalSize,
        averageSize: totalSize / trainingKeys.length || 0,
        cacheSize: this.memoryCache.size,
        sessionStats: sessionStats.slice(0, 10) // Top 10
      };
    } catch (error) {
      console.error('❌ Erreur stats stockage:', error);
      return null;
    }
  }

  // 🔄 EXPORT/IMPORT DONNÉES
  async exportUserData(userId: string): Promise<any> {
    try {
      const keys = await this.storageAdapter.keys();
      const userKeys = keys.filter(k => k.includes(userId));
      
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        sessions: []
      };

      for (const key of userKeys) {
        const data = await this.storageAdapter.get(key);
        if (data) {
          exportData.sessions.push(data);
        }
      }

      return exportData;
    } catch (error) {
      console.error('❌ Erreur export:', error);
      throw error;
    }
  }

  async importUserData(importData: any): Promise<boolean> {
    try {
      for (const session of importData.sessions) {
        await this.saveTrainingSession(session.sessionId, session);
      }
      
      console.log(`📥 ${importData.sessions.length} sessions importées`);
      return true;
    } catch (error) {
      console.error('❌ Erreur import:', error);
      return false;
    }
  }
}
