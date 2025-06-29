/**
 * 🎓 ENTITÉ MÉTIER - SESSION DE FORMATION
 * Entité centrale du domaine formation EBIOS RM
 * Architecture Clean - Domain Layer
 */

export interface TrainingSessionId {
  value: string;
}

export interface LearnerId {
  value: string;
}

export enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum WorkshopType {
  WORKSHOP_1 = 1,
  WORKSHOP_2 = 2,
  WORKSHOP_3 = 3,
  WORKSHOP_4 = 4,
  WORKSHOP_5 = 5
}

export enum SectorType {
  FINANCE = 'finance',
  HEALTHCARE = 'healthcare',
  ENERGY = 'energy',
  DEFENSE = 'defense',
  GOVERNMENT = 'government',
  INDUSTRY = 'industry',
  EDUCATION = 'education',
  GENERIC = 'generic'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface TrainingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  currentWorkshop: WorkshopType;
  timeSpent: number; // en minutes
  lastActivity: Date;
  milestones: TrainingMilestone[];
}

export interface TrainingMilestone {
  id: string;
  name: string;
  description: string;
  achievedAt?: Date;
  requiredScore?: number;
  badge?: string;
}

export interface LearnerProfile {
  id: LearnerId;
  name: string;
  email: string;
  role: string;
  organization: string;
  sector: SectorType;
  experienceLevel: DifficultyLevel;
  learningObjectives: string[];
  preferences: LearningPreferences;
}

export interface LearningPreferences {
  language: string;
  pace: 'slow' | 'normal' | 'fast';
  interactionStyle: 'guided' | 'exploratory' | 'challenge';
  feedbackFrequency: 'immediate' | 'periodic' | 'final';
  contentFormat: 'text' | 'visual' | 'interactive' | 'mixed';
}

export interface TrainingConfiguration {
  workshopSequence: WorkshopType[];
  sectorCustomization: SectorType;
  difficultyLevel: DifficultyLevel;
  estimatedDuration: number; // en heures
  prerequisites: string[];
  learningObjectives: string[];
  assessmentCriteria: AssessmentCriteria[];
}

export interface AssessmentCriteria {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1
  minimumScore: number; // 0-100
  evaluationType: 'automatic' | 'ai_assisted' | 'manual';
}

/**
 * 🎯 ENTITÉ PRINCIPALE - SESSION DE FORMATION
 */
export class TrainingSession {
  private constructor(
    private readonly _id: TrainingSessionId,
    private readonly _learnerId: LearnerId,
    private readonly _configuration: TrainingConfiguration,
    private _status: TrainingStatus,
    private _progress: TrainingProgress,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _completedAt?: Date
  ) {}

  // 🏭 FACTORY METHOD
  static create(
    id: TrainingSessionId,
    learnerId: LearnerId,
    configuration: TrainingConfiguration
  ): TrainingSession {
    const now = new Date();
    const initialProgress: TrainingProgress = {
      currentStep: 1,
      totalSteps: this.calculateTotalSteps(configuration),
      completedSteps: [],
      currentWorkshop: configuration.workshopSequence[0],
      timeSpent: 0,
      lastActivity: now,
      milestones: []
    };

    return new TrainingSession(
      id,
      learnerId,
      configuration,
      TrainingStatus.NOT_STARTED,
      initialProgress,
      now,
      now
    );
  }

  // 🎯 MÉTHODES MÉTIER
  start(): void {
    if (this._status !== TrainingStatus.NOT_STARTED) {
      throw new Error('Session already started or completed');
    }
    
    this._status = TrainingStatus.IN_PROGRESS;
    this._updatedAt = new Date();
    this._progress.lastActivity = new Date();
  }

  pause(): void {
    if (this._status !== TrainingStatus.IN_PROGRESS) {
      throw new Error('Cannot pause session that is not in progress');
    }
    
    this._status = TrainingStatus.PAUSED;
    this._updatedAt = new Date();
  }

