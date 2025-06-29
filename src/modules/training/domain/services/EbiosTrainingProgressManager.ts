/**
 * 🎯 GESTIONNAIRE DE PROGRESSION FORMATION EBIOS RM
 * Système professionnel de suivi et validation de la progression
 * Conforme aux exigences ANSSI pour certification
 */

// 🎯 TYPES DE PROGRESSION
export interface TrainingProgress {
  userId: string;
  sessionId: string;
  currentWorkshop: number;
  currentStep: string;
  overallCompletion: number; // 0-100
  workshopCompletions: Record<number, WorkshopProgress>;
  totalScore: number;
  maxPossibleScore: number;
  badges: Badge[];
  timeSpent: number; // en secondes
  lastActivity: Date;
  certificationEligible: boolean;
  anssiCompliance: ComplianceStatus;
}

export interface WorkshopProgress {
  workshopId: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'validated' | 'failed';
  completionRate: number; // 0-100
  score: number;
  maxScore: number;
  timeSpent: number;
  startedAt?: Date;
  completedAt?: Date;
  validatedAt?: Date;
  attempts: number;
  stepProgresses: Record<string, StepProgress>;
  deliverables: Deliverable[];
  expertFeedback?: string;
}

export interface StepProgress {
  stepId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: Record<string, any>;
  validatedAt?: Date;
  feedback?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  criteria: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'document' | 'analysis' | 'matrix' | 'report';
  content: any;
  completedAt: Date;
  validated: boolean;
  score: number;
}

export interface ComplianceStatus {
  anssiMethodology: boolean;
  expertValidation: boolean;
  minimumScore: boolean;
  timeRequirement: boolean;
  deliverables: boolean;
  overallCompliant: boolean;
  certificationLevel: 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert';
}

// 🎯 CRITÈRES DE VALIDATION ANSSI
export const ANSSI_REQUIREMENTS = {
  minimumOverallScore: 70, // 70% minimum pour certification
  minimumWorkshopScore: 60, // 60% minimum par atelier
  minimumTimePerWorkshop: {
    1: 90,  // 90 minutes minimum Atelier 1
    2: 75,  // 75 minutes minimum Atelier 2
    3: 85,  // 85 minutes minimum Atelier 3
    4: 95,  // 95 minutes minimum Atelier 4
    5: 80   // 80 minutes minimum Atelier 5
  },
  requiredDeliverables: [
    'cartographie_biens_essentiels',
    'inventaire_biens_supports',
    'matrice_evenements_redoutes',
    'analyse_sources_risques',
    'scenarios_strategiques',
    'scenarios_operationnels',
    'plan_traitement_risques'
  ],
  expertValidationRequired: true
};

// 🎯 SYSTÈME DE BADGES
export const AVAILABLE_BADGES = {
  'first_steps': {
    name: 'Premiers pas',
    description: 'Terminer le premier atelier',
    icon: '🎯',
    rarity: 'common' as const,
    criteria: 'Complete workshop 1'
  },
  'risk_analyst': {
    name: 'Analyste de risques',
    description: 'Terminer l\'atelier 2 avec plus de 80%',
    icon: '🔍',
    rarity: 'rare' as const,
    criteria: 'Complete workshop 2 with score >= 80%'
  },
  'scenario_master': {
    name: 'Maître des scénarios',
    description: 'Terminer l\'atelier 3 avec excellence',
    icon: '🎭',
    rarity: 'epic' as const,
    criteria: 'Complete workshop 3 with score >= 90%'
  },
  'security_architect': {
    name: 'Architecte sécurité',
    description: 'Terminer tous les ateliers avec distinction',
    icon: '🏗️',
    rarity: 'legendary' as const,
    criteria: 'Complete all workshops with average score >= 85%'
  },
  'anssi_certified': {
    name: 'Certifié ANSSI',
    description: 'Obtenir la certification ANSSI EBIOS RM',
    icon: '🏆',
    rarity: 'legendary' as const,
    criteria: 'Meet all ANSSI certification requirements'
  },
  'speed_learner': {
    name: 'Apprenant rapide',
    description: 'Terminer la formation en moins de 6 heures',
    icon: '⚡',
    rarity: 'rare' as const,
    criteria: 'Complete training in under 6 hours'
  },
  'perfectionist': {
    name: 'Perfectionniste',
    description: 'Obtenir 100% dans un atelier',
    icon: '💎',
    rarity: 'epic' as const,
    criteria: 'Score 100% in any workshop'
  }
};

/**
 * 🎯 GESTIONNAIRE PRINCIPAL DE PROGRESSION
 */
export class EbiosTrainingProgressManager {
  private progress: TrainingProgress;
  private listeners: Array<(progress: TrainingProgress) => void> = [];

  constructor(userId: string, sessionId: string) {
    this.progress = this.initializeProgress(userId, sessionId);
  }

