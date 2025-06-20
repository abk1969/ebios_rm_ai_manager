/**
 * 📊 MÉTRIQUES DE PERFORMANCE EXPERTES
 * Système de mesure et suivi des performances pour experts EBIOS/GRC/Audit
 * Métriques sophistiquées pour professionnels confirmés
 */

import { EbiosExpertProfile, EbiosSpecialization } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES DE MÉTRIQUES EXPERTES
export interface ExpertPerformanceMetrics {
  userId: string;
  profile: EbiosExpertProfile;
  overallScore: number;
  categoryMetrics: Map<string, CategoryMetrics>;
  timeMetrics: TimeMetrics;
  qualityMetrics: QualityMetrics;
  progressionMetrics: ProgressionMetrics;
  benchmarkMetrics: BenchmarkMetrics;
  lastUpdated: Date;
}

export interface CategoryMetrics {
  category: string;
  averageScore: number;
  bestScore: number;
  consistency: number; // Écart-type normalisé
  improvementRate: number; // % d'amélioration sur 30 jours
  expertiseLevel: 'senior' | 'expert' | 'master';
  completedExercises: number;
  timeSpentHours: number;
}

export interface TimeMetrics {
  averageCompletionTime: number; // minutes par exercice
  efficiencyRatio: number; // score/temps
  timeConsistency: number;
  fastestCompletion: number;
  slowestCompletion: number;
  totalTimeSpent: number; // heures
  sessionsCount: number;
  averageSessionDuration: number;
}

export interface QualityMetrics {
  accuracyRate: number; // % de réponses correctes
  precisionScore: number; // Qualité des analyses ouvertes
  methodologyCompliance: number; // Respect des méthodologies
  innovationIndex: number; // Originalité des approches
  peerReviewScore: number; // Évaluation par pairs
  selfAssessmentAccuracy: number; // Précision auto-évaluation
}

export interface ProgressionMetrics {
  learningVelocity: number; // Vitesse d'apprentissage
  skillAcquisitionRate: number; // Nouvelles compétences/mois
  retentionRate: number; // Maintien des acquis
  adaptabilityScore: number; // Adaptation nouveaux contextes
  masteryProgression: Map<EbiosSpecialization, number>;
  certificationProgress: CertificationProgress[];
}

export interface BenchmarkMetrics {
  industryPercentile: number; // Position vs pairs industrie
  globalPercentile: number; // Position vs tous experts
  sectorRanking: number; // Classement sectoriel
  experienceAdjustedScore: number; // Score ajusté expérience
  peerComparison: PeerComparison;
  expertiseGrowthRate: number; // Croissance vs pairs
}

export interface PeerComparison {
  similarProfilesCount: number;
  averagePeerScore: number;
  topPerformerScore: number;
  relativePosition: number; // 0-1 (1 = meilleur)
  strengthsVsPeers: string[];
  improvementAreasVsPeers: string[];
}

export interface CertificationProgress {
  certification: string;
  currentLevel: number;
  targetLevel: number;
  progressPercentage: number;
  estimatedCompletionDate: Date;
  requiredSkills: string[];
  missingSkills: string[];
}

// 📈 CALCULATEUR DE MÉTRIQUES EXPERTES
export class ExpertMetricsCalculator {
  
  // 🎯 CALCUL MÉTRIQUES GLOBALES
  static calculateOverallMetrics(
    userHistory: ExerciseHistory[],
    profile: EbiosExpertProfile
  ): ExpertPerformanceMetrics {
    const categoryMetrics = this.calculateCategoryMetrics(userHistory);
    const timeMetrics = this.calculateTimeMetrics(userHistory);
    const qualityMetrics = this.calculateQualityMetrics(userHistory);
    const progressionMetrics = this.calculateProgressionMetrics(userHistory, profile);
    const benchmarkMetrics = this.calculateBenchmarkMetrics(userHistory, profile);

    const overallScore = this.calculateOverallScore(
      categoryMetrics,
      timeMetrics,
      qualityMetrics
    );

    return {
      userId: profile.userId || '',
      profile,
      overallScore,
      categoryMetrics,
      timeMetrics,
      qualityMetrics,
      progressionMetrics,
      benchmarkMetrics,
      lastUpdated: new Date()
    };
  }

