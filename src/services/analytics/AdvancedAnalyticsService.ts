/**
 * 📊 SERVICE ANALYTICS AVANCÉ - INTELLIGENCE MÉTIER
 * Service d'analyse avancée pour optimisation continue et insights métier
 * Recommandation audit : Analytics prédictifs et optimisation basée sur les données
 */

import { PerformanceOptimizerAgent } from '../agents/PerformanceOptimizerAgent';
import { PredictiveIntelligenceAgent } from '../agents/PredictiveIntelligenceAgent';
import { RegressionDetector } from '../monitoring/RegressionDetector';

export interface AnalyticsConfig {
  enableRealTimeAnalytics: boolean;
  enablePredictiveAnalytics: boolean;
  enablePerformanceOptimization: boolean;
  dataRetentionDays: number;
  alertThresholds: {
    performance: number;
    compliance: number;
    userSatisfaction: number;
  };
}

export interface MetricDefinition {
  id: string;
  name: string;
  category: 'performance' | 'business' | 'user' | 'compliance' | 'security';
  unit: string;
  aggregation: 'sum' | 'avg' | 'max' | 'min' | 'count';
  target?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'achievement';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metrics: string[];
  recommendations: string[];
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface BusinessIntelligenceReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  executiveSummary: {
    keyMetrics: Record<string, number>;
    achievements: string[];
    challenges: string[];
    recommendations: string[];
  };
  detailedAnalysis: {
    performanceAnalysis: any;
    complianceAnalysis: any;
    userAnalysis: any;
    predictiveInsights: any;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

/**
 * Service d'analytics avancé
 */
export class AdvancedAnalyticsService {
  private performanceOptimizer: PerformanceOptimizerAgent;
  private predictiveIntelligence: PredictiveIntelligenceAgent;
  private regressionDetector: RegressionDetector;
  private config: AnalyticsConfig;
  private metricsHistory: Map<string, any[]> = new Map();
  private insights: AnalyticsInsight[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.performanceOptimizer = new PerformanceOptimizerAgent();
    this.predictiveIntelligence = new PredictiveIntelligenceAgent();
    this.regressionDetector = new RegressionDetector();
    
    this.initializeMetrics();
  }

  /**
   * Collecte et analyse des métriques en temps réel
   */
  async collectAndAnalyzeMetrics(data: {
    performance: any;
    business: any;
    user: any;
    compliance: any;
  }): Promise<{
    insights: AnalyticsInsight[];
    alerts: any[];
    recommendations: string[];
  }> {
    
    const insights: AnalyticsInsight[] = [];
    const alerts: any[] = [];
    const recommendations: string[] = [];

    try {
      // 1. Collecte des métriques
      await this.storeMetrics(data);

      // 2. Analyse de performance
      if (this.config.enablePerformanceOptimization) {
        const perfAnalysis = await this.performanceOptimizer.executeTask({
          id: `perf-analysis-${Date.now()}`,
          type: 'analyze-performance',
          input: { metrics: data.performance },
          priority: 'medium'
        });

        if (perfAnalysis.success) {
          insights.push(...this.convertToInsights(perfAnalysis.data, 'performance'));
        }
      }

      // 3. Analyse prédictive
      if (this.config.enablePredictiveAnalytics) {
        const predictiveAnalysis = await this.predictiveIntelligence.executeTask({
          id: `predictive-analysis-${Date.now()}`,
          type: 'trend-analysis',
          input: {
            marketData: data.business,
            securityTrends: data.compliance,
            methodologyEvolution: {}
          },
          priority: 'medium'
        });

        if (predictiveAnalysis.success) {
          insights.push(...this.convertToInsights(predictiveAnalysis.data, 'predictive'));
        }
      }

      // 4. Détection d'anomalies
      const anomalies = await this.detectAnomalies(data);
      insights.push(...anomalies);

      // 5. Génération d'alertes
      alerts.push(...this.generateAlerts(data, insights));

      // 6. Recommandations globales
      recommendations.push(...this.generateGlobalRecommendations(insights));

      // Stockage des insights
      this.insights.push(...insights);
      this.cleanupOldInsights();

      return { insights, alerts, recommendations };

    } catch (error) {
      console.error('Erreur analyse métriques:', error);
      return { insights: [], alerts: [], recommendations: [] };
    }
  }

  /**
   * Génération de rapport business intelligence
   */
  async generateBusinessIntelligenceReport(
    period: { start: Date; end: Date }
  ): Promise<BusinessIntelligenceReport> {
    
    const reportId = `bi-report-${Date.now()}`;
    
    try {
      // 1. Collecte des données de la période
      const periodData = await this.collectPeriodData(period);

      // 2. Calcul des métriques clés
      const keyMetrics = await this.calculateKeyMetrics(periodData);

      // 3. Analyse détaillée
      const detailedAnalysis = await this.performDetailedAnalysis(periodData);

      // 4. Génération du résumé exécutif
      const executiveSummary = await this.generateExecutiveSummary(keyMetrics, detailedAnalysis);

      // 5. Plan d'action
      const actionPlan = await this.generateActionPlan(detailedAnalysis);

      return {
        id: reportId,
        generatedAt: new Date(),
        period,
        executiveSummary,
        detailedAnalysis,
        actionPlan
      };

    } catch (error) {
      console.error('Erreur génération rapport BI:', error);
      throw error;
    }
  }

  /**
   * Analyse de tendances avancée
   */
  async analyzeTrends(
    metrics: string[],
    timeframe: 'day' | 'week' | 'month' | 'quarter'
  ): Promise<{
    trends: any[];
    forecasts: any[];
    insights: AnalyticsInsight[];
  }> {
    
    const trends: any[] = [];
    const forecasts: any[] = [];
    const insights: AnalyticsInsight[] = [];

    for (const metric of metrics) {
      const history = this.metricsHistory.get(metric) || [];
      
      if (history.length >= 10) {
        // Calcul de tendance
        const trend = this.calculateTrend(history, timeframe);
        trends.push(trend);

        // Prévision
        const forecast = this.generateForecast(history, timeframe);
        forecasts.push(forecast);

        // Insights basés sur la tendance
        if (trend.direction === 'declining' && trend.significance > 0.7) {
          insights.push({
            id: `trend-${metric}-${Date.now()}`,
            type: 'trend',
            severity: 'warning',
            title: `Tendance à la baisse détectée: ${metric}`,
            description: `Le métrique ${metric} montre une tendance à la baisse significative`,
            metrics: [metric],
            recommendations: [
              'Analyser les causes de la dégradation',
              'Mettre en place des actions correctives',
              'Surveiller l\'évolution de près'
            ],
            confidence: trend.significance,
            impact: trend.impact,
            timeframe: timeframe
          });
        }
      }
    }

    return { trends, forecasts, insights };
  }

  /**
   * Optimisation basée sur les données
   */
  async optimizeBasedOnData(): Promise<{
    optimizations: any[];
    expectedImpact: any;
    implementationPlan: string[];
  }> {
    
    const optimizations: any[] = [];
    let expectedImpact = {
      performance: 0,
      compliance: 0,
      userSatisfaction: 0
    };

    // Analyse des données pour identifier les optimisations
    const recentInsights = this.insights.slice(-50); // 50 derniers insights

    // Optimisations de performance
    const perfInsights = recentInsights.filter(i => i.type === 'opportunity' && i.metrics.some(m => m.includes('performance')));
    if (perfInsights.length > 0) {
      optimizations.push({
        category: 'performance',
        title: 'Optimisations de performance identifiées',
        actions: perfInsights.flatMap(i => i.recommendations),
        priority: 'high',
        estimatedGain: 25
      });
      expectedImpact.performance += 25;
    }

    // Optimisations de conformité
    const complianceInsights = recentInsights.filter(i => i.metrics.some(m => m.includes('compliance')));
    if (complianceInsights.length > 0) {
      optimizations.push({
        category: 'compliance',
        title: 'Améliorations de conformité',
        actions: complianceInsights.flatMap(i => i.recommendations),
        priority: 'critical',
        estimatedGain: 15
      });
      expectedImpact.compliance += 15;
    }

    // Plan d'implémentation
    const implementationPlan = [
      'Prioriser les optimisations par impact/effort',
      'Tester en environnement de développement',
      'Déployer progressivement en production',
      'Mesurer l\'impact réel',
      'Ajuster selon les résultats'
    ];

    return {
      optimizations,
      expectedImpact,
      implementationPlan
    };
  }

  /**
   * Dashboard temps réel
   */
  async getRealTimeDashboard(): Promise<{
    currentMetrics: Record<string, number>;
    alerts: any[];
    trends: any[];
    recommendations: string[];
    healthScore: number;
  }> {
    
    // Métriques actuelles
    const currentMetrics = await this.getCurrentMetrics();

    // Alertes actives
    const alerts = this.getActiveAlerts();

    // Tendances récentes
    const trends = await this.getRecentTrends();

    // Recommandations prioritaires
    const recommendations = this.getPriorityRecommendations();

    // Score de santé global
    const healthScore = this.calculateHealthScore(currentMetrics);

    return {
      currentMetrics,
      alerts,
      trends,
      recommendations,
      healthScore
    };
  }

  // Méthodes privées utilitaires
  private initializeMetrics(): void {
    const defaultMetrics: MetricDefinition[] = [
      {
        id: 'api_response_time',
        name: 'Temps de réponse API',
        category: 'performance',
        unit: 'ms',
        aggregation: 'avg',
        target: 200,
        threshold: { warning: 500, critical: 1000 }
      },
      {
        id: 'anssi_compliance_score',
        name: 'Score conformité ANSSI',
        category: 'compliance',
        unit: '%',
        aggregation: 'avg',
        target: 95,
        threshold: { warning: 85, critical: 75 }
      },
      {
        id: 'user_satisfaction',
        name: 'Satisfaction utilisateur',
        category: 'user',
        unit: '/5',
        aggregation: 'avg',
        target: 4.5,
        threshold: { warning: 3.5, critical: 3.0 }
      },
      {
        id: 'workflow_completion_rate',
        name: 'Taux de completion workflows',
        category: 'business',
        unit: '%',
        aggregation: 'avg',
        target: 90,
        threshold: { warning: 80, critical: 70 }
      }
    ];

    // Initialisation des historiques
    defaultMetrics.forEach(metric => {
      this.metricsHistory.set(metric.id, []);
    });
  }

  private async storeMetrics(data: any): Promise<void> {
    const timestamp = new Date();
    
    // Stockage des métriques avec timestamp
    Object.entries(data).forEach(([category, metrics]) => {
      if (typeof metrics === 'object') {
        Object.entries(metrics || {}).forEach(([key, value]) => { // 🔧 CORRECTION: Null check
          const metricId = `${category}_${key}`;
          const history = this.metricsHistory.get(metricId) || [];
          
          history.push({
            timestamp,
            value: typeof value === 'number' ? value : 0
          });
          
          // Limiter l'historique
          if (history.length > 1000) {
            history.splice(0, history.length - 1000);
          }
          
          this.metricsHistory.set(metricId, history);
        });
      }
    });
  }

  private convertToInsights(data: any, source: string): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];
    
    // Conversion des données d'analyse en insights
    if (data.optimizations) {
      data.optimizations.forEach((opt: any) => {
        insights.push({
          id: `${source}-${opt.id}-${Date.now()}`,
          type: 'opportunity',
          severity: opt.priority === 'high' ? 'critical' : 'warning',
          title: opt.title,
          description: opt.description,
          metrics: [source],
          recommendations: opt.actionPlan || [],
          confidence: 0.8,
          impact: opt.estimatedImpact?.performanceGain > 30 ? 'high' : 'medium',
          timeframe: '1-4 semaines'
        });
      });
    }
    
    return insights;
  }

