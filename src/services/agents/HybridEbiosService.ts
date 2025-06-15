/**
 * 🔄 SERVICE HYBRIDE EBIOS - MIGRATION PROGRESSIVE SANS RÉGRESSION
 * Implémente le Strangler Pattern avec Circuit Breaker
 * Fallback automatique vers services legacy
 */

import { CircuitBreaker, CircuitBreakerManager } from './CircuitBreaker';
import { AgentRegistry } from './AgentService';
import type { 
  BusinessValue, 
  DreadedEvent, 
  SupportingAsset, 
  RiskSource,
  StrategicScenario,
  SecurityMeasure 
} from '@/types/ebios';

export interface HybridServiceConfig {
  enableAgents: boolean;
  fallbackTimeout: number;
  circuitBreakerConfig?: {
    failureThreshold?: number;
    recoveryTimeout?: number;
  };
  featureFlags?: Record<string, boolean>;
}

export interface ServiceResult<T> {
  data: T;
  source: 'agent' | 'legacy';
  processingTime: number;
  confidence?: number;
  warnings?: string[];
  success: boolean;
}

/**
 * Service hybride pour migration progressive
 */
export class HybridEbiosService {
  private circuitBreaker: CircuitBreaker;
  private agentRegistry: AgentRegistry;
  private config: HybridServiceConfig;

  constructor(
    private legacyService: any,
    config: Partial<HybridServiceConfig> = {}
  ) {
    this.config = {
      enableAgents: true,
      fallbackTimeout: 5000,
      featureFlags: {},
      ...config
    };

    this.circuitBreaker = CircuitBreakerManager.getInstance()
      .getCircuitBreaker('ebios-hybrid', this.config.circuitBreakerConfig);
    
    this.agentRegistry = AgentRegistry.getInstance();
  }

  /**
   * Analyse de risque hybride avec fallback
   */
  async performRiskAnalysis(input: {
    businessValues: BusinessValue[];
    dreadedEvents: DreadedEvent[];
    riskSources: RiskSource[];
    missionId: string;
  }): Promise<ServiceResult<any>> {
    
    const startTime = Date.now();

    // Vérifier si les agents sont activés et disponibles
    if (this.shouldUseAgent('risk-analysis')) {
      
      return await this.circuitBreaker.execute(
        // Fonction principale (agent)
        async () => {
          const agents = this.agentRegistry.findCapableAgents('risk-analysis');
          if (agents.length === 0) {
            throw new Error('Aucun agent capable trouvé');
          }

          const agent = agents[0];
          const result = await agent.executeTask({
            id: `risk-analysis-${Date.now()}`,
            type: 'risk-analysis',
            input,
            priority: 'medium',
            context: { missionId: input.missionId }
          });

          if (!result.success) {
            throw new Error(result.error || 'Échec agent');
          }

          return {
            data: result.data,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: result.confidence,
            warnings: result.suggestions,
            success: true
          };
        },
        
        // Fonction de fallback (legacy)
        async () => {
          const legacyResult = await this.legacyService.performRiskAnalysis(input);
          return {
            data: legacyResult,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: 0.7, // Confiance réduite pour le service legacy
            warnings: ['Utilisation du service legacy (agent indisponible)'],
            success: true
          };
        }
      ).then(({ result, usedFallback }) => {
        if (usedFallback) {
          result.warnings = result.warnings || [];
          result.warnings.push('Circuit breaker activé - fallback utilisé');
        }
        return result;
      });
    }

    // Utiliser directement le service legacy
    const legacyResult = await this.legacyService.performRiskAnalysis(input);
    return {
      data: legacyResult,
      source: 'legacy',
      processingTime: Date.now() - startTime,
      success: true
    };
  }