  // 📊 MÉTRIQUES PAR CATÉGORIE
  private static calculateCategoryMetrics(history: ExerciseHistory[]): Map<string, CategoryMetrics> {
    const categoryMap = new Map<string, CategoryMetrics>();
    const categoryData = new Map<string, ExerciseHistory[]>();

    // Grouper par catégorie
    history.forEach(exercise => {
      const category = exercise.category;
      if (!categoryData.has(category)) {
        categoryData.set(category, []);
      }
      categoryData.get(category)!.push(exercise);
    });

    // Calculer métriques pour chaque catégorie
    categoryData.forEach((exercises, category) => {
      const scores = exercises.map(e => e.score);
      const times = exercises.map(e => e.completionTime);
      
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const bestScore = Math.max(...scores);
      const consistency = 1 - (this.standardDeviation(scores) / averageScore);
      
      // Calcul taux d'amélioration (30 derniers jours)
      const recent = exercises.filter(e => 
        (Date.now() - e.completedAt.getTime()) <= 30 * 24 * 60 * 60 * 1000
      );
      const improvementRate = this.calculateImprovementRate(recent);

      // Détermination niveau expertise
      const expertiseLevel = this.determineExpertiseLevel(averageScore, consistency);

      categoryMap.set(category, {
        category,
        averageScore,
        bestScore,
        consistency,
        improvementRate,
        expertiseLevel,
        completedExercises: exercises.length,
        timeSpentHours: times.reduce((a, b) => a + b, 0) / 60
      });
    });

    return categoryMap;
  }

  // ⏱️ MÉTRIQUES TEMPORELLES
  private static calculateTimeMetrics(history: ExerciseHistory[]): TimeMetrics {
    const completionTimes = history.map(e => e.completionTime);
    const scores = history.map(e => e.score);
    
    const averageCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
    const efficiencyRatio = scores.reduce((a, b) => a + b, 0) / completionTimes.reduce((a, b) => a + b, 0);
    const timeConsistency = 1 - (this.standardDeviation(completionTimes) / averageCompletionTime);
    
    // Calcul sessions
    const sessions = this.groupIntoSessions(history);
    const sessionDurations = sessions.map(s => s.duration);
    const averageSessionDuration = sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;

    return {
      averageCompletionTime,
      efficiencyRatio,
      timeConsistency,
      fastestCompletion: Math.min(...completionTimes),
      slowestCompletion: Math.max(...completionTimes),
      totalTimeSpent: completionTimes.reduce((a, b) => a + b, 0) / 60,
      sessionsCount: sessions.length,
      averageSessionDuration
    };
  }

  // 🎯 MÉTRIQUES QUALITÉ
  private static calculateQualityMetrics(history: ExerciseHistory[]): QualityMetrics {
    const correctAnswers = history.filter(e => e.isCorrect).length;
    const accuracyRate = correctAnswers / history.length;
    
    // Scores de précision pour analyses ouvertes
    const openAnswers = history.filter(e => e.type === 'open_analysis');
    const precisionScore = openAnswers.length > 0 
      ? openAnswers.reduce((sum, e) => sum + e.precisionScore, 0) / openAnswers.length
      : 0;

    // Conformité méthodologique
    const methodologyScores = history.map(e => e.methodologyScore || 0);
    const methodologyCompliance = methodologyScores.reduce((a, b) => a + b, 0) / methodologyScores.length;

    // Index d'innovation (originalité des approches)
    const innovationIndex = this.calculateInnovationIndex(history);

    return {
      accuracyRate,
      precisionScore,
      methodologyCompliance,
      innovationIndex,
      peerReviewScore: 0, // À implémenter avec système peer review
      selfAssessmentAccuracy: 0 // À implémenter avec auto-évaluation
    };
  }

  // 📈 MÉTRIQUES PROGRESSION
  private static calculateProgressionMetrics(
    history: ExerciseHistory[],
    profile: EbiosExpertProfile
  ): ProgressionMetrics {
    // Vitesse d'apprentissage (amélioration score/temps)
    const learningVelocity = this.calculateLearningVelocity(history);
    
    // Taux d'acquisition de compétences
    const skillAcquisitionRate = this.calculateSkillAcquisitionRate(history);
    
    // Taux de rétention
    const retentionRate = this.calculateRetentionRate(history);
    
    // Score d'adaptabilité
    const adaptabilityScore = this.calculateAdaptabilityScore(history);
    
    // Progression par spécialisation
    const masteryProgression = this.calculateMasteryProgression(history, profile.specializations);
    
    // Progrès certifications
    const certificationProgress = this.calculateCertificationProgress(history, profile);

    return {
      learningVelocity,
      skillAcquisitionRate,
      retentionRate,
      adaptabilityScore,
      masteryProgression,
      certificationProgress
    };
  }

