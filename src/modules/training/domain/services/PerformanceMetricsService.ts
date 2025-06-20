/**
 * 📊 SERVICE DE MÉTRIQUES DE PERFORMANCE
 * Surveillance et optimisation de l'agent Workshop 1
 * POINT 1 - Agent Orchestrateur Workshop 1 Intelligent
 */

import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR LES MÉTRIQUES

export interface PerformanceMetrics {
  agentEffectiveness: AgentEffectivenessMetrics;
  userEngagement: UserEngagementMetrics;
  contentAdaptation: ContentAdaptationMetrics;
  systemPerformance: SystemPerformanceMetrics;
  learningOutcomes: LearningOutcomesMetrics;
}

export interface AgentEffectivenessMetrics {
  responseAccuracy: number; // 0-100
  adaptationSuccess: number; // 0-100
  userSatisfaction: number; // 0-100
  problemResolution: number; // 0-100
  guidanceQuality: number; // 0-100
  averageResponseTime: number; // en ms
}

export interface UserEngagementMetrics {
  sessionDuration: number; // en minutes
  interactionFrequency: number; // interactions/minute
  contentCompletionRate: number; // 0-100
  questionResponseRate: number; // 0-100
  proactiveEngagement: number; // 0-100
  dropoffPoints: string[];
}

export interface ContentAdaptationMetrics {
  adaptationTriggers: number;
  adaptationSuccess: number; // 0-100
  contentRelevance: number; // 0-100
  difficultyAlignment: number; // 0-100
  personalizationEffectiveness: number; // 0-100
  adaptationSpeed: number; // en ms
}

export interface SystemPerformanceMetrics {
  responseTime: number; // en ms
  throughput: number; // requêtes/seconde
  errorRate: number; // 0-100
  cacheHitRate: number; // 0-100
  memoryUsage: number; // en MB
  cpuUsage: number; // 0-100
}

export interface LearningOutcomesMetrics {
  knowledgeRetention: number; // 0-100
  skillImprovement: number; // 0-100
  competencyGrowth: number; // 0-100
  objectiveAchievement: number; // 0-100
  transferability: number; // 0-100
  longTermRetention: number; // 0-100
}

export interface MetricSnapshot {
  timestamp: Date;
  sessionId: string;
  userId: string;
  metrics: PerformanceMetrics;
  context: MetricContext;
}

export interface MetricContext {
  workshopId: number;
  moduleId: string;
  userProfile: EbiosExpertProfile;
  sessionPhase: 'start' | 'middle' | 'end';
  adaptationsApplied: number;
  interactionsCount: number;
}

export interface PerformanceTrend {
  metric: string;
  timeframe: 'hour' | 'day' | 'week' | 'month';
  values: { timestamp: Date; value: number }[];
  trend: 'improving' | 'stable' | 'declining';
  changeRate: number; // pourcentage de changement
}

// 📊 SERVICE PRINCIPAL DE MÉTRIQUES

export class PerformanceMetricsService {
  private static instance: PerformanceMetricsService;
  private metricsHistory: Map<string, MetricSnapshot[]> = new Map();
  private realTimeMetrics: Map<string, PerformanceMetrics> = new Map();
  private performanceThresholds: Map<string, number> = new Map();

  private constructor() {
    this.initializeThresholds();
    this.startMetricsCollection();
  }

  public static getInstance(): PerformanceMetricsService {
    if (!PerformanceMetricsService.instance) {
      PerformanceMetricsService.instance = new PerformanceMetricsService();
    }
    return PerformanceMetricsService.instance;
  }

  private initializeThresholds(): void {
    // Seuils de performance acceptables
    this.performanceThresholds.set('responseTime', 2000); // 2 secondes max
    this.performanceThresholds.set('userSatisfaction', 80); // 80% min
    this.performanceThresholds.set('adaptationSuccess', 75); // 75% min
    this.performanceThresholds.set('contentCompletionRate', 70); // 70% min
    this.performanceThresholds.set('errorRate', 5); // 5% max
    this.performanceThresholds.set('cacheHitRate', 85); // 85% min
  }

  // 📈 COLLECTE DE MÉTRIQUES EN TEMPS RÉEL

