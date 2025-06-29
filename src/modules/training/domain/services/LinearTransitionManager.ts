/**
 * 🔄 GESTIONNAIRE DE TRANSITIONS LINÉAIRES
 * Service pour gérer les transitions fluides entre les étapes du parcours
 * Garantit la progression logique et la motivation de l'apprenant
 */

import { 
  TrainingStep, 
  LinearProgressMetrics, 
  UserTrainingState,
  StepValidationStatus 
} from '../entities/LinearTrainingPath';
import { TrainingStepConfigurationFactory } from '../entities/TrainingStepConfigurations';

// 🎯 TYPES DE TRANSITIONS
export enum TransitionType {
  STEP_COMPLETION = 'step_completion',
  STEP_UNLOCK = 'step_unlock',
  VALIDATION_SUCCESS = 'validation_success',
  VALIDATION_FAILURE = 'validation_failure',
  PROGRESS_UPDATE = 'progress_update',
  MILESTONE_REACHED = 'milestone_reached'
}

// 🎯 DONNÉES DE TRANSITION
export interface TransitionData {
  type: TransitionType;
  fromStep: TrainingStep;
  toStep?: TrainingStep;
  score?: number;
  timeSpent?: number;
  achievements?: Achievement[];
  feedback?: TransitionFeedback;
  nextActions?: NextAction[];
}

// 🎯 FEEDBACK DE TRANSITION
export interface TransitionFeedback {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  details?: string[];
  motivationalMessage?: string;
  improvementSuggestions?: string[];
}

// 🎯 ACTION SUIVANTE RECOMMANDÉE
export interface NextAction {
  id: string;
  title: string;
  description: string;
  type: 'continue' | 'review' | 'practice' | 'help';
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number;
  url?: string;
}

// 🎯 ACHIEVEMENT/BADGE
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'step' | 'score' | 'time' | 'special';
  earnedAt: Date;
  points: number;
}

// 🎯 ANIMATION DE TRANSITION
export interface TransitionAnimation {
  type: 'slide' | 'fade' | 'zoom' | 'celebration';
  duration: number; // millisecondes
  direction?: 'left' | 'right' | 'up' | 'down';
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// 🎯 CLASSE PRINCIPALE DU GESTIONNAIRE
export class LinearTransitionManager {
  private userState: UserTrainingState;
  private transitionHistory: TransitionData[] = [];

  constructor(userState: UserTrainingState) {
    this.userState = userState;
  }

  // 🎯 GÉRER UNE TRANSITION D'ÉTAPE
  async handleStepTransition(
    fromStep: TrainingStep, 
    toStep: TrainingStep, 
    score: number,
    timeSpent: number
  ): Promise<TransitionData> {
    
    // Valider la transition
    if (!this.canTransitionTo(toStep)) {
      throw new Error(`Transition non autorisée vers l'étape ${toStep}`);
    }

    // Créer les données de transition
    const transitionData: TransitionData = {
      type: TransitionType.STEP_COMPLETION,
      fromStep,
      toStep,
      score,
      timeSpent,
      achievements: this.calculateAchievements(fromStep, score, timeSpent),
      feedback: this.generateTransitionFeedback(fromStep, toStep, score),
      nextActions: this.generateNextActions(toStep)
    };

    // Enregistrer la transition
    this.transitionHistory.push(transitionData);

    // Mettre à jour l'état utilisateur
    this.updateUserStateAfterTransition(transitionData);

    return transitionData;
  }

  // 🔓 VÉRIFIER SI UNE TRANSITION EST POSSIBLE
  private canTransitionTo(targetStep: TrainingStep): boolean {
    const currentStep = this.userState.progress.currentStep;
    
    // Vérifier l'ordre séquentiel
    if (targetStep !== currentStep + 1) {
      return false;
    }

    // Vérifier les prérequis
    const targetConfig = TrainingStepConfigurationFactory.getConfiguration(targetStep);
    if (!targetConfig) return false;

    for (const prereq of targetConfig.prerequisites) {
      if (!this.userState.completedSteps.includes(prereq)) {
        return false;
      }
    }

    return true;
  }

