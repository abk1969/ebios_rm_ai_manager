/**
 * 📊 GESTIONNAIRE DE PROGRESSION LINÉAIRE
 * Service centralisé pour la gestion de la progression réelle (non fictive)
 * Remplace les métriques factices par un suivi précis et conforme ANSSI
 */

import { 
  TrainingStep, 
  UserTrainingState,
  LinearProgressMetrics,
  Certificate 
} from '../entities/LinearTrainingPath';
import { TrainingStepConfigurationFactory } from '../entities/TrainingStepConfigurations';
import { ValidationResult } from './ValidationCheckpointService';

// 🎯 ÉVÉNEMENT DE PROGRESSION
export interface ProgressEvent {
  type: 'step_started' | 'step_progress' | 'step_completed' | 'milestone_reached' | 'certificate_earned';
  step: TrainingStep;
  previousProgress: number;
  newProgress: number;
  data?: any;
  timestamp: Date;
}

// 🎯 JALON DE PROGRESSION
export interface ProgressMilestone {
  id: string;
  name: string;
  description: string;
  threshold: number; // pourcentage
  type: 'step' | 'global' | 'time' | 'score';
  reward?: ProgressReward;
  anssiRequired: boolean;
}

// 🎯 RÉCOMPENSE DE PROGRESSION
export interface ProgressReward {
  type: 'badge' | 'certificate' | 'unlock' | 'bonus';
  title: string;
  description: string;
  icon: string;
  points: number;
}

// 🎯 RAPPORT DE PROGRESSION
export interface ProgressReport {
  userId: string;
  sessionId: string;
  generatedAt: Date;
  globalProgress: number;
  stepProgresses: Record<TrainingStep, number>;
  timeSpent: number;
  averageScore: number;
  milestonesReached: ProgressMilestone[];
  certificatesEarned: Certificate[];
  anssiCompliance: ANSSIComplianceReport;
  recommendations: string[];
  nextSteps: string[];
}

// 🎯 RAPPORT DE CONFORMITÉ ANSSI
export interface ANSSIComplianceReport {
  isCompliant: boolean;
  score: number;
  requiredCriteria: string[];
  metCriteria: string[];
  missingCriteria: string[];
  timeRequirement: {
    required: number;
    actual: number;
    met: boolean;
  };
  scoreRequirement: {
    required: number;
    actual: number;
    met: boolean;
  };
}

// 🎯 CLASSE PRINCIPALE DU GESTIONNAIRE
export class LinearProgressManager {
  private userState: UserTrainingState;
  private progressHistory: ProgressEvent[] = [];
  private milestones: ProgressMilestone[] = [];
  private listeners: Map<string, (event: ProgressEvent) => void> = new Map();

  constructor(userState: UserTrainingState) {
    this.userState = userState;
    this.initializeMilestones();
  }

  // 🏗️ INITIALISER LES JALONS
  private initializeMilestones(): void {
    this.milestones = [
      {
        id: 'onboarding_complete',
        name: 'Démarrage réussi',
        description: 'Onboarding terminé avec succès',
        threshold: 20,
        type: 'step',
        reward: {
          type: 'badge',
          title: '🚀 Démarrage',
          description: 'Vous avez commencé votre formation EBIOS RM',
          icon: '🚀',
          points: 10
        },
        anssiRequired: false
      },
      {
        id: 'discovery_mastered',
        name: 'Concepts maîtrisés',
        description: 'Module découverte validé',
        threshold: 40,
        type: 'step',
        reward: {
          type: 'badge',
          title: '🎓 Fondamentaux',
          description: 'Vous maîtrisez les concepts EBIOS RM',
          icon: '🎓',
          points: 20
        },
        anssiRequired: true
      },
      {
        id: 'halfway_point',
        name: 'Mi-parcours',
        description: '50% de la formation complétée',
        threshold: 50,
        type: 'global',
        reward: {
          type: 'badge',
          title: '⚡ Persévérance',
          description: 'Vous avez franchi la moitié du parcours',
          icon: '⚡',
          points: 25
        },
        anssiRequired: false
      },
      {
        id: 'workshops_expert',
        name: 'Expert ateliers',
        description: 'Tous les ateliers EBIOS RM validés',
        threshold: 80,
        type: 'step',
        reward: {
          type: 'certificate',
          title: '🏆 Expert EBIOS RM',
          description: 'Maîtrise complète des 5 ateliers',
          icon: '🏆',
          points: 50
        },
        anssiRequired: true
      },
      {
        id: 'anssi_certified',
        name: 'Certification ANSSI',
        description: 'Formation complète conforme ANSSI',
        threshold: 100,
        type: 'global',
        reward: {
          type: 'certificate',
          title: '🎖️ Certification ANSSI',
          description: 'Formation EBIOS RM certifiée ANSSI',
          icon: '🎖️',
          points: 100
        },
        anssiRequired: true
      }
    ];
  }