  // 🏆 MÉTRIQUES BENCHMARK
  private static calculateBenchmarkMetrics(
    history: ExerciseHistory[],
    profile: EbiosExpertProfile
  ): BenchmarkMetrics {
    // Simulation de données benchmark (à remplacer par vraies données)
    const userScore = history.reduce((sum, e) => sum + e.score, 0) / history.length;
    
    // Percentiles simulés
    const industryPercentile = Math.min(95, Math.max(5, userScore * 1.2));
    const globalPercentile = Math.min(90, Math.max(10, userScore * 1.1));
    
    // Classement sectoriel simulé
    const sectorRanking = Math.max(1, Math.round(100 - industryPercentile));
    
    // Score ajusté expérience
    const experienceMultiplier = Math.min(1.2, 1 + (profile.experienceYears - 5) * 0.02);
    const experienceAdjustedScore = userScore * experienceMultiplier;

    const peerComparison: PeerComparison = {
      similarProfilesCount: 150, // Simulé
      averagePeerScore: userScore * 0.9,
      topPerformerScore: userScore * 1.3,
      relativePosition: industryPercentile / 100,
      strengthsVsPeers: ['Analyse de risques', 'Méthodologie EBIOS'],
      improvementAreasVsPeers: ['Threat Intelligence', 'Quantification']
    };

    return {
      industryPercentile,
      globalPercentile,
      sectorRanking,
      experienceAdjustedScore,
      peerComparison,
      expertiseGrowthRate: 0.15 // 15% croissance simulée
    };
  }

  // 🧮 MÉTHODES UTILITAIRES
  private static standardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private static calculateOverallScore(
    categoryMetrics: Map<string, CategoryMetrics>,
    timeMetrics: TimeMetrics,
    qualityMetrics: QualityMetrics
  ): number {
    const categoryAvg = Array.from(categoryMetrics.values())
      .reduce((sum, cat) => sum + cat.averageScore, 0) / categoryMetrics.size;
    
    const timeScore = timeMetrics.efficiencyRatio * 100;
    const qualityScore = (qualityMetrics.accuracyRate + qualityMetrics.precisionScore + 
                         qualityMetrics.methodologyCompliance) / 3 * 100;
    
    return (categoryAvg * 0.5 + timeScore * 0.25 + qualityScore * 0.25);
  }

  private static determineExpertiseLevel(score: number, consistency: number): 'senior' | 'expert' | 'master' {
    if (score >= 85 && consistency >= 0.8) return 'master';
    if (score >= 70 && consistency >= 0.7) return 'expert';
    return 'senior';
  }

  private static calculateImprovementRate(exercises: ExerciseHistory[]): number {
    if (exercises.length < 2) return 0;
    
    const sorted = exercises.sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, e) => sum + e.score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, e) => sum + e.score, 0) / secondHalf.length;
    
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }

  private static groupIntoSessions(history: ExerciseHistory[]): Session[] {
    // Grouper exercices en sessions (gap > 30 min = nouvelle session)
    const sessions: Session[] = [];
    let currentSession: ExerciseHistory[] = [];
    
    const sorted = history.sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
    
    sorted.forEach((exercise, index) => {
      if (index === 0 || 
          exercise.completedAt.getTime() - sorted[index - 1].completedAt.getTime() > 30 * 60 * 1000) {
        if (currentSession.length > 0) {
          sessions.push(this.createSession(currentSession));
        }
        currentSession = [exercise];
      } else {
        currentSession.push(exercise);
      }
    });
    
    if (currentSession.length > 0) {
      sessions.push(this.createSession(currentSession));
    }
    
    return sessions;
  }

  private static createSession(exercises: ExerciseHistory[]): Session {
    const startTime = exercises[0].completedAt;
    const endTime = exercises[exercises.length - 1].completedAt;
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
    
    return {
      startTime,
      endTime,
      duration,
      exercisesCount: exercises.length,
      averageScore: exercises.reduce((sum, e) => sum + e.score, 0) / exercises.length
    };
  }

  // Méthodes à implémenter selon besoins spécifiques
  private static calculateLearningVelocity(history: ExerciseHistory[]): number { return 0.75; }
  private static calculateSkillAcquisitionRate(history: ExerciseHistory[]): number { return 0.8; }
  private static calculateRetentionRate(history: ExerciseHistory[]): number { return 0.85; }
  private static calculateAdaptabilityScore(history: ExerciseHistory[]): number { return 0.7; }
  private static calculateInnovationIndex(history: ExerciseHistory[]): number { return 0.6; }
  private static calculateMasteryProgression(history: ExerciseHistory[], specializations: EbiosSpecialization[]): Map<EbiosSpecialization, number> {
    return new Map();
  }
  private static calculateCertificationProgress(history: ExerciseHistory[], profile: EbiosExpertProfile): CertificationProgress[] {
    return [];
  }
}

// 🎯 TYPES AUXILIAIRES
export interface ExerciseHistory {
  id: string;
  category: string;
  type: string;
  score: number;
  completionTime: number; // minutes
  completedAt: Date;
  isCorrect: boolean;
  precisionScore: number;
  methodologyScore?: number;
  difficulty: string;
  context: any;
}

export interface Session {
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  exercisesCount: number;
  averageScore: number;
}

export default ExpertMetricsCalculator;
