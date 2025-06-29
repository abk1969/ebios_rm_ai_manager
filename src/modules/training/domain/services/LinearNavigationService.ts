/**
 * 🧭 SERVICE DE NAVIGATION LINÉAIRE
 * Système de navigation simplifié pour le parcours EBIOS RM
 * Remplace la navigation chaotique par un système intuitif
 */

import { 
  TrainingStep, 
  UserTrainingState,
  LinearProgressMetrics 
} from '../entities/LinearTrainingPath';
import { TrainingStepConfigurationFactory } from '../entities/TrainingStepConfigurations';

// 🎯 ÉTAT DE NAVIGATION
export interface NavigationState {
  currentStep: TrainingStep;
  currentStepName: string;
  currentStepDescription: string;
  canGoBack: boolean;
  canGoForward: boolean;
  canExit: boolean;
  progressPercentage: number;
  stepsCompleted: number;
  totalSteps: number;
  estimatedTimeRemaining: number;
  breadcrumb: BreadcrumbItem[];
  availableActions: NavigationAction[];
}

// 🎯 ÉLÉMENT DE FIL D'ARIANE
export interface BreadcrumbItem {
  step: TrainingStep;
  name: string;
  completed: boolean;
  current: boolean;
  accessible: boolean;
  url?: string;
}

// 🎯 ACTION DE NAVIGATION
export interface NavigationAction {
  id: string;
  type: 'primary' | 'secondary' | 'danger';
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
  shortcut?: string;
  action: () => void;
}

// 🎯 ÉVÉNEMENT DE NAVIGATION
export interface NavigationEvent {
  type: 'step_change' | 'progress_update' | 'exit_request' | 'help_request';
  fromStep?: TrainingStep;
  toStep?: TrainingStep;
  data?: any;
  timestamp: Date;
}

// 🎯 CONFIGURATION DE NAVIGATION
export interface NavigationConfig {
  allowBackNavigation: boolean;
  allowSkipping: boolean;
  showProgressBar: boolean;
  showBreadcrumb: boolean;
  showTimeEstimate: boolean;
  autoSave: boolean;
  exitConfirmation: boolean;
  keyboardShortcuts: boolean;
}

// 🎯 CLASSE PRINCIPALE DU SERVICE
export class LinearNavigationService {
  private userState: UserTrainingState;
  private config: NavigationConfig;
  private navigationHistory: NavigationEvent[] = [];
  private listeners: Map<string, (event: NavigationEvent) => void> = new Map();

  constructor(userState: UserTrainingState, config?: Partial<NavigationConfig>) {
    this.userState = userState;
    this.config = {
      allowBackNavigation: true,
      allowSkipping: false,
      showProgressBar: true,
      showBreadcrumb: true,
      showTimeEstimate: true,
      autoSave: true,
      exitConfirmation: true,
      keyboardShortcuts: true,
      ...config
    };
  }

  // 🎯 OBTENIR L'ÉTAT ACTUEL DE NAVIGATION
  getCurrentNavigationState(): NavigationState {
    const currentStep = this.userState.progress.currentStep;
    const currentConfig = TrainingStepConfigurationFactory.getConfiguration(currentStep);
    
    return {
      currentStep,
      currentStepName: currentConfig?.name || `Étape ${currentStep}`,
      currentStepDescription: currentConfig?.description || '',
      canGoBack: this.canNavigateBack(),
      canGoForward: this.canNavigateForward(),
      canExit: true,
      progressPercentage: this.calculateGlobalProgress(),
      stepsCompleted: this.userState.completedSteps.length,
      totalSteps: 5, // 5 étapes au total
      estimatedTimeRemaining: this.calculateTimeRemaining(),
      breadcrumb: this.generateBreadcrumb(),
      availableActions: this.generateNavigationActions()
    };
  }

  // ⬅️ NAVIGUER VERS L'ÉTAPE PRÉCÉDENTE
  async navigateBack(): Promise<boolean> {
    if (!this.canNavigateBack()) {
      return false;
    }

    const currentStep = this.userState.progress.currentStep;
    const previousStep = currentStep - 1;

    if (previousStep >= TrainingStep.ONBOARDING) {
      await this.navigateToStep(previousStep as TrainingStep);
      return true;
    }

    return false;
  }