  // 🏆 CALCULER LES ACHIEVEMENTS
  private calculateAchievements(
    step: TrainingStep, 
    score: number, 
    timeSpent: number
  ): Achievement[] {
    const achievements: Achievement[] = [];
    const now = new Date();

    // Achievement de complétion d'étape
    achievements.push({
      id: `step_${step}_completed`,
      title: `Étape ${step} Complétée`,
      description: `Vous avez terminé l'étape ${this.getStepName(step)}`,
      icon: '✅',
      type: 'step',
      earnedAt: now,
      points: 10
    });

    // Achievement de score élevé
    if (score >= 90) {
      achievements.push({
        id: `high_score_${step}`,
        title: 'Score Excellent',
        description: `Score de ${score}% - Performance exceptionnelle !`,
        icon: '🌟',
        type: 'score',
        earnedAt: now,
        points: 20
      });
    } else if (score >= 80) {
      achievements.push({
        id: `good_score_${step}`,
        title: 'Bon Score',
        description: `Score de ${score}% - Très bien joué !`,
        icon: '⭐',
        type: 'score',
        earnedAt: now,
        points: 15
      });
    }

    // Achievement de rapidité
    const expectedTime = this.getExpectedTimeForStep(step);
    if (timeSpent <= expectedTime * 0.8) {
      achievements.push({
        id: `fast_completion_${step}`,
        title: 'Apprentissage Rapide',
        description: 'Étape complétée en un temps record !',
        icon: '⚡',
        type: 'time',
        earnedAt: now,
        points: 15
      });
    }

    return achievements;
  }

  // 💬 GÉNÉRER LE FEEDBACK DE TRANSITION
  private generateTransitionFeedback(
    fromStep: TrainingStep, 
    toStep: TrainingStep, 
    score: number
  ): TransitionFeedback {
    
    if (score >= 90) {
      return {
        type: 'success',
        title: '🎉 Excellent travail !',
        message: `Vous maîtrisez parfaitement ${this.getStepName(fromStep)}`,
        details: [
          `Score obtenu : ${score}%`,
          'Performance exceptionnelle',
          'Vous êtes prêt pour la suite'
        ],
        motivationalMessage: 'Continuez sur cette lancée, vous êtes sur la voie de l\'excellence !',
        improvementSuggestions: []
      };
    } else if (score >= 75) {
      return {
        type: 'success',
        title: '✅ Très bien !',
        message: `Vous avez validé ${this.getStepName(fromStep)} avec succès`,
        details: [
          `Score obtenu : ${score}%`,
          'Objectifs atteints',
          'Passage à l\'étape suivante autorisé'
        ],
        motivationalMessage: 'Bon travail ! Vous progressez bien dans votre formation.',
        improvementSuggestions: this.generateImprovementSuggestions(score)
      };
    } else {
      return {
        type: 'warning',
        title: '⚠️ Score limite',
        message: `Vous avez validé ${this.getStepName(fromStep)} de justesse`,
        details: [
          `Score obtenu : ${score}%`,
          'Validation acquise mais perfectible',
          'Révision recommandée'
        ],
        motivationalMessage: 'Ne vous découragez pas ! Chaque étape est un apprentissage.',
        improvementSuggestions: this.generateImprovementSuggestions(score)
      };
    }
  }

  // 🎯 GÉNÉRER LES ACTIONS SUIVANTES
  private generateNextActions(nextStep: TrainingStep): NextAction[] {
    const actions: NextAction[] = [];

    // Action principale : continuer
    actions.push({
      id: 'continue_next_step',
      title: `Commencer ${this.getStepName(nextStep)}`,
      description: `Poursuivre votre formation avec l'étape suivante`,
      type: 'continue',
      priority: 'high',
      estimatedTime: this.getExpectedTimeForStep(nextStep),
      url: `/training/step/${nextStep}`
    });

    // Action secondaire : réviser
    actions.push({
      id: 'review_previous',
      title: 'Réviser l\'étape précédente',
      description: 'Revoir les concepts pour renforcer vos acquis',
      type: 'review',
      priority: 'medium',
      estimatedTime: 5
    });

    // Action d'aide
    actions.push({
      id: 'get_help',
      title: 'Obtenir de l\'aide',
      description: 'Consulter les ressources ou contacter le support',
      type: 'help',
      priority: 'low'
    });

    return actions;
  }

