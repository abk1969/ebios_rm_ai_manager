/**
 * 🎯 WORKSHOP 1 AGENT - IDENTIFICATION DES SOURCES DE RISQUE
 * Agent spécialisé pour l'atelier 1 EBIOS RM : Cadrage et sources de risque
 * Responsable de l'identification et l'analyse des sources de risque
 */

import { WorkshopAgent, WorkshopStep, ValidationResult, WorkshopContext } from './WorkshopAgent';
import { AgentConfig, AgentCapability, AgentTask } from '../AgentInterface';
import { Logger } from '../../logging/Logger';

// Types spécifiques à l'atelier 1
export interface RiskSource {
  id: string;
  name: string;
  description: string;
  category: 'human' | 'environmental' | 'technological' | 'organizational';
  subcategory: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  motivation: string[];
  capabilities: string[];
  resources: string[];
  constraints: string[];
  historicalIncidents: HistoricalIncident[];
  geographicalScope: 'local' | 'national' | 'international' | 'global';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  confidence: number; // 0-100
  sources: string[]; // Sources d'information
  lastUpdated: Date;
  aiGenerated: boolean;
}

export interface HistoricalIncident {
  id: string;
  date: Date;
  description: string;
  impact: string;
  source: string;
  relevance: number; // 0-100
}

export interface OrganizationalContext {
  sector: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  geographicalPresence: string[];
  regulatoryFramework: string[];
  businessModel: string;
  digitalMaturity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  riskAppetite: 'low' | 'medium' | 'high';
  previousIncidents: HistoricalIncident[];
}

export interface ThreatLandscape {
  emergingThreats: string[];
  sectorSpecificThreats: string[];
  geopoliticalFactors: string[];
  technologicalTrends: string[];
  regulatoryChanges: string[];
  lastAnalysis: Date;
}

/**
 * Agent spécialisé pour l'atelier 1 EBIOS RM
 * Gère l'identification et l'analyse des sources de risque
 */
export class Workshop1Agent extends WorkshopAgent {
  private riskSources: Map<string, RiskSource> = new Map();
  private organizationalContext?: OrganizationalContext;
  private threatLandscape?: ThreatLandscape;
  private riskSourceTemplates: Map<string, Partial<RiskSource>> = new Map();
  
  // Base de connaissances des sources de risque
  private readonly knowledgeBase = {
    humanSources: [
      'Employés malveillants',
      'Employés négligents',
      'Anciens employés',
      'Prestataires externes',
      'Visiteurs',
      'Hacktivistes',
      'Cybercriminels',
      'Espions industriels',
      'Terroristes',
      'Services de renseignement étrangers'
    ],
    environmentalSources: [
      'Catastrophes naturelles',
      'Incendies',
      'Inondations',
      'Séismes',
      'Conditions météorologiques extrêmes',
      'Pollution',
      'Épidémies/Pandémies'
    ],
    technologicalSources: [
      'Défaillances matérielles',
      'Bugs logiciels',
      'Obsolescence technologique',
      'Cyberattaques automatisées',
      'Malwares',
      'Vulnérabilités zero-day',
      'Défaillances d\'infrastructure',
      'Pannes de réseau'
    ],
    organizationalSources: [
      'Processus défaillants',
      'Manque de formation',
      'Absence de procédures',
      'Défaillance de gouvernance',
      'Conflits d\'intérêts',
      'Changements organisationnels',
      'Fusion/Acquisition',
      'Restructuration'
    ]
  };

  constructor(config: AgentConfig) {
    super(config, 1, [
      AgentCapability.RISK_ANALYSIS,
      AgentCapability.THREAT_MODELING,
      AgentCapability.DOCUMENTATION
    ]);
    
    this.initializeRiskSourceTemplates();
  }

