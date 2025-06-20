/**
 * 🧠 SERVICE DE GUIDAGE INTELLIGENT
 * IA contextuelle pour guider l'apprenant à chaque étape du parcours EBIOS RM
 * Remplace la confusion actuelle par un accompagnement personnalisé
 */

import { 
  TrainingStep, 
  UserTrainingState,
  WorkshopSubStep 
} from '../entities/LinearTrainingPath';
import { TrainingStepConfigurationFactory } from '../entities/TrainingStepConfigurations';
import { ValidationResult } from './ValidationCheckpointService';

// 🎯 TYPE DE GUIDAGE
export enum GuidanceType {
  WELCOME = 'welcome',
  INSTRUCTION = 'instruction',
  HINT = 'hint',
  WARNING = 'warning',
  ENCOURAGEMENT = 'encouragement',
  CORRECTION = 'correction',
  NEXT_STEP = 'next_step',
  HELP = 'help'
}

// 🎯 CONTEXTE DE GUIDAGE
export interface GuidanceContext {
  currentStep: TrainingStep;
  currentSubStep?: WorkshopSubStep;
  stepProgress: number;
  timeSpent: number;
  lastScore?: number;
  strugglingAreas: string[];
  userPreferences: UserGuidancePreferences;
  sessionData: any;
}

// 🎯 PRÉFÉRENCES DE GUIDAGE UTILISATEUR
export interface UserGuidancePreferences {
  verbosity: 'minimal' | 'normal' | 'detailed';
  encouragementFrequency: 'low' | 'medium' | 'high';
  hintTiming: 'immediate' | 'delayed' | 'on_request';
  language: 'fr' | 'en';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

// 🎯 MESSAGE DE GUIDAGE
export interface GuidanceMessage {
  id: string;
  type: GuidanceType;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actions?: GuidanceAction[];
  resources?: GuidanceResource[];
  timing: GuidanceTiming;
  personalization: GuidancePersonalization;
}

// 🎯 ACTION DE GUIDAGE
export interface GuidanceAction {
  id: string;
  label: string;
  description: string;
  type: 'navigate' | 'show_resource' | 'start_exercise' | 'get_help' | 'skip';
  enabled: boolean;
  primary: boolean;
  action: () => void;
}

// 🎯 RESSOURCE DE GUIDAGE
export interface GuidanceResource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'interactive' | 'example';
  url?: string;
  content?: string;
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 🎯 TIMING DU GUIDAGE
export interface GuidanceTiming {
  showImmediately: boolean;
  delayMs?: number;
  showOnce: boolean;
  conditions?: string[];
}

// 🎯 PERSONNALISATION DU GUIDAGE
export interface GuidancePersonalization {
  userName?: string;
  adaptToLevel: boolean;
  useEncouragement: boolean;
  contextualExamples: boolean;
}

// 🎯 RÈGLE DE GUIDAGE
export interface GuidanceRule {
  id: string;
  name: string;
  description: string;
  conditions: GuidanceCondition[];
  message: GuidanceMessage;
  priority: number;
  enabled: boolean;
}

// 🎯 CONDITION DE GUIDAGE
export interface GuidanceCondition {
  type: 'step' | 'progress' | 'time' | 'score' | 'attempts' | 'inactivity';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
  field?: string;
}

// 🎯 CLASSE PRINCIPALE DU SERVICE
export class IntelligentGuidanceService {
  private userState: UserTrainingState;
  private guidanceRules: GuidanceRule[] = [];
  private messageHistory: GuidanceMessage[] = [];
  private userPreferences: UserGuidancePreferences;
  private activeMessages: Map<string, GuidanceMessage> = new Map();

  constructor(userState: UserTrainingState, preferences?: Partial<UserGuidancePreferences>) {
    this.userState = userState;
    this.userPreferences = {
      verbosity: 'normal',
      encouragementFrequency: 'medium',
      hintTiming: 'delayed',
      language: 'fr',
      learningStyle: 'mixed',
      ...preferences
    };

    this.initializeGuidanceRules();
  }