  /**
   * Génération de suggestions avec fallback
   */
  async generateSuggestions(input: {
    entityType: string;
    entityData: any;
    context: any;
  }): Promise<ServiceResult<string[]>> {
    
    const startTime = Date.now();

    if (this.shouldUseAgent('suggestions')) {
      
      return await this.circuitBreaker.execute(
        // Agent
        async () => {
          const agents = this.agentRegistry.findCapableAgents('suggestions');
          if (agents.length === 0) {
            throw new Error('Aucun agent de suggestions trouvé');
          }

          const agent = agents[0];
          const result = await agent.executeTask({
            id: `suggestions-${Date.now()}`,
            type: 'suggestions',
            input,
            priority: 'low'
          });

          if (!result.success) {
            throw new Error(result.error || 'Échec génération suggestions');
          }

          return {
            data: result.data,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: result.confidence,
            success: true
          };
        },
        
        // Fallback
        async () => {
          // Suggestions basiques en fallback
          const basicSuggestions = this.generateBasicSuggestions(input.entityType);
          return {
            data: basicSuggestions,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: 0.5, // Confiance faible pour suggestions basiques
            warnings: ['Suggestions basiques (agent indisponible)'],
            success: true
          };
        }
      ).then(({ result }) => result);
    }

    // Mode legacy direct
    const basicSuggestions = this.generateBasicSuggestions(input.entityType);
    return {
      data: basicSuggestions,
      source: 'legacy',
      processingTime: Date.now() - startTime,
      success: true
    };
  }

  /**
   * Validation EBIOS avec fallback
   */
  async validateEbiosCompliance(input: {
    missionId: string;
    workshop: number;
    data: any;
  }): Promise<ServiceResult<{
    isValid: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
  }>> {

    const startTime = Date.now();

    if (this.shouldUseAgent('validation')) {

      return await this.circuitBreaker.execute(
        // Agent
        async () => {
          const agents = this.agentRegistry.findCapableAgents('validate-workshop-compliance', input.workshop);
          if (agents.length === 0) {
            throw new Error('Aucun agent de validation trouvé');
          }

          const agent = agents[0];
          const result = await agent.executeTask({
            id: `validation-${Date.now()}`,
            type: 'validate-workshop-compliance',
            input: {
              workshop: input.workshop,
              data: input.data,
              context: {
                missionId: input.missionId,
                validationLevel: 'anssi_compliant',
                requiresApproval: true,
                auditMode: false
              }
            },
            priority: 'high',
            context: {
              missionId: input.missionId,
              workshop: input.workshop
            }
          });

          if (!result.success) {
            throw new Error(result.error || 'Échec validation');
          }

          // Transformation du résultat agent vers format attendu
          const agentReport = result.data;
          return {
            data: {
              isValid: agentReport.disqualificationRisk === 'none',
              score: agentReport.overallScore,
              issues: agentReport.criticalIssues,
              recommendations: agentReport.recommendations
            },
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: result.confidence,
            success: true // 🔧 CORRECTION: Propriété success ajoutée
          };
        },

        // Fallback
        async () => {
          // Validation basique en fallback
          const basicValidation = this.performBasicValidation(input);
          return {
            data: basicValidation,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: 0.6, // Confiance modérée pour validation basique
            warnings: ['Validation basique (agent indisponible)'],
            success: true
          };
        }
      ).then(({ result }) => result);
    }

    // Mode legacy direct
    const basicValidation = this.performBasicValidation(input);
    return {
      data: basicValidation,
      source: 'legacy',
      processingTime: Date.now() - startTime,
      success: true
    };
  }

  /**
   * 🆕 Analyse de risques avancée avec fallback
   */
  async performAdvancedRiskAnalysis(input: {
    strategicScenarios: any[];
    operationalScenarios: any[];
    attackPaths: any[];
    businessValues: any[];
    analysisType: 'strategic' | 'operational' | 'quantitative' | 'prioritization';
    missionId: string;
  }): Promise<ServiceResult<any>> {

    const startTime = Date.now();

    if (this.shouldUseAgent('risk-analysis')) {

      return await this.circuitBreaker.execute(
        // Agent
        async () => {
          const agents = this.agentRegistry.findCapableAgents(`analyze-${input.analysisType}-risks`);
          if (agents.length === 0) {
            throw new Error('Aucun agent d\'analyse de risques trouvé');
          }

          const agent = agents[0];
          const result = await agent.executeTask({
            id: `risk-analysis-${Date.now()}`,
            type: `analyze-${input.analysisType}-risks`,
            input: {
              strategicScenarios: input.strategicScenarios,
              operationalScenarios: input.operationalScenarios,
              attackPaths: input.attackPaths,
              businessValues: input.businessValues
            },
            priority: 'high',
            context: {
              missionId: input.missionId,
              workshop: 4, // 🔧 CORRECTION: Propriété workshop ajoutée
              entityType: 'risk-analysis', // 🔧 CORRECTION: Propriété entityType ajoutée
              entityId: input.missionId // 🔧 CORRECTION: Propriété entityId ajoutée
              // analysisDepth: 'advanced', // 🔧 CORRECTION: Propriété non supportée supprimée
              // includeQuantitative: true,
              // includeMitreAttack: true,
              // generateRecommendations: true
            }
          });

          if (!result.success) {
            throw new Error(result.error || 'Échec analyse risques');
          }

          return {
            data: result.data,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: result.confidence,
            warnings: result.suggestions,
            success: true
          };
        },

        // Fallback
        async () => {
          // Analyse basique en fallback
          const basicAnalysis = this.performBasicRiskAnalysis(input);
          return {
            data: basicAnalysis,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: 0.5, // Confiance faible pour analyse basique
            warnings: ['Analyse basique (agent indisponible)'],
            success: true
          };
        }
      ).then(({ result, usedFallback }) => {
        if (usedFallback) {
          result.warnings = result.warnings || [];
          result.warnings.push('Circuit breaker activé - analyse simplifiée');
        }
        return result;
      });
    }

    // Utiliser directement l'analyse basique
    const basicAnalysis = this.performBasicRiskAnalysis(input);
    return {
      data: basicAnalysis,
      source: 'legacy',
      processingTime: Date.now() - startTime,
      success: true
    };
  }