  protected async initializeWorkshopSteps(): Promise<void> {
    // Étape 1: Cadrage organisationnel
    this.workshopSteps.set('organizational_framing', {
      id: 'organizational_framing',
      name: 'Cadrage organisationnel',
      description: 'Définition du périmètre et du contexte organisationnel',
      order: 1,
      required: true,
      estimatedDuration: 60,
      dependencies: [],
      inputs: [
        {
          id: 'organization_info',
          name: 'Informations organisationnelles',
          type: 'object',
          required: true,
          source: 'user',
          validation: {}
        }
      ],
      outputs: [
        {
          id: 'organizational_context',
          name: 'Contexte organisationnel',
          type: 'object',
          format: 'json',
          destination: 'next_step'
        }
      ],
      validations: [
        {
          id: 'context_completeness',
          type: 'completeness',
          rule: 'all_required_fields_present',
          message: 'Tous les champs obligatoires doivent être renseignés',
          severity: 'error'
        }
      ],
      aiCapabilities: ['context_analysis', 'sector_intelligence']
    });

    // Étape 2: Analyse du paysage des menaces
    this.workshopSteps.set('threat_landscape_analysis', {
      id: 'threat_landscape_analysis',
      name: 'Analyse du paysage des menaces',
      description: 'Identification des menaces émergentes et sectorielles',
      order: 2,
      required: true,
      estimatedDuration: 45,
      dependencies: ['organizational_framing'],
      inputs: [
        {
          id: 'organizational_context',
          name: 'Contexte organisationnel',
          type: 'object',
          required: true,
          source: 'previous_step',
          validation: {}
        }
      ],
      outputs: [
        {
          id: 'threat_landscape',
          name: 'Paysage des menaces',
          type: 'object',
          format: 'json',
          destination: 'next_step'
        }
      ],
      validations: [
        {
          id: 'threat_relevance',
          type: 'quality',
          rule: 'threats_relevant_to_context',
          message: 'Les menaces doivent être pertinentes pour le contexte',
          severity: 'warning'
        }
      ],
      aiCapabilities: ['threat_intelligence', 'trend_analysis']
    });

    // Étape 3: Identification des sources de risque
    this.workshopSteps.set('risk_source_identification', {
      id: 'risk_source_identification',
      name: 'Identification des sources de risque',
      description: 'Identification systématique des sources de risque',
      order: 3,
      required: true,
      estimatedDuration: 90,
      dependencies: ['threat_landscape_analysis'],
      inputs: [
        {
          id: 'threat_landscape',
          name: 'Paysage des menaces',
          type: 'object',
          required: true,
          source: 'previous_step',
          validation: {}
        }
      ],
      outputs: [
        {
          id: 'risk_sources',
          name: 'Sources de risque',
          type: 'array',
          format: 'json',
          destination: 'deliverable'
        }
      ],
      validations: [
        {
          id: 'source_coverage',
          type: 'completeness',
          rule: 'all_categories_covered',
          message: 'Toutes les catégories de sources doivent être couvertes',
          severity: 'warning'
        }
      ],
      aiCapabilities: ['risk_identification', 'categorization']
    });

    // Étape 4: Analyse et caractérisation
    this.workshopSteps.set('risk_source_analysis', {
      id: 'risk_source_analysis',
      name: 'Analyse et caractérisation',
      description: 'Analyse détaillée et caractérisation des sources de risque',
      order: 4,
      required: true,
      estimatedDuration: 120,
      dependencies: ['risk_source_identification'],
      inputs: [
        {
          id: 'risk_sources',
          name: 'Sources de risque',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }
      ],
      outputs: [
        {
          id: 'analyzed_risk_sources',
          name: 'Sources de risque analysées',
          type: 'array',
          format: 'json',
          destination: 'deliverable'
        }
      ],
      validations: [
        {
          id: 'analysis_depth',
          type: 'quality',
          rule: 'sufficient_analysis_depth',
          message: 'L\'analyse doit être suffisamment détaillée',
          severity: 'warning'
        }
      ],
      aiCapabilities: ['threat_analysis', 'capability_assessment']
    });

    // Étape 5: Validation et consolidation
    this.workshopSteps.set('validation_consolidation', {
      id: 'validation_consolidation',
      name: 'Validation et consolidation',
      description: 'Validation finale et consolidation des résultats',
      order: 5,
      required: true,
      estimatedDuration: 30,
      dependencies: ['risk_source_analysis'],
      inputs: [
        {
          id: 'analyzed_risk_sources',
          name: 'Sources de risque analysées',
          type: 'array',
          required: true,
          source: 'previous_step',
          validation: {}
        }
      ],
      outputs: [
        {
          id: 'final_risk_sources',
          name: 'Sources de risque finales',
          type: 'array',
          format: 'json',
          destination: 'deliverable'
        }
      ],
      validations: [
        {
          id: 'final_validation',
          type: 'methodology',
          rule: 'ebios_rm_compliance',
          message: 'Les résultats doivent être conformes à EBIOS RM',
          severity: 'error'
        }
      ],
      aiCapabilities: ['validation', 'consolidation']
    });

    this.logger.info('Workshop 1 steps initialized');
  }

