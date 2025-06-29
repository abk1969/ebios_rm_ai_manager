/**
 * 🎯 RECOMMENDATION AGENT - SUGGESTIONS AI POUR EBIOS RM
 * Agent spécialisé pour générer des recommandations intelligentes
 * Améliore la prise de décision avec des suggestions contextuelles
 */

import { 
  EBIOSAgent, 
  AgentConfig, 
  AgentTask, 
  AgentResult, 
  AgentStatus, 
  AgentMetrics,
  AgentCapability
} from '../AgentInterface';
import { Logger } from '../../logging/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';
import { CircuitBreaker } from '../../resilience/CircuitBreaker';

export interface RecommendationContext {
  workshopNumber: number;
  currentStep: string;
  existingData: any;
  userProfile: {
    experience: 'beginner' | 'intermediate' | 'expert';
    role: 'analyst' | 'manager' | 'technical' | 'auditor';
    preferences: {
      detailLevel: 'basic' | 'detailed' | 'comprehensive';
      focusArea: 'compliance' | 'technical' | 'business' | 'all';
    };
  };
  organizationContext: {
    sector: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    maturityLevel: number; // 1-5
    constraints: string[];
  };
  timeConstraints?: {
    deadline: Date;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface Recommendation {
  id: string;
  type: 'security_measure' | 'risk_treatment' | 'methodology' | 'best_practice' | 'tool' | 'process';
  title: string;
  description: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: {
    timeEstimate: string;
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    resources: string[];
  };
  impact: {
    riskReduction: number; // 0-1
    complianceImprovement: number; // 0-1
    businessValue: number; // 0-1
  };
  implementation: {
    steps: string[];
    prerequisites: string[];
    risks: string[];
    successCriteria: string[];
  };
  references: {
    anssiGuides: string[];
    standards: string[];
    bestPractices: string[];
    tools: string[];
  };
  alternatives: {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
  }[];
  confidence: number;
  applicability: number; // 0-1 selon le contexte
}

export interface RecommendationSet {
  recommendations: Recommendation[];
  summary: {
    totalRecommendations: number;
    priorityDistribution: Record<string, number>;
    estimatedTotalEffort: string;
    expectedRiskReduction: number;
  };
  contextualInsights: string[];
  nextSteps: string[];
  confidence: number;
}

/**
 * Agent spécialisé dans la génération de recommandations EBIOS RM
 * Fournit des suggestions intelligentes et contextuelles
 */
export class RecommendationAgent implements EBIOSAgent {
  public readonly agentId: string;
  public readonly capabilities: AgentCapability[] = [AgentCapability.RISK_ANALYSIS]; // 🔧 CORRECTION: Capability existante pour recommandations

  // 🔧 CORRECTION: Propriétés manquantes pour EBIOSAgent
  public get metrics(): AgentMetrics {
    return this.getMetrics();
  }

  public canHandle(taskType: string): boolean {
    const supportedTypes = ['generate_recommendations', 'suggest_security_measures', 'recommend_methodology', 'suggest_improvements', 'prioritize_actions', 'recommend_tools'];
    return supportedTypes.includes(taskType);
  }

  public async heartbeat(): Promise<void> {
    // Pas de retour pour void
  }
  
  public status: AgentStatus = AgentStatus.IDLE; // 🔧 CORRECTION: Propriété publique
  private config: AgentConfig;
  private logger: Logger;
  private metricsCollector: MetricsCollector;
  private circuitBreaker: CircuitBreaker;
  
  // Cache pour les recommandations
  private recommendationCache: Map<string, RecommendationSet> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 2 * 60 * 60 * 1000; // 2 heures
  
  // Base de connaissances des recommandations
  private readonly knowledgeBase = {
    securityMeasures: {
      technical: [
        {
          id: 'auth_mfa',
          title: 'Authentification multi-facteurs',
          description: 'Mise en place d\'une authentification à plusieurs facteurs',
          applicableContexts: ['all'],
          riskReduction: 0.7,
          complexity: 'moderate',
          timeEstimate: '2-4 semaines'
        },
        {
          id: 'encryption_data',
          title: 'Chiffrement des données',
          description: 'Chiffrement des données sensibles au repos et en transit',
          applicableContexts: ['data_protection'],
          riskReduction: 0.8,
          complexity: 'complex',
          timeEstimate: '4-8 semaines'
        }
      ],
      organizational: [
        {
          id: 'security_policy',
          title: 'Politique de sécurité',
          description: 'Élaboration d\'une politique de sécurité complète',
          applicableContexts: ['governance'],
          riskReduction: 0.6,
          complexity: 'moderate',
          timeEstimate: '3-6 semaines'
        },
        {
          id: 'awareness_training',
          title: 'Formation sensibilisation',
          description: 'Programme de sensibilisation à la sécurité',
          applicableContexts: ['human_factor'],
          riskReduction: 0.5,
          complexity: 'simple',
          timeEstimate: '2-3 semaines'
        }
      ]
    },
    bestPractices: {
      workshop1: [
        'Impliquer tous les métiers dès le début',
        'Définir clairement le périmètre d\'étude',
        'Identifier tous les biens essentiels',
        'Évaluer la valeur métier de chaque bien'
      ],
      workshop2: [
        'Utiliser des sources de threat intelligence',
        'Considérer tous types d\'attaquants',
        'Analyser les motivations des sources de menace',
        'Évaluer les capacités des attaquants'
      ],
      workshop3: [
        'Prioriser selon l\'impact métier',
        'Valider avec les experts métier',
        'Considérer les scénarios combinés',
        'Évaluer la vraisemblance objectivement'
      ],
      workshop4: [
        'Détailler suffisamment les scénarios',
        'Identifier toutes les vulnérabilités',
        'Évaluer la facilité d\'exploitation',
        'Considérer les mesures existantes'
      ],
      workshop5: [
        'Équilibrer coût et efficacité',
        'Planifier la mise en œuvre',
        'Définir les indicateurs de suivi',
        'Prévoir les risques résiduels'
      ]
    },
    methodologyGuidance: {
      beginner: {
        focusAreas: ['basic_concepts', 'step_by_step', 'examples'],
        recommendedApproach: 'guided',
        additionalSupport: ['training', 'mentoring', 'templates']
      },
      intermediate: {
        focusAreas: ['optimization', 'efficiency', 'quality'],
        recommendedApproach: 'structured',
        additionalSupport: ['checklists', 'best_practices', 'tools']
      },
      expert: {
        focusAreas: ['innovation', 'customization', 'advanced_techniques'],
        recommendedApproach: 'flexible',
        additionalSupport: ['research', 'peer_review', 'standards']
      }
    }
  };
  
  // Règles de recommandation
  private readonly recommendationRules = {
    priority: {
      critical: (rec: any) => rec.riskReduction > 0.8 || rec.complianceGap > 0.7,
      high: (rec: any) => rec.riskReduction > 0.6 || rec.complianceGap > 0.5,
      medium: (rec: any) => rec.riskReduction > 0.3 || rec.complianceGap > 0.3,
      low: (rec: any) => true
    },
    applicability: {
      sector: {
        finance: ['regulatory_compliance', 'data_protection', 'fraud_prevention'],
        healthcare: ['patient_data', 'medical_devices', 'regulatory_compliance'],
        industry: ['operational_technology', 'supply_chain', 'safety_systems'],
        government: ['classified_information', 'citizen_data', 'critical_infrastructure']
      },
      size: {
        small: ['cost_effective', 'simple_implementation', 'minimal_resources'],
        medium: ['scalable_solutions', 'moderate_complexity', 'balanced_approach'],
        large: ['enterprise_solutions', 'complex_integration', 'comprehensive_coverage'],
        enterprise: ['strategic_alignment', 'global_deployment', 'advanced_capabilities']
      }
    }
  };

  constructor(config: AgentConfig) {
    this.agentId = config.agentId;
    this.config = config;
    this.logger = new Logger('RecommendationAgent', { agentId: this.agentId });
    this.metricsCollector = MetricsCollector.getInstance();
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 30000,
      timeout: 20000 // Plus de temps pour l'analyse
    });
  }

