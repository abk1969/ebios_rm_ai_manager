/**
 * 🔄 SERVICE DE SYNCHRONISATION DES DONNÉES
 * Orchestration de la synchronisation entre modules et stockages
 */

import { UnifiedDataManager, TrainingData } from './UnifiedDataManager';
import { UnifiedMetricsManager } from './UnifiedMetricsManager';
import { StorageAdapter } from './UnifiedDataManager';

// 🎯 TYPES POUR SYNCHRONISATION
export interface SyncEvent {
  type: 'data_changed' | 'mode_completed' | 'session_started' | 'session_ended';
  source: string;
  sessionId: string;
  data: any;
  timestamp: string;
}

export interface SyncSubscriber {
  id: string;
  callback: (event: SyncEvent) => void;
  filters?: string[]; // Types d'événements à écouter
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string;
  pendingChanges: number;
  syncInProgress: boolean;
  errors: string[];
}

export interface ConflictResolution {
  strategy: 'local_wins' | 'remote_wins' | 'merge' | 'ask_user';
  autoResolve: boolean;
  mergeRules?: { [key: string]: string };
}

/**
 * 🎯 CLASSE PRINCIPALE SERVICE SYNCHRONISATION
 */
export class DataSynchronizationService {

  private static instance: DataSynchronizationService | null = null;
  private dataManager: UnifiedDataManager | null = null;
  private subscribers: Map<string, SyncSubscriber> = new Map();
  private syncQueue: SyncEvent[] = [];
  private syncStatus: SyncStatus;
  private conflictResolution: ConflictResolution;
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // 1 seconde, augmente exponentiellement

  constructor(dataManager?: UnifiedDataManager) {
    this.dataManager = dataManager || null;
    this.syncStatus = {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : false,
      lastSync: '',
      pendingChanges: 0,
      syncInProgress: false,
      errors: []
    };
    this.conflictResolution = {
      strategy: 'merge',
      autoResolve: true,
      mergeRules: {
        'workshop_progress': 'max', // Prendre le maximum
        'chat_messages': 'append', // Ajouter à la suite
        'user_preferences': 'local_wins' // Privilégier local
      }
    };

    // Initialisation asynchrone sécurisée
    this.initializationPromise = this.initializeAsync();
  }

  // 🏭 SINGLETON PATTERN SÉCURISÉ
  static getInstance(dataManager?: UnifiedDataManager): DataSynchronizationService {
    if (!DataSynchronizationService.instance) {
      DataSynchronizationService.instance = new DataSynchronizationService(dataManager);
    } else if (dataManager && !DataSynchronizationService.instance.dataManager) {
      // Mise à jour du dataManager si fourni et pas encore défini
      DataSynchronizationService.instance.dataManager = dataManager;
      DataSynchronizationService.instance.initializationPromise = DataSynchronizationService.instance.initializeAsync();
    }
    return DataSynchronizationService.instance;
  }

  // 🔄 INITIALISATION ASYNCHRONE SÉCURISÉE
  private async initializeAsync(): Promise<void> {
    try {
      console.log('🔄 Initialisation DataSynchronizationService...');

      // Attendre que dataManager soit disponible
      await this.waitForDataManager();

      // Initialiser les listeners réseau
      this.initializeNetworkListeners();

      // Démarrer la synchronisation périodique
      this.startPeriodicSync(30000); // 30 secondes

      this.isInitialized = true;
      this.reconnectAttempts = 0; // Reset des tentatives

      console.log('✅ DataSynchronizationService initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation DataSynchronizationService:', error);
      this.scheduleReconnect();
    }
  }

  // ⏳ ATTENDRE DATAMANAGER
  private async waitForDataManager(timeout: number = 10000): Promise<void> {
    const startTime = Date.now();

    while (!this.dataManager && (Date.now() - startTime) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!this.dataManager) {
      throw new Error('DataManager non disponible après timeout');
    }
  }