  // 🔄 METTRE À JOUR L'ÉTAT UTILISATEUR
  private updateUserStateAfterTransition(transitionData: TransitionData): void {
    const { fromStep, toStep, score, timeSpent, achievements } = transitionData;

    // Marquer l'étape comme complétée
    if (!this.userState.completedSteps.includes(fromStep)) {
      this.userState.completedSteps.push(fromStep);
    }

    // Déverrouiller l'étape suivante
    if (toStep && !this.userState.unlockedSteps.includes(toStep)) {
      this.userState.unlockedSteps.push(toStep);
    }

    // Mettre à jour la progression
    if (toStep) {
      this.userState.progress.currentStep = toStep;
      this.userState.progress.stepProgress = 0;
      this.userState.progress.timeSpentCurrentStep = 0;
    }

    // Enregistrer le score
    this.userState.progress.scoresPerStep[fromStep] = score || 0;

    // Ajouter les achievements
    if (achievements) {
      this.userState.certificates.push(...achievements.map(a => ({
        id: a.id,
        type: 'step' as const,
        title: a.title,
        description: a.description,
        earnedAt: a.earnedAt,
        score: score || 0,
        anssiCompliant: score ? score >= 70 : false,
        verificationCode: `TRANS_${Date.now()}`
      })));
    }

    // Mettre à jour le temps total
    if (timeSpent) {
      this.userState.progress.timeSpent += timeSpent;
    }

    this.userState.progress.lastActivityAt = new Date();
  }

  // 🎨 OBTENIR L'ANIMATION DE TRANSITION
  getTransitionAnimation(transitionType: TransitionType): TransitionAnimation {
    switch (transitionType) {
      case TransitionType.STEP_COMPLETION:
        return {
          type: 'celebration',
          duration: 1500,
          easing: 'ease-out'
        };
      case TransitionType.STEP_UNLOCK:
        return {
          type: 'slide',
          duration: 800,
          direction: 'right',
          easing: 'ease-in-out'
        };
      case TransitionType.VALIDATION_SUCCESS:
        return {
          type: 'zoom',
          duration: 600,
          easing: 'ease-out'
        };
      default:
        return {
          type: 'fade',
          duration: 400,
          easing: 'ease'
        };
    }
  }

  // 🔧 MÉTHODES UTILITAIRES
  private getStepName(step: TrainingStep): string {
    const config = TrainingStepConfigurationFactory.getConfiguration(step);
    return config?.name || `Étape ${step}`;
  }

  private getExpectedTimeForStep(step: TrainingStep): number {
    const config = TrainingStepConfigurationFactory.getConfiguration(step);
    return config?.estimatedDuration || 10;
  }

  private generateImprovementSuggestions(score: number): string[] {
    if (score >= 80) return [];
    
    return [
      'Relisez les concepts clés de cette étape',
      'Pratiquez avec les exercices supplémentaires',
      'Consultez les ressources recommandées',
      'N\'hésitez pas à demander de l\'aide'
    ];
  }

  // 📊 OBTENIR L'HISTORIQUE DES TRANSITIONS
  getTransitionHistory(): TransitionData[] {
    return [...this.transitionHistory];
  }

  // 🎯 OBTENIR LA PROCHAINE ÉTAPE RECOMMANDÉE
  getNextRecommendedStep(): TrainingStep | null {
    const currentStep = this.userState.progress.currentStep;
    const nextStep = currentStep + 1;
    
    if (nextStep <= TrainingStep.RESOURCES && this.canTransitionTo(nextStep as TrainingStep)) {
      return nextStep as TrainingStep;
    }
    
    return null;
  }
}