  protected async initializeWorkshopSpecific(): Promise<void> {
    // Chargement de la base de connaissances spécifique
    await this.loadThreatIntelligence();
    
    // Initialisation des templates de sources de risque
    await this.initializeRiskSourceTemplates();
    
    this.logger.info('Workshop 1 specific initialization completed');
  }

  protected async executeStepImplementation(stepId: string, inputs: any): Promise<any> {
    const step = this.workshopSteps.get(stepId);
    if (!step) {
      throw new Error(`Step ${stepId} not found`);
    }
    return this.executeStepLogic(step, inputs);
  }

  protected async executeStepLogic(step: WorkshopStep, inputs: any): Promise<any> {
    switch (step.id) {
      case 'organizational_framing':
        return await this.executeOrganizationalFraming(inputs);
      
      case 'threat_landscape_analysis':
        return await this.executeThreatLandscapeAnalysis(inputs);
      
      case 'risk_source_identification':
        return await this.executeRiskSourceIdentification(inputs);
      
      case 'risk_source_analysis':
        return await this.executeRiskSourceAnalysis(inputs);
      
      case 'validation_consolidation':
        return await this.executeValidationConsolidation(inputs);
      
      default:
        throw new Error(`Unknown step: ${step.id}`);
    }
  }

  protected async executeWorkshopSpecificTask(task: AgentTask): Promise<any> {
    switch (task.type) {
      case 'get_risk_sources':
        return Array.from(this.riskSources.values());
      
      case 'add_risk_source':
        return await this.addRiskSource(task.data);
      
      case 'update_risk_source':
        return await this.updateRiskSource(task.data.id, task.data.updates);
      
      case 'delete_risk_source':
        return await this.deleteRiskSource(task.data.id);
      
      case 'analyze_risk_source':
        return await this.analyzeRiskSource(task.data.id);
      
      case 'get_threat_landscape':
        return this.threatLandscape;
      
      case 'get_organizational_context':
        return this.organizationalContext;
      
      case 'suggest_risk_sources':
        return await this.suggestRiskSources(task.data.context);
      
      case 'validate_risk_source':
        return await this.validateRiskSource(task.data.riskSource);
      
      default:
        throw new Error(`Unknown Workshop 1 task: ${task.type}`);
    }
  }

  // Implémentation des méthodes de validation

  protected async validateMethodology(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Validation de la couverture des catégories
    const categories = ['human', 'environmental', 'technological', 'organizational'];
    const coveredCategories = new Set(
      Array.from(this.riskSources.values()).map(rs => rs.category)
    );

    for (const category of categories) {
      if (!coveredCategories.has(category as any)) {
        results.push({
          id: `missing_category_${category}`,
          type: 'methodology',
          status: 'warning',
          message: `Catégorie ${category} non couverte`,
          details: `Aucune source de risque identifiée pour la catégorie ${category}`,
          severity: 'medium',
          autoFixable: true,
          recommendations: [
            `Identifier au moins une source de risque pour la catégorie ${category}`,
            'Utiliser les suggestions IA pour compléter cette catégorie'
          ]
        });
      }
    }

    // Validation du nombre minimum de sources
    if (this.riskSources.size < 5) {
      results.push({
        id: 'insufficient_sources',
        type: 'methodology',
        status: 'warning',
        message: 'Nombre insuffisant de sources de risque',
        details: `Seulement ${this.riskSources.size} sources identifiées (minimum recommandé: 5)`,
        severity: 'medium',
        autoFixable: true,
        recommendations: [
          'Identifier des sources de risque supplémentaires',
          'Utiliser l\'assistance IA pour suggérer des sources pertinentes'
        ]
      });
    }

    return results;
  }

