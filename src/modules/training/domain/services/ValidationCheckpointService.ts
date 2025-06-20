/**
 * ✅ SERVICE DE VALIDATION PAR CHECKPOINTS
 * Système de validation rigoureuse à chaque étape du parcours
 * Conforme aux exigences ANSSI pour certification
 */

import { 
  TrainingStep, 
  UserTrainingState,
  ValidationCriterion,
  StepValidationStatus 
} from '../entities/LinearTrainingPath';
import { TrainingStepConfigurationFactory } from '../entities/TrainingStepConfigurations';

// 🎯 RÉSULTAT DE VALIDATION
export interface ValidationResult {
  isValid: boolean;
  score: number;
  maxScore: number;
  percentage: number;
  status: StepValidationStatus;
  criteriaMet: ValidationCriterion[];
  criteriaFailed: ValidationCriterion[];
  feedback: ValidationFeedback;
  recommendations: string[];
  anssiCompliant: boolean;
  canProceed: boolean;
  retryAllowed: boolean;
  attemptsRemaining?: number;
}

// 🎯 FEEDBACK DE VALIDATION
export interface ValidationFeedback {
  type: 'success' | 'partial' | 'failure';
  title: string;
  message: string;
  details: ValidationDetail[];
  improvementAreas: string[];
  strengths: string[];
}

// 🎯 DÉTAIL DE VALIDATION
export interface ValidationDetail {
  criterion: string;
  status: 'passed' | 'failed' | 'partial';
  score: number;
  maxScore: number;
  feedback: string;
  anssiRequired: boolean;
}

// 🎯 CHECKPOINT DE VALIDATION
export interface ValidationCheckpoint {
  id: string;
  step: TrainingStep;
  name: string;
  description: string;
  criteria: ValidationCriterion[];
  minimumScore: number;
  anssiRequired: boolean;
  maxAttempts: number;
  timeLimit?: number; // minutes
  prerequisites: string[];
}

// 🎯 DONNÉES DE TENTATIVE
export interface ValidationAttempt {
  id: string;
  checkpointId: string;
  userId: string;
  attemptNumber: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  answers: Record<string, any>;
  result: ValidationResult;
  ipAddress?: string;
  userAgent?: string;
}

// 🎯 CLASSE PRINCIPALE DU SERVICE
export class ValidationCheckpointService {
  private userState: UserTrainingState;
  private attempts: Map<string, ValidationAttempt[]> = new Map();

  constructor(userState: UserTrainingState) {
    this.userState = userState;
    this.loadAttemptHistory();
  }

  // ✅ VALIDER UNE ÉTAPE COMPLÈTE
  async validateStep(
    step: TrainingStep, 
    answers: Record<string, any>,
    timeSpent: number
  ): Promise<ValidationResult> {
    
    const checkpoint = this.getCheckpointForStep(step);
    if (!checkpoint) {
      throw new Error(`Aucun checkpoint défini pour l'étape ${step}`);
    }

    // Vérifier les tentatives restantes
    const attemptCount = this.getAttemptCount(checkpoint.id);
    if (attemptCount >= checkpoint.maxAttempts) {
      return this.createFailureResult('Nombre maximum de tentatives atteint');
    }

    // Créer la tentative
    const attempt = this.createAttempt(checkpoint, answers, timeSpent);

    // Effectuer la validation
    const result = await this.performValidation(checkpoint, answers, timeSpent);

    // Enregistrer la tentative
    attempt.result = result;
    attempt.completedAt = new Date();
    this.recordAttempt(attempt);

    // Mettre à jour l'état utilisateur
    this.updateUserStateAfterValidation(step, result);

    return result;
  }

  // 🔍 EFFECTUER LA VALIDATION
  private async performValidation(
    checkpoint: ValidationCheckpoint,
    answers: Record<string, any>,
    timeSpent: number
  ): Promise<ValidationResult> {
    
    const details: ValidationDetail[] = [];
    let totalScore = 0;
    let maxTotalScore = 0;
    const criteriaMet: ValidationCriterion[] = [];
    const criteriaFailed: ValidationCriterion[] = [];

    // Valider chaque critère
    for (const criterion of checkpoint.criteria) {
      const detail = await this.validateCriterion(criterion, answers, timeSpent);
      details.push(detail);
      
      totalScore += detail.score;
      maxTotalScore += detail.maxScore;

      if (detail.status === 'passed') {
        criteriaMet.push(criterion);
      } else {
        criteriaFailed.push(criterion);
      }
    }

    const percentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
    const isValid = percentage >= checkpoint.minimumScore;
    const anssiCompliant = this.checkANSSICompliance(checkpoint, criteriaMet, percentage);

    return {
      isValid,
      score: totalScore,
      maxScore: maxTotalScore,
      percentage,
      status: this.determineStatus(isValid, percentage),
      criteriaMet,
      criteriaFailed,
      feedback: this.generateFeedback(isValid, percentage, details),
      recommendations: this.generateRecommendations(criteriaFailed),
      anssiCompliant,
      canProceed: isValid && anssiCompliant,
      retryAllowed: !isValid && this.getAttemptCount(checkpoint.id) < checkpoint.maxAttempts - 1,
      attemptsRemaining: checkpoint.maxAttempts - this.getAttemptCount(checkpoint.id) - 1
    };
  }