  // 🏗️ INITIALISER LES RÈGLES DE GUIDAGE
  private initializeGuidanceRules(): void {
    this.guidanceRules = [
      // Règle d'accueil
      {
        id: 'welcome_onboarding',
        name: 'Accueil Onboarding',
        description: 'Message de bienvenue pour l\'onboarding',
        conditions: [
          { type: 'step', operator: 'equals', value: TrainingStep.ONBOARDING },
          { type: 'progress', operator: 'equals', value: 0 }
        ],
        message: this.createWelcomeMessage(),
        priority: 10,
        enabled: true
      },

      // Règle d'encouragement mi-parcours
      {
        id: 'encouragement_halfway',
        name: 'Encouragement Mi-parcours',
        description: 'Encouragement à 50% de progression',
        conditions: [
          { type: 'progress', operator: 'greater_than', value: 45, field: 'globalProgress' },
          { type: 'progress', operator: 'less_than', value: 55, field: 'globalProgress' }
        ],
        message: this.createEncouragementMessage(),
        priority: 5,
        enabled: true
      },

      // Règle d'aide pour difficulté
      {
        id: 'help_struggling',
        name: 'Aide Difficulté',
        description: 'Aide quand l\'utilisateur a des difficultés',
        conditions: [
          { type: 'attempts', operator: 'greater_than', value: 2 },
          { type: 'score', operator: 'less_than', value: 60 }
        ],
        message: this.createHelpMessage(),
        priority: 8,
        enabled: true
      },

      // Règle d'inactivité
      {
        id: 'inactivity_reminder',
        name: 'Rappel Inactivité',
        description: 'Rappel après inactivité prolongée',
        conditions: [
          { type: 'inactivity', operator: 'greater_than', value: 300000 } // 5 minutes
        ],
        message: this.createInactivityMessage(),
        priority: 6,
        enabled: true
      },

      // Règle de félicitations
      {
        id: 'congratulations_high_score',
        name: 'Félicitations Score Élevé',
        description: 'Félicitations pour un score élevé',
        conditions: [
          { type: 'score', operator: 'greater_than', value: 90 }
        ],
        message: this.createCongratulationsMessage(),
        priority: 7,
        enabled: true
      }
    ];
  }

  // 🎯 OBTENIR LE GUIDAGE CONTEXTUEL
  getContextualGuidance(context: GuidanceContext): GuidanceMessage[] {
    const applicableMessages: GuidanceMessage[] = [];

    // Évaluer chaque règle
    for (const rule of this.guidanceRules) {
      if (!rule.enabled) continue;

      if (this.evaluateRule(rule, context)) {
        // Vérifier si le message n'a pas déjà été montré (si showOnce)
        if (rule.message.timing.showOnce && this.wasMessageShown(rule.message.id)) {
          continue;
        }

        applicableMessages.push(rule.message);
      }
    }

    // Trier par priorité
    applicableMessages.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Personnaliser les messages
    return applicableMessages.map(msg => this.personalizeMessage(msg, context));
  }

  // 🔍 ÉVALUER UNE RÈGLE
  private evaluateRule(rule: GuidanceRule, context: GuidanceContext): boolean {
    return rule.conditions.every(condition => this.evaluateCondition(condition, context));
  }

  // 🔍 ÉVALUER UNE CONDITION
  private evaluateCondition(condition: GuidanceCondition, context: GuidanceContext): boolean {
    let value: any;

    switch (condition.type) {
      case 'step':
        value = context.currentStep;
        break;
      case 'progress':
        value = condition.field === 'globalProgress' 
          ? this.userState.progress.globalProgress 
          : context.stepProgress;
        break;
      case 'time':
        value = context.timeSpent;
        break;
      case 'score':
        value = context.lastScore || 0;
        break;
      case 'attempts':
        value = this.getAttemptCount(context.currentStep);
        break;
      case 'inactivity':
        value = Date.now() - this.userState.progress.lastActivityAt.getTime();
        break;
      default:
        return false;
    }

    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'contains':
        return Array.isArray(value) && value.includes(condition.value);
      default:
        return false;
    }
  }