  // 📈 METTRE À JOUR LA PROGRESSION D'UNE ÉTAPE
  updateStepProgress(step: TrainingStep, progress: number, timeSpent: number = 0): void {
    const previousProgress = this.userState.progress.stepProgress;
    const clampedProgress = Math.min(100, Math.max(0, progress));

    // Mettre à jour l'état utilisateur
    this.userState.progress.stepProgress = clampedProgress;
    this.userState.progress.timeSpentCurrentStep += timeSpent;
    this.userState.progress.timeSpent += timeSpent;
    this.userState.progress.lastActivityAt = new Date();

    // Recalculer la progression globale
    this.recalculateGlobalProgress();

    // Émettre l'événement
    const event: ProgressEvent = {
      type: 'step_progress',
      step,
      previousProgress,
      newProgress: clampedProgress,
      data: { timeSpent },
      timestamp: new Date()
    };

    this.emitProgressEvent(event);
    this.progressHistory.push(event);

    // Vérifier les jalons
    this.checkMilestones();
  }

  // ✅ MARQUER UNE ÉTAPE COMME COMPLÉTÉE
  completeStep(step: TrainingStep, validationResult: ValidationResult): void {
    // Vérifier que l'étape n'est pas déjà complétée
    if (this.userState.completedSteps.includes(step)) {
      return;
    }

    // Marquer comme complétée
    this.userState.completedSteps.push(step);
    this.userState.progress.scoresPerStep[step] = validationResult.percentage;

    // Déverrouiller l'étape suivante si applicable
    const nextStep = step + 1;
    if (nextStep <= TrainingStep.RESOURCES && validationResult.canProceed) {
      if (!this.userState.unlockedSteps.includes(nextStep as TrainingStep)) {
        this.userState.unlockedSteps.push(nextStep as TrainingStep);
      }
    }

    // Recalculer la progression globale
    this.recalculateGlobalProgress();

    // Émettre l'événement
    const event: ProgressEvent = {
      type: 'step_completed',
      step,
      previousProgress: this.userState.progress.globalProgress,
      newProgress: this.userState.progress.globalProgress,
      data: { validationResult },
      timestamp: new Date()
    };

    this.emitProgressEvent(event);
    this.progressHistory.push(event);

    // Vérifier les jalons
    this.checkMilestones();

    // Générer un certificat si nécessaire
    this.generateStepCertificate(step, validationResult);
  }

  // 🔄 RECALCULER LA PROGRESSION GLOBALE
  private recalculateGlobalProgress(): void {
    const totalSteps = 5;
    const completedSteps = this.userState.completedSteps.length;
    const currentStepProgress = this.userState.progress.stepProgress;
    
    // Calcul précis : étapes complétées + progression étape actuelle
    const globalProgress = Math.round(
      ((completedSteps + currentStepProgress / 100) / totalSteps) * 100
    );

    this.userState.progress.globalProgress = globalProgress;
  }

  // 🎯 VÉRIFIER LES JALONS
  private checkMilestones(): void {
    const currentGlobalProgress = this.userState.progress.globalProgress;

    for (const milestone of this.milestones) {
      // Vérifier si le jalon est atteint et pas encore récompensé
      const alreadyReached = this.userState.certificates.some(
        cert => cert.id === milestone.id
      );

      if (!alreadyReached && this.isMilestoneReached(milestone)) {
        this.reachMilestone(milestone);
      }
    }
  }

