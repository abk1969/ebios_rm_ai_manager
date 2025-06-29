/**
 * 🎓 MODULE FORMATION - POINT D'ENTRÉE PRINCIPAL
 * Export centralisé de tous les composants et services du module formation
 * Architecture Clean - Barrel exports
 */

// 🏛️ DOMAIN LAYER
export * from './domain/entities/TrainingSession';
export * from './domain/entities/Learner';
export * from './domain/repositories/TrainingRepository';

// 🎮 APPLICATION LAYER
export * from './application/usecases/StartTrainingSessionUseCase';

// 🔌 INFRASTRUCTURE LAYER
export * from './infrastructure/events/TrainingEventBus';
export * from './infrastructure/ai/TrainingInstructorAgent';

// 🎨 PRESENTATION LAYER

// 🎯 INTERFACES UNIFIÉES (RECOMMANDÉES)
export * from './presentation/components/UnifiedTrainingInterface';
export * from './presentation/components/UnifiedModeSelector';
export * from './presentation/components/UnifiedProgressDashboard';
export * from './presentation/components/UnifiedTrainingNavigator';

// 🧪 OUTILS DE TEST ET VALIDATION
export * from './presentation/components/TrainingModulesValidator';

// 🎯 SERVICES D'HARMONISATION
export {
  TrainingHarmonizationService,
  type UnifiedTrainingData,
  type UnifiedProgress,
  type WorkshopCompletion,
  type UnifiedInteraction,
  type UnifiedAchievement
} from './domain/services/TrainingHarmonizationService';
export * from './domain/services/UnifiedDataManager';
export * from './domain/services/UnifiedMetricsManager';

// 🎯 INTERFACES SPÉCIALISÉES
export * from './presentation/stores/trainingStore';
export * from './presentation/components/TrainingInterface';
export * from './presentation/components/TrainingChatInterface';
export * from './presentation/components/TrainingChatInterfaceSimple';
export * from './presentation/components/IntegratedWorkshopManager';
export * from './presentation/components/EbiosTrainingModule';

// 🎯 COMPOSANTS UTILITAIRES
export * from './presentation/components/TrainingProgressPanel';
export * from './presentation/components/TrainingResourcesPanel';
export * from './presentation/components/TrainingHelpPanel';
export * from './presentation/components/TrainingNotifications';
export * from './presentation/components/TrainingDebugPanel';
export * from './presentation/components/SystemActionsMessage';
export * from './presentation/components/QuizMessage';
export * from './presentation/components/InfoCardMessage';
export * from './presentation/components/StandardChatMessage';

// 🎯 TYPES PRINCIPAUX
export type {
  TrainingSession,
  TrainingSessionId,
  LearnerId,
  TrainingStatus,
  WorkshopType,
  SectorType,
  DifficultyLevel,
  TrainingProgress,
  TrainingConfiguration,
  LearningPreferences
} from './domain/entities/TrainingSession';

export type {
  Learner,
  LearnerRole,
  CertificationLevel,
  LearnerSkills,
  LearningHistory
} from './domain/entities/Learner';

export {
  TrainingEventType,
  TrainingEventFactory,
  trainingEventBus
} from './infrastructure/events/TrainingEventBus';

export type {
  TrainingEvent,
  EventMetadata,
  EventHandler
} from './infrastructure/events/TrainingEventBus';

export type {
  TrainingInstruction,
  InstructionType,
  InstructionContext,
  PersonalizationData,
  InteractionStyle
} from './infrastructure/ai/TrainingInstructorAgent';

export type {
  TrainingState,
  TrainingActions,
  ConversationMessage,
  UINotification,
  TrainingError
} from './presentation/stores/trainingStore';

// 🎯 CONSTANTES
export const TRAINING_MODULE_VERSION = '1.0.0';
export const TRAINING_MODULE_NAME = 'EBIOS RM Interactive Training';

// 🎯 CONFIGURATION PAR DÉFAUT
export const DEFAULT_TRAINING_CONFIG = {
  maxSessionDuration: 8 * 60, // 8 heures en minutes
  autoSaveInterval: 30, // 30 secondes
  maxConversationHistory: 100,
  defaultLanguage: 'fr',
  defaultTheme: 'light' as const,
  notificationDuration: 5000, // 5 secondes
  aiResponseTimeout: 30000, // 30 secondes
  maxFileUploadSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'],
  workshopStepsCount: {
    1: 10, // Atelier 1: 10 étapes
    2: 12, // Atelier 2: 12 étapes
    3: 8,  // Atelier 3: 8 étapes
    4: 15, // Atelier 4: 15 étapes
    5: 10  // Atelier 5: 10 étapes
  }
};

// 🎯 HOOKS UTILITAIRES
export { 
  useTrainingStore,
  useCurrentSession,
  useSessionStatus,
  useCurrentLearner,
  useConversation,
  useProgress,
  useUI,
  useMetrics,
  useErrors,
  useIsOnline,
  useTrainingActions,
  persistTrainingState,
  trackTrainingEvents
} from './presentation/stores/trainingStore';

export { useNotifications } from './presentation/components/TrainingNotifications';

// 🎯 SERVICES PRINCIPAUX
// Déjà exportés plus haut

