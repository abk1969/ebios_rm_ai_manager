import { useState, useEffect, useCallback, useRef } from 'react';
import { UnifiedDataManager, TrainingData } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService, SyncStatus, SyncEvent } from '../../domain/services/DataSynchronizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';

/**
 * 🎯 HOOK PERSONNALISÉ POUR PERSISTANCE DONNÉES
 * Facilite l'utilisation du système de persistance dans les composants
 */

interface UseDataPersistenceOptions {
  sessionId: string;
  userId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number; // seconds
  enableSync?: boolean;
  storageType?: 'localStorage' | 'indexedDB' | 'hybrid' | 'firebase';
  onSyncEvent?: (event: SyncEvent) => void;
}

interface UseDataPersistenceReturn {
  // État
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  syncStatus: SyncStatus | null;

  // Données
  sessionData: TrainingData | null;

  // Actions principales
  saveSession: (data: TrainingData) => Promise<void>;
  loadSession: () => Promise<TrainingData | null>;
  updateModeData: (modeId: string, data: any) => Promise<void>;

  // Synchronisation
  syncData: () => Promise<void>;
  clearPendingChanges: () => void;

  // Utilitaires
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<boolean>;
  cleanupExpiredData: (retentionDays?: number) => Promise<number>;
  getStorageStats: () => Promise<any>;

  // Contrôle
  startAutoSave: () => void;
  stopAutoSave: () => void;
  destroy: () => void;

  // 🛡️ NOUVELLES MÉTHODES DE SÉCURITÉ
  isManagerReady: () => boolean;
  waitForInitialization: () => Promise<boolean>;
}

