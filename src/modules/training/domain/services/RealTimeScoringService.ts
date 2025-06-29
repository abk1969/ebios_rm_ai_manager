/**
 * 🎯 SERVICE DE SCORING INTELLIGENT EN TEMPS RÉEL
 * Évaluation automatique et adaptative des réponses complexes EBIOS RM
 * Avec feedback expert instantané et suggestions d'amélioration
 */

import { ComplexQuestion, ScoringCriteria, ScoreBreakdown } from './ComplexQuestionGeneratorService';

// 🎯 TYPES POUR LE SCORING EN TEMPS RÉEL
export interface RealTimeScore {
  questionId: string;
  userId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  breakdown: DetailedScoreBreakdown[];
  feedback: RealTimeFeedback;
  suggestions: ImprovementSuggestion[];
  timeSpent: number;
  submissionTime: Date;
  validationStatus: ValidationStatus;
}

export interface DetailedScoreBreakdown {
  criterion: string;
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
  evaluationMethod: 'automatic' | 'ai_assisted' | 'expert_review';
  feedback: string;
  evidence: string[];
  improvementAreas: string[];
}

export interface RealTimeFeedback {
  immediate: FeedbackItem[];
  detailed: FeedbackItem[];
  expert: FeedbackItem[];
  motivational: string;
  nextSteps: string[];
}

export interface FeedbackItem {
  type: 'positive' | 'constructive' | 'critical';
  category: string;
  message: string;
  priority: number;
  actionable: boolean;
  resources?: string[];
}

export interface ImprovementSuggestion {
  area: string;
  current: string;
  suggested: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  resources: string[];
  examples: string[];
}

export interface ValidationStatus {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completeness: number; // 0-1
  quality: number; // 0-1
}

export interface ValidationError {
  field: string;
  rule: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
  suggestion: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  impact: string;
  recommendation: string;
}

// 🎯 RÉPONSE UTILISATEUR
export interface UserResponse {
  questionId: string;
  userId: string;
  responses: Record<string, any>;
  timeSpent: number;
  hintsUsed: number[];
  submissionTime: Date;
  isPartial: boolean;
}

/**
 * 🎯 SERVICE PRINCIPAL DE SCORING EN TEMPS RÉEL
 */
export class RealTimeScoringService {
  private static instance: RealTimeScoringService;
  private scoringHistory: Map<string, RealTimeScore[]> = new Map();
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private feedbackTemplates: Map<string, FeedbackTemplate[]> = new Map();

  private constructor() {
    this.initializeValidationRules();
    this.initializeFeedbackTemplates();
  }

  public static getInstance(): RealTimeScoringService {
    if (!RealTimeScoringService.instance) {
      RealTimeScoringService.instance = new RealTimeScoringService();
    }
    return RealTimeScoringService.instance;
  }

  /**
   * 🎯 SCORING PRINCIPAL EN TEMPS RÉEL
   */
  async scoreResponse(
    question: ComplexQuestion,
    userResponse: UserResponse
  ): Promise<RealTimeScore> {
    const startTime = Date.now();
    
    try {
      console.log(`🎯 Scoring en temps réel pour question ${question.id}`);
      
      // 1. Validation de la réponse
      const validationStatus = await this.validateResponse(question, userResponse);
      
      // 2. Scoring automatique
      const automaticScores = await this.performAutomaticScoring(question, userResponse);
      
      // 3. Scoring assisté par IA
      const aiAssistedScores = await this.performAIAssistedScoring(question, userResponse);
      
      // 4. Combinaison des scores
      const combinedBreakdown = this.combineScores(automaticScores, aiAssistedScores, question.scoring);
      
      // 5. Calcul du score total
      const totalScore = this.calculateTotalScore(combinedBreakdown, userResponse.hintsUsed, question);
      
      // 6. Génération du feedback
      const feedback = await this.generateRealTimeFeedback(
        question, 
        userResponse, 
        combinedBreakdown, 
        validationStatus
      );
      
      // 7. Suggestions d'amélioration
      const suggestions = await this.generateImprovementSuggestions(
        question, 
        userResponse, 
        combinedBreakdown
      );
      
      const score: RealTimeScore = {
        questionId: question.id,
        userId: userResponse.userId,
        totalScore: totalScore.earned,
        maxScore: totalScore.max,
        percentage: Math.round((totalScore.earned / totalScore.max) * 100),
        breakdown: combinedBreakdown,
        feedback,
        suggestions,
        timeSpent: userResponse.timeSpent,
        submissionTime: userResponse.submissionTime,
        validationStatus
      };
      
      // Sauvegarder dans l'historique
      this.saveToHistory(score);
      
      console.log(`✅ Scoring terminé: ${score.percentage}% (${Date.now() - startTime}ms)`);
      return score;
      
    } catch (error) {
      console.error('❌ Erreur scoring temps réel:', error);
      throw new Error(`Échec du scoring: ${error.message}`);
    }
  }

  /**
   * 🔍 VALIDATION DE LA RÉPONSE
   */
  private async validateResponse(
    question: ComplexQuestion,
    userResponse: UserResponse
  ): Promise<ValidationStatus> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validation des règles de la question
    for (const rule of question.realTimeValidation) {
      const result = this.applyValidationRule(rule, userResponse.responses);
      if (result.isError) {
        errors.push({
          field: rule.field,
          rule: rule.rule,
          message: rule.message,
          severity: rule.severity === 'error' ? 'critical' : 'minor',
          suggestion: this.getValidationSuggestion(rule)
        });
      } else if (result.isWarning) {
        warnings.push({
          field: rule.field,
          message: rule.message,
          impact: 'Qualité de la réponse',
          recommendation: this.getValidationSuggestion(rule)
        });
      }
    }
    
