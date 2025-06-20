/**
 * 🎼 ORCHESTRATEUR DE FORMATION LINÉAIRE
 * Service central qui coordonne tous les aspects du parcours EBIOS RM
 * Remplace la complexité actuelle par une orchestration simple et efficace
 */

import { 
  TrainingStep, 
  UserTrainingState,
  LinearTrainingPath 
} from '../entities/LinearTrainingPath';
import { LinearNavigationService, NavigationEvent } from './LinearNavigationService';
import { LinearProgressManager, ProgressEvent } from './LinearProgressManager';
import { ValidationCheckpointService, ValidationResult } from './ValidationCheckpointService';
import { LinearTransitionManager, TransitionData } from './LinearTransitionManager';

// 🎯 ÉTAT DE L'ORCHESTRATEUR
export interface OrchestratorState {
  isInitialized: boolean;
  currentStep: TrainingStep;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastActivity: Date;
  sessionActive: boolean;
}

// 🎯 ÉVÉNEMENT D'ORCHESTRATION
export interface OrchestrationEvent {
  type: 'session_started' | 'step_changed' | 'progress_updated' | 'validation_completed' | 'session_ended' | 'error_occurred';
  data: any;
  timestamp: Date;
  source: 'navigation' | 'progress' | 'validation' | 'transition' | 'orchestrator';
}

// 🎯 CONFIGURATION DE L'ORCHESTRATEUR
export interface OrchestratorConfig {
  autoSave: boolean;
  autoSaveInterval: number; // millisecondes
  sessionTimeout: number; // millisecondes
  enableAnalytics: boolean;
  strictValidation: boolean;
  anssiMode: boolean;
}

// 🎯 RÉSULTAT D'ACTION
export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  nextAction?: string;
}

// 🎯 CLASSE PRINCIPALE DE L'ORCHESTRATEUR
export class LinearTrainingOrchestrator {
  private userState: UserTrainingState;
  private trainingPath: LinearTrainingPath;
  public navigationService: LinearNavigationService;
  public progressManager: LinearProgressManager;
  public validationService: ValidationCheckpointService;
  public transitionManager: LinearTransitionManager;
  public guidanceService: any; // Temporaire pour le build
  
  private orchestratorState: OrchestratorState;
  private config: OrchestratorConfig;
  private listeners: Map<string, (event: OrchestrationEvent) => void> = new Map();
  private autoSaveTimer?: NodeJS.Timeout;

  constructor(
    userState: UserTrainingState, 
    config?: Partial<OrchestratorConfig>
  ) {
    this.userState = userState;
    this.config = {
      autoSave: true,
      autoSaveInterval: 30000, // 30 secondes
      sessionTimeout: 3600000, // 1 heure
      enableAnalytics: true,
      strictValidation: true,
      anssiMode: true,
      ...config
    };

    this.orchestratorState = {
      isInitialized: false,
      currentStep: userState.progress.currentStep,
      isLoading: false,
      hasError: false,
      lastActivity: new Date(),
      sessionActive: false
    };

    this.initializeServices();
  }

  // 🏗️ INITIALISER LES SERVICES
  private initializeServices(): void {
    try {
      // Créer le parcours de formation
      this.trainingPath = new LinearTrainingPath(this.userState);

      // Initialiser les services
      this.navigationService = new LinearNavigationService(this.userState);
      this.progressManager = new LinearProgressManager(this.userState);
      this.validationService = new ValidationCheckpointService(this.userState);
      this.transitionManager = new LinearTransitionManager(this.userState);
      this.guidanceService = {}; // Temporaire pour le build

      // Configurer les listeners inter-services
      this.setupServiceListeners();

      // Démarrer l'auto-sauvegarde si configurée
      if (this.config.autoSave) {
        this.startAutoSave();
      }

      this.orchestratorState.isInitialized = true;
      this.orchestratorState.sessionActive = true;

      this.emitEvent({
        type: 'session_started',
        data: { userState: this.userState },
        timestamp: new Date(),
        source: 'orchestrator'
      });

    } catch (error) {
      this.handleError('Erreur lors de l\'initialisation', error);
    }
  }