  // 🎯 VALIDER UN CRITÈRE SPÉCIFIQUE
  private async validateCriterion(
    criterion: ValidationCriterion,
    answers: Record<string, any>,
    timeSpent: number
  ): Promise<ValidationDetail> {
    
    let score = 0;
    let maxScore = 10; // Score par défaut
    let status: 'passed' | 'failed' | 'partial' = 'failed';
    let feedback = '';

    switch (criterion.type) {
      case 'score':
        const userScore = answers[criterion.id] || 0;
        score = Math.min(userScore, maxScore);
        status = userScore >= criterion.threshold ? 'passed' : 'failed';
        feedback = `Score obtenu: ${userScore}/${maxScore} (minimum: ${criterion.threshold})`;
        break;

      case 'time':
        const meetsTimeRequirement = timeSpent >= criterion.threshold;
        score = meetsTimeRequirement ? maxScore : 0;
        status = meetsTimeRequirement ? 'passed' : 'failed';
        feedback = `Temps passé: ${timeSpent} min (minimum: ${criterion.threshold} min)`;
        break;

      case 'completion':
        const completionRate = answers[`${criterion.id}_completion`] || 0;
        score = Math.round((completionRate / 100) * maxScore);
        status = completionRate >= criterion.threshold ? 'passed' : 'failed';
        feedback = `Taux de complétion: ${completionRate}% (minimum: ${criterion.threshold}%)`;
        break;

      case 'deliverable':
        const deliverable = answers[criterion.id];
        const hasDeliverable = deliverable && deliverable.length > 0;
        score = hasDeliverable ? maxScore : 0;
        status = hasDeliverable ? 'passed' : 'failed';
        feedback = hasDeliverable ? 'Livrable fourni' : 'Livrable manquant';
        break;

      default:
        feedback = 'Type de critère non reconnu';
    }

    return {
      criterion: criterion.name,
      status,
      score,
      maxScore,
      feedback,
      anssiRequired: criterion.anssiRequired
    };
  }

  // 🏛️ VÉRIFIER LA CONFORMITÉ ANSSI
  private checkANSSICompliance(
    checkpoint: ValidationCheckpoint,
    criteriaMet: ValidationCriterion[],
    percentage: number
  ): boolean {
    
    if (!checkpoint.anssiRequired) return true;

    // Tous les critères ANSSI obligatoires doivent être remplis
    const anssiCriteria = checkpoint.criteria.filter(c => c.anssiRequired);
    const anssiCriteriaMet = criteriaMet.filter(c => c.anssiRequired);

    if (anssiCriteriaMet.length < anssiCriteria.length) {
      return false;
    }

    // Score minimum ANSSI
    return percentage >= 70; // Seuil ANSSI
  }

  // 📊 DÉTERMINER LE STATUT
  private determineStatus(isValid: boolean, percentage: number): StepValidationStatus {
    if (!isValid) return StepValidationStatus.FAILED;
    if (percentage >= 90) return StepValidationStatus.COMPLETED;
    return StepValidationStatus.COMPLETED;
  }

  // 💬 GÉNÉRER LE FEEDBACK
  private generateFeedback(
    isValid: boolean, 
    percentage: number, 
    details: ValidationDetail[]
  ): ValidationFeedback {
    
    const strengths = details
      .filter(d => d.status === 'passed')
      .map(d => d.criterion);
    
    const improvementAreas = details
      .filter(d => d.status === 'failed')
      .map(d => d.criterion);

    if (isValid) {
      return {
        type: 'success',
        title: '🎉 Validation réussie !',
        message: `Excellent travail ! Vous avez obtenu ${percentage}%`,
        details,
        improvementAreas: [],
        strengths
      };
    } else {
      return {
        type: 'failure',
        title: '❌ Validation échouée',
        message: `Score insuffisant: ${percentage}% (minimum requis: 70%)`,
        details,
        improvementAreas,
        strengths
      };
    }
  }

