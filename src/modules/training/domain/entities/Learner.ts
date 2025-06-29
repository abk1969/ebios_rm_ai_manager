/**
 * 🎓 ENTITÉ MÉTIER - APPRENANT
 * Représente un apprenant dans le système de formation EBIOS RM
 * Architecture Clean - Domain Layer
 */

import { LearnerId, SectorType, DifficultyLevel, LearningPreferences } from './TrainingSession';

export enum LearnerRole {
  RSSI = 'rssi',
  SECURITY_ANALYST = 'security_analyst',
  RISK_MANAGER = 'risk_manager',
  AUDITOR = 'auditor',
  CONSULTANT = 'consultant',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  STUDENT = 'student',
  OTHER = 'other'
}

export enum CertificationLevel {
  NONE = 'none',
  FOUNDATION = 'foundation',
  PRACTITIONER = 'practitioner',
  EXPERT = 'expert',
  MASTER = 'master'
}

export interface LearnerSkills {
  cybersecurity: number; // 0-100
  riskManagement: number;
  ebiosMethodology: number;
  technicalKnowledge: number;
  regulatoryKnowledge: number;
  communicationSkills: number;
}

export interface LearningHistory {
  completedSessions: string[];
  totalHoursSpent: number;
  averageScore: number;
  certifications: Certification[];
  badges: Badge[];
  lastActivity: Date;
}

export interface Certification {
  id: string;
  name: string;
  level: CertificationLevel;
  issuedAt: Date;
  expiresAt?: Date;
  issuer: string;
  credentialId: string;
  verificationUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  category: BadgeCategory;
  rarity: BadgeRarity;
}

export enum BadgeCategory {
  COMPLETION = 'completion',
  EXCELLENCE = 'excellence',
  SPEED = 'speed',
  CONSISTENCY = 'consistency',
  COLLABORATION = 'collaboration',
  INNOVATION = 'innovation'
}

export enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface LearnerGoals {
  shortTerm: string[];
  longTerm: string[];
  targetCertification?: CertificationLevel;
  completionDeadline?: Date;
  focusAreas: string[];
}

export interface LearnerMetrics {
  engagementScore: number; // 0-100
  progressConsistency: number; // 0-100
  knowledgeRetention: number; // 0-100
  practicalApplication: number; // 0-100
  collaborationScore: number; // 0-100
  overallPerformance: number; // 0-100
}

/**
 * 🎯 ENTITÉ PRINCIPALE - APPRENANT
 */
export class Learner {
  private constructor(
    private readonly _id: LearnerId,
    private _name: string,
    private _email: string,
    private _role: LearnerRole,
    private _organization: string,
    private _sector: SectorType,
    private _experienceLevel: DifficultyLevel,
    private _skills: LearnerSkills,
    private _preferences: LearningPreferences,
    private _goals: LearnerGoals,
    private _history: LearningHistory,
    private _metrics: LearnerMetrics,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _isActive: boolean = true
  ) {}

  // 🏭 FACTORY METHOD
  static create(
    id: LearnerId,
    name: string,
    email: string,
    role: LearnerRole,
    organization: string,
    sector: SectorType,
    experienceLevel: DifficultyLevel
  ): Learner {
    const now = new Date();
    
    const initialSkills: LearnerSkills = {
      cybersecurity: this.getInitialSkillLevel(experienceLevel),
      riskManagement: this.getInitialSkillLevel(experienceLevel),
      ebiosMethodology: 0, // Toujours 0 au début
      technicalKnowledge: this.getInitialSkillLevel(experienceLevel),
      regulatoryKnowledge: this.getInitialSkillLevel(experienceLevel),
      communicationSkills: this.getInitialSkillLevel(experienceLevel)
    };

    const initialPreferences: LearningPreferences = {
      language: 'fr',
      pace: 'normal',
      interactionStyle: 'guided',
      feedbackFrequency: 'periodic',
      contentFormat: 'mixed'
    };

    const initialGoals: LearnerGoals = {
      shortTerm: [],
      longTerm: [],
      focusAreas: []
    };

    const initialHistory: LearningHistory = {
      completedSessions: [],
      totalHoursSpent: 0,
      averageScore: 0,
      certifications: [],
      badges: [],
      lastActivity: now
    };

    const initialMetrics: LearnerMetrics = {
      engagementScore: 50,
      progressConsistency: 50,
      knowledgeRetention: 50,
      practicalApplication: 50,
      collaborationScore: 50,
      overallPerformance: 50
    };

    return new Learner(
      id,
      name,
      email,
      role,
      organization,
      sector,
      experienceLevel,
      initialSkills,
      initialPreferences,
      initialGoals,
      initialHistory,
      initialMetrics,
      now,
      now
    );
  }

  // 🎯 MÉTHODES MÉTIER
  updateProfile(updates: Partial<{
    name: string;
    email: string;
    role: LearnerRole;
    organization: string;
    sector: SectorType;
    experienceLevel: DifficultyLevel;
  }>): void {
    if (updates.name) this._name = updates.name;
    if (updates.email) this._email = updates.email;
    if (updates.role) this._role = updates.role;
    if (updates.organization) this._organization = updates.organization;
    if (updates.sector) this._sector = updates.sector;
    if (updates.experienceLevel) this._experienceLevel = updates.experienceLevel;
    
    this._updatedAt = new Date();
  }

  updatePreferences(preferences: Partial<LearningPreferences>): void {
    this._preferences = { ...this._preferences, ...preferences };
    this._updatedAt = new Date();
  }

  updateGoals(goals: Partial<LearnerGoals>): void {
    this._goals = { ...this._goals, ...goals };
    this._updatedAt = new Date();
  }

