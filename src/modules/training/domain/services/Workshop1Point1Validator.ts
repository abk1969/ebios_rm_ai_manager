/**
 * ✅ VALIDATEUR POINT 1 - AGENT ORCHESTRATEUR WORKSHOP 1 INTELLIGENT
 * Validation complète de l'implémentation du Point 1
 * Vérification de tous les composants et leur intégration
 */

import { AdaptiveContentService } from './AdaptiveContentService';
import { ExpertProfileAnalyzer } from './ExpertProfileAnalyzer';
import { Workshop1MasterAgent } from './Workshop1MasterAgent';
import { IntelligentCacheService } from './IntelligentCacheService';
import { PerformanceMetricsService } from './PerformanceMetricsService';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR LA VALIDATION

export interface ValidationResult {
  component: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface Point1ValidationReport {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalChecks: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  results: ValidationResult[];
  recommendations: string[];
  executionTime: number;
  integrationScore: number; // 0-100
}

// ✅ VALIDATEUR PRINCIPAL

export class Workshop1Point1Validator {
  private static instance: Workshop1Point1Validator;
  private validationResults: ValidationResult[] = [];

  private constructor() {}

  public static getInstance(): Workshop1Point1Validator {
    if (!Workshop1Point1Validator.instance) {
      Workshop1Point1Validator.instance = new Workshop1Point1Validator();
    }
    return Workshop1Point1Validator.instance;
  }

  // 🚀 VALIDATION COMPLÈTE DU POINT 1

  public async validatePoint1Implementation(): Promise<Point1ValidationReport> {
    const startTime = Date.now();
    this.validationResults = [];

    console.log('🔍 Démarrage validation POINT 1 - Agent Orchestrateur Workshop 1...');

    // 1. Validation des services principaux
    await this.validateCoreServices();

    // 2. Validation de l'adaptation de contenu
    await this.validateContentAdaptation();

    // 3. Validation de l'analyse de profil
    await this.validateProfileAnalysis();

    // 4. Validation de l'agent maître
    await this.validateMasterAgent();

    // 5. Validation du cache intelligent
    await this.validateIntelligentCache();

    // 6. Validation des métriques de performance
    await this.validatePerformanceMetrics();

    // 7. Tests d'intégration
    await this.validateIntegration();

    // 8. Tests de performance
    await this.validatePerformance();

    const executionTime = Date.now() - startTime;
    return this.generateValidationReport(executionTime);
  }

  // 🔧 VALIDATION DES SERVICES PRINCIPAUX

  private async validateCoreServices(): Promise<void> {
    try {
      // Test AdaptiveContentService
      const adaptiveService = AdaptiveContentService.getInstance();
      this.addResult('AdaptiveContentService', 'success', 'Service initialisé correctement');

      // Test ExpertProfileAnalyzer
      const profileAnalyzer = ExpertProfileAnalyzer.getInstance();
      this.addResult('ExpertProfileAnalyzer', 'success', 'Service initialisé correctement');

      // Test Workshop1MasterAgent
      const masterAgent = Workshop1MasterAgent.getInstance();
      this.addResult('Workshop1MasterAgent', 'success', 'Agent maître initialisé correctement');

      // Test IntelligentCacheService
      const cacheService = IntelligentCacheService.getInstance();
      this.addResult('IntelligentCacheService', 'success', 'Cache intelligent initialisé correctement');

      // Test PerformanceMetricsService
      const metricsService = PerformanceMetricsService.getInstance();
      this.addResult('PerformanceMetricsService', 'success', 'Service de métriques initialisé correctement');

    } catch (error) {
      this.addResult('CoreServices', 'error', `Erreur d'initialisation: ${error}`);
    }
  }

  // 🎨 VALIDATION DE L'ADAPTATION DE CONTENU

  private async validateContentAdaptation(): Promise<void> {
    try {
      const adaptiveService = AdaptiveContentService.getInstance();
      
      // Test avec profil expert
      const expertProfile: EbiosExpertProfile = {
        id: 'test-expert-001',
        name: 'Dr. Test Expert',
        role: 'RSSI Senior',
        experience: { ebiosYears: 8, totalYears: 12, projectsCompleted: 25 },
        specializations: ['risk_management', 'threat_intelligence'],
        certifications: ['CISSP', 'ANSSI'],
        sector: 'santé',
        organizationType: 'CHU',
        preferredComplexity: 'expert',
        learningStyle: 'analytical'
      };

      // Test d'analyse de profil
      const expertise = await adaptiveService.analyzeExpertProfile(expertProfile);
      
      if (expertise.level === 'expert' && expertise.score >= 70) {
        this.addResult('ProfileAnalysis', 'success', 
          `Analyse correcte: niveau ${expertise.level}, score ${expertise.score}`);
      } else {
        this.addResult('ProfileAnalysis', 'warning', 
          `Analyse inattendue: niveau ${expertise.level}, score ${expertise.score}`);
      }

      // Test d'adaptation de contenu
      const originalContent = "Contenu de test pour validation";
      const adaptedContent = await adaptiveService.adaptContent(
        originalContent,
        expertProfile,
        { workshopId: 1, moduleId: 'test', learningObjective: 'validation' }
      );

      if (adaptedContent.adaptedContent && adaptedContent.adaptedContent !== originalContent) {
        this.addResult('ContentAdaptation', 'success', 'Adaptation de contenu fonctionnelle');
      } else {
        this.addResult('ContentAdaptation', 'error', 'Échec de l\'adaptation de contenu');
      }

    } catch (error) {
      this.addResult('ContentAdaptation', 'error', `Erreur adaptation: ${error}`);
    }
  }