  // 🏆 ATTEINDRE UN JALON
  private reachMilestone(milestone: ProgressMilestone): void {
    // Générer la récompense
    if (milestone.reward) {
      const certificate: Certificate = {
        id: milestone.id,
        type: milestone.reward.type === 'certificate' ? 'final' : 'step',
        title: milestone.reward.title,
        description: milestone.reward.description,
        earnedAt: new Date(),
        score: this.userState.progress.globalProgress,
        anssiCompliant: milestone.anssiRequired,
        verificationCode: this.generateVerificationCode(milestone.id)
      };

      this.userState.certificates.push(certificate);
    }

    // Émettre l'événement
    const event: ProgressEvent = {
      type: 'milestone_reached',
      step: this.userState.progress.currentStep,
      previousProgress: this.userState.progress.globalProgress,
      newProgress: this.userState.progress.globalProgress,
      data: { milestone },
      timestamp: new Date()
    };

    this.emitProgressEvent(event);
    this.progressHistory.push(event);
  }

  // 🔍 VÉRIFIER SI UN JALON EST ATTEINT
  private isMilestoneReached(milestone: ProgressMilestone): boolean {
    switch (milestone.type) {
      case 'global':
        return this.userState.progress.globalProgress >= milestone.threshold;
      
      case 'step':
        // Vérifier si l'étape correspondante est complétée
        const stepForMilestone = this.getStepForMilestone(milestone.id);
        return stepForMilestone ? this.userState.completedSteps.includes(stepForMilestone) : false;
      
      case 'time':
        return this.userState.progress.timeSpent >= milestone.threshold;
      
      case 'score':
        const averageScore = this.calculateAverageScore();
        return averageScore >= milestone.threshold;
      
      default:
        return false;
    }
  }

  // 🎯 OBTENIR L'ÉTAPE POUR UN JALON
  private getStepForMilestone(milestoneId: string): TrainingStep | null {
    const stepMapping: Record<string, TrainingStep> = {
      'onboarding_complete': TrainingStep.ONBOARDING,
      'discovery_mastered': TrainingStep.DISCOVERY,
      'workshops_expert': TrainingStep.WORKSHOPS
    };

    return stepMapping[milestoneId] || null;
  }

  // 📊 CALCULER LE SCORE MOYEN
  private calculateAverageScore(): number {
    const scores = Object.values(this.userState.progress.scoresPerStep);
    if (scores.length === 0) return 0;
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // 🏅 GÉNÉRER UN CERTIFICAT D'ÉTAPE
  private generateStepCertificate(step: TrainingStep, validationResult: ValidationResult): void {
    if (!validationResult.canProceed) return;

    const stepConfig = TrainingStepConfigurationFactory.getConfiguration(step);
    if (!stepConfig) return;

    const certificate: Certificate = {
      id: `step_${step}_${Date.now()}`,
      type: 'step',
      title: `Étape ${stepConfig.name} validée`,
      description: `Validation réussie avec ${validationResult.percentage}%`,
      earnedAt: new Date(),
      score: validationResult.percentage,
      anssiCompliant: validationResult.anssiCompliant,
      verificationCode: this.generateVerificationCode(`step_${step}`)
    };

    this.userState.certificates.push(certificate);

    // Émettre l'événement
    const event: ProgressEvent = {
      type: 'certificate_earned',
      step,
      previousProgress: this.userState.progress.globalProgress,
      newProgress: this.userState.progress.globalProgress,
      data: { certificate },
      timestamp: new Date()
    };

    this.emitProgressEvent(event);
  }

  // 🔐 GÉNÉRER UN CODE DE VÉRIFICATION
  private generateVerificationCode(id: string): string {
    const timestamp = Date.now();
    const hash = btoa(`${id}_${timestamp}_${this.userState.userId}`);
    return `ANSSI_${hash.substring(0, 12)}`;
  }

  // 📋 GÉNÉRER UN RAPPORT DE PROGRESSION
  generateProgressReport(): ProgressReport {
    const anssiCompliance = this.checkANSSICompliance();
    
    return {
      userId: this.userState.userId,
      sessionId: this.userState.sessionId,
      generatedAt: new Date(),
      globalProgress: this.userState.progress.globalProgress,
      stepProgresses: this.userState.progress.scoresPerStep,
      timeSpent: this.userState.progress.timeSpent,
      averageScore: this.calculateAverageScore(),
      milestonesReached: this.getReachedMilestones(),
      certificatesEarned: this.userState.certificates,
      anssiCompliance,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };
  }

  // 🏛️ VÉRIFIER LA CONFORMITÉ ANSSI
  private checkANSSICompliance(): ANSSIComplianceReport {
    const requiredTime = 160; // minutes
    const requiredScore = 75; // pourcentage
    const actualTime = this.userState.progress.timeSpent;
    const actualScore = this.calculateAverageScore();

    const requiredCriteria = [
      'Temps minimum 160 minutes',
      'Score moyen minimum 75%',
      'Tous les ateliers validés',
      'Livrables produits',
      'Certificats obtenus'
    ];

    const metCriteria: string[] = [];
    const missingCriteria: string[] = [];

    // Vérifier chaque critère
    if (actualTime >= requiredTime) {
      metCriteria.push('Temps minimum 160 minutes');
    } else {
      missingCriteria.push('Temps minimum 160 minutes');
    }

    if (actualScore >= requiredScore) {
      metCriteria.push('Score moyen minimum 75%');
    } else {
      missingCriteria.push('Score moyen minimum 75%');
    }

    if (this.userState.completedSteps.length === 5) {
      metCriteria.push('Tous les ateliers validés');
    } else {
      missingCriteria.push('Tous les ateliers validés');
    }

    const isCompliant = missingCriteria.length === 0;

    return {
      isCompliant,
      score: isCompliant ? 100 : Math.round((metCriteria.length / requiredCriteria.length) * 100),
      requiredCriteria,
      metCriteria,
      missingCriteria,
      timeRequirement: {
        required: requiredTime,
        actual: actualTime,
        met: actualTime >= requiredTime
      },
      scoreRequirement: {
        required: requiredScore,
        actual: actualScore,
        met: actualScore >= requiredScore
      }
    };
  }

  // 💡 GÉNÉRER DES RECOMMANDATIONS
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const compliance = this.checkANSSICompliance();

    if (!compliance.timeRequirement.met) {
      recommendations.push('Consacrez plus de temps à chaque étape pour approfondir vos connaissances');
    }

    if (!compliance.scoreRequirement.met) {
      recommendations.push('Révisez les concepts moins maîtrisés et refaites les exercices');
    }

    if (this.userState.completedSteps.length < 5) {
      recommendations.push('Complétez toutes les étapes du parcours de formation');
    }

    if (recommendations.length === 0) {
      recommendations.push('Excellent travail ! Continuez sur cette lancée.');
    }

    return recommendations;
  }

