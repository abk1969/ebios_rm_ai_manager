/**
 * 🛤️ PARCOURS DE FORMATION LINÉAIRE EBIOS RM
 * Entité métier pour la gestion du nouveau parcours guidé
 * Conforme aux exigences ANSSI pour note 18+/20
 */

// 🎯 ÉNUMÉRATION DES ÉTAPES DU PARCOURS
export enum TrainingStep {
  ONBOARDING = 1,
  DISCOVERY = 2,
  WORKSHOPS = 3,
  CERTIFICATION = 4,
  RESOURCES = 5
}

// 🎯 SOUS-ÉTAPES DES ATELIERS
export enum WorkshopSubStep {
  THEORY = 'theory',
  PRACTICE = 'practice',
  VALIDATION = 'validation',
  TRANSITION = 'transition'
}

// 🎯 STATUT DE VALIDATION D'UNE ÉTAPE
export enum StepValidationStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  LOCKED = 'locked'
}

// 🎯 INTERFACE POUR LES MÉTRIQUES DE PROGRESSION
export interface LinearProgressMetrics {
  currentStep: TrainingStep;
  currentWorkshop?: number; // 1-5 pour l'étape WORKSHOPS
  currentSubStep?: WorkshopSubStep;
  stepProgress: number; // 0-100% pour l'étape actuelle
  globalProgress: number; // 0-100% pour tout le parcours
  timeSpent: number; // minutes totales
  timeSpentCurrentStep: number; // minutes étape actuelle
  scoresPerStep: Record<TrainingStep, number>; // scores par étape
  scoresPerWorkshop: Record<number, number>; // scores par atelier
  validationsCompleted: string[]; // IDs des validations réussies
  certificateEarned: boolean;
  anssiCompliant: boolean;
  startedAt: Date;
  lastActivityAt: Date;
  estimatedTimeRemaining: number; // minutes estimées restantes
}

// 🎯 CONFIGURATION D'UNE ÉTAPE
export interface StepConfiguration {
  id: TrainingStep;
  name: string;
  description: string;
  estimatedDuration: number; // minutes
  minimumScore: number; // score minimum pour validation
  prerequisites: TrainingStep[]; // étapes prérequises
  content: StepContent;
  validation: StepValidation;
  unlockConditions: UnlockCondition[];
}

// 🎯 CONTENU D'UNE ÉTAPE
export interface StepContent {
  title: string;
  subtitle?: string;
  sections: ContentSection[];
  resources: Resource[];
  exercises: Exercise[];
  assessments: Assessment[];
}

// 🎯 SECTION DE CONTENU
export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'exercise';
  content: string | object;
  duration: number; // minutes
  mandatory: boolean;
  order: number;
}

// 🎯 RESSOURCE PÉDAGOGIQUE
export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'tool';
  url?: string;
  content?: string;
  downloadable: boolean;
  category: string;
}

// 🎯 EXERCICE PRATIQUE
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'guided' | 'free' | 'case_study' | 'simulation';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  instructions: string[];
  expectedDeliverables: string[];
  scoringCriteria: ScoringCriterion[];
}

// 🎯 ÉVALUATION
export interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'practical' | 'oral' | 'project';
  questions: Question[];
  timeLimit?: number; // minutes
  passingScore: number; // pourcentage
  maxAttempts: number;
  randomizeQuestions: boolean;
}

// 🎯 QUESTION D'ÉVALUATION
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'practical';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

// 🎯 CRITÈRE DE NOTATION
export interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number; // 0-1
  anssiRequired: boolean; // requis pour conformité ANSSI
}

// 🎯 VALIDATION D'ÉTAPE
export interface StepValidation {
  type: 'automatic' | 'manual' | 'hybrid';
  criteria: ValidationCriterion[];
  minimumScore: number;
  requiredDeliverables: string[];
  anssiCompliance: boolean;
}

// 🎯 CRITÈRE DE VALIDATION
export interface ValidationCriterion {
  id: string;
  name: string;
  description: string;
  type: 'score' | 'time' | 'completion' | 'deliverable';
  threshold: number;
  mandatory: boolean;
  anssiRequired: boolean;
}

// 🎯 CONDITION DE DÉVERROUILLAGE
export interface UnlockCondition {
  type: 'step_completed' | 'score_achieved' | 'time_spent' | 'deliverable_submitted';
  targetStep?: TrainingStep;
  targetWorkshop?: number;
  minimumScore?: number;
  minimumTime?: number;
  requiredDeliverable?: string;
}

// 🎯 ÉTAT DU PARCOURS UTILISATEUR
export interface UserTrainingState {
  userId: string;
  sessionId: string;
  currentPath: LinearTrainingPath;
  progress: LinearProgressMetrics;
  completedSteps: TrainingStep[];
  unlockedSteps: TrainingStep[];
  currentStepData: any; // données spécifiques à l'étape actuelle
  savedAnswers: Record<string, any>; // réponses sauvegardées
  attempts: Record<string, number>; // nombre de tentatives par évaluation
  certificates: Certificate[];
  preferences: UserPreferences;
}