    // Calcul de la complétude
    const completeness = this.calculateCompleteness(question, userResponse);
    
    // Calcul de la qualité
    const quality = this.calculateQuality(question, userResponse, errors, warnings);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness,
      quality
    };
  }

  /**
   * 🤖 SCORING AUTOMATIQUE
   */
  private async performAutomaticScoring(
    question: ComplexQuestion,
    userResponse: UserResponse
  ): Promise<DetailedScoreBreakdown[]> {
    const breakdown: DetailedScoreBreakdown[] = [];
    
    for (const criterion of question.scoring.breakdown) {
      if (criterion.evaluationMethod === 'automatic') {
        const score = await this.evaluateAutomaticCriterion(criterion, userResponse, question);
        breakdown.push(score);
      }
    }
    
    return breakdown;
  }

  /**
   * 🧠 SCORING ASSISTÉ PAR IA
   */
  private async performAIAssistedScoring(
    question: ComplexQuestion,
    userResponse: UserResponse
  ): Promise<DetailedScoreBreakdown[]> {
    const breakdown: DetailedScoreBreakdown[] = [];
    
    for (const criterion of question.scoring.breakdown) {
      if (criterion.evaluationMethod === 'ai_assisted') {
        const score = await this.evaluateAIAssistedCriterion(criterion, userResponse, question);
        breakdown.push(score);
      }
    }
    
    return breakdown;
  }

  /**
   * 📊 COMBINAISON DES SCORES
   */
  private combineScores(
    automaticScores: DetailedScoreBreakdown[],
    aiScores: DetailedScoreBreakdown[],
    scoringCriteria: ScoringCriteria
  ): DetailedScoreBreakdown[] {
    const combined = [...automaticScores, ...aiScores];
    
    // Ajouter les critères nécessitant une revue experte
    for (const criterion of scoringCriteria.breakdown) {
      if (criterion.evaluationMethod === 'expert_review') {
        combined.push({
          criterion: criterion.criterion,
          earnedPoints: 0, // À évaluer par un expert
          maxPoints: criterion.points,
          percentage: 0,
          evaluationMethod: 'expert_review',
          feedback: 'Évaluation experte requise',
          evidence: [],
          improvementAreas: []
        });
      }
    }
    
    return combined;
  }

  /**
   * 🎯 CALCUL DU SCORE TOTAL
   */
  private calculateTotalScore(
    breakdown: DetailedScoreBreakdown[],
    hintsUsed: number[],
    question: ComplexQuestion
  ): { earned: number; max: number } {
    let earned = breakdown.reduce((sum, item) => sum + item.earnedPoints, 0);
    const max = breakdown.reduce((sum, item) => sum + item.maxPoints, 0);
    
    // Déduction pour les indices utilisés
    for (const hintLevel of hintsUsed) {
      const hint = question.hints.find(h => h.level === hintLevel);
      if (hint) {
        earned -= hint.pointDeduction;
      }
    }
    
    // Application des bonus et pénalités
    // (À implémenter selon les règles spécifiques)
    
    return { earned: Math.max(0, earned), max };
  }

  // Méthodes utilitaires (à implémenter)
  private initializeValidationRules(): void { console.log('🔧 Initialisation règles validation...'); }
  private initializeFeedbackTemplates(): void { console.log('🔧 Initialisation templates feedback...'); }
  private applyValidationRule(rule: any, responses: any): any { return { isError: false, isWarning: false }; }
  private getValidationSuggestion(rule: any): string { return 'Suggestion par défaut'; }
  private calculateCompleteness(question: ComplexQuestion, response: UserResponse): number { return 0.8; }
  private calculateQuality(question: ComplexQuestion, response: UserResponse, errors: any[], warnings: any[]): number { return 0.7; }
  private evaluateAutomaticCriterion(criterion: any, response: UserResponse, question: ComplexQuestion): Promise<DetailedScoreBreakdown> { 
    return Promise.resolve({
      criterion: criterion.criterion,
      earnedPoints: criterion.points * 0.8,
      maxPoints: criterion.points,
      percentage: 80,
      evaluationMethod: 'automatic',
      feedback: 'Évaluation automatique',
      evidence: [],
      improvementAreas: []
    });
  }
  private evaluateAIAssistedCriterion(criterion: any, response: UserResponse, question: ComplexQuestion): Promise<DetailedScoreBreakdown> {
    return Promise.resolve({
      criterion: criterion.criterion,
      earnedPoints: criterion.points * 0.75,
      maxPoints: criterion.points,
      percentage: 75,
      evaluationMethod: 'ai_assisted',
      feedback: 'Évaluation IA',
      evidence: [],
      improvementAreas: []
    });
  }
  private generateRealTimeFeedback(question: ComplexQuestion, response: UserResponse, breakdown: DetailedScoreBreakdown[], validation: ValidationStatus): Promise<RealTimeFeedback> {
    return Promise.resolve({
      immediate: [],
      detailed: [],
      expert: [],
      motivational: 'Excellent travail !',
      nextSteps: []
    });
  }
  private generateImprovementSuggestions(question: ComplexQuestion, response: UserResponse, breakdown: DetailedScoreBreakdown[]): Promise<ImprovementSuggestion[]> {
    return Promise.resolve([]);
  }
  private saveToHistory(score: RealTimeScore): void {
    const userHistory = this.scoringHistory.get(score.userId) || [];
    userHistory.push(score);
    this.scoringHistory.set(score.userId, userHistory);
  }
}

// Types utilitaires
interface ValidationRule {
  field: string;
  rule: string;
  validator: (value: any) => boolean;
  message: string;
}

interface FeedbackTemplate {
  condition: string;
  template: string;
  type: 'positive' | 'constructive' | 'critical';
}
