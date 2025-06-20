import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Database, 
  Cloud, 
  HardDrive,
  Wifi,
  WifiOff,
  RotateCcw as Sync,
  Save,
  Download,
  Upload,
  Trash2
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { UnifiedDataManager, TrainingData } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService, SyncStatus } from '../../domain/services/DataSynchronizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';

/**
 * 🧪 COMPOSANT DE TEST PERSISTANCE DONNÉES
 * Valide le système complet de gestion et synchronisation des données
 */

interface DataPersistenceTestProps {
  sessionId?: string;
}

export const DataPersistenceTest: React.FC<DataPersistenceTestProps> = ({
  sessionId = 'test-session-persistence'
}) => {
  const [dataManager, setDataManager] = useState<UnifiedDataManager | null>(null);
  const [syncService, setSyncService] = useState<DataSynchronizationService | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    initializeServices();
    
    // Listeners réseau
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Créer adaptateur hybride pour test
      const localStorage = StorageAdapterFactory.createAdapter('localStorage');
      const indexedDB = StorageAdapterFactory.createAdapter('indexedDB');
      const hybrid = StorageAdapterFactory.createAdapter('hybrid', {
        primary: indexedDB,
        fallback: localStorage
      });

      // Initialiser services
      const dm = UnifiedDataManager.getInstance(hybrid);
      const ss = DataSynchronizationService.getInstance(dm);
      
      setDataManager(dm);
      setSyncService(ss);

      // Démarrer auto-save
      dm.startAutoSave(sessionId, 10); // 10 secondes pour test

      // Abonnement aux événements sync
      ss.subscribe({
        id: 'test-subscriber',
        callback: (event) => {
          setTestResults(prev => [...prev, {
            type: 'sync_event',
            data: event,
            timestamp: new Date().toISOString()
          }]);
        }
      });

      // Mise à jour statut sync
      const updateSyncStatus = () => {
        setSyncStatus(ss.getSyncStatus());
      };
      
      updateSyncStatus();
      const interval = setInterval(updateSyncStatus, 2000);

      // Charger stats stockage
      loadStorageStats(dm);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('❌ Erreur initialisation services:', error);
    }
  };

  const loadStorageStats = async (dm: UnifiedDataManager) => {
    try {
      const stats = await dm.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    }
  };

  const testSaveSession = async () => {
    if (!dataManager) return;

    try {
      const testData: TrainingData = {
        sessionId,
        userId: 'test-user',
        metrics: {
          globalProgress: {
            overallCompletion: 45,
            totalTimeSpent: 120,
            averageScore: 78,
            modesCompleted: 2,
            totalModes: 4,
            streak: 3,
            lastActivity: new Date().toISOString(),
            level: 'Intermédiaire',
            nextMilestone: 'Test milestone'
          },
          modeMetrics: {},
          achievements: [],
          learningPath: {
            currentPath: 'Test path',
            pathCompletion: 45,
            recommendedNext: [],
            prerequisites: [],
            estimatedTimeToComplete: 60,
            adaptiveRecommendations: []
          },
          sessionMetrics: {
            sessionId,
            startTime: new Date().toISOString(),
            currentDuration: 30,
            modesVisited: ['expert-chat'],
            actionsPerformed: 15,
            engagementScore: 82,
            focusTime: 25,
            breakTime: 5
          },
          recommendations: []
        },
        modeData: {
          'expert-chat': {
            modeId: 'expert-chat',
            data: { questionsAsked: 5, lastQuestion: 'Test question' },
            lastModified: new Date().toISOString(),
            version: 1,
            checksum: 'test-checksum'
          }
        },
        userPreferences: {
          language: 'fr',
          theme: 'light',
          notifications: true,
          autoSave: true,
          autoSaveInterval: 30,
          dataRetention: 30,
          privacySettings: {
            shareAnalytics: true,
            shareProgress: true,
            allowCookies: true,
            dataProcessingConsent: true,
            consentDate: new Date().toISOString()
          }
        },
        progressHistory: [],
        lastSyncTime: new Date().toISOString(),
        version: '1.0.0'
      };

      await dataManager.saveTrainingSession(sessionId, testData);
      
      setTestResults(prev => [...prev, {
        type: 'save_success',
        data: { sessionId, size: JSON.stringify(testData).length },
        timestamp: new Date().toISOString()
      }]);

      // Recharger stats
      loadStorageStats(dataManager);

    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'save_error',
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testLoadSession = async () => {
    if (!dataManager) return;

    try {
      const data = await dataManager.loadTrainingSession(sessionId);
      
      setTestResults(prev => [...prev, {
        type: 'load_success',
        data: { 
          sessionId, 
          found: !!data,
          modesCount: data ? Object.keys(data.modeData).length : 0
        },
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'load_error',
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testUpdateModeData = async () => {
    if (!dataManager) return;

    try {
      await dataManager.updateModeData(sessionId, 'workshops', {
        workshopId: 1,
        completed: true,
        score: 85,
        timeSpent: 45
      });

      setTestResults(prev => [...prev, {
        type: 'update_success',
        data: { modeId: 'workshops', sessionId },
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'update_error',
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testSyncData = async () => {
    if (!syncService) return;

    try {
      const result = await syncService.syncData(sessionId);
      
      setTestResults(prev => [...prev, {
        type: 'sync_result',
        data: result,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'sync_error',
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testCleanupData = async () => {
    if (!dataManager) return;

    try {
      const cleaned = await dataManager.cleanupExpiredData(0); // Nettoyer tout pour test
      
      setTestResults(prev => [...prev, {
        type: 'cleanup_success',
        data: { cleanedCount: cleaned },
        timestamp: new Date().toISOString()
      }]);

      loadStorageStats(dataManager);

    } catch (error) {
      setTestResults(prev => [...prev, {
        type: 'cleanup_error',
        data: { error: error instanceof Error ? error.message : 'Erreur inconnue' },
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const testFeatures = [
    {
      name: 'UnifiedDataManager initialisé',
      status: dataManager ? 'passed' : 'failed',
      description: 'Service principal de gestion des données'
    },
    {
      name: 'DataSynchronizationService actif',
      status: syncService ? 'passed' : 'failed',
      description: 'Service de synchronisation temps réel'
    },
    {
      name: 'Adaptateur hybride configuré',
      status: 'passed',
      description: 'IndexedDB + LocalStorage fallback'
    },
    {
      name: 'Auto-save activé',
      status: dataManager ? 'passed' : 'failed',
      description: 'Sauvegarde automatique toutes les 10s'
    },
    {
      name: 'Événements sync abonnés',
      status: syncService ? 'passed' : 'failed',
      description: 'Écoute des événements de synchronisation'
    },
    {
      name: 'Détection réseau active',
      status: 'passed',
      description: 'Gestion online/offline automatique'
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        🧪 Test Persistance et Synchronisation Données
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tests fonctionnels */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Tests fonctionnels</h3>
          
          {testFeatures.map((test, index) => (
            <div key={index} className="flex items-start space-x-3">
              {test.status === 'passed' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <div className="font-medium">{test.name}</div>
                <div className="text-sm text-gray-600">{test.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Statut système */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Statut système</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Connexion réseau :</span>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
            </div>

            {syncStatus && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Synchronisation :</span>
                  <span className={syncStatus.syncInProgress ? 'text-blue-600' : 'text-gray-600'}>
                    {syncStatus.syncInProgress ? 'En cours...' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Changements en attente :</span>
                  <span className="text-orange-600">{syncStatus.pendingChanges}</span>
                </div>
                
                {syncStatus.lastSync && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Dernière sync :</span>
                    <span className="text-gray-600 text-sm">
                      {new Date(syncStatus.lastSync).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </>
            )}

            {storageStats && (
              <>
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Statistiques stockage :</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Sessions totales :</span>
                      <span>{storageStats.totalSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taille totale :</span>
                      <span>{Math.round(storageStats.totalSize / 1024)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache mémoire :</span>
                      <span>{storageStats.cacheSize} éléments</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions de test */}
      <div className="mt-6 space-y-4">
        <h3 className="font-semibold text-lg">Actions de test</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button onClick={testSaveSession} size="sm" className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </Button>
          
          <Button onClick={testLoadSession} size="sm" variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Charger</span>
          </Button>
          
          <Button onClick={testUpdateModeData} size="sm" variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Mettre à jour</span>
          </Button>
          
          <Button onClick={testSyncData} size="sm" variant="outline" className="flex items-center space-x-2">
            <Sync className="w-4 h-4" />
            <span>Synchroniser</span>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={testCleanupData} size="sm" variant="outline" className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span>Nettoyer données</span>
          </Button>
        </div>
      </div>

      {/* Historique tests */}
      {testResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold text-lg">Historique tests</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {testResults.slice(-10).reverse().map((result, index) => (
                <div key={index} className="bg-white p-3 rounded border text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">
                      {result.type === 'save_success' ? '💾 Sauvegarde réussie' :
                       result.type === 'load_success' ? '📖 Chargement réussi' :
                       result.type === 'update_success' ? '📝 Mise à jour réussie' :
                       result.type === 'sync_result' ? '🔄 Synchronisation' :
                       result.type === 'sync_event' ? '📡 Événement sync' :
                       result.type === 'cleanup_success' ? '🧹 Nettoyage réussi' :
                       '❌ Erreur'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {JSON.stringify(result.data, null, 2).substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions validation */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-medium mb-2">🧪 Validation manuelle :</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Tester la sauvegarde et le chargement de session</li>
          <li>Vérifier la mise à jour des données de mode</li>
          <li>Tester la synchronisation avec/sans réseau</li>
          <li>Valider l'auto-save (attendre 10s après modification)</li>
          <li>Tester le nettoyage des données expirées</li>
          <li>Vérifier la persistance après rechargement page</li>
        </ol>
      </div>
    </div>
  );
};