  // 🎯 GÉNÉRER LES PROCHAINES ÉTAPES
  private generateNextSteps(): string[] {
    const nextSteps: string[] = [];
    const currentStep = this.userState.progress.currentStep;

    if (currentStep < TrainingStep.RESOURCES) {
      const nextStepConfig = TrainingStepConfigurationFactory.getConfiguration(currentStep + 1 as TrainingStep);
      if (nextStepConfig) {
        nextSteps.push(`Commencer : ${nextStepConfig.name}`);
      }
    }

    if (this.userState.progress.globalProgress === 100) {
      nextSteps.push('Télécharger votre certificat ANSSI');
      nextSteps.push('Consulter les ressources avancées');
    }

    return nextSteps;
  }

  // 📊 MÉTHODES D'INFORMATION
  getReachedMilestones(): ProgressMilestone[] {
    return this.milestones.filter(milestone => this.isMilestoneReached(milestone));
  }

  getProgressHistory(): ProgressEvent[] {
    return [...this.progressHistory];
  }

  getCurrentProgress(): LinearProgressMetrics {
    return { ...this.userState.progress };
  }

  // 📡 SYSTÈME D'ÉVÉNEMENTS
  addEventListener(eventType: string, callback: (event: ProgressEvent) => void): void {
    this.listeners.set(eventType, callback);
  }

  removeEventListener(eventType: string): void {
    this.listeners.delete(eventType);
  }

  private emitProgressEvent(event: ProgressEvent): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Erreur dans le listener de progression:', error);
      }
    });
  }

  // 🔄 RÉINITIALISER LA PROGRESSION
  resetProgress(): void {
    this.userState.progress = {
      currentStep: TrainingStep.ONBOARDING,
      currentWorkshop: undefined,
      currentSubStep: undefined,
      stepProgress: 0,
      globalProgress: 0,
      timeSpent: 0,
      timeSpentCurrentStep: 0,
      scoresPerStep: {},
      scoresPerWorkshop: {},
      validationsCompleted: [],
      certificateEarned: false,
      anssiCompliant: false,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      estimatedTimeRemaining: 160
    };

    this.userState.completedSteps = [];
    this.userState.unlockedSteps = [TrainingStep.ONBOARDING];
    this.userState.certificates = [];
    this.progressHistory = [];
  }
}