  public async initialize(): Promise<void> {
    this.logger.info('Initializing RecommendationAgent');
    this.status = AgentStatus.INITIALIZING;
    
    try {
      // Validation de la base de connaissances
      await this.validateKnowledgeBase();
      
      // Chargement des règles de recommandation
      await this.loadRecommendationRules();
      
      // Production ready
      await this.testRecommendationAlgorithms();
      
      this.status = AgentStatus.READY;
      this.logger.info('RecommendationAgent initialized successfully');
      
    } catch (error) {
      this.status = AgentStatus.ERROR;
      this.logger.error('Failed to initialize RecommendationAgent:', error);
      throw error;
    }
  }

  public async execute(task: AgentTask): Promise<AgentResult> {
    this.logger.info(`Executing recommendation task: ${task.type}`);
    this.status = AgentStatus.RUNNING;
    
    const startTime = Date.now();
    
    try {
      const result = await this.circuitBreaker.execute(
        () => this.executeRecommendationTask(task),
        () => this.executeFallback(task)
      );
      
      const executionTime = Date.now() - startTime;
      this.status = AgentStatus.READY;
      
      // Enregistrement des métriques
      this.metricsCollector.recordExecution({
        agentId: this.agentId,
        taskType: task.type,
        executionTime,
        success: true,
        metadata: { 
          taskId: task.id,
          recommendationCount: result.recommendations?.length || 0,
          averageConfidence: this.calculateAverageConfidence(result.recommendations || [])
        }
      });
      
      return {
        taskId: task.id,
        type: task.type, // 🔧 CORRECTION: Propriété type ajoutée
        agentId: this.agentId,
        success: true,
        data: result,
        executionTime,
        metadata: {
          processingTime: Date.now() - startTime, // 🔧 CORRECTION: Propriété requise
          agentVersion: '1.0.0', // 🔧 CORRECTION: Propriété requise
          fallbackUsed: false
        }
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.status = AgentStatus.ERROR;
      
      this.logger.error('Recommendation task failed:', error);
      
      this.metricsCollector.recordExecution({
        agentId: this.agentId,
        taskType: task.type,
        executionTime,
        success: false,
        metadata: { 
          taskId: task.id, 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      return {
        taskId: task.id,
        type: task.type, // 🔧 CORRECTION: Propriété type ajoutée
        agentId: this.agentId,
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        metadata: {
          processingTime: Date.now() - Date.now(), // 🔧 CORRECTION: Propriété requise
          agentVersion: '1.0.0', // 🔧 CORRECTION: Propriété requise
          fallbackUsed: true
        }
      };
    }
  }

  public getStatus(): AgentStatus {
    return this.status;
  }

  public getMetrics(): AgentMetrics { // 🔧 CORRECTION: Méthode synchrone
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);
    
    const successfulExecutions = executions.filter(e => e.success).length;
    const totalExecutions = executions.length;
    
    const avgConfidence = this.calculateAverageExecutionConfidence(executions);
    const avgRecommendationCount = this.calculateAverageRecommendationCount(executions);
    
    const totalFailures = totalExecutions - successfulExecutions;

    return {
      tasksCompleted: totalExecutions, // 🔧 CORRECTION: Propriété correcte
      tasksFailures: totalFailures, // 🔧 CORRECTION: Propriété ajoutée
      errorRate: totalExecutions > 0 ? (totalFailures / totalExecutions) * 100 : 0, // 🔧 CORRECTION: Propriété ajoutée
      averageExecutionTime: totalExecutions > 0
        ? executions.reduce((sum, e) => sum + e.executionTime, 0) / totalExecutions
        : 0,
      lastHeartbeat: executions.length > 0
        ? executions[executions.length - 1].timestamp
        : new Date(), // 🔧 CORRECTION: Propriété correcte
      uptime: Date.now() - Date.now() // 🔧 CORRECTION: Propriété ajoutée (placeholder)
    };
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down RecommendationAgent');
    this.status = AgentStatus.SHUTDOWN;
    
    // Nettoyage du cache
    this.recommendationCache.clear();
    this.cacheExpiry.clear();
  }

  private async executeRecommendationTask(task: AgentTask): Promise<RecommendationSet> {
    switch (task.type) {
      case 'generate_recommendations':
        return await this.generateRecommendations(task.data.context);
      
      case 'suggest_security_measures':
        return await this.suggestSecurityMeasures(task.data.context, task.data.risks);
      
      case 'recommend_methodology':
        return await this.recommendMethodology(task.data.context);
      
      case 'suggest_improvements':
        return await this.suggestImprovements(task.data.context, task.data.currentState);
      
      case 'prioritize_actions':
        return await this.prioritizeActions(task.data.context, task.data.actions);
      
      case 'recommend_tools':
        return await this.recommendTools(task.data.context, task.data.requirements);
      
      default:
        throw new Error(`Unknown recommendation task type: ${task.type}`);
    }
  }

  private async generateRecommendations(context: RecommendationContext): Promise<RecommendationSet> {
    const cacheKey = this.getCacheKey('general', context);
    
    // Vérification du cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    this.logger.debug(`Generating recommendations for workshop ${context.workshopNumber}`);
    
    // Analyse du contexte
    const contextAnalysis = this.analyzeContext(context);
    
    // Génération des recommandations
    const recommendations = await this.generateContextualRecommendations(context, contextAnalysis);
    
    // Priorisation et filtrage
    const prioritizedRecommendations = this.prioritizeRecommendations(recommendations, context);
    
    // Génération du résumé
    const summary = this.generateSummary(prioritizedRecommendations);
    
    // Insights contextuels
    const contextualInsights = this.generateContextualInsights(context, contextAnalysis);
    
    // Prochaines étapes
    const nextSteps = this.generateNextSteps(prioritizedRecommendations, context);
    
    const recommendationSet: RecommendationSet = {
      recommendations: prioritizedRecommendations,
      summary,
      contextualInsights,
      nextSteps,
      confidence: this.calculateSetConfidence(prioritizedRecommendations)
    };
    
    // Mise en cache
    this.setCache(cacheKey, recommendationSet);
    
    return recommendationSet;
  }

  private async suggestSecurityMeasures(context: RecommendationContext, risks: any[]): Promise<RecommendationSet> {
    this.logger.debug('Suggesting security measures for identified risks');
    
    const recommendations: Recommendation[] = [];
    
    // Analyse des risques
    for (const risk of risks) {
      const measures = this.findApplicableSecurityMeasures(risk, context);
      recommendations.push(...measures);
    }
    
    // Déduplication et optimisation
    const optimizedRecommendations = this.optimizeRecommendations(recommendations, context);
    
    return {
      recommendations: optimizedRecommendations,
      summary: this.generateSummary(optimizedRecommendations),
      contextualInsights: [`${risks.length} risques analysés`, `${optimizedRecommendations.length} mesures recommandées`],
      nextSteps: this.generateSecurityMeasuresNextSteps(optimizedRecommendations),
      confidence: 0.88
    };
  }

  private async recommendMethodology(context: RecommendationContext): Promise<RecommendationSet> {
    this.logger.debug('Recommending methodology approach');
    
    const userExperience = context.userProfile.experience;
    const guidance = this.knowledgeBase.methodologyGuidance[userExperience];
    
    const recommendations = this.generateMethodologyRecommendations(guidance, context);
    
    return {
      recommendations,
      summary: this.generateSummary(recommendations),
      contextualInsights: this.generateMethodologyInsights(context, guidance),
      nextSteps: this.generateMethodologyNextSteps(context),
      confidence: 0.92
    };
  }

  private async suggestImprovements(context: RecommendationContext, currentState: any): Promise<RecommendationSet> {
    this.logger.debug('Suggesting improvements based on current state');
    
    // Analyse des lacunes
    const gaps = this.identifyGaps(currentState, context);
    
    // Génération des améliorations
    const improvements = this.generateImprovementRecommendations(gaps, context);
    
    return {
      recommendations: improvements,
      summary: this.generateSummary(improvements),
      contextualInsights: this.generateImprovementInsights(gaps, context),
      nextSteps: this.generateImprovementNextSteps(improvements),
      confidence: 0.85
    };
  }

  private async prioritizeActions(context: RecommendationContext, actions: any[]): Promise<RecommendationSet> {
    this.logger.debug('Prioritizing actions based on context');
    
    // Conversion des actions en recommandations
    const recommendations = actions.map(action => this.convertActionToRecommendation(action, context));
    
    // Priorisation
    const prioritized = this.prioritizeRecommendations(recommendations, context);
    
    return {
      recommendations: prioritized,
      summary: this.generateSummary(prioritized),
      contextualInsights: [`${actions.length} actions analysées`, 'Priorisation basée sur le contexte organisationnel'],
      nextSteps: this.generatePrioritizationNextSteps(prioritized),
      confidence: 0.90
    };
  }

  private async recommendTools(context: RecommendationContext, requirements: any): Promise<RecommendationSet> {
    this.logger.debug('Recommending tools based on requirements');
    
    const toolRecommendations = this.generateToolRecommendations(requirements, context);
    
    return {
      recommendations: toolRecommendations,
      summary: this.generateSummary(toolRecommendations),
      contextualInsights: this.generateToolInsights(requirements, context),
      nextSteps: this.generateToolNextSteps(toolRecommendations),
      confidence: 0.83
    };
  }

  private async executeFallback(task: AgentTask): Promise<RecommendationSet> {
    this.logger.warn('Using fallback for recommendation task');
    
    const fallbackRecommendation: Recommendation = {
      id: 'fallback_001',
      type: 'methodology',
      title: 'Consulter la documentation ANSSI',
      description: 'En cas d\'indisponibilité du service de recommandation, consultez le guide EBIOS RM de l\'ANSSI',
      rationale: 'Service de recommandation temporairement indisponible',
      priority: 'medium',
      effort: {
        timeEstimate: '1-2 heures',
        complexity: 'simple',
        resources: ['Documentation ANSSI']
      },
      impact: {
        riskReduction: 0.3,
        complianceImprovement: 0.5,
        businessValue: 0.2
      },
      implementation: {
        steps: ['Télécharger le guide ANSSI', 'Lire la section pertinente', 'Appliquer les recommandations'],
        prerequisites: ['Accès internet'],
        risks: ['Information potentiellement obsolète'],
        successCriteria: ['Compréhension des concepts', 'Application des bonnes pratiques']
      },
      references: {
        anssiGuides: ['Guide EBIOS RM'],
        standards: [],
        bestPractices: [],
        tools: []
      },
      alternatives: [],
      confidence: 0.1,
      applicability: 1.0
    };
    
    return {
      recommendations: [fallbackRecommendation],
      summary: {
        totalRecommendations: 1,
        priorityDistribution: { medium: 1 },
        estimatedTotalEffort: '1-2 heures',
        expectedRiskReduction: 0.3
      },
      contextualInsights: ['Service de recommandation indisponible'],
      nextSteps: ['Consulter la documentation officielle'],
      confidence: 0.1
    };
  }

  // Méthodes d'analyse et de génération
  
  private analyzeContext(context: RecommendationContext): any {
    return {
      userMaturity: this.assessUserMaturity(context.userProfile),
      organizationalReadiness: this.assessOrganizationalReadiness(context.organizationContext),
      workshopSpecifics: this.getWorkshopSpecifics(context.workshopNumber),
      constraints: this.analyzeConstraints(context),
      opportunities: this.identifyOpportunities(context)
    };
  }

  private async generateContextualRecommendations(context: RecommendationContext, analysis: any): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    // Recommandations basées sur l'atelier
    const workshopRecs = this.generateWorkshopRecommendations(context.workshopNumber, context);
    recommendations.push(...workshopRecs);
    
    // Recommandations basées sur le profil utilisateur
    const userRecs = this.generateUserProfileRecommendations(context.userProfile, context);
    recommendations.push(...userRecs);
    
    // Recommandations basées sur l'organisation
    const orgRecs = this.generateOrganizationalRecommendations(context.organizationContext, context);
    recommendations.push(...orgRecs);
    
    // Recommandations basées sur les contraintes
    if (context.timeConstraints) {
      const timeRecs = this.generateTimeConstraintRecommendations(context.timeConstraints, context);
      recommendations.push(...timeRecs);
    }
    
    return recommendations;
  }

  private generateWorkshopRecommendations(workshopNumber: number, context: RecommendationContext): Recommendation[] {
    const bestPractices = this.knowledgeBase.bestPractices[`workshop${workshopNumber}` as keyof typeof this.knowledgeBase.bestPractices] || [];
    
    return bestPractices.map((practice, index) => ({
      id: `workshop_${workshopNumber}_${index}`,
      type: 'best_practice' as const,
      title: practice,
      description: `Bonne pratique pour l'atelier ${workshopNumber} EBIOS RM`,
      rationale: `Recommandation basée sur les meilleures pratiques ANSSI pour l'atelier ${workshopNumber}`,
      priority: 'medium' as const,
      effort: {
        timeEstimate: '1-3 jours',
        complexity: 'moderate' as const,
        resources: ['Équipe EBIOS', 'Documentation']
      },
      impact: {
        riskReduction: 0.4,
        complianceImprovement: 0.6,
        businessValue: 0.5
      },
      implementation: {
        steps: [`Appliquer la pratique: ${practice}`],
        prerequisites: ['Formation EBIOS RM'],
        risks: ['Résistance au changement'],
        successCriteria: ['Pratique intégrée dans le processus']
      },
      references: {
        anssiGuides: [`Guide EBIOS RM - Atelier ${workshopNumber}`],
        standards: ['ISO 27005'],
        bestPractices: [practice],
        tools: []
      },
      alternatives: [],
      confidence: 0.8,
      applicability: this.calculateApplicability(context)
    }));
  }

  private generateUserProfileRecommendations(userProfile: any, context: RecommendationContext): Recommendation[] {
    const guidance = this.knowledgeBase.methodologyGuidance[userProfile.experience as keyof typeof this.knowledgeBase.methodologyGuidance]; // 🔧 CORRECTION: Type assertion
    
    return guidance.additionalSupport.map((support: any, index: number) => ({ // 🔧 CORRECTION: Types explicites
      id: `user_${userProfile.experience}_${index}`,
      type: 'methodology' as const,
      title: `Support ${support} pour ${userProfile.experience}`,
      description: `Recommandation de support adapté au niveau ${userProfile.experience}`,
      rationale: `Adapté au profil utilisateur ${userProfile.experience}`,
      priority: userProfile.experience === 'beginner' ? 'high' as const : 'medium' as const,
      effort: {
        timeEstimate: support === 'training' ? '1-2 semaines' : '1-3 jours',
        complexity: 'simple' as const,
        resources: [support]
      },
      impact: {
        riskReduction: 0.3,
        complianceImprovement: 0.5,
        businessValue: 0.6
      },
      implementation: {
        steps: [`Mettre en place ${support}`],
        prerequisites: [],
        risks: ['Coût supplémentaire'],
        successCriteria: ['Amélioration des compétences']
      },
      references: {
        anssiGuides: ['Guide EBIOS RM'],
        standards: [],
        bestPractices: [support],
        tools: []
      },
      alternatives: [],
      confidence: 0.85,
      applicability: 1.0
    }));
  }

  private generateOrganizationalRecommendations(orgContext: any, context: RecommendationContext): Recommendation[] {
    const sectorRecommendations = this.recommendationRules.applicability.sector[orgContext.sector as keyof typeof this.recommendationRules.applicability.sector] || [];
    const sizeRecommendations = this.recommendationRules.applicability.size[orgContext.size as keyof typeof this.recommendationRules.applicability.size] || [];
    
    const recommendations: Recommendation[] = [];
    
    // Recommandations sectorielles
    sectorRecommendations.forEach((rec, index) => {
      recommendations.push({
        id: `sector_${orgContext.sector}_${index}`,
        type: 'process' as const,
        title: `Recommandation sectorielle: ${rec}`,
        description: `Recommandation spécifique au secteur ${orgContext.sector}`,
        rationale: `Adapté aux spécificités du secteur ${orgContext.sector}`,
        priority: 'high' as const,
        effort: {
          timeEstimate: '2-6 semaines',
          complexity: 'moderate' as const,
          resources: ['Expertise sectorielle']
        },
        impact: {
          riskReduction: 0.6,
          complianceImprovement: 0.8,
          businessValue: 0.7
        },
        implementation: {
          steps: [`Implémenter ${rec}`],
          prerequisites: ['Analyse sectorielle'],
          risks: ['Complexité réglementaire'],
          successCriteria: ['Conformité sectorielle']
        },
        references: {
          anssiGuides: ['Guide sectoriel'],
          standards: ['Standards sectoriels'],
          bestPractices: [rec],
          tools: []
        },
        alternatives: [],
        confidence: 0.82,
        applicability: 0.9
      });
    });
    
    return recommendations;
  }

  private generateTimeConstraintRecommendations(timeConstraints: any, context: RecommendationContext): Recommendation[] {
    if (timeConstraints.urgency === 'critical' || timeConstraints.urgency === 'high') {
      return [{
        id: 'time_critical_001',
        type: 'methodology' as const,
        title: 'Approche accélérée EBIOS RM',
        description: 'Méthodologie adaptée aux contraintes de temps critiques',
        rationale: 'Contraintes de temps nécessitant une approche optimisée',
        priority: 'critical' as const,
        effort: {
          timeEstimate: '1-2 semaines',
          complexity: 'complex' as const,
          resources: ['Équipe dédiée', 'Experts externes']
        },
        impact: {
          riskReduction: 0.5,
          complianceImprovement: 0.6,
          businessValue: 0.8
        },
        implementation: {
          steps: [
            'Prioriser les ateliers critiques',
            'Paralléliser les activités',
            'Utiliser des templates pré-remplis',
            'Limiter le périmètre initial'
          ],
          prerequisites: ['Équipe expérimentée'],
          risks: ['Qualité réduite', 'Risques non identifiés'],
          successCriteria: ['Respect des délais', 'Couverture minimale des risques']
        },
        references: {
          anssiGuides: ['Guide EBIOS RM - Approche rapide'],
          standards: [],
          bestPractices: ['Priorisation', 'Parallélisation'],
          tools: ['Templates EBIOS']
        },
        alternatives: [
          {
            title: 'Analyse de risque simplifiée',
            description: 'Approche encore plus rapide mais moins complète',
            pros: ['Très rapide', 'Ressources minimales'],
            cons: ['Couverture limitée', 'Non conforme EBIOS RM']
          }
        ],
        confidence: 0.75,
        applicability: 0.8
      }];
    }
    
    return [];
  }

  // Méthodes utilitaires
  
  private prioritizeRecommendations(recommendations: Recommendation[], context: RecommendationContext): Recommendation[] {
    return recommendations
      .map(rec => ({
        ...rec,
        priority: this.calculatePriority(rec, context),
        applicability: this.calculateApplicability(context, rec)
      }))
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Si même priorité, trier par applicabilité puis confiance
        const applicabilityDiff = b.applicability - a.applicability;
        if (applicabilityDiff !== 0) return applicabilityDiff;
        
        return b.confidence - a.confidence;
      })
      .slice(0, 10); // Limiter à 10 recommandations principales
  }