  // ➡️ NAVIGUER VERS L'ÉTAPE SUIVANTE
  async navigateForward(): Promise<boolean> {
    if (!this.canNavigateForward()) {
      return false;
    }

    const currentStep = this.userState.progress.currentStep;
    const nextStep = currentStep + 1;

    if (nextStep <= TrainingStep.RESOURCES) {
      await this.navigateToStep(nextStep as TrainingStep);
      return true;
    }

    return false;
  }

  // 🎯 NAVIGUER VERS UNE ÉTAPE SPÉCIFIQUE
  async navigateToStep(targetStep: TrainingStep): Promise<boolean> {
    const currentStep = this.userState.progress.currentStep;

    // Vérifier si la navigation est autorisée
    if (!this.isStepAccessible(targetStep)) {
      console.warn(`Navigation vers l'étape ${targetStep} non autorisée`);
      return false;
    }

    // Sauvegarder l'état actuel si configuré
    if (this.config.autoSave) {
      await this.saveCurrentState();
    }

    // Émettre l'événement de changement
    const event: NavigationEvent = {
      type: 'step_change',
      fromStep: currentStep,
      toStep: targetStep,
      timestamp: new Date()
    };

    this.emitNavigationEvent(event);

    // Mettre à jour l'état utilisateur
    this.userState.progress.currentStep = targetStep;
    this.userState.progress.stepProgress = 0;
    this.userState.progress.timeSpentCurrentStep = 0;
    this.userState.progress.lastActivityAt = new Date();

    // Enregistrer dans l'historique
    this.navigationHistory.push(event);

    return true;
  }

  // 🔍 VÉRIFIER SI UNE ÉTAPE EST ACCESSIBLE
  private isStepAccessible(step: TrainingStep): boolean {
    // L'étape actuelle est toujours accessible
    if (step === this.userState.progress.currentStep) {
      return true;
    }

    // Navigation arrière autorisée si configurée
    if (step < this.userState.progress.currentStep && this.config.allowBackNavigation) {
      return true;
    }

    // Navigation avant seulement si l'étape est déverrouillée
    if (step > this.userState.progress.currentStep) {
      return this.userState.unlockedSteps.includes(step);
    }

    return false;
  }

  // ⬅️ VÉRIFIER SI ON PEUT NAVIGUER EN ARRIÈRE
  private canNavigateBack(): boolean {
    const currentStep = this.userState.progress.currentStep;
    return this.config.allowBackNavigation && currentStep > TrainingStep.ONBOARDING;
  }

  // ➡️ VÉRIFIER SI ON PEUT NAVIGUER EN AVANT
  private canNavigateForward(): boolean {
    const currentStep = this.userState.progress.currentStep;
    const nextStep = currentStep + 1;
    
    if (nextStep > TrainingStep.RESOURCES) {
      return false;
    }

    // Vérifier si l'étape suivante est déverrouillée
    return this.userState.unlockedSteps.includes(nextStep as TrainingStep);
  }

  // 📊 CALCULER LA PROGRESSION GLOBALE
  private calculateGlobalProgress(): number {
    const totalSteps = 5;
    const completedSteps = this.userState.completedSteps.length;
    const currentStepProgress = this.userState.progress.stepProgress;
    
    return Math.round(((completedSteps + currentStepProgress / 100) / totalSteps) * 100);
  }

  // ⏱️ CALCULER LE TEMPS RESTANT
  private calculateTimeRemaining(): number {
    const totalEstimatedTime = 160; // minutes total
    const timeSpent = this.userState.progress.timeSpent;
    return Math.max(0, totalEstimatedTime - timeSpent);
  }

  // 🍞 GÉNÉRER LE FIL D'ARIANE
  private generateBreadcrumb(): BreadcrumbItem[] {
    const breadcrumb: BreadcrumbItem[] = [];
    const currentStep = this.userState.progress.currentStep;

    for (let step = TrainingStep.ONBOARDING; step <= TrainingStep.RESOURCES; step++) {
      const config = TrainingStepConfigurationFactory.getConfiguration(step as TrainingStep);
      
      breadcrumb.push({
        step: step as TrainingStep,
        name: config?.name || `Étape ${step}`,
        completed: this.userState.completedSteps.includes(step as TrainingStep),
        current: step === currentStep,
        accessible: this.isStepAccessible(step as TrainingStep),
        url: step === currentStep ? undefined : `/training/step/${step}`
      });
    }

    return breadcrumb;
  }