  // 🚀 INITIALISATION DE LA PROGRESSION
  private initializeProgress(userId: string, sessionId: string): TrainingProgress {
    return {
      userId,
      sessionId,
      currentWorkshop: 1,
      currentStep: '',
      overallCompletion: 0,
      workshopCompletions: {},
      totalScore: 0,
      maxPossibleScore: 500, // 100 points par atelier
      badges: [],
      timeSpent: 0,
      lastActivity: new Date(),
      certificationEligible: false,
      anssiCompliance: {
        anssiMethodology: false,
        expertValidation: false,
        minimumScore: false,
        timeRequirement: false,
        deliverables: false,
        overallCompliant: false,
        certificationLevel: 'none'
      }
    };
  }

  // 📊 MISE À JOUR PROGRESSION ATELIER
  updateWorkshopProgress(
    workshopId: number, 
    stepId: string, 
    stepScore: number, 
    stepMaxScore: number,
    answers: Record<string, any>
  ): void {
    // Initialiser l'atelier si nécessaire
    if (!this.progress.workshopCompletions[workshopId]) {
      this.progress.workshopCompletions[workshopId] = {
        workshopId,
        status: 'in_progress',
        completionRate: 0,
        score: 0,
        maxScore: 100,
        timeSpent: 0,
        attempts: 1,
        stepProgresses: {},
        deliverables: []
      };
    }

    const workshop = this.progress.workshopCompletions[workshopId];

    // Mettre à jour la progression de l'étape
    workshop.stepProgresses[stepId] = {
      stepId,
      status: 'completed',
      score: stepScore,
      maxScore: stepMaxScore,
      timeSpent: 0, // À calculer
      answers,
      validatedAt: new Date()
    };

    // Recalculer le score de l'atelier
    const totalStepScore = Object.values(workshop.stepProgresses)
      .reduce((sum, step) => sum + step.score, 0);
    const totalStepMaxScore = Object.values(workshop.stepProgresses)
      .reduce((sum, step) => sum + step.maxScore, 0);

    workshop.score = totalStepMaxScore > 0 ? (totalStepScore / totalStepMaxScore) * 100 : 0;
    workshop.completionRate = (Object.keys(workshop.stepProgresses).length / 4) * 100; // 4 étapes par atelier

    // Mettre à jour la progression globale
    this.updateOverallProgress();
    this.checkBadges();
    this.checkANSSICompliance();
    this.notifyListeners();
  }

  // 🏁 TERMINER UN ATELIER
  completeWorkshop(workshopId: number, finalScore: number, deliverables: Deliverable[]): void {
    const workshop = this.progress.workshopCompletions[workshopId];
    if (!workshop) return;

    workshop.status = finalScore >= ANSSI_REQUIREMENTS.minimumWorkshopScore ? 'completed' : 'failed';
    workshop.completedAt = new Date();
    workshop.score = finalScore;
    workshop.deliverables = deliverables;
    workshop.completionRate = 100;

    // Débloquer l'atelier suivant
    if (workshop.status === 'completed' && workshopId < 5) {
      this.progress.currentWorkshop = workshopId + 1;
    }

    this.updateOverallProgress();
    this.checkBadges();
    this.checkANSSICompliance();
    this.notifyListeners();
  }

  // 📈 MISE À JOUR PROGRESSION GLOBALE
  private updateOverallProgress(): void {
    const completedWorkshops = Object.values(this.progress.workshopCompletions)
      .filter(w => w.status === 'completed').length;
    
    this.progress.overallCompletion = (completedWorkshops / 5) * 100;
    
    this.progress.totalScore = Object.values(this.progress.workshopCompletions)
      .reduce((sum, workshop) => sum + workshop.score, 0);

    this.progress.lastActivity = new Date();
  }

  // 🏆 VÉRIFICATION DES BADGES
  private checkBadges(): void {
    const newBadges: Badge[] = [];

    // Badge premiers pas
    if (!this.hasBadge('first_steps') && this.isWorkshopCompleted(1)) {
      newBadges.push(this.createBadge('first_steps'));
    }

    // Badge analyste de risques
    if (!this.hasBadge('risk_analyst') && 
        this.isWorkshopCompleted(2) && 
        this.getWorkshopScore(2) >= 80) {
      newBadges.push(this.createBadge('risk_analyst'));
    }

    // Badge maître des scénarios
    if (!this.hasBadge('scenario_master') && 
        this.isWorkshopCompleted(3) && 
        this.getWorkshopScore(3) >= 90) {
      newBadges.push(this.createBadge('scenario_master'));
    }

    // Badge perfectionniste
    if (!this.hasBadge('perfectionist') && 
        Object.values(this.progress.workshopCompletions).some(w => w.score >= 100)) {
      newBadges.push(this.createBadge('perfectionist'));
    }

    // Badge architecte sécurité
    if (!this.hasBadge('security_architect') && 
        this.getAllWorkshopsCompleted() && 
        this.getAverageScore() >= 85) {
      newBadges.push(this.createBadge('security_architect'));
    }

    // Badge apprenant rapide
    if (!this.hasBadge('speed_learner') && 
        this.getAllWorkshopsCompleted() && 
        this.progress.timeSpent < 6 * 3600) { // 6 heures
      newBadges.push(this.createBadge('speed_learner'));
    }

    // Badge certifié ANSSI
    if (!this.hasBadge('anssi_certified') && 
        this.progress.anssiCompliance.overallCompliant) {
      newBadges.push(this.createBadge('anssi_certified'));
    }

    this.progress.badges.push(...newBadges);
  }