  // 💡 GÉNÉRER LES RECOMMANDATIONS
  private generateRecommendations(criteriaFailed: ValidationCriterion[]): string[] {
    const recommendations: string[] = [];

    for (const criterion of criteriaFailed) {
      switch (criterion.type) {
        case 'score':
          recommendations.push(`Améliorez votre compréhension de: ${criterion.name}`);
          break;
        case 'time':
          recommendations.push(`Consacrez plus de temps à: ${criterion.name}`);
          break;
        case 'completion':
          recommendations.push(`Complétez entièrement: ${criterion.name}`);
          break;
        case 'deliverable':
          recommendations.push(`Fournissez le livrable requis: ${criterion.name}`);
          break;
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Continuez votre excellent travail !');
    }

    return recommendations;
  }

  // 🎯 OBTENIR LE CHECKPOINT POUR UNE ÉTAPE
  private getCheckpointForStep(step: TrainingStep): ValidationCheckpoint | null {
    const config = TrainingStepConfigurationFactory.getConfiguration(step);
    if (!config) return null;

    return {
      id: `checkpoint_${step}`,
      step,
      name: `Validation ${config.name}`,
      description: `Checkpoint de validation pour ${config.name}`,
      criteria: config.validation.criteria,
      minimumScore: config.validation.minimumScore,
      anssiRequired: config.validation.anssiCompliance,
      maxAttempts: 3, // Par défaut
      prerequisites: []
    };
  }

  // 📝 GESTION DES TENTATIVES
  private createAttempt(
    checkpoint: ValidationCheckpoint,
    answers: Record<string, any>,
    timeSpent: number
  ): ValidationAttempt {
    
    const attemptNumber = this.getAttemptCount(checkpoint.id) + 1;
    
    return {
      id: `attempt_${checkpoint.id}_${attemptNumber}_${Date.now()}`,
      checkpointId: checkpoint.id,
      userId: this.userState.userId,
      attemptNumber,
      startedAt: new Date(),
      timeSpent,
      answers,
      result: {} as ValidationResult // Sera rempli après validation
    };
  }

  private recordAttempt(attempt: ValidationAttempt): void {
    const checkpointAttempts = this.attempts.get(attempt.checkpointId) || [];
    checkpointAttempts.push(attempt);
    this.attempts.set(attempt.checkpointId, checkpointAttempts);
  }

  private getAttemptCount(checkpointId: string): number {
    return this.attempts.get(checkpointId)?.length || 0;
  }

  private loadAttemptHistory(): void {
    // Charger l'historique depuis le stockage persistant
    // Implémentation selon le système de persistance choisi
  }

  // 🔄 METTRE À JOUR L'ÉTAT UTILISATEUR
  private updateUserStateAfterValidation(step: TrainingStep, result: ValidationResult): void {
    // Mettre à jour le score de l'étape
    this.userState.progress.scoresPerStep[step] = result.percentage;

    // Marquer comme complété si validé
    if (result.canProceed && !this.userState.completedSteps.includes(step)) {
      this.userState.completedSteps.push(step);
    }

    this.userState.progress.lastActivityAt = new Date();
  }

  // 🚫 CRÉER UN RÉSULTAT D'ÉCHEC
  private createFailureResult(reason: string): ValidationResult {
    return {
      isValid: false,
      score: 0,
      maxScore: 100,
      percentage: 0,
      status: StepValidationStatus.FAILED,
      criteriaMet: [],
      criteriaFailed: [],
      feedback: {
        type: 'failure',
        title: 'Validation impossible',
        message: reason,
        details: [],
        improvementAreas: [],
        strengths: []
      },
      recommendations: ['Contactez le support pour assistance'],
      anssiCompliant: false,
      canProceed: false,
      retryAllowed: false
    };
  }

  // 📊 MÉTHODES PUBLIQUES D'INFORMATION
  getValidationHistory(step: TrainingStep): ValidationAttempt[] {
    const checkpointId = `checkpoint_${step}`;
    return this.attempts.get(checkpointId) || [];
  }

  getLastValidationResult(step: TrainingStep): ValidationResult | null {
    const history = this.getValidationHistory(step);
    return history.length > 0 ? history[history.length - 1].result : null;
  }

  canRetakeValidation(step: TrainingStep): boolean {
    const checkpoint = this.getCheckpointForStep(step);
    if (!checkpoint) return false;
    
    return this.getAttemptCount(checkpoint.id) < checkpoint.maxAttempts;
  }
}