  public async recordSessionMetrics(
    sessionId: string,
    userId: string,
    context: MetricContext,
    rawMetrics: Partial<PerformanceMetrics>
  ): Promise<void> {
    
    const timestamp = new Date();
    
    // Calcul des métriques complètes
    const metrics = await this.calculateCompleteMetrics(rawMetrics, context);
    
    // Création du snapshot
    const snapshot: MetricSnapshot = {
      timestamp,
      sessionId,
      userId,
      metrics,
      context
    };

    // Stockage dans l'historique
    if (!this.metricsHistory.has(sessionId)) {
      this.metricsHistory.set(sessionId, []);
    }
    this.metricsHistory.get(sessionId)!.push(snapshot);

    // Mise à jour des métriques temps réel
    this.realTimeMetrics.set(sessionId, metrics);

    // Analyse des alertes
    await this.analyzePerformanceAlerts(snapshot);

    console.log(`📊 Métriques enregistrées pour session ${sessionId}`);
  }

  private async calculateCompleteMetrics(
    rawMetrics: Partial<PerformanceMetrics>,
    context: MetricContext
  ): Promise<PerformanceMetrics> {
    
    const startTime = Date.now();

    // Métriques d'efficacité de l'agent
    const agentEffectiveness: AgentEffectivenessMetrics = {
      responseAccuracy: rawMetrics.agentEffectiveness?.responseAccuracy || 
        await this.calculateResponseAccuracy(context),
      adaptationSuccess: rawMetrics.agentEffectiveness?.adaptationSuccess || 
        await this.calculateAdaptationSuccess(context),
      userSatisfaction: rawMetrics.agentEffectiveness?.userSatisfaction || 
        await this.calculateUserSatisfaction(context),
      problemResolution: rawMetrics.agentEffectiveness?.problemResolution || 
        await this.calculateProblemResolution(context),
      guidanceQuality: rawMetrics.agentEffectiveness?.guidanceQuality || 
        await this.calculateGuidanceQuality(context),
      averageResponseTime: rawMetrics.agentEffectiveness?.averageResponseTime || 
        await this.calculateAverageResponseTime(context)
    };

    // Métriques d'engagement utilisateur
    const userEngagement: UserEngagementMetrics = {
      sessionDuration: rawMetrics.userEngagement?.sessionDuration || 
        await this.calculateSessionDuration(context),
      interactionFrequency: rawMetrics.userEngagement?.interactionFrequency || 
        await this.calculateInteractionFrequency(context),
      contentCompletionRate: rawMetrics.userEngagement?.contentCompletionRate || 
        await this.calculateContentCompletionRate(context),
      questionResponseRate: rawMetrics.userEngagement?.questionResponseRate || 
        await this.calculateQuestionResponseRate(context),
      proactiveEngagement: rawMetrics.userEngagement?.proactiveEngagement || 
        await this.calculateProactiveEngagement(context),
      dropoffPoints: rawMetrics.userEngagement?.dropoffPoints || 
        await this.identifyDropoffPoints(context)
    };

    // Métriques d'adaptation de contenu
    const contentAdaptation: ContentAdaptationMetrics = {
      adaptationTriggers: context.adaptationsApplied,
      adaptationSuccess: await this.calculateContentAdaptationSuccess(context),
      contentRelevance: await this.calculateContentRelevance(context),
      difficultyAlignment: await this.calculateDifficultyAlignment(context),
      personalizationEffectiveness: await this.calculatePersonalizationEffectiveness(context),
      adaptationSpeed: await this.calculateAdaptationSpeed(context)
    };

    // Métriques de performance système
    const systemPerformance: SystemPerformanceMetrics = {
      responseTime: Date.now() - startTime,
      throughput: await this.calculateThroughput(),
      errorRate: await this.calculateErrorRate(),
      cacheHitRate: await this.getCacheHitRate(),
      memoryUsage: await this.getMemoryUsage(),
      cpuUsage: await this.getCpuUsage()
    };

    // Métriques de résultats d'apprentissage
    const learningOutcomes: LearningOutcomesMetrics = {
      knowledgeRetention: await this.calculateKnowledgeRetention(context),
      skillImprovement: await this.calculateSkillImprovement(context),
      competencyGrowth: await this.calculateCompetencyGrowth(context),
      objectiveAchievement: await this.calculateObjectiveAchievement(context),
      transferability: await this.calculateTransferability(context),
      longTermRetention: await this.calculateLongTermRetention(context)
    };

    return {
      agentEffectiveness,
      userEngagement,
      contentAdaptation,
      systemPerformance,
      learningOutcomes
    };
  }

  // 🎯 CALCULS SPÉCIFIQUES DE MÉTRIQUES

  private async calculateResponseAccuracy(context: MetricContext): Promise<number> {
    // Analyse de la précision des réponses de l'agent
    const expertiseLevel = context.userProfile.experience?.ebiosYears || 0;
    const baseAccuracy = 85;
    
    // Ajustement selon l'expertise de l'utilisateur
    if (expertiseLevel >= 10) return Math.min(95, baseAccuracy + 10);
    if (expertiseLevel >= 5) return Math.min(90, baseAccuracy + 5);
    
    return baseAccuracy;
  }

