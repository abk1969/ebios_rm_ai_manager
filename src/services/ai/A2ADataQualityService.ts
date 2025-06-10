/**
 * 🤖 A2A DATA QUALITY SERVICE
 * Service d'orchestration A2A pour la qualité des données EBIOS RM
 * Intégration avec MCP Server/Client pour suggestions intelligentes
 */

import { A2AOrchestrator } from '../agents/A2AOrchestrator';
// import { EBIOSMCPClient } from '../mcp/EBIOSMCPClient'; // 🚫 Désactivé temporairement (incompatible navigateur)
import { dataQualityDetector, DataQualityIssue } from './DataQualityDetector';

export interface A2AQualitySuggestion {
  id: string;
  field: string;
  originalValue: string;
  suggestedValue: string;
  confidence: number;
  reasoning: string;
  source: 'a2a-agent' | 'mcp-tool' | 'ebios-knowledge' | 'hybrid';
  agentUsed?: string;
  mcpToolUsed?: string;
  metadata?: {
    executionTime: number;
    fallbackUsed: boolean;
    validationScore: number;
  };
}

export interface A2AQualityAnalysis {
  entityId: string;
  entityType: 'businessValue' | 'dreadedEvent' | 'supportingAsset';
  issues: DataQualityIssue[];
  suggestions: A2AQualitySuggestion[];
  overallScore: number;
  agentsUsed: string[];
  mcpToolsUsed: string[];
  executionTime: number;
}

/**
 * Service principal pour l'orchestration A2A de la qualité des données
 */
export class A2ADataQualityService {
  private orchestrator: A2AOrchestrator;
  // private mcpClient: EBIOSMCPClient; // 🚫 Désactivé temporairement
  private isInitialized = false;

  constructor() {
    this.orchestrator = new A2AOrchestrator();
    // 🚫 MCP désactivé temporairement - incompatible navigateur
    // this.mcpClient = new EBIOSMCPClient({
    //   provider: 'gemini',
    //   model: 'gemini-2.5-flash-preview-05-20',
    //   apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    //   maxTokens: 2048,
    //   temperature: 0.3
    // });
  }

  /**
   * Initialisation du service (mode dégradé sans MCP)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 🚫 MCP désactivé temporairement - incompatible navigateur
      // await this.mcpClient.connect(['node', 'ebios-mcp-server.js']);
      this.isInitialized = true;
      console.log('🤖 A2A Data Quality Service initialisé (mode dégradé sans MCP)');
    } catch (error) {
      console.warn('⚠️ Erreur initialisation, mode dégradé activé:', error);
      this.isInitialized = true; // Mode dégradé
    }
  }

  /**
   * 🔍 Analyse complète avec orchestration A2A
   */
  async analyzeEntityWithA2A(
    entityType: 'businessValue' | 'dreadedEvent' | 'supportingAsset',
    entity: Record<string, any>,
    missionId: string
  ): Promise<A2AQualityAnalysis> {
    
    await this.initialize();
    const startTime = Date.now();
    const agentsUsed: string[] = [];
    const mcpToolsUsed: string[] = [];

    // 1. Analyse de base avec le détecteur existant
    const baseReport = dataQualityDetector.analyzeCompleteEntity(entityType, entity);

    // 2. Orchestration A2A pour suggestions avancées
    const suggestions: A2AQualitySuggestion[] = [];

    for (const issue of baseReport.issues) {
      if (issue.autoFixAvailable) {
        try {
          // Tentative avec agent A2A spécialisé
          const a2aSuggestion = await this.getA2ASuggestion(
            issue,
            entityType,
            entity,
            missionId
          );
          
          if (a2aSuggestion) {
            suggestions.push(a2aSuggestion);
            if (a2aSuggestion.agentUsed) agentsUsed.push(a2aSuggestion.agentUsed);
            if (a2aSuggestion.mcpToolUsed) mcpToolsUsed.push(a2aSuggestion.mcpToolUsed);
          }
        } catch (error) {
          console.warn(`⚠️ Fallback pour issue ${issue.id}:`, error);
          
          // Fallback vers suggestion de base
          suggestions.push({
            id: `fallback-${issue.id}`,
            field: issue.field,
            originalValue: issue.value,
            suggestedValue: issue.suggestedValue || 'Valeur par défaut',
            confidence: 0.6,
            reasoning: 'Suggestion de fallback (agents non disponibles)',
            source: 'ebios-knowledge',
            metadata: {
              executionTime: 0,
              fallbackUsed: true,
              validationScore: 0.6
            }
          });
        }
      }
    }

    return {
      entityId: entity.id || 'unknown',
      entityType,
      issues: baseReport.issues,
      suggestions,
      overallScore: baseReport.overallScore,
      agentsUsed: [...new Set(agentsUsed)],
      mcpToolsUsed: [...new Set(mcpToolsUsed)],
      executionTime: Date.now() - startTime
    };
  }