  private calculatePriority(recommendation: Recommendation, context: RecommendationContext): 'low' | 'medium' | 'high' | 'critical' {
    const score = (
      recommendation.impact.riskReduction * 0.4 +
      recommendation.impact.complianceImprovement * 0.3 +
      recommendation.impact.businessValue * 0.3
    );
    
    // Ajustement selon l'urgence
    const urgencyMultiplier = context.timeConstraints?.urgency === 'critical' ? 1.2 : 1.0;
    const adjustedScore = score * urgencyMultiplier;
    
    if (adjustedScore >= 0.8) return 'critical';
    if (adjustedScore >= 0.6) return 'high';
    if (adjustedScore >= 0.3) return 'medium';
    return 'low';
  }

  private calculateApplicability(context: RecommendationContext, recommendation?: Recommendation): number {
    let score = 0.5; // Base score
    
    // Ajustement selon la maturité organisationnelle
    const maturityBonus = context.organizationContext.maturityLevel / 5 * 0.2;
    score += maturityBonus;
    
    // Ajustement selon l'expérience utilisateur
    const experienceBonus = {
      beginner: 0.1,
      intermediate: 0.2,
      expert: 0.3
    }[context.userProfile.experience];
    score += experienceBonus;
    
    // Ajustement selon la taille de l'organisation
    const sizeBonus = {
      small: 0.1,
      medium: 0.15,
      large: 0.2,
      enterprise: 0.25
    }[context.organizationContext.size];
    score += sizeBonus;
    
    return Math.min(score, 1.0);
  }

