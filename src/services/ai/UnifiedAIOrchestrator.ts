/**
 * 🎼 ORCHESTRATEUR IA UNIFIÉ
 * Coordination intelligente de tous les composants IA EBIOS RM
 */

import { 
  AISuggestion, 
  AIContext, 
  AIOrchestrationContext,
  AIServiceResponse,
  AIAgent,
  AIConfiguration
} from '../../types/ai';

import { GlobalContextAIService } from './GlobalContextAIService';
import { EbiosCoherenceService } from '../EbiosCoherenceService';
import { AIEnrichmentService } from '../AIEnrichmentService';
import { PythonAIIntegrationService } from '../PythonAIIntegrationService';

export class UnifiedAIOrchestrator {
  private static instance: UnifiedAIOrchestrator;
  private agents: Map<string, AIAgent> = new Map();
  private activeServices: Map<string, any> = new Map();
  private configuration: AIConfiguration;
  private orchestrationQueue: Array<{
    id: string;
    priority: number;
    context: AIOrchestrationContext;
    callback: (result: any) => void;
  }> = [];

  private constructor() {
    this.configuration = this.getDefaultConfiguration();
    this.initializeServices();
    this.registerAgents();
  }

  public static getInstance(): UnifiedAIOrchestrator {
    if (!UnifiedAIOrchestrator.instance) {
      UnifiedAIOrchestrator.instance = new UnifiedAIOrchestrator();
    }
    return UnifiedAIOrchestrator.instance;
  }

  /**
   * Configuration par défaut
   */
  private getDefaultConfiguration(): AIConfiguration {
    return {
      enabled: true,
      services: {
        suggestions: true,
        coherenceAnalysis: true,
        autoEnrichment: true,
        mlPredictions: true,
        agentOrchestration: true
      },
      thresholds: {
        minConfidence: 0.6,
        maxSuggestions: 10,
        cacheTimeout: 300000 // 5 minutes
      },
      fallback: {
        enabled: true,
        staticSuggestions: true,
        offlineMode: false
      }
    };
  }

  /**
   * Initialise les services IA
   */
  private initializeServices(): void {
    try {
      // Services principaux
      this.activeServices.set('globalContext', GlobalContextAIService);
      this.activeServices.set('coherence', EbiosCoherenceService);
      this.activeServices.set('enrichment', AIEnrichmentService);
      this.activeServices.set('pythonIntegration', PythonAIIntegrationService);

      console.log('🎼 Services IA initialisés:', this.activeServices.size);
    } catch (error) {
      console.error('❌ Erreur initialisation services IA:', error);
    }
  }

  /**
   * Enregistre les agents IA
   */
  private registerAgents(): void {
    const agents: AIAgent[] = [
      {
        id: 'suggestion-agent',
        name: 'Agent de Suggestions',
        type: 'recommender',
        capabilities: ['workshop-suggestions', 'contextual-recommendations'],
        specialization: ['business-values', 'essential-assets', 'supporting-assets'],
        status: 'active'
      },
      {
        id: 'coherence-agent',
        name: 'Agent de Cohérence',
        type: 'validator',
        capabilities: ['coherence-analysis', 'cross-workshop-validation'],
        specialization: ['coherence', 'methodology'],
        status: 'active'
      },
      {
        id: 'enrichment-agent',
        name: 'Agent d\'Enrichissement',
        type: 'analyzer',
        capabilities: ['data-enrichment', 'metadata-generation'],
        specialization: ['dreaded-events', 'security-measures'],
        status: 'active'
      },
      {
        id: 'orchestration-agent',
        name: 'Agent d\'Orchestration',
        type: 'orchestrator',
        capabilities: ['workflow-coordination', 'priority-management'],
        specialization: ['strategic-scenarios', 'risk-sources'],
        status: 'active'
      }
    ];

    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    console.log('🤖 Agents IA enregistrés:', this.agents.size);
  }