  protected async validateCompliance(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Validation de la conformité EBIOS RM
    Array.from(this.riskSources.entries()).forEach(([id, riskSource]) => {
      if (!riskSource.description || riskSource.description.length < 20) {
        results.push({
          id: `incomplete_description_${id}`,
          type: 'compliance',
          status: 'failed',
          message: 'Description insuffisante',
          details: `La source de risque ${riskSource.name} n'a pas de description suffisamment détaillée`,
          severity: 'medium',
          autoFixable: true,
          recommendations: [
            'Compléter la description de la source de risque',
            'Inclure les motivations, capacités et contraintes'
          ]
        });
      }

      if (!riskSource.motivation || riskSource.motivation.length === 0) {
        results.push({
          id: `missing_motivation_${id}`,
          type: 'compliance',
          status: 'failed',
          message: 'Motivations non définies',
          details: `Les motivations de la source de risque ${riskSource.name} ne sont pas définies`,
          severity: 'high',
          autoFixable: true,
          recommendations: [
            'Définir les motivations de la source de risque',
            'Analyser les objectifs et intérêts de la source'
          ]
        });
      }
    });

    return results;
  }

  protected async validateQuality(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Validation de la qualité des analyses
    Array.from(this.riskSources.entries()).forEach(([id, riskSource]) => {
      if (riskSource.confidence < 70) {
        results.push({
          id: `low_confidence_${id}`,
          type: 'quality',
          status: 'warning',
          message: 'Niveau de confiance faible',
          details: `La source de risque ${riskSource.name} a un niveau de confiance de ${riskSource.confidence}%`,
          severity: 'low',
          autoFixable: false,
          recommendations: [
            'Enrichir l\'analyse avec des sources supplémentaires',
            'Valider les informations avec des experts',
            'Rechercher des incidents historiques pertinents'
          ]
        });
      }

      if (!riskSource.sources || riskSource.sources.length === 0) {
        results.push({
          id: `no_sources_${id}`,
          type: 'quality',
          status: 'warning',
          message: 'Aucune source d\'information',
          details: `La source de risque ${riskSource.name} ne référence aucune source d'information`,
          severity: 'medium',
          autoFixable: false,
          recommendations: [
            'Ajouter des références aux sources d\'information utilisées',
            'Documenter la provenance des données'
          ]
        });
      }
    });

    return results;
  }

  protected async validateCompleteness(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Validation de la complétude
    if (!this.organizationalContext) {
      results.push({
        id: 'missing_organizational_context',
        type: 'completeness',
        status: 'failed',
        message: 'Contexte organisationnel manquant',
        details: 'Le contexte organisationnel n\'a pas été défini',
        severity: 'critical',
        autoFixable: false,
        recommendations: [
          'Compléter l\'étape de cadrage organisationnel',
          'Définir le secteur, la taille et le contexte de l\'organisation'
        ]
      });
    }

    if (!this.threatLandscape) {
      results.push({
        id: 'missing_threat_landscape',
        type: 'completeness',
        status: 'failed',
        message: 'Paysage des menaces manquant',
        details: 'L\'analyse du paysage des menaces n\'a pas été réalisée',
        severity: 'high',
        autoFixable: false,
        recommendations: [
          'Réaliser l\'analyse du paysage des menaces',
          'Identifier les menaces émergentes et sectorielles'
        ]
      });
    }

    return results;
  }

  // Méthodes d'exécution des étapes

  private async executeOrganizationalFraming(inputs: any): Promise<any> {
    this.logger.info('Executing organizational framing');

    const orgInfo = inputs.organization_info;
    
    this.organizationalContext = {
      sector: orgInfo.sector,
      size: orgInfo.size,
      geographicalPresence: orgInfo.geographicalPresence || [],
      regulatoryFramework: orgInfo.regulatoryFramework || [],
      businessModel: orgInfo.businessModel,
      digitalMaturity: orgInfo.digitalMaturity || 'intermediate',
      riskAppetite: orgInfo.riskAppetite || 'medium',
      previousIncidents: orgInfo.previousIncidents || []
    };

    // Génération d'insights IA sur le contexte
    const aiInsights = await this.generateContextualInsights(this.organizationalContext);
    
    await this.addAIContribution({
      type: 'analysis',
      content: `Analyse contextuelle: ${aiInsights}`,
      confidence: 85,
      source: 'context_analysis_ai',
      accepted: true
    });

    return {
      organizational_context: this.organizationalContext,
      ai_insights: aiInsights
    };
  }