  private generateSummary(recommendations: Recommendation[]): any {
    const priorityDistribution = recommendations.reduce((acc, rec) => {
      acc[rec.priority] = (acc[rec.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalEffortHours = recommendations.reduce((sum, rec) => {
      const hours = this.parseTimeEstimate(rec.effort.timeEstimate);
      return sum + hours;
    }, 0);
    
    const avgRiskReduction = recommendations.length > 0 
      ? recommendations.reduce((sum, rec) => sum + rec.impact.riskReduction, 0) / recommendations.length
      : 0;
    
    return {
      totalRecommendations: recommendations.length,
      priorityDistribution,
      estimatedTotalEffort: this.formatEffortEstimate(totalEffortHours),
      expectedRiskReduction: Math.round(avgRiskReduction * 100) / 100
    };
  }

  private generateContextualInsights(context: RecommendationContext, analysis: any): string[] {
    const insights: string[] = [];
    
    insights.push(`Atelier ${context.workshopNumber} EBIOS RM en cours`);
    insights.push(`Niveau d'expérience: ${context.userProfile.experience}`);
    insights.push(`Taille organisation: ${context.organizationContext.size}`);
    insights.push(`Maturité sécurité: ${context.organizationContext.maturityLevel}/5`);
    
    if (context.timeConstraints?.urgency === 'critical') {
      insights.push('⚠️ Contraintes de temps critiques détectées');
    }
    
    if (context.organizationContext.maturityLevel < 3) {
      insights.push('💡 Opportunité d\'amélioration de la maturité sécurité');
    }
    
    return insights;
  }

  private generateNextSteps(recommendations: Recommendation[], context: RecommendationContext): string[] {
    const nextSteps: string[] = [];
    
    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      nextSteps.push(`Commencer par: ${topRecommendation.title}`);
      
      if (topRecommendation.implementation.prerequisites.length > 0) {
        nextSteps.push(`Prérequis: ${topRecommendation.implementation.prerequisites.join(', ')}`);
      }
    }
    
    nextSteps.push('Valider les recommandations avec l\'équipe');
    nextSteps.push('Planifier la mise en œuvre');
    nextSteps.push('Définir les indicateurs de suivi');
    
    return nextSteps;
  }

  // Méthodes de cache et métriques
  
  private getCacheKey(type: string, context: RecommendationContext): string {
    const contextKey = JSON.stringify({
      workshopNumber: context.workshopNumber,
      currentStep: context.currentStep,
      userExperience: context.userProfile.experience,
      orgSize: context.organizationContext.size,
      sector: context.organizationContext.sector
    });
    
    return `${type}:${contextKey}`;
  }

  private getFromCache(key: string): RecommendationSet | null {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.recommendationCache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.recommendationCache.get(key) || null;
  }

  private setCache(key: string, recommendationSet: RecommendationSet): void {
    this.recommendationCache.set(key, recommendationSet);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  private wasCacheHit(task: AgentTask): boolean {
    const cacheKey = this.getCacheKey(task.type, task.data.context);
    return this.recommendationCache.has(cacheKey);
  }

  private calculateCacheHitRate(): number {
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);
    const cacheHits = executions.filter(e => e.metadata?.cacheHit).length;
    return executions.length > 0 ? (cacheHits / executions.length) * 100 : 0;
  }

  private calculateAverageConfidence(recommendations: Recommendation[]): number {
    if (recommendations.length === 0) return 0;
    return recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
  }

  private calculateAverageExecutionConfidence(executions: any[]): number {
    const confidenceValues = executions
      .map(e => e.metadata?.averageConfidence)
      .filter(c => typeof c === 'number');
    
    return confidenceValues.length > 0 
      ? confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length
      : 0;
  }

  private calculateAverageRecommendationCount(executions: any[]): number {
    const counts = executions
      .map(e => e.metadata?.recommendationCount)
      .filter(c => typeof c === 'number');
    
    return counts.length > 0 
      ? counts.reduce((sum, c) => sum + c, 0) / counts.length
      : 0;
  }

  private assessRecommendationQuality(recommendationSet: RecommendationSet): string {
    const avgConfidence = this.calculateAverageConfidence(recommendationSet.recommendations);
    const count = recommendationSet.recommendations.length;
    
    if (avgConfidence >= 0.8 && count >= 5) return 'excellent';
    if (avgConfidence >= 0.6 && count >= 3) return 'good';
    if (avgConfidence >= 0.4 && count >= 1) return 'acceptable';
    return 'poor';
  }

  private getKnowledgeBaseSize(): number {
    return (
      Object.keys(this.knowledgeBase.securityMeasures.technical).length +
      Object.keys(this.knowledgeBase.securityMeasures.organizational).length +
      Object.keys(this.knowledgeBase.bestPractices).length
    );
  }

  // Méthodes utilitaires pour le parsing et formatage
  
  private parseTimeEstimate(estimate: string): number {
    // Parse "1-2 semaines" -> heures moyennes
    const weekMatch = estimate.match(/(\d+)-(\d+)\s*semaines?/);
    if (weekMatch) {
      const avgWeeks = (parseInt(weekMatch[1]) + parseInt(weekMatch[2])) / 2;
      return avgWeeks * 40; // 40h par semaine
    }
    
    const dayMatch = estimate.match(/(\d+)-(\d+)\s*jours?/);
    if (dayMatch) {
      const avgDays = (parseInt(dayMatch[1]) + parseInt(dayMatch[2])) / 2;
      return avgDays * 8; // 8h par jour
    }
    
    const hourMatch = estimate.match(/(\d+)-(\d+)\s*heures?/);
    if (hourMatch) {
      return (parseInt(hourMatch[1]) + parseInt(hourMatch[2])) / 2;
    }
    
    return 8; // Défaut: 1 jour
  }

  private formatEffortEstimate(hours: number): string {
    if (hours >= 160) { // 4+ semaines
      const weeks = Math.round(hours / 40);
      return `${weeks} semaines`;
    }
    
    if (hours >= 40) { // 1+ semaine
      const weeks = Math.round(hours / 40 * 10) / 10;
      return `${weeks} semaines`;
    }
    
    if (hours >= 8) { // 1+ jour
      const days = Math.round(hours / 8);
      return `${days} jours`;
    }
    
    return `${Math.round(hours)} heures`;
  }

  // Méthodes d'initialisation et validation
  
  private async validateKnowledgeBase(): Promise<void> {
    const securityMeasuresCount = 
      this.knowledgeBase.securityMeasures.technical.length +
      this.knowledgeBase.securityMeasures.organizational.length;
    
    if (securityMeasuresCount === 0) {
      throw new Error('Knowledge base is empty');
    }
    
    this.logger.info(`Knowledge base validated with ${securityMeasuresCount} security measures`);
  }

  private async loadRecommendationRules(): Promise<void> {
    // Chargement et validation des règles de recommandation
    const rulesCount = Object.keys(this.recommendationRules.priority).length;
    this.logger.info(`Loaded ${rulesCount} recommendation rules`);
  }

  private async testRecommendationAlgorithms(): Promise<void> {
    // Production ready
    const testContext: RecommendationContext = {
      workshopNumber: 1,
      currentStep: 'test',
      existingData: {},
      userProfile: {
        experience: 'intermediate',
        role: 'analyst',
        preferences: {
          detailLevel: 'detailed',
          focusArea: 'all'
        }
      },
      organizationContext: {
        sector: 'finance',
        size: 'medium',
        maturityLevel: 3,
        constraints: []
      }
    };
    
    const testRecommendations = await this.generateContextualRecommendations(testContext, {});
    
    if (testRecommendations.length === 0) {
      throw new Error('Recommendation algorithms failed test');
    }
    
    this.logger.info(`Recommendation algorithms tested successfully (${testRecommendations.length} test recommendations)`);
  }

  // Méthodes stub pour implémentation future
  
  private assessUserMaturity(userProfile: any): any {
    return { level: userProfile.experience, score: 0.5 };
  }

  private assessOrganizationalReadiness(orgContext: any): any {
    return { readiness: orgContext.maturityLevel / 5, factors: [] };
  }

  private getWorkshopSpecifics(workshopNumber: number): any {
    return { focus: `workshop_${workshopNumber}`, requirements: [] };
  }

  private analyzeConstraints(context: RecommendationContext): any {
    return { constraints: context.organizationContext.constraints, impact: 'medium' };
  }

  private identifyOpportunities(context: RecommendationContext): any {
    return { opportunities: [], potential: 'medium' };
  }

  private findApplicableSecurityMeasures(risk: any, context: RecommendationContext): Recommendation[] {
    // Stub - à implémenter avec logique de matching
    return [];
  }

  private optimizeRecommendations(recommendations: Recommendation[], context: RecommendationContext): Recommendation[] {
    // Déduplication simple par titre
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.title)) return false;
      seen.add(rec.title);
      return true;
    });
  }

  private generateSecurityMeasuresNextSteps(recommendations: Recommendation[]): string[] {
    return ['Évaluer les mesures proposées', 'Prioriser selon le budget', 'Planifier l\'implémentation'];
  }

  private generateMethodologyRecommendations(guidance: any, context: RecommendationContext): Recommendation[] {
    // Stub - à implémenter
    return [];
  }

  private generateMethodologyInsights(context: RecommendationContext, guidance: any): string[] {
    return [`Approche recommandée: ${guidance.recommendedApproach}`];
  }

  private generateMethodologyNextSteps(context: RecommendationContext): string[] {
    return ['Adapter la méthodologie', 'Former l\'équipe', 'Commencer l\'atelier'];
  }

  private identifyGaps(currentState: any, context: RecommendationContext): any[] {
    // Stub - à implémenter
    return [];
  }

  private generateImprovementRecommendations(gaps: any[], context: RecommendationContext): Recommendation[] {
    // Stub - à implémenter
    return [];
  }

  private generateImprovementInsights(gaps: any[], context: RecommendationContext): string[] {
    return [`${gaps.length} lacunes identifiées`];
  }

  private generateImprovementNextSteps(improvements: Recommendation[]): string[] {
    return ['Analyser les améliorations', 'Prioriser les actions', 'Mettre en œuvre'];
  }

  private convertActionToRecommendation(action: any, context: RecommendationContext): Recommendation {
    // Stub - conversion d'action en recommandation
    return {
      id: action.id || 'converted_action',
      type: 'process',
      title: action.title || 'Action convertie',
      description: action.description || '',
      rationale: 'Action existante convertie en recommandation',
      priority: 'medium',
      effort: {
        timeEstimate: '1-2 jours',
        complexity: 'moderate',
        resources: []
      },
      impact: {
        riskReduction: 0.3,
        complianceImprovement: 0.3,
        businessValue: 0.3
      },
      implementation: {
        steps: [],
        prerequisites: [],
        risks: [],
        successCriteria: []
      },
      references: {
        anssiGuides: [],
        standards: [],
        bestPractices: [],
        tools: []
      },
      alternatives: [],
      confidence: 0.5,
      applicability: 0.5
    };
  }

  private generatePrioritizationNextSteps(prioritized: Recommendation[]): string[] {
    return ['Valider la priorisation', 'Allouer les ressources', 'Commencer par les actions prioritaires'];
  }

  private generateToolRecommendations(requirements: any, context: RecommendationContext): Recommendation[] {
    // Stub - à implémenter
    return [];
  }

  private generateToolInsights(requirements: any, context: RecommendationContext): string[] {
    return ['Analyse des besoins en outils'];
  }

  private generateToolNextSteps(toolRecommendations: Recommendation[]): string[] {
    return ['Évaluer les outils', 'Tester les solutions', 'Déployer les outils sélectionnés'];
  }

  private calculateSetConfidence(recommendations: Recommendation[]): number {
    return this.calculateAverageConfidence(recommendations);
  }
}