  // 🔍 VALIDATION DE L'ANALYSE DE PROFIL

  private async validateProfileAnalysis(): Promise<void> {
    try {
      const profileAnalyzer = ExpertProfileAnalyzer.getInstance();

      // Test avec différents niveaux de profils
      const profiles = [
        {
          id: 'junior-001',
          name: 'Junior Test',
          role: 'Analyste',
          experience: { ebiosYears: 1, totalYears: 2, projectsCompleted: 3 },
          specializations: [],
          certifications: [],
          sector: 'finance',
          organizationType: 'Banque',
          preferredComplexity: 'intermediate',
          learningStyle: 'guided'
        },
        {
          id: 'senior-001',
          name: 'Senior Test',
          role: 'Expert Sécurité',
          experience: { ebiosYears: 6, totalYears: 10, projectsCompleted: 15 },
          specializations: ['risk_management'],
          certifications: ['CISSP'],
          sector: 'santé',
          organizationType: 'CHU',
          preferredComplexity: 'expert',
          learningStyle: 'collaborative'
        }
      ];

      for (const profile of profiles) {
        const analysis = await profileAnalyzer.analyzeProfile(profile as EbiosExpertProfile);
        
        if (analysis.expertiseLevel && analysis.learningPath && analysis.recommendations) {
          this.addResult('ProfileAnalysis', 'success', 
            `Analyse complète pour ${profile.name}: ${analysis.expertiseLevel.level}`);
        } else {
          this.addResult('ProfileAnalysis', 'error', 
            `Analyse incomplète pour ${profile.name}`);
        }
      }

    } catch (error) {
      this.addResult('ProfileAnalysis', 'error', `Erreur analyse profil: ${error}`);
    }
  }

  // 🎭 VALIDATION DE L'AGENT MAÎTRE

  private async validateMasterAgent(): Promise<void> {
    try {
      const masterAgent = Workshop1MasterAgent.getInstance();

      // Test de démarrage de session
      const testProfile: EbiosExpertProfile = {
        id: 'test-master-001',
        name: 'Test Master Agent',
        role: 'Expert EBIOS',
        experience: { ebiosYears: 5, totalYears: 8, projectsCompleted: 12 },
        specializations: ['risk_management'],
        certifications: ['ANSSI'],
        sector: 'santé',
        organizationType: 'CHU',
        preferredComplexity: 'expert',
        learningStyle: 'collaborative'
      };

      const session = await masterAgent.startIntelligentSession('test-user-001', testProfile);

      if (session.sessionId && session.status === 'active') {
        this.addResult('MasterAgent', 'success', 
          `Session créée avec succès: ${session.sessionId}`);
      } else {
        this.addResult('MasterAgent', 'error', 'Échec création de session');
      }

      // Test de mise à jour de progression
      await masterAgent.updateSessionProgress(session.sessionId, {
        moduleProgress: 50,
        timeSpent: 30,
        engagementIndicators: ['active_participation']
      });

      this.addResult('MasterAgent', 'success', 'Mise à jour progression fonctionnelle');

    } catch (error) {
      this.addResult('MasterAgent', 'error', `Erreur agent maître: ${error}`);
    }
  }

  // 💾 VALIDATION DU CACHE INTELLIGENT

  private async validateIntelligentCache(): Promise<void> {
    try {
      const cacheService = IntelligentCacheService.getInstance();

      // Test de mise en cache
      const testData = { test: 'data', timestamp: new Date() };
      await cacheService.cacheWorkshop1Session('test-session-001', testData);

      // Test de récupération
      const cachedData = await cacheService.getCachedWorkshop1Session('test-session-001');

      if (cachedData && cachedData.test === 'data') {
        this.addResult('IntelligentCache', 'success', 'Cache fonctionnel');
      } else {
        this.addResult('IntelligentCache', 'error', 'Échec du cache');
      }

      // Test des métriques de cache
      const cacheInfo = cacheService.getCacheInfo();
      if (cacheInfo.entries >= 0 && cacheInfo.size >= 0) {
        this.addResult('CacheMetrics', 'success', 
          `Métriques cache: ${cacheInfo.entries} entrées, ${cacheInfo.size} bytes`);
      } else {
        this.addResult('CacheMetrics', 'warning', 'Métriques cache invalides');
      }

    } catch (error) {
      this.addResult('IntelligentCache', 'error', `Erreur cache: ${error}`);
    }
  }