// 🎯 UTILITAIRES
export const TrainingUtils = {
  /**
   * Génère un ID unique pour une session
   */
  generateSessionId: (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  },

  /**
   * Génère un ID unique pour un apprenant
   */
  generateLearnerId: (): string => {
    return `learner_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  },

  /**
   * Calcule la durée estimée d'un atelier
   */
  calculateWorkshopDuration: (workshopId: number, difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'): number => {
    const baseDuration = DEFAULT_TRAINING_CONFIG.workshopStepsCount[workshopId as keyof typeof DEFAULT_TRAINING_CONFIG.workshopStepsCount] * 15; // 15 min par étape
    
    const difficultyMultiplier = {
      beginner: 1.5,
      intermediate: 1.0,
      advanced: 0.8,
      expert: 0.6
    };

    return Math.round(baseDuration * difficultyMultiplier[difficulty]);
  },

  /**
   * Formate une durée en minutes vers un format lisible
   */
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${mins}min`;
    }
  },

  /**
   * Valide un email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Génère une couleur basée sur un pourcentage
   */
  getProgressColor: (percentage: number): string => {
    if (percentage < 25) return 'text-red-600 bg-red-100';
    if (percentage < 50) return 'text-yellow-600 bg-yellow-100';
    if (percentage < 75) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  },

  /**
   * Détermine le niveau de difficulté recommandé basé sur l'expérience
   */
  getRecommendedDifficulty: (skillLevel: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' => {
    if (skillLevel < 25) return 'beginner';
    if (skillLevel < 50) return 'intermediate';
    if (skillLevel < 75) return 'advanced';
    return 'expert';
  },

  /**
   * Calcule le score d'engagement basé sur les métriques
   */
  calculateEngagementScore: (
    interactionCount: number,
    sessionDuration: number,
    responseQuality: number
  ): number => {
    const interactionScore = Math.min(100, interactionCount * 2);
    const durationScore = Math.min(100, sessionDuration / 60 * 10); // 10 points par minute
    const qualityScore = responseQuality;
    
    return Math.round((interactionScore + durationScore + qualityScore) / 3);
  }
};

// 🎯 VALIDATEURS
export const TrainingValidators = {
  /**
   * Valide une configuration de formation
   */
  validateTrainingConfiguration: (config: Partial<{
    workshopSequence: number[];
    estimatedDuration: number;
  }>): string[] => {
    const errors: string[] = [];
    
    if (!config.workshopSequence || config.workshopSequence.length === 0) {
      errors.push('La séquence d\'ateliers ne peut pas être vide');
    }
    
    if (config.workshopSequence?.some((w: number) => w < 1 || w > 5)) {
      errors.push('Les ateliers doivent être entre 1 et 5');
    }
    
    if (config.estimatedDuration && config.estimatedDuration < 30) {
      errors.push('La durée estimée doit être d\'au moins 30 minutes');
    }
    
    return errors;
  },

  /**
   * Valide un profil d'apprenant
   */
  validateLearnerProfile: (profile: Partial<{
    name: string;
    email: string;
    organization: string;
  }>): string[] => {
    const errors: string[] = [];
    
    if (!profile.name || profile.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!profile.email || !TrainingUtils.isValidEmail(profile.email)) {
      errors.push('L\'email n\'est pas valide');
    }
    
    if (!profile.organization || profile.organization.trim().length < 2) {
      errors.push('L\'organisation doit être spécifiée');
    }
    
    return errors;
  }
};

// 🎯 ERREURS PERSONNALISÉES
export class TrainingModuleError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'TrainingModuleError';
  }
}

export class TrainingSessionNotFoundError extends TrainingModuleError {
  constructor(sessionId: string) {
    super(
      `Session de formation non trouvée: ${sessionId}`,
      'SESSION_NOT_FOUND',
      { sessionId }
    );
  }
}

export class LearnerNotFoundError extends TrainingModuleError {
  constructor(learnerId: string) {
    super(
      `Apprenant non trouvé: ${learnerId}`,
      'LEARNER_NOT_FOUND',
      { learnerId }
    );
  }
}

export class InvalidConfigurationError extends TrainingModuleError {
  constructor(errors: string[]) {
    super(
      `Configuration invalide: ${errors.join(', ')}`,
      'INVALID_CONFIGURATION',
      { errors }
    );
  }
}

// 🎯 VERSION ET MÉTADONNÉES
export const TRAINING_MODULE_METADATA = {
  version: TRAINING_MODULE_VERSION,
  name: TRAINING_MODULE_NAME,
  description: 'Module de formation interactive EBIOS RM avec IA',
  author: 'EBIOS AI Manager Team',
  license: 'Proprietary',
  dependencies: {
    react: '^18.0.0',
    zustand: '^4.0.0',
    'lucide-react': '^0.263.0'
  },
  features: [
    'Formation interactive avec IA',
    'Progression temps réel',
    'Adaptation sectorielle',
    'Certification automatique',
    'Support multi-appareils',
    'Ressources pédagogiques',
    'Analytics avancés'
  ],
  supportedLanguages: ['fr', 'en'],
  supportedSectors: [
    'finance',
    'healthcare', 
    'energy',
    'defense',
    'government',
    'industry',
    'education',
    'generic'
  ]
} as const;