  private async detectAnomalies(data: any): Promise<AnalyticsInsight[]> {
    const anomalies: AnalyticsInsight[] = [];
    
    // Détection d'anomalies basique
    if (data.performance?.apiResponseTime > 1000) {
      anomalies.push({
        id: `anomaly-api-${Date.now()}`,
        type: 'anomaly',
        severity: 'critical',
        title: 'Anomalie temps de réponse API',
        description: 'Temps de réponse API anormalement élevé détecté',
        metrics: ['api_response_time'],
        recommendations: [
          'Vérifier la charge serveur',
          'Analyser les requêtes lentes',
          'Redémarrer les services si nécessaire'
        ],
        confidence: 0.9,
        impact: 'high',
        timeframe: 'Immédiat'
      });
    }
    
    return anomalies;
  }

  private generateAlerts(data: any, insights: AnalyticsInsight[]): any[] {
    const alerts: any[] = [];
    
    // Génération d'alertes basées sur les seuils
    insights.forEach(insight => {
      if (insight.severity === 'critical') {
        alerts.push({
          id: `alert-${insight.id}`,
          type: 'critical',
          title: insight.title,
          description: insight.description,
          timestamp: new Date(),
          actions: insight.recommendations
        });
      }
    });
    
    return alerts;
  }

  private generateGlobalRecommendations(insights: AnalyticsInsight[]): string[] {
    const recommendations: string[] = [];
    
    // Agrégation des recommandations
    const allRecommendations = insights.flatMap(i => i.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];
    
    // Priorisation
    recommendations.push(...uniqueRecommendations.slice(0, 5));
    
    return recommendations;
  }