  private async executeThreatLandscapeAnalysis(inputs: any): Promise<any> {
    this.logger.info('Executing threat landscape analysis');

    const context = inputs.organizational_context;
    
    this.threatLandscape = {
      emergingThreats: await this.identifyEmergingThreats(context),
      sectorSpecificThreats: await this.identifySectorThreats(context.sector),
      geopoliticalFactors: await this.analyzeGeopoliticalFactors(context.geographicalPresence),
      technologicalTrends: await this.analyzeTechnologicalTrends(context.digitalMaturity),
      regulatoryChanges: await this.analyzeRegulatoryChanges(context.regulatoryFramework),
      lastAnalysis: new Date()
    };

    await this.addAIContribution({
      type: 'analysis',
      content: `Analyse du paysage des menaces pour le secteur ${context.sector}`,
      confidence: 90,
      source: 'threat_intelligence_ai',
      accepted: true
    });

    return {
      threat_landscape: this.threatLandscape
    };
  }

  private async executeRiskSourceIdentification(inputs: any): Promise<any> {
    this.logger.info('Executing risk source identification');

    const threatLandscape = inputs.threat_landscape;
    
    // Identification basée sur le paysage des menaces
    const identifiedSources = await this.identifyRiskSourcesFromThreats(threatLandscape);
    
    // Ajout des sources suggérées par l'IA
    const aiSuggestions = await this.suggestRiskSources(this.organizationalContext!);
    
    // Consolidation des sources
    const allSources = [...identifiedSources, ...aiSuggestions];
    
    for (const source of allSources) {
      this.riskSources.set(source.id, source);
    }

    await this.addAIContribution({
      type: 'suggestion',
      content: `${aiSuggestions.length} sources de risque suggérées par l'IA`,
      confidence: 80,
      source: 'risk_identification_ai',
      accepted: true
    });

    return {
      risk_sources: Array.from(this.riskSources.values())
    };
  }

  private async executeRiskSourceAnalysis(inputs: any): Promise<any> {
    this.logger.info('Executing risk source analysis');

    const riskSources = inputs.risk_sources;
    
    // Analyse détaillée de chaque source
    for (const source of riskSources) {
      await this.analyzeRiskSource(source.id);
    }

    return {
      analyzed_risk_sources: Array.from(this.riskSources.values())
    };
  }

  private async executeValidationConsolidation(inputs: any): Promise<any> {
    this.logger.info('Executing validation and consolidation');

    const analyzedSources = inputs.analyzed_risk_sources;
    
    // Validation finale
    const validationResults = await this.validateWorkshop();
    
    // Consolidation des résultats
    const finalSources = await this.consolidateRiskSources(analyzedSources);
    
    // Génération du livrable final
    await this.generateDeliverable('risk_sources', {
      sources: finalSources,
      organizationalContext: this.organizationalContext,
      threatLandscape: this.threatLandscape,
      validationResults,
      metadata: {
        workshopNumber: 1,
        completionDate: new Date(),
        participantCount: this.currentContext?.participants.length || 0,
        aiAssistanceLevel: this.currentContext?.aiAssistanceLevel || 'standard'
      }
    });

    return {
      final_risk_sources: finalSources,
      validation_results: validationResults
    };
  }

  // Méthodes utilitaires spécifiques

  private async loadThreatIntelligence(): Promise<void> {
    // Chargement de la base de connaissances des menaces
    this.logger.debug('Loading threat intelligence database');
  }

  private initializeRiskSourceTemplates(): void {
    // Templates pour les différentes catégories
    this.riskSourceTemplates.set('cybercriminal', {
      category: 'human',
      subcategory: 'external_malicious',
      motivation: ['financial_gain', 'data_theft'],
      capabilities: ['technical_skills', 'social_engineering'],
      resources: ['automated_tools', 'botnets'],
      constraints: ['law_enforcement', 'technical_barriers'],
      geographicalScope: 'global',
      timeframe: 'immediate'
    });

    this.riskSourceTemplates.set('natural_disaster', {
      category: 'environmental',
      subcategory: 'natural_events',
      motivation: [],
      capabilities: ['physical_destruction'],
      resources: [],
      constraints: ['geographical_limitations'],
      geographicalScope: 'local',
      timeframe: 'immediate'
    });

    // Autres templates...
  }