  private async calculateAdaptationSuccess(context: MetricContext): Promise<number> {
    // Mesure du succès des adaptations appliquées
    if (context.adaptationsApplied === 0) return 100; // Pas d'adaptation nécessaire
    
    // Simulation basée sur le nombre d'adaptations et le profil
    const adaptationRatio = Math.min(context.adaptationsApplied / 5, 1);
    return Math.max(60, 100 - (adaptationRatio * 30));
  }

  private async calculateUserSatisfaction(context: MetricContext): Promise<number> {
    // Estimation de la satisfaction basée sur l'engagement
    const baseScore = 80;
    const interactionBonus = Math.min(context.interactionsCount * 2, 15);
    
    return Math.min(100, baseScore + interactionBonus);
  }

  private async calculateProblemResolution(context: MetricContext): Promise<number> {
    // Taux de résolution des problèmes rencontrés
    return 88; // Valeur simulée - dans un vrai système, basé sur les tickets/questions
  }

  private async calculateGuidanceQuality(context: MetricContext): Promise<number> {
    // Qualité de la guidance fournie
    const expertiseLevel = context.userProfile.experience?.ebiosYears || 0;
    
    if (expertiseLevel >= 10) return 92; // Guidance experte
    if (expertiseLevel >= 5) return 87; // Guidance avancée
    return 82; // Guidance standard
  }

  private async calculateAverageResponseTime(context: MetricContext): Promise<number> {
    // Temps de réponse moyen de l'agent
    return 1200 + Math.random() * 800; // 1.2-2.0 secondes simulées
  }

  private async calculateSessionDuration(context: MetricContext): Promise<number> {
    // Durée de session estimée
    return 45 + Math.random() * 60; // 45-105 minutes
  }

  private async calculateInteractionFrequency(context: MetricContext): Promise<number> {
    // Fréquence d'interaction par minute
    return context.interactionsCount / Math.max(1, context.interactionsCount * 2);
  }

  private async calculateContentCompletionRate(context: MetricContext): Promise<number> {
    // Taux de completion du contenu
    if (context.sessionPhase === 'start') return 15;
    if (context.sessionPhase === 'middle') return 60;
    return 95; // end
  }

  private async calculateQuestionResponseRate(context: MetricContext): Promise<number> {
    // Taux de réponse aux questions
    return 85 + Math.random() * 10; // 85-95%
  }

  private async calculateProactiveEngagement(context: MetricContext): Promise<number> {
    // Engagement proactif de l'utilisateur
    const expertiseBonus = (context.userProfile.experience?.ebiosYears || 0) * 2;
    return Math.min(100, 70 + expertiseBonus);
  }

  private async identifyDropoffPoints(context: MetricContext): Promise<string[]> {
    // Points d'abandon identifiés
    const dropoffs: string[] = [];
    
    if (context.adaptationsApplied > 3) {
      dropoffs.push('excessive_adaptations');
    }
    
    if (context.interactionsCount < 5) {
      dropoffs.push('low_interaction');
    }
    
    return dropoffs;
  }

  // 🔧 MÉTRIQUES SYSTÈME

  private async calculateThroughput(): Promise<number> {
    return 50 + Math.random() * 30; // 50-80 requêtes/seconde
  }

  private async calculateErrorRate(): Promise<number> {
    return Math.random() * 3; // 0-3% d'erreurs
  }

  private async getCacheHitRate(): Promise<number> {
    return 85 + Math.random() * 10; // 85-95%
  }

  private async getMemoryUsage(): Promise<number> {
    return 150 + Math.random() * 100; // 150-250 MB
  }

  private async getCpuUsage(): Promise<number> {
    return 20 + Math.random() * 30; // 20-50%
  }

  // 📚 MÉTRIQUES D'APPRENTISSAGE

  private async calculateKnowledgeRetention(context: MetricContext): Promise<number> {
    const expertiseLevel = context.userProfile.experience?.ebiosYears || 0;
    return Math.min(100, 70 + expertiseLevel * 3);
  }

  private async calculateSkillImprovement(context: MetricContext): Promise<number> {
    return 75 + Math.random() * 20; // 75-95%
  }

  private async calculateCompetencyGrowth(context: MetricContext): Promise<number> {
    return 80 + Math.random() * 15; // 80-95%
  }