  /**
   * Orchestration principale - point d'entrée unifié
   */
  public async orchestrate(context: AIOrchestrationContext): Promise<AIServiceResponse> {
    const startTime = Date.now();

    try {
      console.log(`🎼 Orchestration démarrée pour Workshop ${context.currentWorkshop}`);

      // 1. Validation du contexte
      const validationResult = this.validateContext(context);
      if (!validationResult.valid) {
        throw new Error(`Contexte invalide: ${validationResult.reason}`);
      }

      // 2. Sélection des agents appropriés
      const selectedAgents = this.selectAgentsForContext(context);
      console.log(`🤖 Agents sélectionnés: ${selectedAgents.length}`);

      // 3. Orchestration parallèle des services
      const orchestrationResults = await this.executeParallelOrchestration(context, selectedAgents);

      // 4. Agrégation et priorisation des résultats
      const aggregatedResults = this.aggregateResults(orchestrationResults);

      // 5. Application des filtres de qualité
      const filteredResults = this.applyQualityFilters(aggregatedResults, context);

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: filteredResults,
        metadata: {
          processingTime,
          source: 'unified-orchestrator',
          cached: false,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Erreur orchestration:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        metadata: {
          processingTime: Date.now() - startTime,
          source: 'unified-orchestrator',
          cached: false,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Valide le contexte d'orchestration
   */
  private validateContext(context: AIOrchestrationContext): { valid: boolean; reason?: string } {
    if (!context.currentWorkshop || context.currentWorkshop < 1 || context.currentWorkshop > 5) {
      return { valid: false, reason: 'Numéro de workshop invalide' };
    }

    if (!context.globalContext?.missionId) {
      return { valid: false, reason: 'ID de mission manquant' };
    }

    return { valid: true };
  }

  /**
   * Sélectionne les agents appropriés pour le contexte
   */
  private selectAgentsForContext(context: AIOrchestrationContext): AIAgent[] {
    const selectedAgents: AIAgent[] = [];

    // Logique de sélection basée sur le workshop et le contexte
    this.agents.forEach(agent => {
      if (agent.status === 'active') {
        // Tous les agents sont pertinents, mais avec des priorités différentes
        selectedAgents.push(agent);
      }
    });

    // Trier par pertinence (orchestrateur en premier, puis suggestions, etc.)
    return selectedAgents.sort((a, b) => {
      const priority = { 'orchestrator': 1, 'recommender': 2, 'analyzer': 3, 'validator': 4 };
      return (priority[a.type] || 5) - (priority[b.type] || 5);
    });
  }

  /**
   * Exécute l'orchestration en parallèle
   */
  private async executeParallelOrchestration(
    context: AIOrchestrationContext, 
    agents: AIAgent[]
  ): Promise<Array<{ agent: AIAgent; result: any; success: boolean }>> {
    const promises = agents.map(async (agent) => {
      try {
        const result = await this.executeAgentTask(agent, context);
        return { agent, result, success: true };
      } catch (error) {
        console.error(`❌ Erreur agent ${agent.name}:`, error);
        return { agent, result: null, success: false };
      }
    });

    return Promise.all(promises);
  }

  /**
   * Exécute une tâche pour un agent spécifique
   */
  private async executeAgentTask(agent: AIAgent, context: AIOrchestrationContext): Promise<any> {
    const aiContext: AIContext = {
      missionId: context.globalContext.missionId,
      workshopNumber: context.currentWorkshop as 1 | 2 | 3 | 4 | 5,
      currentStep: context.globalContext.currentPhase,
      userProfile: context.userPreferences,
      organizationContext: context.globalContext.organizationProfile,
      existingData: context.currentData,
      crossWorkshopData: context.previousWorkshopsData
    };

    switch (agent.type) {
      case 'recommender':
        return this.executeRecommenderAgent(aiContext);
      
      case 'validator':
        return this.executeValidatorAgent(aiContext);
      
      case 'analyzer':
        return this.executeAnalyzerAgent(aiContext);
      
      case 'orchestrator':
        return this.executeOrchestratorAgent(aiContext);
      
      default:
        throw new Error(`Type d'agent non supporté: ${agent.type}`);
    }
  }

  /**
   * Exécute l'agent de recommandation
   */
  private async executeRecommenderAgent(context: AIContext): Promise<AISuggestion[]> {
    const globalContextService = this.activeServices.get('globalContext');
    if (globalContextService) {
      return await globalContextService.generateWorkshopSuggestions(
        context.workshopNumber,
        context.missionId,
        context.existingData
      );
    }
    return [];
  }

  /**
   * Exécute l'agent de validation
   */
  private async executeValidatorAgent(context: AIContext): Promise<any> {
    const coherenceService = this.activeServices.get('coherence');
    if (coherenceService) {
      return await coherenceService.analyzeCoherence(context.missionId);
    }
    return null;
  }

  /**
   * Exécute l'agent d'analyse
   */
  private async executeAnalyzerAgent(context: AIContext): Promise<any> {
    const enrichmentService = this.activeServices.get('enrichment');
    if (enrichmentService && context.existingData) {
      return await enrichmentService.enrichData(context.existingData, context);
    }
    return null;
  }

  /**
   * Exécute l'agent d'orchestration
   */
  private async executeOrchestratorAgent(context: AIContext): Promise<any> {
    // Logique d'orchestration meta (coordination des autres agents)
    return {
      orchestrationStrategy: 'parallel',
      priorityMatrix: this.calculatePriorityMatrix(context),
      resourceAllocation: this.calculateResourceAllocation(context)
    };
  }

  /**
   * Calcule la matrice de priorité
   */
  private calculatePriorityMatrix(context: AIContext): Record<string, number> {
    const priorities: Record<string, number> = {};
    
    // Priorités basées sur le workshop
    switch (context.workshopNumber) {
      case 1:
        priorities.suggestions = 0.8;
        priorities.coherence = 0.6;
        priorities.enrichment = 0.7;
        break;
      case 2:
        priorities.suggestions = 0.9;
        priorities.coherence = 0.8;
        priorities.enrichment = 0.6;
        break;
      default:
        priorities.suggestions = 0.7;
        priorities.coherence = 0.9;
        priorities.enrichment = 0.5;
    }

    return priorities;
  }

  /**
   * Calcule l'allocation des ressources
   */
  private calculateResourceAllocation(context: AIContext): Record<string, number> {
    return {
      cpuAllocation: 0.8,
      memoryAllocation: 0.7,
      networkAllocation: 0.6,
      cacheAllocation: 0.9
    };
  }

  /**
   * Agrège les résultats de tous les agents
   */
  private aggregateResults(results: Array<{ agent: AIAgent; result: any; success: boolean }>): any {
    const aggregated = {
      suggestions: [],
      coherenceAnalysis: null,
      enrichmentData: null,
      orchestrationMetadata: null,
      successfulAgents: 0,
      totalAgents: results.length
    };

    results.forEach(({ agent, result, success }) => {
      if (success && result) {
        aggregated.successfulAgents++;
        
        switch (agent.type) {
          case 'recommender':
            if (Array.isArray(result)) {
              aggregated.suggestions.push(...result);
            }
            break;
          case 'validator':
            aggregated.coherenceAnalysis = result;
            break;
          case 'analyzer':
            aggregated.enrichmentData = result;
            break;
          case 'orchestrator':
            aggregated.orchestrationMetadata = result;
            break;
        }
      }
    });

    return aggregated;
  }

  /**
   * Applique les filtres de qualité
   */
  private applyQualityFilters(results: any, context: AIOrchestrationContext): any {
    // Filtrer les suggestions par confiance minimale
    if (results.suggestions) {
      results.suggestions = results.suggestions
        .filter((suggestion: AISuggestion) => 
          suggestion.confidence >= this.configuration.thresholds.minConfidence
        )
        .slice(0, this.configuration.thresholds.maxSuggestions);
    }

    // Ajouter des métadonnées de qualité
    results.qualityMetrics = {
      confidenceThreshold: this.configuration.thresholds.minConfidence,
      suggestionsFiltered: results.suggestions?.length || 0,
      agentSuccessRate: results.successfulAgents / results.totalAgents
    };

    return results;
  }

  /**
   * Met à jour la configuration
   */
  public updateConfiguration(newConfig: Partial<AIConfiguration>): void {
    this.configuration = { ...this.configuration, ...newConfig };
    console.log('🔧 Configuration IA mise à jour');
  }

  /**
   * Obtient le statut de l'orchestrateur
   */
  public getStatus(): any {
    return {
      activeServices: this.activeServices.size,
      registeredAgents: this.agents.size,
      queueLength: this.orchestrationQueue.length,
      configuration: this.configuration,
      lastActivity: new Date().toISOString()
    };
  }
}

// Export de l'instance singleton
export const unifiedAIOrchestrator = UnifiedAIOrchestrator.getInstance();