  // 🎨 PERSONNALISER UN MESSAGE
  private personalizeMessage(message: GuidanceMessage, context: GuidanceContext): GuidanceMessage {
    const personalized = { ...message };

    // Personnalisation du contenu
    if (personalized.personalization.userName) {
      personalized.content = personalized.content.replace(
        '{userName}', 
        personalized.personalization.userName
      );
    }

    // Adaptation au niveau
    if (personalized.personalization.adaptToLevel) {
      const stepConfig = TrainingStepConfigurationFactory.getConfiguration(context.currentStep);
      if (stepConfig) {
        personalized.content = personalized.content.replace(
          '{stepName}', 
          stepConfig.name
        );
      }
    }

    // Exemples contextuels
    if (personalized.personalization.contextualExamples) {
      const example = this.getContextualExample(context.currentStep);
      personalized.content = personalized.content.replace('{example}', example);
    }

    return personalized;
  }

  // 🎯 CRÉER LES MESSAGES TYPES

  private createWelcomeMessage(): GuidanceMessage {
    return {
      id: 'welcome_onboarding',
      type: GuidanceType.WELCOME,
      title: '🎓 Bienvenue dans votre formation EBIOS RM !',
      content: 'Bonjour {userName} ! Je suis votre assistant intelligent pour cette formation. Je vais vous guider étape par étape vers la maîtrise d\'EBIOS RM. Commençons par découvrir ensemble cette méthodologie.',
      priority: 'high',
      actions: [
        {
          id: 'start_onboarding',
          label: 'Commencer',
          description: 'Démarrer l\'onboarding',
          type: 'navigate',
          enabled: true,
          primary: true,
          action: () => console.log('Démarrage onboarding')
        }
      ],
      timing: {
        showImmediately: true,
        showOnce: true
      },
      personalization: {
        adaptToLevel: true,
        useEncouragement: true,
        contextualExamples: false
      }
    };
  }

  private createEncouragementMessage(): GuidanceMessage {
    return {
      id: 'encouragement_halfway',
      type: GuidanceType.ENCOURAGEMENT,
      title: '🌟 Excellent progrès !',
      content: 'Félicitations ! Vous avez déjà parcouru la moitié de votre formation. Votre progression est remarquable. Continuez sur cette lancée, vous êtes sur la bonne voie pour devenir un expert EBIOS RM !',
      priority: 'medium',
      timing: {
        showImmediately: false,
        delayMs: 2000,
        showOnce: true
      },
      personalization: {
        adaptToLevel: false,
        useEncouragement: true,
        contextualExamples: false
      }
    };
  }

  private createHelpMessage(): GuidanceMessage {
    return {
      id: 'help_struggling',
      type: GuidanceType.HELP,
      title: '🆘 Besoin d\'aide ?',
      content: 'Je remarque que vous rencontrez quelques difficultés avec {stepName}. C\'est tout à fait normal ! Voici quelques ressources qui peuvent vous aider à mieux comprendre.',
      priority: 'high',
      resources: [
        {
          id: 'step_guide',
          title: 'Guide détaillé de l\'étape',
          type: 'document',
          estimatedTime: 5,
          difficulty: 'beginner'
        }
      ],
      actions: [
        {
          id: 'show_resources',
          label: 'Voir les ressources',
          description: 'Afficher les ressources d\'aide',
          type: 'show_resource',
          enabled: true,
          primary: true,
          action: () => console.log('Affichage ressources')
        }
      ],
      timing: {
        showImmediately: true,
        showOnce: false
      },
      personalization: {
        adaptToLevel: true,
        useEncouragement: true,
        contextualExamples: true
      }
    };
  }