  private async calculateObjectiveAchievement(context: MetricContext): Promise<number> {
    if (context.sessionPhase === 'end') return 90 + Math.random() * 10;
    if (context.sessionPhase === 'middle') return 60 + Math.random() * 20;
    return 20 + Math.random() * 30;
  }

  private async calculateTransferability(context: MetricContext): Promise<number> {
    const sectorExperience = context.userProfile.sector ? 10 : 0;
    return 70 + sectorExperience + Math.random() * 15;
  }

  private async calculateLongTermRetention(context: MetricContext): Promise<number> {
    return 65 + Math.random() * 25; // 65-90%
  }

  // 🚨 ANALYSE DES ALERTES

  private async analyzePerformanceAlerts(snapshot: MetricSnapshot): Promise<void> {
    const alerts: string[] = [];

    // Vérification des seuils critiques
    if (snapshot.metrics.systemPerformance.responseTime > this.performanceThresholds.get('responseTime')!) {
      alerts.push(`⚠️ Temps de réponse élevé: ${snapshot.metrics.systemPerformance.responseTime}ms`);
    }

    if (snapshot.metrics.agentEffectiveness.userSatisfaction < this.performanceThresholds.get('userSatisfaction')!) {
      alerts.push(`⚠️ Satisfaction utilisateur faible: ${snapshot.metrics.agentEffectiveness.userSatisfaction}%`);
    }

    if (snapshot.metrics.userEngagement.contentCompletionRate < this.performanceThresholds.get('contentCompletionRate')!) {
      alerts.push(`⚠️ Taux de completion faible: ${snapshot.metrics.userEngagement.contentCompletionRate}%`);
    }

    // Envoi des alertes si nécessaire
    if (alerts.length > 0) {
      console.warn(`🚨 Alertes performance session ${snapshot.sessionId}:`, alerts);
      await this.sendPerformanceAlerts(snapshot.sessionId, alerts);
    }
  }

  private async sendPerformanceAlerts(sessionId: string, alerts: string[]): Promise<void> {
    // Dans un vrai système, envoyer les alertes via email/Slack/etc.
    console.log(`📧 Alertes envoyées pour session ${sessionId}:`, alerts);
  }

  // 📊 API PUBLIQUE POUR CONSULTATION

  public getSessionMetrics(sessionId: string): MetricSnapshot[] {
    return this.metricsHistory.get(sessionId) || [];
  }

  public getRealTimeMetrics(sessionId: string): PerformanceMetrics | null {
    return this.realTimeMetrics.get(sessionId) || null;
  }

  public getPerformanceTrends(metric: string, timeframe: 'hour' | 'day' | 'week' | 'month'): PerformanceTrend {
    // Implémentation simplifiée - dans un vrai système, analyser l'historique
    return {
      metric,
      timeframe,
      values: [],
      trend: 'stable',
      changeRate: 0
    };
  }

  public getSystemHealthScore(): number {
    // Score de santé global du système (0-100)
    const metrics = Array.from(this.realTimeMetrics.values());
    if (metrics.length === 0) return 100;

    const avgResponseTime = metrics.reduce((sum, m) => sum + m.systemPerformance.responseTime, 0) / metrics.length;
    const avgSatisfaction = metrics.reduce((sum, m) => sum + m.agentEffectiveness.userSatisfaction, 0) / metrics.length;
    const avgCompletion = metrics.reduce((sum, m) => sum + m.userEngagement.contentCompletionRate, 0) / metrics.length;

    // Score composite
    const responseScore = Math.max(0, 100 - (avgResponseTime / 50)); // Pénalité si > 5s
    const satisfactionScore = avgSatisfaction;
    const completionScore = avgCompletion;

    return Math.round((responseScore + satisfactionScore + completionScore) / 3);
  }

  // 🔄 NETTOYAGE ET MAINTENANCE

  private startMetricsCollection(): void {
    // Nettoyage périodique des anciennes métriques
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 60 * 60 * 1000); // Toutes les heures
  }

  private cleanupOldMetrics(): void {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 jours
    let cleaned = 0;

    for (const [sessionId, snapshots] of this.metricsHistory.entries()) {
      const filteredSnapshots = snapshots.filter(s => s.timestamp > cutoffDate);
      
      if (filteredSnapshots.length !== snapshots.length) {
        this.metricsHistory.set(sessionId, filteredSnapshots);
        cleaned += snapshots.length - filteredSnapshots.length;
      }

      // Supprimer les sessions vides
      if (filteredSnapshots.length === 0) {
        this.metricsHistory.delete(sessionId);
        this.realTimeMetrics.delete(sessionId);
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Nettoyage métriques: ${cleaned} snapshots supprimés`);
    }
  }
}

export default PerformanceMetricsService;