export const useDataPersistence = (options: UseDataPersistenceOptions): UseDataPersistenceReturn => {
  const {
    sessionId,
    userId = 'default-user',
    autoSave = true,
    autoSaveInterval = 30,
    enableSync = true,
    storageType = 'hybrid',
    onSyncEvent
  } = options;

  // État
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [sessionData, setSessionData] = useState<TrainingData | null>(null);

  // 🛡️ RÉFÉRENCES SÉCURISÉES
  const dataManagerRef = useRef<UnifiedDataManager | null>(null);
  const syncServiceRef = useRef<DataSynchronizationService | null>(null);
  const syncStatusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializationPromiseRef = useRef<Promise<boolean> | null>(null);

  // 🚀 INITIALISATION SÉCURISÉE
  useEffect(() => {
    const initialize = async (): Promise<boolean> => {
      try {
        console.log('🔄 Initialisation hook persistance...');
        setIsLoading(true);
        setError(null);

        // Créer adaptateur de stockage avec fallback
        let storageAdapter;
        try {
          storageAdapter = storageType === 'firebase'
            ? StorageAdapterFactory.createRecommendedAdapter(userId)
            : StorageAdapterFactory.createAdapter(storageType);
        } catch (adapterError) {
          console.warn('⚠️ Erreur adaptateur, fallback vers localStorage:', adapterError);
          storageAdapter = StorageAdapterFactory.createAdapter('localStorage');
        }

        // Initialiser gestionnaire de données
        const dataManager = UnifiedDataManager.getInstance(storageAdapter);
        dataManagerRef.current = dataManager;

        // Initialiser service de synchronisation si activé
        if (enableSync) {
          try {
            const syncService = DataSynchronizationService.getInstance(dataManager);
            syncServiceRef.current = syncService;

            // Abonnement aux événements avec protection
            syncService.subscribe({
              id: `hook_${sessionId}`,
              callback: (event) => {
                try {
                  if (onSyncEvent) {
                    onSyncEvent(event);
                  }
                } catch (callbackError) {
                  console.error('❌ Erreur callback sync:', callbackError);
                }
              }
            });

            // Mise à jour statut sync avec protection
            const updateSyncStatus = () => {
              try {
                if (syncServiceRef.current) {
                  setSyncStatus(syncServiceRef.current.getSyncStatus());
                }
              } catch (statusError) {
                console.error('❌ Erreur mise à jour statut sync:', statusError);
              }
            };

            updateSyncStatus();
            syncStatusIntervalRef.current = setInterval(updateSyncStatus, 5000);
          } catch (syncError) {
            console.warn('⚠️ Erreur initialisation sync, continuons sans:', syncError);
          }
        }

        // Démarrer auto-save si activé
        if (autoSave && dataManager) {
          try {
            dataManager.startAutoSave(sessionId, autoSaveInterval || 30);
          } catch (autoSaveError) {
            console.warn('⚠️ Erreur auto-save, continuons sans:', autoSaveError);
          }
        }

        // Charger session existante avec protection
        try {
          const existingData = await dataManager.loadTrainingSession(sessionId);
          if (existingData) {
            setSessionData(existingData);
          }
        } catch (loadError) {
          console.warn('⚠️ Erreur chargement session existante:', loadError);
        }

        setIsInitialized(true);
        console.log('✅ Hook persistance initialisé avec succès');
        return true;

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur initialisation';
        setError(errorMessage);
        console.error('❌ Erreur initialisation hook persistance:', err);

        // Marquer comme initialisé même en cas d'erreur pour éviter les blocages
        setIsInitialized(true);
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    // Créer et stocker la promesse d'initialisation
    initializationPromiseRef.current = initialize();

    // Cleanup
    return () => {
      if (syncStatusIntervalRef.current) {
        clearInterval(syncStatusIntervalRef.current);
      }
      if (dataManagerRef.current) {
        dataManagerRef.current.stopAutoSave();
      }
      if (syncServiceRef.current) {
        syncServiceRef.current.unsubscribe(`hook_${sessionId}`);
      }
    };
  }, [sessionId, userId, autoSave, autoSaveInterval, enableSync, storageType]);

  // 💾 SAUVEGARDE SESSION - SÉCURISÉE
  const saveSession = useCallback(async (data: TrainingData) => {
    if (!dataManagerRef.current || !isInitialized) {
      throw new Error('DataManager non initialisé - attendez l\'initialisation');
    }

    try {
      setIsLoading(true);
      setError(null);

      await dataManagerRef.current.saveTrainingSession(sessionId, data);
      setSessionData(data);

      // Émettre événement sync si activé - AVEC VÉRIFICATION
      if (syncServiceRef.current) {
        try {
          DataSynchronizationService.emitSessionStart(sessionId);
        } catch (syncError) {
          console.warn('⚠️ Erreur émission événement sync:', syncError);
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur sauvegarde';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isInitialized]);

  // 📖 CHARGEMENT SESSION - SÉCURISÉ
  const loadSession = useCallback(async (): Promise<TrainingData | null> => {
    if (!dataManagerRef.current || !isInitialized) {
      throw new Error('DataManager non initialisé - attendez l\'initialisation');
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await dataManagerRef.current.loadTrainingSession(sessionId);
      setSessionData(data);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur chargement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isInitialized]);

  // 📝 MISE À JOUR DONNÉES MODE - SÉCURISÉE
  const updateModeData = useCallback(async (modeId: string, data: any) => {
    if (!dataManagerRef.current || !isInitialized) {
      throw new Error('DataManager non initialisé - attendez l\'initialisation');
    }

    try {
      setError(null);

      await dataManagerRef.current.updateModeData(sessionId, modeId, data);

      // Recharger session pour refléter les changements
      const updatedSession = await dataManagerRef.current.loadTrainingSession(sessionId);
      setSessionData(updatedSession);

      // Émettre événement sync - AVEC VÉRIFICATION
      if (syncServiceRef.current) {
        try {
          syncServiceRef.current.emit({
            type: 'data_changed',
            source: modeId,
            sessionId,
            data: { modeId, changes: data },
            timestamp: new Date().toISOString()
          });
        } catch (syncError) {
          console.warn('⚠️ Erreur émission événement sync:', syncError);
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur mise à jour';
      setError(errorMessage);
      throw err;
    }
  }, [sessionId, isInitialized]);

  // 🔄 SYNCHRONISATION
  const syncData = useCallback(async () => {
    if (!syncServiceRef.current) {
      throw new Error('Service de synchronisation non activé');
    }

    try {
      setError(null);
      await syncServiceRef.current.syncData(sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur synchronisation';
      setError(errorMessage);
      throw err;
    }
  }, [sessionId]);

  // 🧹 NETTOYAGE CHANGEMENTS EN ATTENTE
  const clearPendingChanges = useCallback(() => {
    if (syncServiceRef.current) {
      syncServiceRef.current.clearPendingEvents();
    }
  }, []);

  // 📤 EXPORT DONNÉES
  const exportData = useCallback(async () => {
    if (!dataManagerRef.current) {
      throw new Error('DataManager non initialisé');
    }

    try {
      return await dataManagerRef.current.exportUserData(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur export';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  // 📥 IMPORT DONNÉES
  const importData = useCallback(async (data: any): Promise<boolean> => {
    if (!dataManagerRef.current) {
      throw new Error('DataManager non initialisé');
    }

    try {
      setError(null);
      const success = await dataManagerRef.current.importUserData(data);
      
      if (success) {
        // Recharger session après import
        await loadSession();
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur import';
      setError(errorMessage);
      throw err;
    }
  }, [loadSession]);

  // 🧹 NETTOYAGE DONNÉES EXPIRÉES
  const cleanupExpiredData = useCallback(async (retentionDays: number = 30): Promise<number> => {
    if (!dataManagerRef.current) {
      throw new Error('DataManager non initialisé');
    }

    try {
      setError(null);
      return await dataManagerRef.current.cleanupExpiredData(retentionDays);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur nettoyage';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // 📊 STATISTIQUES STOCKAGE
  const getStorageStats = useCallback(async () => {
    if (!dataManagerRef.current) {
      throw new Error('DataManager non initialisé');
    }

    try {
      setError(null);
      return await dataManagerRef.current.getStorageStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur stats';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // ⏰ CONTRÔLE AUTO-SAVE
  const startAutoSave = useCallback(() => {
    if (dataManagerRef.current) {
      dataManagerRef.current.startAutoSave(sessionId, autoSaveInterval);
    }
  }, [sessionId, autoSaveInterval]);

  const stopAutoSave = useCallback(() => {
    if (dataManagerRef.current) {
      dataManagerRef.current.stopAutoSave();
    }
  }, []);

  // 🗑️ DESTRUCTION
  const destroy = useCallback(() => {
    if (syncStatusIntervalRef.current) {
      clearInterval(syncStatusIntervalRef.current);
    }
    if (dataManagerRef.current) {
      dataManagerRef.current.stopAutoSave();
    }
    if (syncServiceRef.current) {
      syncServiceRef.current.unsubscribe(`hook_${sessionId}`);
      syncServiceRef.current.destroy();
    }
  }, [sessionId]);

  // 🛡️ NOUVELLES MÉTHODES DE SÉCURITÉ
  const isManagerReady = useCallback(() => {
    return isInitialized && dataManagerRef.current !== null;
  }, [isInitialized]);

  const waitForInitialization = useCallback(async (): Promise<boolean> => {
    if (isInitialized) {
      return true;
    }

    if (initializationPromiseRef.current) {
      return await initializationPromiseRef.current;
    }

    // Fallback: attendre avec timeout
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (isInitialized) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);

      // Timeout après 10 secondes
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 10000);
    });
  }, [isInitialized]);

  return {
    // État
    isInitialized,
    isLoading,
    error,
    syncStatus,
    
    // Données
    sessionData,
    
    // Actions principales
    saveSession,
    loadSession,
    updateModeData,
    
    // Synchronisation
    syncData,
    clearPendingChanges,
    
    // Utilitaires
    exportData,
    importData,
    cleanupExpiredData,
    getStorageStats,
    
    // Contrôle
    startAutoSave,
    stopAutoSave,
    destroy,

    // 🛡️ Sécurité
    isManagerReady,
    waitForInitialization
  };
};

/**
 * 🎯 HOOK SIMPLIFIÉ POUR MODE SPÉCIFIQUE
 */
export const useModeDataPersistence = (sessionId: string, modeId: string) => {
  const { sessionData, updateModeData, isLoading, error } = useDataPersistence({ sessionId });
  
  const modeData = sessionData?.modeData[modeId];
  
  const saveModeData = useCallback(async (data: any) => {
    await updateModeData(modeId, data);
  }, [modeId, updateModeData]);
  
  return {
    modeData: modeData?.data,
    lastModified: modeData?.lastModified,
    version: modeData?.version,
    saveModeData,
    isLoading,
    error
  };
};