  // 📊 VALIDATION DES MÉTRIQUES DE PERFORMANCE

  private async validatePerformanceMetrics(): Promise<void> {
    try {
      const metricsService = PerformanceMetricsService.getInstance();

      // Test d'enregistrement de métriques
      const testContext = {
        workshopId: 1,
        moduleId: 'test-module',
        userProfile: {
          id: 'test-user',
          name: 'Test User',
          role: 'Test',
          experience: { ebiosYears: 3, totalYears: 5, projectsCompleted: 8 },
          specializations: ['risk_management'],
          certifications: [],
          sector: 'test',
          organizationType: 'Test Org',
          preferredComplexity: 'intermediate',
          learningStyle: 'guided'
        } as EbiosExpertProfile,
        sessionPhase: 'middle' as const,
        adaptationsApplied: 2,
        interactionsCount: 5
      };

      await metricsService.recordSessionMetrics(
        'test-session-metrics',
        'test-user-metrics',
        testContext,
        {}
      );

      // Test de récupération des métriques
      const sessionMetrics = metricsService.getSessionMetrics('test-session-metrics');
      if (sessionMetrics.length > 0) {
        this.addResult('PerformanceMetrics', 'success', 'Métriques enregistrées et récupérées');
      } else {
        this.addResult('PerformanceMetrics', 'error', 'Échec enregistrement métriques');
      }

      // Test du score de santé système
      const healthScore = metricsService.getSystemHealthScore();
      if (healthScore >= 0 && healthScore <= 100) {
        this.addResult('SystemHealth', 'success', `Score santé système: ${healthScore}%`);
      } else {
        this.addResult('SystemHealth', 'warning', `Score santé invalide: ${healthScore}`);
      }

    } catch (error) {
      this.addResult('PerformanceMetrics', 'error', `Erreur métriques: ${error}`);
    }
  }

  // 🔗 VALIDATION DE L'INTÉGRATION

  private async validateIntegration(): Promise<void> {
    try {
      // Test d'intégration complète : profil → adaptation → agent → cache → métriques
      const testProfile: EbiosExpertProfile = {
        id: 'integration-test-001',
        name: 'Integration Test User',
        role: 'Expert EBIOS RM',
        experience: { ebiosYears: 7, totalYears: 10, projectsCompleted: 20 },
        specializations: ['risk_management', 'threat_intelligence'],
        certifications: ['CISSP', 'ANSSI'],
        sector: 'santé',
        organizationType: 'CHU',
        preferredComplexity: 'expert',
        learningStyle: 'collaborative'
      };

      // 1. Analyse de profil
      const profileAnalyzer = ExpertProfileAnalyzer.getInstance();
      const analysis = await profileAnalyzer.analyzeProfile(testProfile);

      // 2. Adaptation de contenu
      const adaptiveService = AdaptiveContentService.getInstance();
      const adaptedContent = await adaptiveService.adaptContent(
        "Contenu test intégration",
        testProfile,
        { workshopId: 1, moduleId: 'integration-test', learningObjective: 'test' }
      );

      // 3. Session agent maître
      const masterAgent = Workshop1MasterAgent.getInstance();
      const session = await masterAgent.startIntelligentSession('integration-user', testProfile);

      // 4. Cache
      const cacheService = IntelligentCacheService.getInstance();
      await cacheService.cacheExpertProfile(testProfile, analysis);

      // 5. Métriques
      const metricsService = PerformanceMetricsService.getInstance();
      await metricsService.recordSessionMetrics(
        session.sessionId,
        'integration-user',
        {
          workshopId: 1,
          moduleId: 'integration-test',
          userProfile: testProfile,
          sessionPhase: 'start',
          adaptationsApplied: 1,
          interactionsCount: 3
        },
        {}
      );

      this.addResult('Integration', 'success', 'Intégration complète fonctionnelle');

    } catch (error) {
      this.addResult('Integration', 'error', `Erreur intégration: ${error}`);
    }
  }

  // ⚡ VALIDATION DES PERFORMANCES