  private async generateContextualInsights(context: OrganizationalContext): Promise<string> {
    // Génération d'insights basés sur le contexte
    const insights = [];
    
    if (context.sector === 'finance') {
      insights.push('Secteur financier: exposition élevée aux cyberattaques et à la réglementation');
    }
    
    if (context.digitalMaturity === 'advanced') {
      insights.push('Maturité numérique avancée: surface d\'attaque étendue mais meilleure détection');
    }
    
    return insights.join('; ');
  }

  private async identifyEmergingThreats(context: OrganizationalContext): Promise<string[]> {
    // Identification des menaces émergentes
    const threats = [
      'Attaques par IA générative',
      'Ransomware-as-a-Service',
      'Supply chain attacks',
      'Deepfakes'
    ];
    
    return threats;
  }

  private async identifySectorThreats(sector: string): Promise<string[]> {
    // Menaces spécifiques au secteur
    const sectorThreats: Record<string, string[]> = {
      finance: ['Fraude bancaire', 'Blanchiment d\'argent', 'Manipulation de marché'],
      healthcare: ['Vol de données médicales', 'Ransomware hospitalier', 'Fraude à l\'assurance'],
      energy: ['Cyberattaques sur infrastructures critiques', 'Espionnage industriel'],
      manufacturing: ['Sabotage industriel', 'Vol de propriété intellectuelle']
    };
    
    return sectorThreats[sector] || [];
  }

  private async analyzeGeopoliticalFactors(regions: string[]): Promise<string[]> {
    // Analyse des facteurs géopolitiques
    return ['Tensions commerciales', 'Cyberguerre', 'Espionnage étatique'];
  }

  private async analyzeTechnologicalTrends(maturity: string): Promise<string[]> {
    // Analyse des tendances technologiques
    return ['Cloud computing', 'IoT', 'Intelligence artificielle', '5G'];
  }

  private async analyzeRegulatoryChanges(frameworks: string[]): Promise<string[]> {
    // Analyse des changements réglementaires
    return ['RGPD', 'NIS2', 'Cyber Resilience Act'];
  }

  private async identifyRiskSourcesFromThreats(threatLandscape: ThreatLandscape): Promise<RiskSource[]> {
    const sources: RiskSource[] = [];
    
    // Conversion des menaces en sources de risque
    for (const threat of threatLandscape.emergingThreats) {
      sources.push(await this.createRiskSourceFromThreat(threat, 'emerging'));
    }
    
    return sources;
  }