  /**
   * 🆕 Génération rapport conformité ANSSI
   */
  async generateComplianceReport(input: {
    missionId: string;
    includeAllWorkshops: boolean;
    reportType: 'summary' | 'detailed' | 'audit';
  }): Promise<ServiceResult<{
    report: string;
    score: number;
    certification: boolean;
    recommendations: string[];
  }>> {

    const startTime = Date.now();

    if (this.shouldUseAgent('compliance-reporting')) {

      return await this.circuitBreaker.execute(
        // Agent
        async () => {
          const agents = this.agentRegistry.findCapableAgents('generate-compliance-report');
          if (agents.length === 0) {
            throw new Error('Aucun agent de rapport trouvé');
          }

          const agent = agents[0];
          const result = await agent.executeTask({
            id: `compliance-report-${Date.now()}`,
            type: 'generate-compliance-report',
            input,
            priority: 'medium',
            context: {
              missionId: input.missionId
            }
          });

          if (!result.success) {
            throw new Error(result.error || 'Échec génération rapport');
          }

          return {
            data: result.data,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: result.confidence,
            success: true
          };
        },

        // Fallback
        async () => {
          // Rapport basique en fallback
          const basicReport = this.generateBasicReport(input);
          return {
            data: basicReport,
            source: 'agent' as const,
            processingTime: Date.now() - startTime,
            confidence: 0.4, // Confiance très faible pour rapport basique
            warnings: ['Rapport basique (agent indisponible)'],
            success: true // 🔧 CORRECTION: Propriété success ajoutée
          };
        }
      ).then(({ result }) => result);
    }

    // Mode legacy direct
    const basicReport = this.generateBasicReport(input);
    return {
      data: basicReport,
      source: 'legacy',
      processingTime: Date.now() - startTime,
      success: true
    };
  }

  /**
   * Détermine si un agent doit être utilisé
   */
  private shouldUseAgent(feature: string): boolean {
    if (!this.config.enableAgents) {
      return false;
    }

    // Vérifier les feature flags
    const featureFlag = this.config.featureFlags?.[feature];
    if (featureFlag !== undefined) {
      return featureFlag;
    }

    // Vérifier la disponibilité du circuit breaker
    return this.circuitBreaker.isAvailable();
  }

  /**
   * Génère des suggestions basiques en fallback
   */
  private generateBasicSuggestions(entityType: string): string[] {
    const basicSuggestions: Record<string, string[]> = {
      'business_value': [
        'Définir clairement la valeur métier',
        'Identifier les parties prenantes',
        'Évaluer l\'impact en cas de compromission'
      ],
      'dreaded_event': [
        'Préciser les conséquences',
        'Évaluer la gravité',
        'Identifier les biens supports impactés'
      ],
      'risk_source': [
        'Analyser les motivations',
        'Évaluer les capacités',
        'Déterminer la pertinence'
      ]
    };

    return basicSuggestions[entityType] || ['Compléter les informations'];
  }