  // 🔄 PLANIFIER RECONNEXION
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts); // Backoff exponentiel
    this.reconnectAttempts++;

    console.log(`🔄 Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms`);

    setTimeout(() => {
      this.initializationPromise = this.initializeAsync();
    }, delay);
  }

  // 🌐 INITIALISATION LISTENERS RÉSEAU SÉCURISÉE
  private initializeNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      const handleOnline = async () => {
        this.syncStatus.isOnline = true;
        this.reconnectAttempts = 0; // Reset des tentatives
        console.log('🌐 Connexion rétablie - synchronisation déclenchée');

        try {
          await this.triggerSync();
        } catch (error) {
          console.error('❌ Erreur sync après reconnexion:', error);
          this.scheduleReconnect();
        }
      };

      const handleOffline = () => {
        this.syncStatus.isOnline = false;
        console.log('📴 Connexion perdue - mode offline activé');

        // Sauvegarder les données en attente localement
        this.saveQueueToLocalStorage();
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Vérification périodique de la connectivité
      this.startConnectivityCheck();
    }
  }

  // 🔍 VÉRIFICATION PÉRIODIQUE CONNECTIVITÉ
  private startConnectivityCheck(): void {
    setInterval(async () => {
      if (typeof navigator !== 'undefined' && navigator.onLine !== this.syncStatus.isOnline) {
        const wasOnline = this.syncStatus.isOnline;
        this.syncStatus.isOnline = navigator.onLine;

        if (!wasOnline && this.syncStatus.isOnline) {
          // Reconnexion détectée
          console.log('🔄 Reconnexion détectée par vérification périodique');
          try {
            await this.triggerSync();
          } catch (error) {
            console.error('❌ Erreur sync après reconnexion détectée:', error);
          }
        }
      }
    }, 5000); // Vérification toutes les 5 secondes
  }

  // 💾 SAUVEGARDER QUEUE EN LOCAL
  private saveQueueToLocalStorage(): void {
    try {
      if (typeof localStorage !== 'undefined' && this.syncQueue.length > 0) {
        localStorage.setItem('sync_queue_backup', JSON.stringify(this.syncQueue));
        console.log(`💾 Queue sauvegardée localement (${this.syncQueue.length} événements)`);
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde queue locale:', error);
    }
  }

  // 📥 RESTAURER QUEUE DEPUIS LOCAL
  private restoreQueueFromLocalStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const backup = localStorage.getItem('sync_queue_backup');
        if (backup) {
          const restoredQueue = JSON.parse(backup);
          this.syncQueue.push(...restoredQueue);
          this.syncStatus.pendingChanges = this.syncQueue.length;
          localStorage.removeItem('sync_queue_backup');
          console.log(`📥 Queue restaurée depuis local (${restoredQueue.length} événements)`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur restauration queue locale:', error);
    }
  }

  // ⏰ SYNCHRONISATION PÉRIODIQUE
  startPeriodicSync(intervalMs: number): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
        this.triggerSync();
      }
    }, intervalMs);
  }

  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // 📡 ABONNEMENT AUX ÉVÉNEMENTS - SÉCURISÉ
  subscribe(subscriber: SyncSubscriber): void {
    try {
      this.subscribers.set(subscriber.id, subscriber);
      console.log(`📡 Abonné ${subscriber.id} enregistré`);
    } catch (error) {
      console.error(`❌ Erreur abonnement ${subscriber.id}:`, error);
    }
  }

  unsubscribe(subscriberId: string): void {
    try {
      this.subscribers.delete(subscriberId);
      console.log(`📡 Abonné ${subscriberId} supprimé`);
    } catch (error) {
      console.error(`❌ Erreur désabonnement ${subscriberId}:`, error);
    }
  }

  // 🛡️ VÉRIFICATION INITIALISATION
  private async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized && this.dataManager) {
      return true;
    }

    if (this.initializationPromise) {
      try {
        await this.initializationPromise;
        return this.isInitialized && this.dataManager !== null;
      } catch (error) {
        console.error('❌ Erreur attente initialisation:', error);
        return false;
      }
    }

    return false;
  }

  // 📢 ÉMISSION D'ÉVÉNEMENTS - SÉCURISÉE
  async emit(event: SyncEvent): Promise<void> {
    try {
      // Validation de l'événement
      if (!this.validateEvent(event)) {
        console.error('❌ Événement invalide:', event);
        return;
      }

      // Ajouter à la queue
      this.syncQueue.push(event);
      this.syncStatus.pendingChanges = this.syncQueue.length;

      // Notifier les abonnés avec protection
      this.subscribers.forEach(subscriber => {
        if (!subscriber.filters || subscriber.filters.includes(event.type)) {
          try {
            subscriber.callback(event);
          } catch (error) {
            console.error(`❌ Erreur callback abonné ${subscriber.id}:`, error);
            this.syncStatus.errors.push(`Callback error: ${subscriber.id}`);
          }
        }
      });

      // Déclencher sync si en ligne et initialisé
      if (this.syncStatus.isOnline && await this.ensureInitialized()) {
        await this.triggerSync();
      } else if (!this.syncStatus.isOnline) {
        // Sauvegarder en local si hors ligne
        this.saveQueueToLocalStorage();
      }

      console.log(`📢 Événement émis: ${event.type} de ${event.source}`);
    } catch (error) {
      console.error('❌ Erreur émission événement:', error);
      this.syncStatus.errors.push(`Emit error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ✅ VALIDATION ÉVÉNEMENT
  private validateEvent(event: SyncEvent): boolean {
    if (!event.type || !event.source || !event.sessionId || !event.timestamp) {
      return false;
    }

    const validTypes = ['data_changed', 'mode_completed', 'session_started', 'session_ended'];
    if (!validTypes.includes(event.type)) {
      return false;
    }

    // Validation timestamp
    try {
      new Date(event.timestamp);
    } catch {
      return false;
    }

    return true;
  }

  // 🔄 DÉCLENCHEMENT SYNCHRONISATION - SÉCURISÉ
  private async triggerSync(): Promise<void> {
    // Vérifications préliminaires
    if (this.syncStatus.syncInProgress) {
      console.log('⏳ Synchronisation déjà en cours, ignorée');
      return;
    }

    if (this.syncQueue.length === 0) {
      console.log('📭 Aucun événement à synchroniser');
      return;
    }

    if (!await this.ensureInitialized()) {
      console.error('❌ Service non initialisé, synchronisation reportée');
      this.scheduleReconnect();
      return;
    }

    this.syncStatus.syncInProgress = true;
    this.syncStatus.errors = [];

    try {
      console.log(`🔄 Début synchronisation (${this.syncQueue.length} événements)`);

      // Restaurer queue depuis localStorage si nécessaire
      this.restoreQueueFromLocalStorage();

      // Grouper événements par session
      const eventsBySession = this.groupEventsBySession();

      // Synchroniser chaque session avec gestion d'erreurs individuelles
      const syncPromises = Array.from(eventsBySession.entries()).map(async ([sessionId, events]) => {
        try {
          await this.syncSession(sessionId, events);
          return { sessionId, success: true, events: events.length };
        } catch (error) {
          console.error(`❌ Erreur sync session ${sessionId}:`, error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.syncStatus.errors.push(`Session ${sessionId}: ${errorMessage}`);
          return { sessionId, success: false, error: errorMessage };
        }
      });

      const results = await Promise.allSettled(syncPromises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;

      if (failed === 0) {
        // Succès complet - vider la queue
        this.syncQueue = [];
        this.syncStatus.pendingChanges = 0;
        this.syncStatus.lastSync = new Date().toISOString();
        console.log(`✅ Synchronisation terminée avec succès (${successful} sessions)`);
      } else {
        // Succès partiel - garder les événements échoués
        console.warn(`⚠️ Synchronisation partielle: ${successful} succès, ${failed} échecs`);
        this.filterFailedEvents(results);
      }

    } catch (error) {
      console.error('❌ Erreur critique synchronisation:', error);
      this.syncStatus.errors.push(`Critical: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);

      // En cas d'erreur critique, programmer une reconnexion
      this.scheduleReconnect();
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  // 🧹 FILTRER ÉVÉNEMENTS ÉCHOUÉS
  private filterFailedEvents(results: PromiseSettledResult<any>[]): void {
    const failedSessionIds = new Set(
      results
        .filter(r => r.status === 'fulfilled' && !r.value.success)
        .map(r => r.status === 'fulfilled' ? r.value.sessionId : null)
        .filter(Boolean)
    );

    // Garder seulement les événements des sessions échouées
    this.syncQueue = this.syncQueue.filter(event => failedSessionIds.has(event.sessionId));
    this.syncStatus.pendingChanges = this.syncQueue.length;

    console.log(`🧹 ${this.syncQueue.length} événements conservés pour retry`);
  }

  // 📊 GROUPEMENT ÉVÉNEMENTS PAR SESSION
  private groupEventsBySession(): Map<string, SyncEvent[]> {
    const grouped = new Map<string, SyncEvent[]>();

    this.syncQueue.forEach(event => {
      if (!grouped.has(event.sessionId)) {
        grouped.set(event.sessionId, []);
      }
      grouped.get(event.sessionId)!.push(event);
    });

    return grouped;
  }

  // 🔄 SYNCHRONISATION SESSION SPÉCIFIQUE - SÉCURISÉE
  private async syncSession(sessionId: string, events: SyncEvent[]): Promise<void> {
    if (!this.dataManager) {
      throw new Error('DataManager non disponible pour synchronisation');
    }

    try {
      console.log(`🔄 Synchronisation session ${sessionId} (${events.length} événements)`);

      // Validation des événements
      const validEvents = events.filter(event => this.validateEvent(event));
      if (validEvents.length !== events.length) {
        console.warn(`⚠️ ${events.length - validEvents.length} événements invalides ignorés`);
      }

      if (validEvents.length === 0) {
        console.log(`📭 Aucun événement valide pour session ${sessionId}`);
        return;
      }

      // Charger données actuelles avec retry
      let currentData;
      try {
        currentData = await this.dataManager.loadTrainingSession(sessionId);
      } catch (loadError) {
        console.warn(`⚠️ Erreur chargement session ${sessionId}, création nouvelle:`, loadError);
        currentData = this.createDefaultSessionData(sessionId);
      }

      if (!currentData) {
        console.warn(`⚠️ Session ${sessionId} non trouvée, création nouvelle`);
        currentData = this.createDefaultSessionData(sessionId);
      }

      // Appliquer événements avec gestion d'erreurs
      const updatedData = await this.applyEventsWithErrorHandling(currentData, validEvents);

      // Synchroniser métriques avec protection
      try {
        await this.syncMetrics(sessionId, updatedData);
      } catch (metricsError) {
        console.warn(`⚠️ Erreur sync métriques session ${sessionId}:`, metricsError);
        // Continuer sans les métriques
      }

      // Sauvegarder avec retry
      await this.saveWithRetry(sessionId, updatedData);

      console.log(`✅ Session ${sessionId} synchronisée avec succès`);

    } catch (error) {
      console.error(`❌ Erreur sync session ${sessionId}:`, error);
      throw new Error(`Sync session failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 🏗️ CRÉER DONNÉES SESSION PAR DÉFAUT
  private createDefaultSessionData(sessionId: string): any {
    return {
      sessionId,
      userId: 'default-user',
      metrics: {
        globalProgress: {
          overallCompletion: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          modesCompleted: 0,
          totalModes: 5,
          streak: 0,
          lastActivity: new Date().toISOString(),
          level: 'Débutant',
          nextMilestone: 'Premier atelier'
        },
        modeMetrics: {},
        achievements: [],
        learningPath: {
          currentStep: 1,
          totalSteps: 5,
          completedSteps: [],
          recommendedNext: 'workshop-1'
        },
        sessionMetrics: {
          startTime: new Date().toISOString(),
          currentDuration: 0,
          actionsPerformed: 0,
          averageResponseTime: 0,
          engagementScore: 50
        },
        recommendations: []
      },
      modeData: {},
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
  }

  // 📝 APPLICATION ÉVÉNEMENTS AVEC GESTION D'ERREURS
  private async applyEventsWithErrorHandling(data: any, events: SyncEvent[]): Promise<any> {
    const updatedData = { ...data };
    const errors: string[] = [];

    for (const event of events) {
      try {
        await this.applyEvents(updatedData, [event]);
      } catch (error) {
        console.error(`❌ Erreur application événement ${event.type}:`, error);
        errors.push(`Event ${event.type}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} erreurs lors de l'application des événements:`, errors);
    }

    return updatedData;
  }

  // 💾 SAUVEGARDE AVEC RETRY
  private async saveWithRetry(sessionId: string, data: any, maxRetries: number = 3): Promise<void> {
    let lastError: Error | unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.dataManager!.saveTrainingSession(sessionId, data);
        return; // Succès
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Tentative sauvegarde ${attempt}/${maxRetries} échouée:`, error);

        if (attempt < maxRetries) {
          // Attendre avant retry avec backoff exponentiel
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }
      }
    }

    const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(`Sauvegarde échouée après ${maxRetries} tentatives: ${errorMessage}`);
  }

  // 📝 APPLICATION DES ÉVÉNEMENTS
  private async applyEvents(data: TrainingData, events: SyncEvent[]): Promise<TrainingData> {
    const updatedData = { ...data };

    for (const event of events) {
      switch (event.type) {
        case 'data_changed':
          await this.applyDataChange(updatedData, event);
          break;
        case 'mode_completed':
          await this.applyModeCompletion(updatedData, event);
          break;
        case 'session_started':
          await this.applySessionStart(updatedData, event);
          break;
        case 'session_ended':
          await this.applySessionEnd(updatedData, event);
          break;
      }
    }

    return updatedData;
  }

  // 🔧 APPLICATION CHANGEMENT DONNÉES
  private async applyDataChange(data: TrainingData, event: SyncEvent): Promise<void> {
    const { modeId, changes } = event.data;

    if (!data.modeData[modeId]) {
      data.modeData[modeId] = {
        modeId,
        data: {},
        lastModified: event.timestamp,
        version: 1,
        checksum: ''
      };
    }

    // Appliquer changements selon stratégie
    const strategy = this.conflictResolution?.mergeRules?.[modeId] || this.conflictResolution?.strategy || 'merge';
    
    switch (strategy) {
      case 'merge':
        data.modeData[modeId].data = { ...data.modeData[modeId].data, ...changes };
        break;
      case 'local_wins':
        // Ne pas écraser les données locales
        break;
      case 'remote_wins':
        data.modeData[modeId].data = changes;
        break;
    }

    data.modeData[modeId].lastModified = event.timestamp;
    data.modeData[modeId].version += 1;
  }

  // ✅ APPLICATION COMPLETION MODE
  private async applyModeCompletion(data: TrainingData, event: SyncEvent): Promise<void> {
    const { modeId, results } = event.data;

    // Mettre à jour métriques mode
    if (data.modeData[modeId]) {
      data.modeData[modeId].data.completed = true;
      data.modeData[modeId].data.completionTime = event.timestamp;
      data.modeData[modeId].data.results = results;
    }

    // Mettre à jour métriques globales
    UnifiedMetricsManager.updateModeMetrics({
      modeId,
      updateType: 'completion',
      data: results,
      timestamp: event.timestamp
    });
  }

  // 🚀 APPLICATION DÉBUT SESSION
  private async applySessionStart(data: TrainingData, event: SyncEvent): Promise<void> {
    data.metrics.sessionMetrics.startTime = event.timestamp;
    data.metrics.sessionMetrics.currentDuration = 0;
    data.metrics.sessionMetrics.actionsPerformed = 0;
  }

  // 🏁 APPLICATION FIN SESSION
  private async applySessionEnd(data: TrainingData, event: SyncEvent): Promise<void> {
    const { duration, finalMetrics } = event.data;
    
    data.metrics.sessionMetrics.currentDuration = duration;
    data.metrics.sessionMetrics = { ...data.metrics.sessionMetrics, ...finalMetrics };
    
    // Ajouter snapshot progression
    data.progressHistory.push({
      timestamp: event.timestamp,
      globalProgress: data.metrics.globalProgress.overallCompletion,
      modeProgresses: Object.fromEntries(
        Object.entries(data.metrics.modeMetrics).map(([id, mode]) => [id, mode.completion])
      ),
      achievements: data.metrics.achievements.map(a => a.id),
      totalTime: data.metrics.globalProgress.totalTimeSpent,
      sessionCount: data.progressHistory.length + 1
    });
  }

  // 📊 SYNCHRONISATION MÉTRIQUES
  private async syncMetrics(sessionId: string, data: TrainingData): Promise<void> {
    try {
      // Synchroniser avec UnifiedMetricsManager
      const currentMetrics = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
      
      // Fusionner métriques si nécessaire
      if (currentMetrics) {
        data.metrics = this.mergeMetrics(data.metrics, currentMetrics);
      }

    } catch (error) {
      console.error(`❌ Erreur sync métriques session ${sessionId}:`, error);
    }
  }

  // 🔀 FUSION MÉTRIQUES
  private mergeMetrics(local: any, remote: any): any {
    // Logique de fusion intelligente
    return {
      ...remote,
      ...local,
      globalProgress: {
        ...remote.globalProgress,
        ...local.globalProgress,
        // Prendre le maximum pour la progression
        overallCompletion: Math.max(
          local.globalProgress?.overallCompletion || 0,
          remote.globalProgress?.overallCompletion || 0
        ),
        totalTimeSpent: Math.max(
          local.globalProgress?.totalTimeSpent || 0,
          remote.globalProgress?.totalTimeSpent || 0
        )
      }
    };
  }

  // 🔄 SYNCHRONISATION MANUELLE DES DONNÉES
  async syncData(sessionId: string): Promise<void> {
    try {
      console.log(`🔄 Synchronisation manuelle des données pour session ${sessionId}`);

      // Déclencher la synchronisation
      await this.triggerSync();

      // Attendre que la synchronisation soit terminée
      await new Promise(resolve => {
        const checkSync = () => {
          if (!this.syncStatus.syncInProgress) {
            resolve(void 0);
          } else {
            setTimeout(checkSync, 100);
          }
        };
        checkSync();
      });

      console.log(`✅ Synchronisation terminée pour session ${sessionId}`);
    } catch (error) {
      console.error(`❌ Erreur synchronisation session ${sessionId}:`, error);
      throw error;
    }
  }

  // 📊 MÉTHODES UTILITAIRES
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  getPendingEvents(): SyncEvent[] {
    return [...this.syncQueue];
  }

  clearPendingEvents(): void {
    this.syncQueue = [];
    this.syncStatus.pendingChanges = 0;
  }

  // 🔧 CONFIGURATION
  setConflictResolution(resolution: ConflictResolution): void {
    this.conflictResolution = resolution;
  }

  // 🧹 NETTOYAGE
  destroy(): void {
    this.stopPeriodicSync();
    this.subscribers.clear();
    this.syncQueue = [];
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.triggerSync);
      window.removeEventListener('offline', this.triggerSync);
    }
  }

  // 📈 MÉTHODES HELPER SÉCURISÉES POUR MODULES
  static async emitWorkshopCompletion(sessionId: string, workshopId: number, results: any): Promise<void> {
    try {
      const service = DataSynchronizationService.getInstance();
      await service.emit({
        type: 'mode_completed',
        source: 'workshops',
        sessionId,
        data: { modeId: 'workshops', workshopId, results },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur émission completion workshop:', error);
    }
  }

  static async emitChatActivity(sessionId: string, activity: any): Promise<void> {
    try {
      const service = DataSynchronizationService.getInstance();
      await service.emit({
        type: 'data_changed',
        source: 'chat_expert',
        sessionId,
        data: { modeId: 'expert-chat', changes: activity },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur émission activité chat:', error);
    }
  }

  static async emitSessionStart(sessionId: string): Promise<void> {
    try {
      const service = DataSynchronizationService.getInstance();
      await service.emit({
        type: 'session_started',
        source: 'system',
        sessionId,
        data: {},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur émission début session:', error);
    }
  }

  static async emitSessionEnd(sessionId: string, duration: number, metrics: any): Promise<void> {
    try {
      const service = DataSynchronizationService.getInstance();
      await service.emit({
        type: 'session_ended',
        source: 'system',
        sessionId,
        data: { duration, finalMetrics: metrics },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Erreur émission fin session:', error);
    }
  }

  // 🛡️ MÉTHODES DE SANTÉ ET DIAGNOSTIC
  static getServiceHealth(): {
    isHealthy: boolean;
    status: string;
    errors: string[];
    metrics: any;
  } {
    try {
      const service = DataSynchronizationService.getInstance();
      const syncStatus = service.getSyncStatus();

      return {
        isHealthy: syncStatus.errors.length === 0 && service.isInitialized,
        status: service.isInitialized ? 'initialized' : 'initializing',
        errors: syncStatus.errors,
        metrics: {
          pendingEvents: syncStatus.pendingChanges,
          lastSync: syncStatus.lastSync,
          isOnline: syncStatus.isOnline,
          syncInProgress: syncStatus.syncInProgress,
          reconnectAttempts: service.reconnectAttempts
        }
      };
    } catch (error) {
      return {
        isHealthy: false,
        status: 'error',
        errors: [error instanceof Error ? error.message : String(error)],
        metrics: {}
      };
    }
  }

  static async forceReconnect(): Promise<boolean> {
    try {
      const service = DataSynchronizationService.getInstance();
      service.reconnectAttempts = 0;
      service.initializationPromise = service.initializeAsync();
      await service.initializationPromise;
      return service.isInitialized;
    } catch (error) {
      console.error('❌ Erreur reconnexion forcée:', error);
      return false;
    }
  }
}