  // 🎮 GÉNÉRER LES ACTIONS DE NAVIGATION
  private generateNavigationActions(): NavigationAction[] {
    const actions: NavigationAction[] = [];

    // Action "Précédent"
    if (this.canNavigateBack()) {
      actions.push({
        id: 'navigate_back',
        type: 'secondary',
        label: 'Précédent',
        description: 'Retourner à l\'étape précédente',
        icon: '⬅️',
        enabled: true,
        shortcut: 'Alt+←',
        action: () => this.navigateBack()
      });
    }

    // Action "Suivant"
    if (this.canNavigateForward()) {
      actions.push({
        id: 'navigate_forward',
        type: 'primary',
        label: 'Suivant',
        description: 'Passer à l\'étape suivante',
        icon: '➡️',
        enabled: true,
        shortcut: 'Alt+→',
        action: () => this.navigateForward()
      });
    }

    // Action "Aide"
    actions.push({
      id: 'get_help',
      type: 'secondary',
      label: 'Aide',
      description: 'Obtenir de l\'aide sur cette étape',
      icon: '❓',
      enabled: true,
      shortcut: 'F1',
      action: () => this.requestHelp()
    });

    // Action "Quitter" avec confirmation
    if (this.config.exitConfirmation) {
      actions.push({
        id: 'exit_training',
        type: 'danger',
        label: 'Quitter',
        description: 'Quitter la formation (progression sauvegardée)',
        icon: '🚪',
        enabled: true,
        shortcut: 'Ctrl+Q',
        action: () => this.requestExit()
      });
    }

    return actions;
  }

  // 🆘 DEMANDER DE L'AIDE
  private requestHelp(): void {
    const event: NavigationEvent = {
      type: 'help_request',
      data: { step: this.userState.progress.currentStep },
      timestamp: new Date()
    };
    
    this.emitNavigationEvent(event);
  }

  // 🚪 DEMANDER LA SORTIE
  private requestExit(): void {
    const event: NavigationEvent = {
      type: 'exit_request',
      data: { 
        step: this.userState.progress.currentStep,
        progress: this.userState.progress 
      },
      timestamp: new Date()
    };
    
    this.emitNavigationEvent(event);
  }

  // 💾 SAUVEGARDER L'ÉTAT ACTUEL
  private async saveCurrentState(): Promise<void> {
    // Implémentation de la sauvegarde
    // Sera connectée au système de persistance
    console.log('Sauvegarde de l\'état de navigation...');
  }

  // 📡 SYSTÈME D'ÉVÉNEMENTS
  addEventListener(eventType: string, callback: (event: NavigationEvent) => void): void {
    this.listeners.set(eventType, callback);
  }

  removeEventListener(eventType: string): void {
    this.listeners.delete(eventType);
  }

  private emitNavigationEvent(event: NavigationEvent): void {
    // Émettre vers tous les listeners
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Erreur dans le listener de navigation:', error);
      }
    });
  }

  // 📊 MÉTHODES D'INFORMATION
  getNavigationHistory(): NavigationEvent[] {
    return [...this.navigationHistory];
  }

  getCurrentStepConfig() {
    return TrainingStepConfigurationFactory.getConfiguration(this.userState.progress.currentStep);
  }

  getStepProgress(): number {
    return this.userState.progress.stepProgress;
  }

  // ⌨️ GESTION DES RACCOURCIS CLAVIER
  handleKeyboardShortcut(event: KeyboardEvent): boolean {
    if (!this.config.keyboardShortcuts) return false;

    const { key, altKey, ctrlKey } = event;

    // Alt + Flèche gauche : Précédent
    if (altKey && key === 'ArrowLeft') {
      event.preventDefault();
      this.navigateBack();
      return true;
    }

    // Alt + Flèche droite : Suivant
    if (altKey && key === 'ArrowRight') {
      event.preventDefault();
      this.navigateForward();
      return true;
    }

    // F1 : Aide
    if (key === 'F1') {
      event.preventDefault();
      this.requestHelp();
      return true;
    }

    // Ctrl + Q : Quitter
    if (ctrlKey && key === 'q') {
      event.preventDefault();
      this.requestExit();
      return true;
    }

    return false;
  }

  // 🔧 CONFIGURATION
  updateConfig(newConfig: Partial<NavigationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): NavigationConfig {
    return { ...this.config };
  }
}