  private async createRiskSourceFromThreat(threat: string, type: string): Promise<RiskSource> {
    return {
      id: `source_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      name: threat,
      description: `Source de risque identifiée: ${threat}`,
      category: 'technological',
      subcategory: type,
      threatLevel: 'medium',
      motivation: [],
      capabilities: [],
      resources: [],
      constraints: [],
      historicalIncidents: [],
      geographicalScope: 'global',
      timeframe: 'medium_term',
      confidence: 70,
      sources: ['threat_intelligence'],
      lastUpdated: new Date(),
      aiGenerated: true
    };
  }

  private async suggestRiskSources(context: OrganizationalContext): Promise<RiskSource[]> {
    const suggestions: RiskSource[] = [];
    
    // Suggestions basées sur le contexte
    Object.entries(this.knowledgeBase).forEach(([category, sources]) => {
      for (const sourceName of sources.slice(0, 2)) { // Limiter les suggestions
        const template = this.riskSourceTemplates.get('cybercriminal') || {};
        
        suggestions.push({
          id: `suggested_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
          name: sourceName,
          description: `Source de risque suggérée: ${sourceName}`,
          category: category.replace('Sources', '').toLowerCase() as any,
          subcategory: 'suggested',
          threatLevel: 'medium',
          motivation: template.motivation || [],
          capabilities: template.capabilities || [],
          resources: template.resources || [],
          constraints: template.constraints || [],
          historicalIncidents: [],
          geographicalScope: template.geographicalScope || 'local',
          timeframe: template.timeframe || 'medium_term',
          confidence: 60,
          sources: ['ai_suggestion'],
          lastUpdated: new Date(),
          aiGenerated: true
        });
      }
    });
    
    return suggestions.slice(0, 5); // Limiter à 5 suggestions
  }

  private async addRiskSource(data: Partial<RiskSource>): Promise<RiskSource> {
    const riskSource: RiskSource = {
      id: data.id || `source_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      name: data.name || 'Nouvelle source de risque',
      description: data.description || '',
      category: data.category || 'human',
      subcategory: data.subcategory || 'unknown',
      threatLevel: data.threatLevel || 'medium',
      motivation: data.motivation || [],
      capabilities: data.capabilities || [],
      resources: data.resources || [],
      constraints: data.constraints || [],
      historicalIncidents: data.historicalIncidents || [],
      geographicalScope: data.geographicalScope || 'local',
      timeframe: data.timeframe || 'medium_term',
      confidence: data.confidence || 50,
      sources: data.sources || [],
      lastUpdated: new Date(),
      aiGenerated: data.aiGenerated || false
    };
    
    this.riskSources.set(riskSource.id, riskSource);
    
    this.logger.info(`Risk source added: ${riskSource.name}`);
    
    return riskSource;
  }

  private async updateRiskSource(id: string, updates: Partial<RiskSource>): Promise<RiskSource> {
    const existing = this.riskSources.get(id);
    if (!existing) {
      throw new Error(`Risk source not found: ${id}`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date()
    };
    
    this.riskSources.set(id, updated);
    
    this.logger.info(`Risk source updated: ${id}`);
    
    return updated;
  }

  private async deleteRiskSource(id: string): Promise<boolean> {
    const deleted = this.riskSources.delete(id);
    
    if (deleted) {
      this.logger.info(`Risk source deleted: ${id}`);
    }
    
    return deleted;
  }

  private async analyzeRiskSource(id: string): Promise<RiskSource> {
    const riskSource = this.riskSources.get(id);
    if (!riskSource) {
      throw new Error(`Risk source not found: ${id}`);
    }
    
    // Enrichissement de l'analyse
    const enrichedSource = {
      ...riskSource,
      confidence: Math.min(riskSource.confidence + 10, 100),
      lastUpdated: new Date()
    };
    
    // Recherche d'incidents historiques
    const incidents = await this.findHistoricalIncidents(riskSource.name);
    enrichedSource.historicalIncidents = incidents;
    
    this.riskSources.set(id, enrichedSource);
    
    this.logger.info(`Risk source analyzed: ${riskSource.name}`);
    
    return enrichedSource;
  }

  private async validateRiskSource(riskSource: RiskSource): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Validation des champs obligatoires
    if (!riskSource.name || riskSource.name.trim().length === 0) {
      results.push({
        id: 'missing_name',
        type: 'compliance',
        status: 'failed',
        message: 'Nom manquant',
        details: 'Le nom de la source de risque est obligatoire',
        severity: 'critical',
        autoFixable: false,
        recommendations: ['Saisir un nom pour la source de risque']
      });
    }
    
    if (!riskSource.description || riskSource.description.length < 10) {
      results.push({
        id: 'insufficient_description',
        type: 'quality',
        status: 'warning',
        message: 'Description insuffisante',
        details: 'La description doit contenir au moins 10 caractères',
        severity: 'medium',
        autoFixable: false,
        recommendations: ['Enrichir la description de la source de risque']
      });
    }
    
    return results;
  }

  private async consolidateRiskSources(sources: RiskSource[]): Promise<RiskSource[]> {
    // Consolidation et déduplication
    const consolidated = new Map<string, RiskSource>();
    
    for (const source of sources) {
      const key = `${source.category}_${source.name.toLowerCase()}`;
      
      if (consolidated.has(key)) {
        // Fusion des sources similaires
        const existing = consolidated.get(key)!;
        consolidated.set(key, {
          ...existing,
          confidence: Math.max(existing.confidence, source.confidence),
          sources: Array.from(new Set([...existing.sources, ...source.sources])),
          historicalIncidents: [...existing.historicalIncidents, ...source.historicalIncidents]
        });
      } else {
        consolidated.set(key, source);
      }
    }
    
    return Array.from(consolidated.values());
  }

  private async findHistoricalIncidents(sourceName: string): Promise<HistoricalIncident[]> {
    // Recherche d'incidents historiques (simulation)
    return [
      {
        id: `incident_${Date.now()}`,
        date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Il y a 1 an
        description: `Incident impliquant ${sourceName}`,
        impact: 'Moyen',
        source: 'CERT-FR',
        relevance: 75
      }
    ];
  }
}