  private createInactivityMessage(): GuidanceMessage {
    return {
      id: 'inactivity_reminder',
      type: GuidanceType.WARNING,
      title: '⏰ Toujours là ?',
      content: 'Vous semblez avoir fait une pause. Souhaitez-vous reprendre votre formation où vous l\'avez laissée ? Je peux vous rappeler où nous en étions.',
      priority: 'medium',
      actions: [
        {
          id: 'resume_training',
          label: 'Reprendre',
          description: 'Reprendre la formation',
          type: 'navigate',
          enabled: true,
          primary: true,
          action: () => console.log('Reprise formation')
        }
      ],
      timing: {
        showImmediately: true,
        showOnce: false
      },
      personalization: {
        adaptToLevel: false,
        useEncouragement: false,
        contextualExamples: false
      }
    };
  }

  private createCongratulationsMessage(): GuidanceMessage {
    return {
      id: 'congratulations_high_score',
      type: GuidanceType.ENCOURAGEMENT,
      title: '🎉 Score exceptionnel !',
      content: 'Bravo ! Votre score de {score}% est remarquable. Vous maîtrisez parfaitement cette étape. Vous êtes en excellente voie pour obtenir votre certification ANSSI !',
      priority: 'medium',
      timing: {
        showImmediately: true,
        showOnce: false
      },
      personalization: {
        adaptToLevel: false,
        useEncouragement: true,
        contextualExamples: false
      }
    };
  }

  // 🔧 MÉTHODES UTILITAIRES

  private getAttemptCount(step: TrainingStep): number {
    // Logique pour obtenir le nombre de tentatives
    return this.userState.attempts[`step_${step}`] || 0;
  }

  private wasMessageShown(messageId: string): boolean {
    return this.messageHistory.some(msg => msg.id === messageId);
  }

  private getContextualExample(step: TrainingStep): string {
    const examples: Record<TrainingStep, string> = {
      [TrainingStep.ONBOARDING]: 'Par exemple, dans un CHU, la sécurité des données patients est cruciale.',
      [TrainingStep.DISCOVERY]: 'Prenons l\'exemple du CHU Métropolitain que nous étudions.',
      [TrainingStep.WORKSHOPS]: 'Comme nous l\'avons vu avec le système d\'information du CHU.',
      [TrainingStep.CERTIFICATION]: 'Votre expertise sera validée par un cas concret.',
      [TrainingStep.RESOURCES]: 'Ces ressources vous accompagneront dans vos futurs projets.'
    };

    return examples[step] || '';
  }

  // 📊 MÉTHODES PUBLIQUES

  // 📝 ENREGISTRER UN MESSAGE MONTRÉ
  recordShownMessage(message: GuidanceMessage): void {
    this.messageHistory.push({
      ...message,
      id: `${message.id}_${Date.now()}`
    });
  }

  // 🎯 OBTENIR LE GUIDAGE POUR L'ÉTAPE ACTUELLE
  getCurrentStepGuidance(): GuidanceMessage[] {
    const context: GuidanceContext = {
      currentStep: this.userState.progress.currentStep,
      stepProgress: this.userState.progress.stepProgress,
      timeSpent: this.userState.progress.timeSpentCurrentStep,
      lastScore: this.userState.progress.scoresPerStep[this.userState.progress.currentStep],
      strugglingAreas: [],
      userPreferences: this.userPreferences,
      sessionData: {}
    };

    return this.getContextualGuidance(context);
  }

  // ⚙️ METTRE À JOUR LES PRÉFÉRENCES
  updatePreferences(newPreferences: Partial<UserGuidancePreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...newPreferences };
  }

  // 📋 OBTENIR L'HISTORIQUE DES MESSAGES
  getMessageHistory(): GuidanceMessage[] {
    return [...this.messageHistory];
  }

  // 🧹 NETTOYER LES MESSAGES ACTIFS
  clearActiveMessages(): void {
    this.activeMessages.clear();
  }
}