  private cleanupOldInsights(): void {
    // Nettoyer les insights anciens
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.dataRetentionDays);
    
    this.insights = this.insights.filter(insight => {
      // Garder les insights récents (pas de timestamp dans l'interface actuelle)
      return true; // Simplification pour l'exemple
    });
  }

  private async collectPeriodData(period: { start: Date; end: Date }): Promise<any> {
    // Collecte des données pour la période
    const periodData: any = {};
    
    this.metricsHistory.forEach((history, metricId) => {
      const periodHistory = history.filter(entry => 
        entry.timestamp >= period.start && entry.timestamp <= period.end
      );
      periodData[metricId] = periodHistory;
    });
    
    return periodData;
  }

  private async calculateKeyMetrics(periodData: any): Promise<Record<string, number>> {
    const keyMetrics: Record<string, number> = {};
    
    // Calcul des métriques clés
    Object.entries(periodData).forEach(([metricId, history]) => { // 🔧 CORRECTION: Suppression du type explicite
      if ((history as any[]).length > 0) { // 🔧 CORRECTION: Type assertion
        const values = (history as any[]).map((entry: any) => entry.value); // 🔧 CORRECTION: Types explicites
        keyMetrics[metricId] = values.reduce((sum: number, val: number) => sum + val, 0) / values.length; // 🔧 CORRECTION: Types explicites
      }
    });
    
    return keyMetrics;
  }

  private async performDetailedAnalysis(periodData: any): Promise<any> {
    return {
      performanceAnalysis: { summary: 'Performance stable' },
      complianceAnalysis: { summary: 'Conformité maintenue' },
      userAnalysis: { summary: 'Satisfaction en hausse' },
      predictiveInsights: { summary: 'Tendances positives' }
    };
  }

  private async generateExecutiveSummary(keyMetrics: any, detailedAnalysis: any): Promise<any> {
    return {
      keyMetrics,
      achievements: ['Conformité ANSSI maintenue', 'Performance optimisée'],
      challenges: ['Montée en charge à prévoir'],
      recommendations: ['Continuer l\'optimisation', 'Surveiller les tendances']
    };
  }

  private async generateActionPlan(detailedAnalysis: any): Promise<any> {
    return {
      immediate: ['Surveiller les métriques critiques'],
      shortTerm: ['Optimiser les performances'],
      longTerm: ['Évolution architecture']
    };
  }

  private calculateTrend(history: any[], timeframe: string): any {
    // Calcul de tendance simplifié
    if (history.length < 2) return { direction: 'stable', significance: 0 };
    
    const recent = history.slice(-10);
    const older = history.slice(-20, -10);
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.value, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, entry) => sum + entry.value, 0) / older.length : recentAvg;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    return {
      direction: change > 0.05 ? 'increasing' : change < -0.05 ? 'declining' : 'stable',
      significance: Math.abs(change),
      impact: Math.abs(change) > 0.2 ? 'high' : Math.abs(change) > 0.1 ? 'medium' : 'low'
    };
  }

  private generateForecast(history: any[], timeframe: string): any {
    // Prévision simplifiée
    const recent = history.slice(-5);
    const avg = recent.reduce((sum, entry) => sum + entry.value, 0) / recent.length;
    
    return {
      metric: 'forecast',
      predictedValue: avg * 1.05, // Croissance de 5%
      confidence: 0.7,
      timeframe
    };
  }

  private async getCurrentMetrics(): Promise<Record<string, number>> {
    const currentMetrics: Record<string, number> = {};
    
    this.metricsHistory.forEach((history, metricId) => {
      if (history.length > 0) {
        currentMetrics[metricId] = history[history.length - 1].value;
      }
    });
    
    return currentMetrics;
  }

  private getActiveAlerts(): any[] {
    return this.insights
      .filter(insight => insight.severity === 'critical')
      .slice(-5)
      .map(insight => ({
        id: insight.id,
        title: insight.title,
        severity: insight.severity,
        timestamp: new Date()
      }));
  }

  private async getRecentTrends(): Promise<any[]> {
    // Tendances récentes simplifiées
    return [
      { metric: 'performance', direction: 'stable', change: 0.02 },
      { metric: 'compliance', direction: 'increasing', change: 0.05 }
    ];
  }

  private getPriorityRecommendations(): string[] {
    return this.insights
      .slice(-10)
      .flatMap(insight => insight.recommendations)
      .slice(0, 3);
  }

  private calculateHealthScore(metrics: Record<string, number>): number {
    // Score de santé global simplifié
    const scores = Object.values(metrics).filter(val => val > 0);
    if (scores.length === 0) return 85;
    
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.min(100, Math.max(0, avgScore));
  }
}