  // 🎧 CONFIGURER LES LISTENERS INTER-SERVICES
  private setupServiceListeners(): void {
    // Écouter les événements de navigation
    this.navigationService.addEventListener('navigation', (event: NavigationEvent) => {
      this.handleNavigationEvent(event);
    });

    // Écouter les événements de progression
    this.progressManager.addEventListener('progress', (event: ProgressEvent) => {
      this.handleProgressEvent(event);
    });
  }

  // 🧭 GÉRER LES ÉVÉNEMENTS DE NAVIGATION
  private handleNavigationEvent(event: NavigationEvent): void {
    this.updateLastActivity();

    switch (event.type) {
      case 'step_change':
        this.handleStepChange(event.fromStep!, event.toStep!);
        break;
      case 'help_request':
        this.handleHelpRequest();
        break;
      case 'exit_request':
        this.handleExitRequest();
        break;
    }
  }

  // 📊 GÉRER LES ÉVÉNEMENTS DE PROGRESSION
  private handleProgressEvent(event: ProgressEvent): void {
    this.updateLastActivity();

    this.emitEvent({
      type: 'progress_updated',
      data: event,
      timestamp: new Date(),
      source: 'progress'
    });
  }

  // 🔄 GÉRER LE CHANGEMENT D'ÉTAPE
  private async handleStepChange(fromStep: TrainingStep, toStep: TrainingStep): Promise<void> {
    try {
      this.orchestratorState.isLoading = true;
      this.orchestratorState.currentStep = toStep;

      // Gérer la transition avec le TransitionManager
      const transitionData = await this.transitionManager.handleStepTransition(
        fromStep, 
        toStep, 
        this.userState.progress.scoresPerStep[fromStep] || 0,
        this.userState.progress.timeSpentCurrentStep
      );

      this.emitEvent({
        type: 'step_changed',
        data: { fromStep, toStep, transitionData },
        timestamp: new Date(),
        source: 'orchestrator'
      });

    } catch (error) {
      this.handleError('Erreur lors du changement d\'étape', error);
    } finally {
      this.orchestratorState.isLoading = false;
    }
  }

  // 🎯 API PUBLIQUE - ACTIONS PRINCIPALES

  // ▶️ DÉMARRER UNE ÉTAPE
  async startStep(step: TrainingStep): Promise<ActionResult> {
    try {
      if (!this.orchestratorState.isInitialized) {
        return { success: false, message: 'Orchestrateur non initialisé' };
      }

      const canStart = await this.navigationService.navigateToStep(step);
      if (!canStart) {
        return { 
          success: false, 
          message: 'Impossible de démarrer cette étape. Vérifiez les prérequis.' 
        };
      }

      this.progressManager.updateStepProgress(step, 0, 0);

      return {
        success: true,
        message: `Étape ${step} démarrée avec succès`,
        nextAction: 'continue_step'
      };

    } catch (error) {
      return { 
        success: false, 
        message: `Erreur lors du démarrage de l'étape: ${error}` 
      };
    }
  }

  // 📈 METTRE À JOUR LA PROGRESSION
  async updateProgress(step: TrainingStep, progress: number, timeSpent: number = 0): Promise<ActionResult> {
    try {
      this.progressManager.updateStepProgress(step, progress, timeSpent);
      
      return {
        success: true,
        message: 'Progression mise à jour',
        data: { progress, timeSpent }
      };

    } catch (error) {
      return { 
        success: false, 
        message: `Erreur lors de la mise à jour: ${error}` 
      };
    }
  }