  resume(): void {
    if (this._status !== TrainingStatus.PAUSED) {
      throw new Error('Cannot resume session that is not paused');
    }
    
    this._status = TrainingStatus.IN_PROGRESS;
    this._updatedAt = new Date();
    this._progress.lastActivity = new Date();
  }

  completeStep(stepId: number, timeSpent: number): void {
    if (this._status !== TrainingStatus.IN_PROGRESS) {
      throw new Error('Cannot complete step when session is not in progress');
    }

    if (!this._progress.completedSteps.includes(stepId)) {
      this._progress.completedSteps.push(stepId);
      this._progress.timeSpent += timeSpent;
      this._progress.currentStep = Math.max(this._progress.currentStep, stepId + 1);
      this._progress.lastActivity = new Date();
      this._updatedAt = new Date();
    }

    // Vérifier si la session est terminée
    if (this._progress.completedSteps.length >= this._progress.totalSteps) {
      this.complete();
    }
  }

  complete(): void {
    this._status = TrainingStatus.COMPLETED;
    this._completedAt = new Date();
    this._updatedAt = new Date();
  }

  fail(reason: string): void {
    this._status = TrainingStatus.FAILED;
    this._updatedAt = new Date();
  }

  addMilestone(milestone: TrainingMilestone): void {
    milestone.achievedAt = new Date();
    this._progress.milestones.push(milestone);
    this._updatedAt = new Date();
  }

  // 🔍 GETTERS
  get id(): TrainingSessionId { return this._id; }
  get learnerId(): LearnerId { return this._learnerId; }
  get configuration(): TrainingConfiguration { return this._configuration; }
  get status(): TrainingStatus { return this._status; }
  get progress(): TrainingProgress { return { ...this._progress }; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get completedAt(): Date | undefined { return this._completedAt; }

  // 📊 MÉTHODES CALCULÉES
  get completionPercentage(): number {
    return (this._progress.completedSteps.length / this._progress.totalSteps) * 100;
  }

  get isActive(): boolean {
    return this._status === TrainingStatus.IN_PROGRESS;
  }

  get isCompleted(): boolean {
    return this._status === TrainingStatus.COMPLETED;
  }

  get estimatedTimeRemaining(): number {
    const completionRate = this.completionPercentage / 100;
    if (completionRate === 0) return this._configuration.estimatedDuration * 60;
    
    const timePerPercent = this._progress.timeSpent / (completionRate * 100);
    return Math.max(0, (100 - this.completionPercentage) * timePerPercent);
  }

  // 🛠️ MÉTHODES PRIVÉES
  private static calculateTotalSteps(configuration: TrainingConfiguration): number {
    // Calcul basé sur la séquence d'ateliers et la complexité
    return configuration.workshopSequence.length * 10; // 10 étapes par atelier en moyenne
  }

  // 📋 VALIDATION
  isValid(): boolean {
    return (
      this._id.value.length > 0 &&
      this._learnerId.value.length > 0 &&
      this._configuration.workshopSequence.length > 0 &&
      this._progress.totalSteps > 0
    );
  }

  // 🔄 SÉRIALISATION
  toSnapshot(): TrainingSessionSnapshot {
    return {
      id: this._id.value,
      learnerId: this._learnerId.value,
      configuration: this._configuration,
      status: this._status,
      progress: this._progress,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      completedAt: this._completedAt?.toISOString()
    };
  }

  static fromSnapshot(snapshot: TrainingSessionSnapshot): TrainingSession {
    return new TrainingSession(
      { value: snapshot.id },
      { value: snapshot.learnerId },
      snapshot.configuration,
      snapshot.status,
      snapshot.progress,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt),
      snapshot.completedAt ? new Date(snapshot.completedAt) : undefined
    );
  }
}

export interface TrainingSessionSnapshot {
  id: string;
  learnerId: string;
  configuration: TrainingConfiguration;
  status: TrainingStatus;
  progress: TrainingProgress;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