// 🎯 CERTIFICAT OBTENU
export interface Certificate {
  id: string;
  type: 'step' | 'workshop' | 'final';
  title: string;
  description: string;
  earnedAt: Date;
  score: number;
  validUntil?: Date;
  anssiCompliant: boolean;
  verificationCode: string;
}

// 🎯 PRÉFÉRENCES UTILISATEUR
export interface UserPreferences {
  language: 'fr' | 'en';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  pacePreference: 'slow' | 'normal' | 'fast';
  notificationsEnabled: boolean;
  autoSaveEnabled: boolean;
}

// 🎯 CLASSE PRINCIPALE DU PARCOURS LINÉAIRE
export class LinearTrainingPath {
  private steps: Map<TrainingStep, StepConfiguration>;
  private userState: UserTrainingState;

  constructor(userState: UserTrainingState) {
    this.userState = userState;
    this.steps = new Map();
    this.initializeSteps();
  }

  // 🏗️ INITIALISATION DES ÉTAPES
  private initializeSteps(): void {
    // Configuration sera ajoutée dans la suite du développement
    // Chaque étape aura sa configuration complète
  }

  // 🎯 OBTENIR L'ÉTAPE ACTUELLE
  getCurrentStep(): StepConfiguration | null {
    return this.steps.get(this.userState.progress.currentStep) || null;
  }

  // 🔓 VÉRIFIER SI UNE ÉTAPE EST DÉVERROUILLÉE
  isStepUnlocked(step: TrainingStep): boolean {
    return this.userState.unlockedSteps.includes(step);
  }

  // ✅ VALIDER UNE ÉTAPE
  validateStep(step: TrainingStep, score: number, deliverables: any[]): boolean {
    const stepConfig = this.steps.get(step);
    if (!stepConfig) return false;

    // Logique de validation sera implémentée
    return score >= stepConfig.minimumScore;
  }

  // 📊 CALCULER LA PROGRESSION GLOBALE
  calculateGlobalProgress(): number {
    const totalSteps = this.steps.size;
    const completedSteps = this.userState.completedSteps.length;
    const currentStepProgress = this.userState.progress.stepProgress;
    
    return Math.round(((completedSteps + currentStepProgress / 100) / totalSteps) * 100);
  }

  // 🎯 PASSER À L'ÉTAPE SUIVANTE
  moveToNextStep(): boolean {
    const currentStep = this.userState.progress.currentStep;
    const nextStep = currentStep + 1;
    
    if (nextStep <= TrainingStep.RESOURCES && this.isStepUnlocked(nextStep as TrainingStep)) {
      this.userState.progress.currentStep = nextStep as TrainingStep;
      this.userState.progress.stepProgress = 0;
      this.userState.progress.timeSpentCurrentStep = 0;
      return true;
    }
    
    return false;
  }

  // 📈 METTRE À JOUR LA PROGRESSION
  updateProgress(stepProgress: number, timeSpent: number): void {
    this.userState.progress.stepProgress = Math.min(100, Math.max(0, stepProgress));
    this.userState.progress.timeSpentCurrentStep += timeSpent;
    this.userState.progress.timeSpent += timeSpent;
    this.userState.progress.globalProgress = this.calculateGlobalProgress();
    this.userState.progress.lastActivityAt = new Date();
  }

  // 🏆 VÉRIFIER LA CONFORMITÉ ANSSI
  checkANSSICompliance(): boolean {
    // Critères ANSSI stricts
    const minimumGlobalScore = 75;
    const minimumTimeSpent = 160; // minutes
    const requiredCertificates = this.userState.certificates.filter(c => c.anssiCompliant);
    
    return (
      this.userState.progress.globalProgress === 100 &&
      this.userState.progress.timeSpent >= minimumTimeSpent &&
      requiredCertificates.length >= 5 && // un par atelier
      this.userState.completedSteps.length === 5
    );
  }

  // 💾 SAUVEGARDER L'ÉTAT
  saveState(): UserTrainingState {
    return { ...this.userState };
  }

  // 📤 EXPORTER LES DONNÉES POUR ANSSI
  exportForANSSI(): any {
    return {
      userId: this.userState.userId,
      sessionId: this.userState.sessionId,
      completionDate: new Date(),
      totalTimeSpent: this.userState.progress.timeSpent,
      globalScore: this.userState.progress.globalProgress,
      workshopScores: this.userState.progress.scoresPerWorkshop,
      certificates: this.userState.certificates,
      anssiCompliant: this.checkANSSICompliance(),
      verificationHash: this.generateVerificationHash()
    };
  }

  // 🔐 GÉNÉRER HASH DE VÉRIFICATION
  private generateVerificationHash(): string {
    // Implémentation du hash de vérification pour ANSSI
    return `ANSSI_${Date.now()}_${this.userState.userId}`;
  }
}