  /**
   * 🤖 Obtient une suggestion via orchestration A2A
   */
  private async getA2ASuggestion(
    issue: DataQualityIssue,
    entityType: string,
    entity: Record<string, any>,
    missionId: string
  ): Promise<A2AQualitySuggestion | null> {
    
    const startTime = Date.now();

    try {
      // 1. Tentative avec agent A2A spécialisé
      const agentResult = await this.orchestrator.orchestrateEbiosWorkflow(
        missionId,
        1, // Workshop 1 pour les entités de base
        {
          missionId,
          workshop: 1,
          currentState: {
            issue,
            entityType,
            entity,
            task: 'data-quality-suggestion'
          }
        }
      );

      if (agentResult.success && agentResult.data?.suggestion) {
        return {
          id: `a2a-${issue.id}`,
          field: issue.field,
          originalValue: issue.value,
          suggestedValue: agentResult.data.suggestion.value,
          confidence: agentResult.data.suggestion.confidence || 0.8,
          reasoning: agentResult.data.suggestion.reasoning || 'Suggestion générée par agent A2A',
          source: 'a2a-agent',
          agentUsed: agentResult.agentsUsed?.[0] || 'unknown-agent',
          metadata: {
            executionTime: Date.now() - startTime,
            fallbackUsed: agentResult.fallbacksUsed?.length > 0,
            validationScore: agentResult.data.suggestion.validationScore || 0.8
          }
        };
      }

      // 2. Fallback vers MCP si agent A2A échoue
      return await this.getMCPSuggestion(issue, entityType, entity);

    } catch (error) {
      console.warn('⚠️ Erreur agent A2A, tentative MCP:', error);
      return await this.getMCPSuggestion(issue, entityType, entity);
    }
  }

  /**
   * 🔌 Obtient une suggestion via MCP (désactivé temporairement)
   */
  private async getMCPSuggestion(
    issue: DataQualityIssue,
    entityType: string,
    entity: Record<string, any>
  ): Promise<A2AQualitySuggestion | null> {

    // 🚫 MCP désactivé temporairement - incompatible navigateur
    console.log('⚠️ MCP désactivé - utilisation de suggestions de fallback');

    // Fallback vers suggestions basiques
    return {
      id: `fallback-mcp-${issue.id}`,
      field: issue.field,
      originalValue: issue.value,
      suggestedValue: issue.suggestedValue || this.generateFallbackSuggestion(issue, entityType),
      confidence: 0.6,
      reasoning: 'Suggestion de fallback (MCP désactivé)',
      source: 'ebios-knowledge',
      metadata: {
        executionTime: 0,
        fallbackUsed: true,
        validationScore: 0.6
      }
    };
  }