  updateSkills(skillUpdates: Partial<LearnerSkills>): void {
    this._skills = { ...this._skills, ...skillUpdates };
    this._updatedAt = new Date();
  }

  completeSession(sessionId: string, hoursSpent: number, score: number): void {
    if (!this._history.completedSessions.includes(sessionId)) {
      this._history.completedSessions.push(sessionId);
      this._history.totalHoursSpent += hoursSpent;
      
      // Recalculer la moyenne
      const totalSessions = this._history.completedSessions.length;
      this._history.averageScore = 
        (this._history.averageScore * (totalSessions - 1) + score) / totalSessions;
      
      this._history.lastActivity = new Date();
      this._updatedAt = new Date();
      
      // Mettre à jour les métriques
      this.updateMetricsAfterSession(score, hoursSpent);
    }
  }

  awardBadge(badge: Badge): void {
    const existingBadge = this._history.badges.find(b => b.id === badge.id);
    if (!existingBadge) {
      this._history.badges.push(badge);
      this._updatedAt = new Date();
    }
  }

  awardCertification(certification: Certification): void {
    const existingCert = this._history.certifications.find(c => c.id === certification.id);
    if (!existingCert) {
      this._history.certifications.push(certification);
      this._updatedAt = new Date();
    }
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  reactivate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  // 🔍 GETTERS
  get id(): LearnerId { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get role(): LearnerRole { return this._role; }
  get organization(): string { return this._organization; }
  get sector(): SectorType { return this._sector; }
  get experienceLevel(): DifficultyLevel { return this._experienceLevel; }
  get skills(): LearnerSkills { return { ...this._skills }; }
  get preferences(): LearningPreferences { return { ...this._preferences }; }
  get goals(): LearnerGoals { return { ...this._goals }; }
  get history(): LearningHistory { return { ...this._history }; }
  get metrics(): LearnerMetrics { return { ...this._metrics }; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get isActive(): boolean { return this._isActive; }

  // 📊 MÉTHODES CALCULÉES
  get overallSkillLevel(): number {
    const skills = Object.values(this._skills);
    return skills.reduce((sum, skill) => sum + skill, 0) / skills.length;
  }

  get recommendedDifficulty(): DifficultyLevel {
    const skillLevel = this.overallSkillLevel;
    if (skillLevel < 25) return DifficultyLevel.BEGINNER;
    if (skillLevel < 50) return DifficultyLevel.INTERMEDIATE;
    if (skillLevel < 75) return DifficultyLevel.ADVANCED;
    return DifficultyLevel.EXPERT;
  }

  get isEligibleForCertification(): boolean {
    return (
      this._history.completedSessions.length >= 5 &&
      this._history.averageScore >= 75 &&
      this.overallSkillLevel >= 70
    );
  }

  // 🛠️ MÉTHODES PRIVÉES
  private static getInitialSkillLevel(experienceLevel: DifficultyLevel): number {
    switch (experienceLevel) {
      case DifficultyLevel.BEGINNER: return 10;
      case DifficultyLevel.INTERMEDIATE: return 30;
      case DifficultyLevel.ADVANCED: return 50;
      case DifficultyLevel.EXPERT: return 70;
      default: return 10;
    }
  }

  private updateMetricsAfterSession(score: number, hoursSpent: number): void {
    // Logique de mise à jour des métriques basée sur la performance
    const performanceImpact = (score - 50) / 50; // -1 à 1
    
    this._metrics.overallPerformance = Math.max(0, Math.min(100, 
      this._metrics.overallPerformance + performanceImpact * 5
    ));
    
    // Mise à jour de l'engagement basée sur la régularité
    const daysSinceLastActivity = Math.floor(
      (Date.now() - this._history.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastActivity <= 1) {
      this._metrics.engagementScore = Math.min(100, this._metrics.engagementScore + 2);
    } else if (daysSinceLastActivity > 7) {
      this._metrics.engagementScore = Math.max(0, this._metrics.engagementScore - 5);
    }
  }

  // 📋 VALIDATION
  isValid(): boolean {
    return (
      this._id.value.length > 0 &&
      this._name.length > 0 &&
      this._email.includes('@') &&
      this._organization.length > 0
    );
  }

  // 🔄 SÉRIALISATION
  toSnapshot(): LearnerSnapshot {
    return {
      id: this._id.value,
      name: this._name,
      email: this._email,
      role: this._role,
      organization: this._organization,
      sector: this._sector,
      experienceLevel: this._experienceLevel,
      skills: this._skills,
      preferences: this._preferences,
      goals: this._goals,
      history: this._history,
      metrics: this._metrics,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      isActive: this._isActive
    };
  }

  static fromSnapshot(snapshot: LearnerSnapshot): Learner {
    return new Learner(
      { value: snapshot.id },
      snapshot.name,
      snapshot.email,
      snapshot.role,
      snapshot.organization,
      snapshot.sector,
      snapshot.experienceLevel,
      snapshot.skills,
      snapshot.preferences,
      snapshot.goals,
      snapshot.history,
      snapshot.metrics,
      new Date(snapshot.createdAt),
      new Date(snapshot.updatedAt),
      snapshot.isActive
    );
  }
}

export interface LearnerSnapshot {
  id: string;
  name: string;
  email: string;
  role: LearnerRole;
  organization: string;
  sector: SectorType;
  experienceLevel: DifficultyLevel;
  skills: LearnerSkills;
  preferences: LearningPreferences;
  goals: LearnerGoals;
  history: LearningHistory;
  metrics: LearnerMetrics;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