  // ✅ VALIDER UNE ÉTAPE
  async validateStep(
    step: TrainingStep, 
    answers: Record<string, any>, 
    timeSpent: number
  ): Promise<ActionResult> {
    try {
      this.orchestratorState.isLoading = true;

      // Effectuer la validation
      const validationResult = await this.validationService.validateStep(step, answers, timeSpent);

      // Mettre à jour la progression
      if (validationResult.canProceed) {
        this.progressManager.completeStep(step, validationResult);
      }

      this.emitEvent({
        type: 'validation_completed',
        data: { step, validationResult },
        timestamp: new Date(),
        source: 'validation'
      });

      return {
        success: validationResult.canProceed,
        message: validationResult.feedback.message,
        data: validationResult,
        nextAction: validationResult.canProceed ? 'proceed_next_step' : 'retry_validation'
      };

    } catch (error) {
      return { 
        success: false, 
        message: `Erreur lors de la validation: ${error}` 
      };
    } finally {
      this.orchestratorState.isLoading = false;
    }
  }

  // 🎯 NAVIGUER VERS L'ÉTAPE SUIVANTE
  async proceedToNextStep(): Promise<ActionResult> {
    try {
      const success = await this.navigationService.navigateForward();
      
      if (success) {
        return {
          success: true,
          message: 'Navigation vers l\'étape suivante réussie',
          nextAction: 'start_step'
        };
      } else {
        return {
          success: false,
          message: 'Impossible de passer à l\'étape suivante. Vérifiez les validations.'
        };
      }

    } catch (error) {
      return { 
        success: false, 
        message: `Erreur lors de la navigation: ${error}` 
      };
    }
  }

  // 📊 OBTENIR L'ÉTAT COMPLET
  getFullState(): {
    orchestrator: OrchestratorState;
    navigation: any;
    progress: any;
    user: UserTrainingState;
  } {
    return {
      orchestrator: { ...this.orchestratorState },
      navigation: this.navigationService.getCurrentNavigationState(),
      progress: this.progressManager.getCurrentProgress(),
      user: { ...this.userState }
    };
  }

  // 📋 GÉNÉRER UN RAPPORT COMPLET
  generateComprehensiveReport(): any {
    return {
      progressReport: this.progressManager.generateProgressReport(),
      navigationHistory: this.navigationService.getNavigationHistory(),
      validationHistory: this.getAllValidationHistory(),
      transitionHistory: this.transitionManager.getTransitionHistory(),
      orchestratorState: this.orchestratorState,
      generatedAt: new Date()
    };
  }

  // 🔧 MÉTHODES UTILITAIRES

  private getAllValidationHistory(): any[] {
    const history: any[] = [];
    for (let step = TrainingStep.ONBOARDING; step <= TrainingStep.RESOURCES; step++) {
      const stepHistory = this.validationService.getValidationHistory(step as TrainingStep);
      history.push(...stepHistory);
    }
    return history;
  }

  private handleHelpRequest(): void {
    // Logique d'aide contextuelle
    console.log('Demande d\'aide pour l\'étape:', this.orchestratorState.currentStep);
  }

  private handleExitRequest(): void {
    this.saveState();
    this.orchestratorState.sessionActive = false;
    
    this.emitEvent({
      type: 'session_ended',
      data: { reason: 'user_request' },
      timestamp: new Date(),
      source: 'orchestrator'
    });
  }

  private updateLastActivity(): void {
    this.orchestratorState.lastActivity = new Date();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.orchestratorState.hasError = true;
    this.orchestratorState.errorMessage = message;

    this.emitEvent({
      type: 'error_occurred',
      data: { message, error: error.toString() },
      timestamp: new Date(),
      source: 'orchestrator'
    });
  }

  // 💾 SAUVEGARDE AUTOMATIQUE
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      this.saveState();
    }, this.config.autoSaveInterval);
  }

  private saveState(): void {
    // Implémentation de la sauvegarde
    console.log('Sauvegarde automatique de l\'état...');
  }

  // 📡 SYSTÈME D'ÉVÉNEMENTS
  addEventListener(eventType: string, callback: (event: OrchestrationEvent) => void): void {
    this.listeners.set(eventType, callback);
  }

  removeEventListener(eventType: string): void {
    this.listeners.delete(eventType);
  }

  private emitEvent(event: OrchestrationEvent): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Erreur dans le listener d\'orchestration:', error);
      }
    });
  }

  // 🧹 NETTOYAGE
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.saveState();
    this.orchestratorState.sessionActive = false;
    this.listeners.clear();
  }
}