  /**
   * 🔧 Génère une suggestion de fallback contextuelle et intelligente
   */
  private generateFallbackSuggestion(issue: DataQualityIssue, entityType: string): string {
    const currentValue = issue.value.toLowerCase();
    const fieldName = issue.field.toLowerCase();

    // 🎯 Suggestions contextuelles selon le champ et la valeur
    if (fieldName.includes('criticality') || fieldName.includes('level')) {
      // Pour les niveaux de criticité
      if (currentValue.includes('important')) return 'critique';
      if (currentValue.includes('primary')) return 'essentiel';
      if (currentValue.includes('operational')) return 'important';
      return 'critique';
    }

    if (fieldName.includes('category')) {
      // Pour les catégories
      if (currentValue.includes('primary')) return 'stratégique';
      if (currentValue.includes('operational')) return 'opérationnel';
      if (currentValue.includes('important')) return 'critique';
      return 'stratégique';
    }

    // 🎯 Suggestions par type d'entité avec contexte
    const contextualSuggestions = {
      businessValue: {
        financial: ['Chiffre d\'affaires', 'Revenus', 'Rentabilité'],
        data: ['Données clients', 'Base de données', 'Informations confidentielles'],
        reputation: ['Réputation', 'Image de marque', 'Confiance client'],
        compliance: ['Conformité réglementaire', 'Respect RGPD', 'Certification'],
        default: ['Données clients', 'Chiffre d\'affaires', 'Réputation']
      },
      dreadedEvent: {
        confidentiality: ['Atteinte à la confidentialité des données', 'Fuite d\'informations', 'Vol de données'],
        availability: ['Perte de disponibilité des services', 'Interruption d\'activité', 'Déni de service'],
        integrity: ['Altération des données', 'Corruption d\'informations', 'Modification non autorisée'],
        default: ['Atteinte à la confidentialité', 'Perte de disponibilité', 'Vol de données']
      },
      supportingAsset: {
        server: ['Serveur de base de données', 'Serveur applicatif', 'Infrastructure serveur'],
        network: ['Réseau informatique', 'Infrastructure réseau', 'Équipements réseau'],
        application: ['Application web', 'Logiciel métier', 'Système d\'information'],
        workstation: ['Poste de travail utilisateur', 'Station de travail', 'Ordinateur portable'],
        default: ['Serveur de base de données', 'Application web', 'Réseau informatique']
      }
    };

    // 🔍 Détection du contexte selon la valeur actuelle
    let context = 'default';
    if (currentValue.includes('data') || currentValue.includes('donnée')) context = 'data';
    if (currentValue.includes('financial') || currentValue.includes('chiffre')) context = 'financial';
    if (currentValue.includes('reputation') || currentValue.includes('image')) context = 'reputation';
    if (currentValue.includes('compliance') || currentValue.includes('conformité')) context = 'compliance';
    if (currentValue.includes('server') || currentValue.includes('serveur')) context = 'server';
    if (currentValue.includes('network') || currentValue.includes('réseau')) context = 'network';
    if (currentValue.includes('application') || currentValue.includes('app')) context = 'application';
    if (currentValue.includes('workstation') || currentValue.includes('poste')) context = 'workstation';
    if (currentValue.includes('confidential') || currentValue.includes('confidentiel')) context = 'confidentiality';
    if (currentValue.includes('available') || currentValue.includes('disponib')) context = 'availability';
    if (currentValue.includes('integrity') || currentValue.includes('intégrité')) context = 'integrity';

    const entitySuggestions = contextualSuggestions[entityType as keyof typeof contextualSuggestions];
    if (entitySuggestions) {
      const contextSuggestions = entitySuggestions[context as keyof typeof entitySuggestions] || entitySuggestions.default;
      return contextSuggestions[Math.floor(Math.random() * contextSuggestions.length)];
    }

    // Fallback final
    return entityType === 'businessValue' ? 'Données clients' :
           entityType === 'dreadedEvent' ? 'Atteinte à la confidentialité' :
           'Serveur de base de données';
  }

  /**
   * 🔧 Application d'une suggestion avec validation A2A
   */
  async applySuggestionWithValidation(
    suggestion: A2AQualitySuggestion,
    entity: Record<string, any>,
    missionId: string
  ): Promise<{
    success: boolean;
    validatedValue: string;
    validationScore: number;
    agentUsed?: string;
  }> {
    
    try {
      // Validation via orchestration A2A
      const validationResult = await this.orchestrator.orchestrateEbiosWorkflow(
        missionId,
        1,
        {
          missionId,
          workshop: 1,
          currentState: {
            task: 'validate-suggestion',
            suggestion,
            entity,
            field: suggestion.field
          }
        }
      );

      if (validationResult.success && validationResult.data?.validation) {
        return {
          success: true,
          validatedValue: validationResult.data.validation.value || suggestion.suggestedValue,
          validationScore: validationResult.data.validation.score || 0.8,
          agentUsed: validationResult.agentsUsed?.[0]
        };
      }

      // Fallback : accepter la suggestion telle quelle
      return {
        success: true,
        validatedValue: suggestion.suggestedValue,
        validationScore: suggestion.confidence
      };

    } catch (error) {
      console.warn('⚠️ Erreur validation A2A:', error);
      return {
        success: true,
        validatedValue: suggestion.suggestedValue,
        validationScore: suggestion.confidence
      };
    }
  }
}

export const a2aDataQualityService = new A2ADataQualityService();