  // ✅ VÉRIFICATION CONFORMITÉ ANSSI
  private checkANSSICompliance(): void {
    const compliance = this.progress.anssiCompliance;

    // Méthodologie ANSSI respectée
    compliance.anssiMethodology = this.getAllWorkshopsCompleted();

    // Score minimum atteint
    compliance.minimumScore = this.progress.totalScore >= ANSSI_REQUIREMENTS.minimumOverallScore &&
      Object.values(this.progress.workshopCompletions)
        .every(w => w.score >= ANSSI_REQUIREMENTS.minimumWorkshopScore);

    // Temps minimum respecté
    compliance.timeRequirement = Object.entries(this.progress.workshopCompletions)
      .every(([id, workshop]) => 
        workshop.timeSpent >= ANSSI_REQUIREMENTS.minimumTimePerWorkshop[parseInt(id) as keyof typeof ANSSI_REQUIREMENTS.minimumTimePerWorkshop]
      );

    // Livrables requis
    const allDeliverables = Object.values(this.progress.workshopCompletions)
      .flatMap(w => w.deliverables.map(d => d.id));
    compliance.deliverables = ANSSI_REQUIREMENTS.requiredDeliverables
      .every(required => allDeliverables.includes(required));

    // Validation experte (à implémenter)
    compliance.expertValidation = false; // Sera validé par un expert

    // Conformité globale
    compliance.overallCompliant = 
      compliance.anssiMethodology &&
      compliance.minimumScore &&
      compliance.timeRequirement &&
      compliance.deliverables &&
      compliance.expertValidation;

    // Niveau de certification
    if (compliance.overallCompliant) {
      const avgScore = this.getAverageScore();
      if (avgScore >= 95) compliance.certificationLevel = 'expert';
      else if (avgScore >= 85) compliance.certificationLevel = 'advanced';
      else if (avgScore >= 75) compliance.certificationLevel = 'intermediate';
      else compliance.certificationLevel = 'basic';
    }

    this.progress.certificationEligible = compliance.overallCompliant;
  }

  // 🔧 MÉTHODES UTILITAIRES
  private hasBadge(badgeId: string): boolean {
    return this.progress.badges.some(badge => badge.id === badgeId);
  }

  private createBadge(badgeId: string): Badge {
    const badgeTemplate = AVAILABLE_BADGES[badgeId as keyof typeof AVAILABLE_BADGES];
    return {
      id: badgeId,
      name: badgeTemplate.name,
      description: badgeTemplate.description,
      icon: badgeTemplate.icon,
      earnedAt: new Date(),
      criteria: badgeTemplate.criteria,
      rarity: badgeTemplate.rarity
    };
  }

  private isWorkshopCompleted(workshopId: number): boolean {
    return this.progress.workshopCompletions[workshopId]?.status === 'completed';
  }

  private getWorkshopScore(workshopId: number): number {
    return this.progress.workshopCompletions[workshopId]?.score || 0;
  }

  private getAllWorkshopsCompleted(): boolean {
    return [1, 2, 3, 4, 5].every(id => this.isWorkshopCompleted(id));
  }

  private getAverageScore(): number {
    const scores = Object.values(this.progress.workshopCompletions)
      .filter(w => w.status === 'completed')
      .map(w => w.score);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  }

  // 📡 SYSTÈME D'ÉVÉNEMENTS
  addProgressListener(listener: (progress: TrainingProgress) => void): void {
    this.listeners.push(listener);
  }

  removeProgressListener(listener: (progress: TrainingProgress) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.progress));
  }

  // 🎯 API PUBLIQUE
  getProgress(): TrainingProgress {
    return { ...this.progress };
  }

  getCurrentWorkshop(): number {
    return this.progress.currentWorkshop;
  }

  isWorkshopUnlocked(workshopId: number): boolean {
    if (workshopId === 1) return true;
    return this.isWorkshopCompleted(workshopId - 1);
  }

  getCertificationStatus(): ComplianceStatus {
    return { ...this.progress.anssiCompliance };
  }

  exportProgress(): string {
    return JSON.stringify(this.progress, null, 2);
  }

  importProgress(progressData: string): void {
    try {
      this.progress = JSON.parse(progressData);
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur import progression:', error);
    }
  }
}

export default EbiosTrainingProgressManager;
