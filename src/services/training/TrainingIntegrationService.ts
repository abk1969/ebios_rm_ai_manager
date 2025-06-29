/**
 * 🔗 SERVICE D'INTÉGRATION FORMATION
 * Service pour faire le pont entre Redux et le module formation
 * Synchronisation bidirectionnelle des états
 */

import { store } from '@/store';
import { 
  TrainingSession, 
  Learner, 
  trainingEventBus, 
  TrainingEventType,
  TrainingEventFactory,
  useTrainingStore
} from '@/modules/training';
import { 
  addSession, 
  updateSession, 
  addLearner, 
  updateLearner,
  setCurrentSession,
  updateSessionStatus
} from '@/store/slices/trainingSlice';

/**
 * 🎯 SERVICE PRINCIPAL D'INTÉGRATION
 */
export class TrainingIntegrationService {
  private static instance: TrainingIntegrationService;
  private isInitialized = false;
  private isSyncing = false; // Protection contre les boucles de synchronisation
  private eventSubscriptions: string[] = [];

  private constructor() {}

  static getInstance(): TrainingIntegrationService {
    if (!TrainingIntegrationService.instance) {
      TrainingIntegrationService.instance = new TrainingIntegrationService();
    }
    return TrainingIntegrationService.instance;
  }

  /**
   * 🚀 Initialiser l'intégration - DÉSACTIVÉ
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // 🚨 SERVICE DÉSACTIVÉ - Module formation indépendant
    console.log('⚠️ Service d\'intégration formation désactivé - Module indépendant');
    this.isInitialized = true;
    return;

    /* ANCIEN CODE DÉSACTIVÉ POUR ÉVITER LES CONFLITS
    console.log('🔗 Initialisation du service d\'intégration formation...');

    try {
      // 🛡️ VÉRIFICATION SÉCURITÉ: S'assurer que l'environnement est stable
      if (!this.checkEnvironmentSafety()) {
        console.warn('⚠️ Environnement non sécurisé, initialisation formation annulée');
        return;
      }
      // 1. Configurer les écouteurs d'événements
      this.setupEventListeners();

      // 2. Synchroniser les états initiaux
      await this.syncInitialStates();

      // 3. Configurer la synchronisation bidirectionnelle (avec protection anti-boucle)
      this.setupBidirectionalSync();

      this.isInitialized = true;
      console.log('✅ Service d\'intégration formation initialisé');

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du service d\'intégration:', error);
      throw error;
    }
    */
  }

  /**
   * 🎧 Configurer les écouteurs d'événements du module formation
   */
  private setupEventListeners(): void {
    // Écouter les événements de session
    const sessionSubscription = trainingEventBus.subscribe(
      [
        TrainingEventType.SESSION_CREATED,
        TrainingEventType.SESSION_STARTED,
        TrainingEventType.SESSION_COMPLETED,
        TrainingEventType.STEP_COMPLETED
      ],
      {
        handle: (event) => this.handleSessionEvent(event),
        canHandle: () => true,
        priority: 1
      }
    );

    // Écouter les événements d'apprenant
    const learnerSubscription = trainingEventBus.subscribe(
      [
        TrainingEventType.LEARNER_REGISTERED,
        TrainingEventType.LEARNER_PROFILE_UPDATED,
        TrainingEventType.LEARNER_SKILLS_UPDATED
      ],
      {
        handle: (event) => this.handleLearnerEvent(event),
        canHandle: () => true,
        priority: 1
      }
    );

    // Écouter les événements d'évaluation
    const assessmentSubscription = trainingEventBus.subscribe(
      [
        TrainingEventType.ASSESSMENT_COMPLETED,
        TrainingEventType.BADGE_EARNED,
        TrainingEventType.CERTIFICATION_AWARDED
      ],
      {
        handle: (event) => this.handleAssessmentEvent(event),
        canHandle: () => true,
        priority: 1
      }
    );

    this.eventSubscriptions.push(sessionSubscription, learnerSubscription, assessmentSubscription);
  }

  /**
   * 🔄 Synchroniser les états initiaux
   */
  private async syncInitialStates(): Promise<void> {
    // Récupérer l'état actuel du module formation
    const trainingState = useTrainingStore.getState();
    
    // Synchroniser avec Redux si nécessaire
    if (trainingState.currentSession) {
      store.dispatch(setCurrentSession(trainingState.currentSession.id.value));
    }

    if (trainingState.sessionStatus !== 'idle') {
      store.dispatch(updateSessionStatus(trainingState.sessionStatus));
    }
  }

  /**
   * 🔄 Configurer la synchronisation bidirectionnelle (AVEC PROTECTION ANTI-BOUCLE)
   */
  private setupBidirectionalSync(): void {
    // Écouter les changements dans le store Redux
    store.subscribe(() => {
      if (this.isSyncing) return; // Protection contre les boucles

      const reduxState = store.getState().training;
      const trainingState = useTrainingStore.getState();

      // Synchroniser la session courante
      if (reduxState.currentSessionId !== trainingState.currentSession?.id.value) {
        this.isSyncing = true;
        this.syncCurrentSession(reduxState.currentSessionId);
        setTimeout(() => { this.isSyncing = false; }, 100); // Reset après délai
      }
    });

    // Écouter les changements dans le store Zustand
    useTrainingStore.subscribe(
      (state) => state.currentSession,
      (currentSession) => {
        if (this.isSyncing) return; // Protection contre les boucles

        const reduxState = store.getState().training;
        if (currentSession?.id.value !== reduxState.currentSessionId) {
          this.isSyncing = true;
          store.dispatch(setCurrentSession(currentSession?.id.value || null));
          setTimeout(() => { this.isSyncing = false; }, 100); // Reset après délai
        }
      }
    );
  }

  /**
   * 🎯 Gérer les événements de session
   */
  private async handleSessionEvent(event: any): Promise<void> {
    const { type, payload } = event;

    switch (type) {
      case TrainingEventType.SESSION_CREATED:
        await this.handleSessionCreated(payload);
        break;

      case TrainingEventType.SESSION_STARTED:
        store.dispatch(updateSessionStatus('active'));
        break;

      case TrainingEventType.SESSION_COMPLETED:
        store.dispatch(updateSessionStatus('completed'));
        await this.handleSessionCompleted(payload);
        break;

      case TrainingEventType.STEP_COMPLETED:
        await this.handleStepCompleted(payload);
        break;
    }
  }

  /**
   * 🎯 Gérer les événements d'apprenant
   */
  private async handleLearnerEvent(event: any): Promise<void> {
    const { type, payload } = event;

    switch (type) {
      case TrainingEventType.LEARNER_REGISTERED:
        await this.handleLearnerRegistered(payload);
        break;

      case TrainingEventType.LEARNER_PROFILE_UPDATED:
      case TrainingEventType.LEARNER_SKILLS_UPDATED:
        await this.handleLearnerUpdated(payload);
        break;
    }
  }

  /**
   * 🎯 Gérer les événements d'évaluation
   */
  private async handleAssessmentEvent(event: any): Promise<void> {
    const { type, payload } = event;

    // Mettre à jour les métriques globales
    const reduxState = store.getState().training;
    
    // Ici, on pourrait mettre à jour des statistiques globales
    console.log(`Événement d'évaluation: ${type}`, payload);
  }

  /**
   * 🎯 Handlers spécifiques
   */
  private async handleSessionCreated(payload: any): Promise<void> {
    // Ajouter la session au store Redux
    if (payload.session) {
      store.dispatch(addSession(payload.session));
      store.dispatch(setCurrentSession(payload.session.id.value));
    }
  }

  private async handleSessionCompleted(payload: any): Promise<void> {
    // Mettre à jour les métriques de completion
    if (payload.sessionId) {
      store.dispatch(updateSession({
        id: payload.sessionId,
        updates: { status: 'completed' }
      }));
    }
  }

  private async handleStepCompleted(payload: any): Promise<void> {
    // Mettre à jour la progression
    if (payload.sessionId && payload.stepId) {
      // Ici, on pourrait mettre à jour la progression détaillée
      console.log(`Étape ${payload.stepId} terminée pour la session ${payload.sessionId}`);
    }
  }

  private async handleLearnerRegistered(payload: any): Promise<void> {
    if (payload.learner) {
      store.dispatch(addLearner(payload.learner));
    }
  }

  private async handleLearnerUpdated(payload: any): Promise<void> {
    if (payload.learnerId && payload.updates) {
      store.dispatch(updateLearner({
        id: payload.learnerId,
        updates: payload.updates
      }));
    }
  }

  /**
   * 🔄 Synchroniser la session courante
   */
  private syncCurrentSession(sessionId: string | null): void {
    const trainingActions = useTrainingStore.getState();
    
    if (sessionId) {
      // Trouver la session dans le store Redux
      const reduxState = store.getState().training;
      const session = reduxState.sessions.find(s => s.id.value === sessionId);
      
      if (session) {
        // Mettre à jour le store Zustand
        trainingActions.setCurrentSession(session);
      }
    } else {
      trainingActions.setCurrentSession(null);
    }
  }

  /**
   * 🎯 API publique pour l'intégration
   */

  /**
   * Créer une session depuis l'application principale - DÉSACTIVÉ
   */
  async createSessionFromApp(config: {
    learnerId: string;
    workshopSequence: number[];
    sectorCustomization?: string;
  }): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    // 🚨 SERVICE DÉSACTIVÉ - Module formation indépendant
    console.log('⚠️ createSessionFromApp désactivé - Module indépendant');

    return {
      success: true,
      sessionId: 'session_healthcare_chu_2024' // ID par défaut
    };

    /* ANCIEN CODE DÉSACTIVÉ
    try {
      // Émettre un événement pour créer la session
      const event = TrainingEventFactory.createSessionEvent(
        TrainingEventType.SESSION_CREATED,
        'temp_session_id',
        config.learnerId,
        config,
        { source: 'TrainingIntegrationService' }
      );

      await trainingEventBus.emit(event);

      return { success: true, sessionId: event.id };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
    */
  }

  /**
   * Obtenir les métriques de formation - DÉSACTIVÉ
   */
  getTrainingMetrics() {
    // 🚨 SERVICE DÉSACTIVÉ - Retourner des métriques par défaut
    console.log('⚠️ getTrainingMetrics désactivé - Module indépendant');

    return {
      redux: { totalSessions: 0, completedSessions: 0, averageCompletionRate: 0, totalLearners: 0 },
      module: { engagementScore: 50, comprehensionLevel: 50, responseQuality: 50 },
      combined: {
        totalSessions: 0,
        activeSessions: 0,
        completionRate: 0,
        engagement: 50
      }
    };

    /* ANCIEN CODE DÉSACTIVÉ
    const reduxState = store.getState().training;
    const trainingState = useTrainingStore.getState();

    return {
      redux: reduxState.globalMetrics,
      module: trainingState.metrics,
      combined: {
        totalSessions: reduxState.globalMetrics.totalSessions,
        activeSessions: reduxState.sessions.filter(s => s.isActive).length,
        completionRate: reduxState.globalMetrics.averageCompletionRate,
        engagement: trainingState.metrics.engagementScore
      }
    };
    */
  }

  /**
   * 🛡️ Vérification sécurité environnement
   */
  private checkEnvironmentSafety(): boolean {
    try {
      // Vérifier que les dépendances critiques sont disponibles
      if (typeof window === 'undefined') return false;
      if (!window.localStorage) return false;
      if (!store) return false;

      // Vérifier que Redux fonctionne
      const state = store.getState();
      if (!state) return false;

      return true;
    } catch (error) {
      console.error('🚨 Erreur vérification sécurité:', error);
      return false;
    }
  }

  /**
   * 🧹 Nettoyage
   */
  cleanup(): void {
    // Désabonner tous les événements
    this.eventSubscriptions.forEach(subscriptionId => {
      trainingEventBus.unsubscribe(subscriptionId);
    });
    
    this.eventSubscriptions = [];
    this.isInitialized = false;
  }
}

// 🎯 Instance globale
export const trainingIntegrationService = TrainingIntegrationService.getInstance();