  /**
   * Validation basique en fallback
   */
  private performBasicValidation(input: any): {
    isValid: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Validation basique selon le workshop
    switch (input.workshop) {
      case 1:
        if (!input.data.businessValues?.length) {
          issues.push('Aucune valeur métier définie');
          recommendations.push('Définir au moins 3 valeurs métier');
        }
        break;
      case 2:
        if (!input.data.riskSources?.length) {
          issues.push('Aucune source de risque identifiée');
          recommendations.push('Identifier les sources de risque pertinentes');
        }
        break;
      case 3:
        if (!input.data.strategicScenarios?.length) {
          issues.push('Aucun scénario stratégique défini');
          recommendations.push('Créer des scénarios stratégiques');
        }
        break;
      case 4:
        if (!input.data.attackPaths?.length) {
          issues.push('Aucun chemin d\'attaque documenté');
          recommendations.push('Documenter les chemins d\'attaque');
        }
        break;
      case 5:
        if (!input.data.securityMeasures?.length) {
          issues.push('Aucune mesure de sécurité définie');
          recommendations.push('Définir le plan de traitement');
        }
        break;
    }

    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      isValid: issues.length === 0,
      score,
      issues,
      recommendations
    };
  }

  /**
   * 🆕 Analyse de risques basique en fallback
   */
  private performBasicRiskAnalysis(input: any): any {
    const { analysisType, strategicScenarios, operationalScenarios, attackPaths } = input;

    switch (analysisType) {
      case 'strategic':
        return {
          strategicAnalysis: strategicScenarios.map((scenario: any) => ({
            scenarioId: scenario.id,
            riskLevel: 'medium',
            likelihood: scenario.likelihood || 2,
            impact: scenario.gravity || 2,
            riskScore: (scenario.likelihood || 2) * (scenario.gravity || 2),
            businessImpact: ['Impact métier à évaluer'],
            mitigationStrategies: ['Mesures de sécurité standard'],
            residualRisk: 4
          })),
          overallRisk: 'medium'
        };

      case 'operational':
        return {
          operationalAnalysis: attackPaths.map((path: any) => ({
            pathId: path.id,
            feasibility: 0.5,
            detectability: 0.5,
            exploitability: 0.5,
            overallRisk: 0.25,
            criticalSteps: ['Étape critique à identifier'],
            detectionPoints: ['Point de détection standard'],
            mitigationMeasures: ['Mesure de mitigation basique']
          })),
          mitreMapping: []
        };

      case 'quantitative':
        return {
          annualLossExpectancy: 50000,
          singleLossExpectancy: 10000,
          annualRateOccurrence: 0.2,
          costBenefitAnalysis: []
        };

      case 'prioritization':
        return {
          priorities: [],
          actionPlan: ['Évaluer les risques en détail', 'Prioriser selon l\'impact métier']
        };

      default:
        return {
          analysis: 'Analyse basique non spécialisée',
          recommendations: ['Utiliser l\'agent d\'analyse pour plus de détails']
        };
    }
  }

  /**
   * 🆕 Génération rapport basique en fallback
   */
  private generateBasicReport(input: any): {
    report: string;
    score: number;
    certification: boolean;
    recommendations: string[];
  } {
    const { missionId, reportType } = input;

    const basicReport = `
# RAPPORT CONFORMITÉ EBIOS RM (VERSION BASIQUE)

## Mission: ${missionId}
## Date: ${new Date().toLocaleDateString('fr-FR')}
## Type: ${reportType}

### Score Global: 75/100 (Estimation)

### Statut: Conformité partielle

### Recommandations:
- Compléter l'analyse avec l'agent de validation ANSSI
- Vérifier la conformité de tous les ateliers
- Mettre à jour les mesures de sécurité

### Note: Ce rapport est généré en mode fallback.
Pour un rapport complet, utiliser l'agent de validation ANSSI.
    `;

    return {
      report: basicReport,
      score: 75,
      certification: false,
      recommendations: [
        'Activer l\'agent de validation ANSSI',
        'Compléter tous les ateliers EBIOS RM',
        'Valider la conformité avec un expert'
      ]
    };
  }

  /**
   * Statistiques du service hybride
   */
  getStats(): {
    circuitBreaker: any;
    agentUsage: number;
    legacyUsage: number;
    totalRequests: number;
  } {
    const cbStats = this.circuitBreaker.getStats();
    
    return {
      circuitBreaker: cbStats,
      agentUsage: cbStats.totalRequests - cbStats.fallbackUsage,
      legacyUsage: cbStats.fallbackUsage,
      totalRequests: cbStats.totalRequests
    };
  }

  /**
   * Configuration du service
   */
  updateConfig(newConfig: Partial<HybridServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