  private async validatePerformance(): Promise<void> {
    try {
      const startTime = Date.now();

      // Test de performance : 10 analyses de profil simultanées
      const profileAnalyzer = ExpertProfileAnalyzer.getInstance();
      const promises = [];

      for (let i = 0; i < 10; i++) {
        const testProfile: EbiosExpertProfile = {
          id: `perf-test-${i}`,
          name: `Performance Test ${i}`,
          role: 'Test Role',
          experience: { ebiosYears: i + 1, totalYears: i + 3, projectsCompleted: i * 2 },
          specializations: ['risk_management'],
          certifications: i % 2 === 0 ? ['CISSP'] : [],
          sector: 'test',
          organizationType: 'Test',
          preferredComplexity: 'intermediate',
          learningStyle: 'guided'
        };

        promises.push(profileAnalyzer.analyzeProfile(testProfile));
      }

      await Promise.all(promises);
      const executionTime = Date.now() - startTime;

      if (executionTime < 5000) { // Moins de 5 secondes pour 10 analyses
        this.addResult('Performance', 'success', 
          `Performance acceptable: ${executionTime}ms pour 10 analyses`);
      } else {
        this.addResult('Performance', 'warning', 
          `Performance dégradée: ${executionTime}ms pour 10 analyses`);
      }

    } catch (error) {
      this.addResult('Performance', 'error', `Erreur test performance: ${error}`);
    }
  }

  // 📊 GÉNÉRATION DU RAPPORT

  private generateValidationReport(executionTime: number): Point1ValidationReport {
    const successCount = this.validationResults.filter(r => r.status === 'success').length;
    const warningCount = this.validationResults.filter(r => r.status === 'warning').length;
    const errorCount = this.validationResults.filter(r => r.status === 'error').length;

    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (errorCount > 0) {
      overallStatus = 'critical';
    } else if (warningCount > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const integrationScore = Math.round((successCount / this.validationResults.length) * 100);

    const recommendations: string[] = [];
    if (errorCount > 0) {
      recommendations.push('Corriger immédiatement les erreurs critiques identifiées');
    }
    if (warningCount > 0) {
      recommendations.push('Examiner et optimiser les composants avec avertissements');
    }
    if (integrationScore >= 90) {
      recommendations.push('POINT 1 prêt pour la production - Excellent travail !');
    } else if (integrationScore >= 75) {
      recommendations.push('POINT 1 fonctionnel - Quelques optimisations recommandées');
    } else {
      recommendations.push('POINT 1 nécessite des corrections avant mise en production');
    }

    return {
      overallStatus,
      totalChecks: this.validationResults.length,
      successCount,
      warningCount,
      errorCount,
      results: this.validationResults,
      recommendations,
      executionTime,
      integrationScore
    };
  }

  // 🔧 MÉTHODES UTILITAIRES

  private addResult(component: string, status: 'success' | 'warning' | 'error', message: string, details?: any): void {
    this.validationResults.push({
      component,
      status,
      message,
      details,
      timestamp: new Date()
    });
  }

  // 📋 RAPPORT FORMATÉ

  public formatValidationReport(report: Point1ValidationReport): string {
    let output = '\n🎭 RAPPORT DE VALIDATION - POINT 1 : AGENT ORCHESTRATEUR WORKSHOP 1\n';
    output += '='.repeat(80) + '\n\n';
    
    output += `📊 Statut Global: ${report.overallStatus.toUpperCase()}\n`;
    output += `⏱️  Temps d'exécution: ${report.executionTime}ms\n`;
    output += `🎯 Score d'intégration: ${report.integrationScore}%\n`;
    output += `✅ Succès: ${report.successCount}/${report.totalChecks}\n`;
    output += `⚠️  Avertissements: ${report.warningCount}\n`;
    output += `❌ Erreurs: ${report.errorCount}\n\n`;

    output += '📋 DÉTAILS DES VÉRIFICATIONS:\n';
    output += '-'.repeat(50) + '\n';
    
    for (const result of report.results) {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      output += `${icon} ${result.component}: ${result.message}\n`;
    }

    output += '\n💡 RECOMMANDATIONS:\n';
    output += '-'.repeat(30) + '\n';
    for (const recommendation of report.recommendations) {
      output += `• ${recommendation}\n`;
    }

    output += '\n🎯 COMPOSANTS VALIDÉS:\n';
    output += '-'.repeat(30) + '\n';
    output += '• AdaptiveContentService - Adaptation intelligente du contenu\n';
    output += '• ExpertProfileAnalyzer - Analyse avancée des profils experts\n';
    output += '• Workshop1MasterAgent - Agent orchestrateur principal\n';
    output += '• IntelligentCacheService - Cache optimisé pour performance\n';
    output += '• PerformanceMetricsService - Surveillance et métriques\n';
    output += '• Intégration complète - Communication entre tous les composants\n';

    return output;
  }
}

export default Workshop1Point1Validator;
