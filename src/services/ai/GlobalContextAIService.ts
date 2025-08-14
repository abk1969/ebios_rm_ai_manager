/**
 * 🎯 SERVICE DE CONTEXTE GLOBAL IA
 * Service orchestrateur qui unifie toutes les suggestions IA avec un contexte global
 * 
 * CARACTÉRISTIQUES :
 * - Agrégation des données de tous les ateliers
 * - Analyse de cohérence inter-ateliers
 * - Suggestions basées sur l'ensemble du contexte
 * - Intégration sans régression avec les services existants
 */

import {
  Mission,
  BusinessValue,
  SupportingAsset,
  DreadedEvent,
  RiskSource,
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure
} from '@/types/ebios';
import { AISuggestion, ValidationResult as _ValidationResult } from '../aiAssistant';
import { getMissionById } from '../firebase/missions';
import { getBusinessValuesByMission } from '../firebase/businessValues';
import { getSupportingAssetsByMission } from '../firebase/supportingAssets';
import { getDreadedEvents } from '../firebase/dreadedEvents';
import { geminiAIService } from './GeminiAIService';

// 🎯 TYPES ET INTERFACES
interface GlobalMissionContext {
  mission: Mission;
  workshop1: {
    businessValues: BusinessValue[];
    supportingAssets: SupportingAsset[];
    dreadedEvents: DreadedEvent[];
  };
  workshop2: {
    riskSources: RiskSource[];
    stakeholders: any[];
  };
  workshop3: {
    strategicScenarios: StrategicScenario[];
  };
  workshop4: {
    operationalScenarios: OperationalScenario[];
  };
  workshop5: {
    securityMeasures: SecurityMeasure[];
  };
  coherenceScore: number;
  lastAnalysis: Date;
}

interface ContextualSuggestion extends AISuggestion {
  contextualRelevance: number; // 0-100
  crossWorkshopImpact: string[];
  coherenceJustification: string;
  globalAlignment: number; // 0-100
}

interface CoherenceAnalysis {
  overallScore: number;
  workshopScores: Record<number, number>;
  inconsistencies: string[];
  recommendations: string[];
  missingLinks: string[];
}

// 🎯 SERVICE PRINCIPAL
class GlobalContextAIService {
  private static instance: GlobalContextAIService;
  private contextCache: Map<string, GlobalMissionContext> = new Map();
  private cacheExpiry: Map<string, Date> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): GlobalContextAIService {
    if (!GlobalContextAIService.instance) {
      GlobalContextAIService.instance = new GlobalContextAIService();
    }
    return GlobalContextAIService.instance;
  }

  // 🎯 MÉTHODES PRINCIPALES

  /**
   * Obtient le contexte global d'une mission avec cache intelligent
   */
  async getGlobalContext(missionId: string): Promise<GlobalMissionContext | null> {
    // Vérification du cache
    const cached = this.contextCache.get(missionId);
    const expiry = this.cacheExpiry.get(missionId);
    
    if (cached && expiry && expiry > new Date()) {
      return cached;
    }

    try {
      // Chargement des données de tous les ateliers
      const [mission, businessValues, supportingAssets, dreadedEvents] = await Promise.all([
        getMissionById(missionId),
        getBusinessValuesByMission(missionId),
        getSupportingAssetsByMission(missionId),
        getDreadedEvents(missionId)
      ]);

      if (!mission) {
        console.warn('🚨 Mission non trouvée:', missionId);
        return null;
      }

      // Construction du contexte global
      const globalContext: GlobalMissionContext = {
        mission,
        workshop1: {
          businessValues,
          supportingAssets,
          dreadedEvents
        },
        workshop2: {
          riskSources: [], // TODO: Charger depuis Firebase
          stakeholders: []
        },
        workshop3: {
          strategicScenarios: []
        },
        workshop4: {
          operationalScenarios: []
        },
        workshop5: {
          securityMeasures: []
        },
        coherenceScore: this.calculateCoherenceScore(businessValues, supportingAssets, dreadedEvents),
        lastAnalysis: new Date()
      };

      // Mise en cache
      this.contextCache.set(missionId, globalContext);
      this.cacheExpiry.set(missionId, new Date(Date.now() + this.CACHE_DURATION));

      return globalContext;
    } catch (error) {
      console.error('🚨 Erreur lors du chargement du contexte global:', error);
      return null;
    }
  }

  /**
   * Génère des suggestions contextuelles intelligentes
   */
  async generateContextualSuggestions(
    missionId: string,
    currentWorkshop: number,
    currentData: any
  ): Promise<ContextualSuggestion[]> {
    const globalContext = await this.getGlobalContext(missionId);
    if (!globalContext) {
      return [];
    }

    const suggestions: ContextualSuggestion[] = [];

    // Analyse selon l'atelier actuel
    switch (currentWorkshop) {
      case 1:
        suggestions.push(...this.generateWorkshop1Suggestions(globalContext, currentData));
        break;
      case 2:
        suggestions.push(...this.generateWorkshop2Suggestions(globalContext, currentData));
        break;
      case 3:
        suggestions.push(...this.generateWorkshop3Suggestions(globalContext, currentData));
        break;
      case 4:
        suggestions.push(...this.generateWorkshop4Suggestions(globalContext, currentData));
        break;
      case 5:
        suggestions.push(...this.generateWorkshop5Suggestions(globalContext, currentData));
        break;
    }

    // 🤖 INTÉGRATION GEMINI FLASH 2.5
    if (geminiAIService.isAvailable()) {
      try {
        const geminiSuggestions = await this.generateGeminiSuggestions(
          globalContext,
          currentWorkshop,
          currentData
        );
        suggestions.push(...geminiSuggestions);
      } catch (error) {
        console.warn('⚠️ Erreur suggestions Gemini, fallback vers suggestions locales:', error);
      }
    }

    // Tri par pertinence contextuelle
    return suggestions.sort((a, b) => b.contextualRelevance - a.contextualRelevance);
  }

  /**
   * 🤖 Génère des suggestions avec Gemini Flash 2.5
   */
  private async generateGeminiSuggestions(
    globalContext: GlobalMissionContext,
    currentWorkshop: number,
    currentData: any
  ): Promise<ContextualSuggestion[]> {
    try {
      const workshopTypes = {
        1: 'business_values' as const,
        2: 'risk_sources' as const,
        3: 'strategic_scenarios' as const,
        4: 'operational_scenarios' as const,
        5: 'security_measures' as const
      };

      const response = await geminiAIService.generateSuggestions({
        type: workshopTypes[currentWorkshop as keyof typeof workshopTypes] || 'business_values',
        workshop: currentWorkshop as 1 | 2 | 3 | 4 | 5,
        missionId: globalContext.mission.id,
        context: {
          organization: globalContext.mission.organization,
          sector: globalContext.mission.sector,
          existingData: globalContext,
          userProfile: undefined
        },
        currentData,
        maxSuggestions: 3
      });

      if (response.success) {
        // Convertir les suggestions Gemini en ContextualSuggestion
        return response.suggestions.map(suggestion => ({
          id: suggestion.id,
          type: suggestion.type as 'suggestion' | 'warning' | 'best-practice' | 'optimization',
          priority: suggestion.priority as 'critical' | 'high' | 'medium' | 'low',
          category: `workshop${currentWorkshop}`,
          title: suggestion.title,
          description: suggestion.description,
          actionText: suggestion.actionText,
          confidence: suggestion.confidence,
          relevance: suggestion.relevance,
          source: 'gemini-flash-2.5',
          context: suggestion.context,
          contextualRelevance: suggestion.relevance,
          missionAlignment: Math.round(suggestion.confidence * 100),
          sectorSpecific: true,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['EBIOS-RM', 'ANSSI'],
          crossWorkshopImpact: [],
          implementationPriority: 'short-term' as const,
          coherenceJustification: `Suggestion générée par Gemini Flash 2.5 basée sur l'analyse contextuelle`,
          globalAlignment: Math.round((suggestion.confidence + suggestion.relevance / 100) * 50),
          createdAt: suggestion.createdAt,
          appliedAt: undefined,
          isApplied: false
        }));
      }

      return [];
    } catch (error) {
      console.error('❌ Erreur génération suggestions Gemini:', error);
      return [];
    }
  }

  /**
   * Analyse la cohérence inter-ateliers
   */
  async analyzeCoherence(missionId: string): Promise<CoherenceAnalysis> {
    const globalContext = await this.getGlobalContext(missionId);
    if (!globalContext) {
      return {
        overallScore: 0,
        workshopScores: {},
        inconsistencies: ['Impossible de charger le contexte global'],
        recommendations: [],
        missingLinks: []
      };
    }

    const analysis: CoherenceAnalysis = {
      overallScore: globalContext.coherenceScore,
      workshopScores: {
        1: this.analyzeWorkshop1Coherence(globalContext),
        2: this.analyzeWorkshop2Coherence(globalContext),
        3: this.analyzeWorkshop3Coherence(globalContext),
        4: this.analyzeWorkshop4Coherence(globalContext),
        5: this.analyzeWorkshop5Coherence(globalContext)
      },
      inconsistencies: this.detectInconsistencies(globalContext),
      recommendations: this.generateCoherenceRecommendations(globalContext),
      missingLinks: this.detectMissingLinks(globalContext)
    };

    return analysis;
  }

  // 🎯 MÉTHODES PRIVÉES - GÉNÉRATION DE SUGGESTIONS

  private generateWorkshop1Suggestions(
    context: GlobalMissionContext,
    _currentData: any
  ): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const { businessValues, supportingAssets, dreadedEvents: _dreadedEvents } = context.workshop1;

    // Suggestion basée sur le contexte organisationnel
    if (context.mission.missionContext?.sector) {
      const sectorSpecificValues = this.getSectorSpecificBusinessValues(context.mission.missionContext.sector);
      const existingCategories = new Set(businessValues.map(v => v.category));
      
      sectorSpecificValues.forEach(value => {
        if (!existingCategories.has(value.category)) {
          suggestions.push({
            id: `contextual-bv-${Date.now()}-${Math.random()}`,
            type: 'suggestion',
            title: `Valeur métier recommandée : ${value.name}`,
            description: `Basé sur votre secteur (${context.mission.missionContext?.sector}), cette valeur métier est généralement critique.`,
            priority: 'medium',
            category: 'business-value',
            source: 'expert-knowledge',
            contextualRelevance: 85,
            crossWorkshopImpact: ['workshop2', 'workshop3'],
            coherenceJustification: `Aligné avec le secteur ${context.mission.missionContext?.sector}`,
            globalAlignment: 90,
            relatedData: value
          });
        }
      });
    }

    // Suggestion de cohérence actifs-valeurs
    const orphanAssets = supportingAssets.filter(asset => 
      !businessValues.some(value => value.id === asset.businessValueId)
    );
    
    if (orphanAssets.length > 0) {
      suggestions.push({
        id: `coherence-assets-${Date.now()}`,
        type: 'warning',
        title: 'Actifs supports non liés',
        description: `${orphanAssets.length} actif(s) support(s) ne sont pas liés à des valeurs métier.`,
        priority: 'high',
        category: 'coherence',
        source: 'ebios-rm',
        contextualRelevance: 95,
        crossWorkshopImpact: ['workshop2'],
        coherenceJustification: 'Nécessaire pour la cohérence EBIOS RM',
        globalAlignment: 100,
        actionText: 'Lier aux valeurs métier'
      });
    }

    return suggestions;
  }

  private generateWorkshop2Suggestions(
    context: GlobalMissionContext,
    _currentData: any
  ): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    
    // Suggestions basées sur les valeurs métier de l'atelier 1
    const { businessValues } = context.workshop1;
    
    if (businessValues.length > 0) {
      suggestions.push({
        id: `w2-context-${Date.now()}`,
        type: 'suggestion',
        title: 'Sources de risque basées sur vos valeurs métier',
        description: `Identifiez des sources de risque spécifiques à vos ${businessValues.length} valeur(s) métier définies.`,
        priority: 'high',
        category: 'risk-source',
        source: 'ebios-rm',
        contextualRelevance: 90,
        crossWorkshopImpact: ['workshop1', 'workshop3'],
        coherenceJustification: 'Continuité logique depuis l\'atelier 1',
        globalAlignment: 95
      });
    }

    return suggestions;
  }

  private generateWorkshop3Suggestions(
    context: GlobalMissionContext,
    currentData: any
  ): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const { strategicScenarios } = context.workshop3;
    const { businessValues } = context.workshop1;
    const { riskSources } = context.workshop2;

    // Suggestion 1: Créer des scénarios basés sur les valeurs métier critiques
    if (businessValues.length > 0 && strategicScenarios.length < businessValues.length) {
      const criticalBusinessValues = businessValues.filter(bv =>
        bv.criticalityLevel === 'high' || bv.criticalityLevel === 'critical'
      );

      if (criticalBusinessValues.length > 0) {
        suggestions.push({
          id: `w3_strategic_scenarios_${Date.now()}`,
          type: 'suggestion',
          priority: 'high',
          category: 'strategic-scenarios',
          title: 'Créer des scénarios stratégiques pour les valeurs métier critiques',
          description: `Vous avez ${criticalBusinessValues.length} valeur(s) métier critique(s). Créez des scénarios stratégiques pour chacune d'elles.`,
          actionText: 'Générer des scénarios',
          confidence: 0.9,
          relevance: 95,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 3,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { businessValues: criticalBusinessValues }
          },
          contextualRelevance: 95,
          missionAlignment: 90,
          sectorSpecific: true,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ANSSI', 'ISO27005'],
          crossWorkshopImpact: ['workshop1', 'workshop4'],
          implementationPriority: 'immediate',
          coherenceJustification: 'Alignement direct avec les valeurs métier critiques identifiées',
          globalAlignment: 92,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 2: Analyser la cohérence avec les sources de risques
    if (riskSources.length > 0 && strategicScenarios.length > 0) {
      const uncoveredRiskSources = riskSources.filter(rs =>
        !strategicScenarios.some(ss => ss.riskSourceIds?.includes(rs.id))
      );

      if (uncoveredRiskSources.length > 0) {
        suggestions.push({
          id: `w3_risk_coverage_${Date.now()}`,
          type: 'warning',
          priority: 'medium',
          category: 'strategic-scenarios',
          title: 'Sources de risques non couvertes par les scénarios',
          description: `${uncoveredRiskSources.length} source(s) de risque ne sont pas couvertes par vos scénarios stratégiques.`,
          actionText: 'Réviser la couverture',
          confidence: 0.85,
          relevance: 88,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 3,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { uncoveredRiskSources }
          },
          contextualRelevance: 88,
          missionAlignment: 85,
          sectorSpecific: false,
          organizationSizeRelevant: false,
          regulatoryCompliance: ['EBIOS-RM'],
          crossWorkshopImpact: ['workshop2'],
          implementationPriority: 'short-term',
          coherenceJustification: 'Assurer la couverture complète des sources de risques',
          globalAlignment: 87,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 3: Évaluation des niveaux de risque
    if (strategicScenarios.length > 0) {
      const unassessedScenarios = strategicScenarios.filter(ss =>
        !ss.riskLevel || ss.riskLevel === 'unknown'
      );

      if (unassessedScenarios.length > 0) {
        suggestions.push({
          id: `w3_risk_assessment_${Date.now()}`,
          type: 'best-practice',
          priority: 'medium',
          category: 'strategic-scenarios',
          title: 'Évaluer les niveaux de risque des scénarios',
          description: `${unassessedScenarios.length} scénario(s) n'ont pas de niveau de risque défini.`,
          actionText: 'Évaluer les risques',
          confidence: 0.8,
          relevance: 82,
          source: 'anssi',
          context: {
            missionId: context.mission.id,
            workshopNumber: 3,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { unassessedScenarios }
          },
          contextualRelevance: 82,
          missionAlignment: 80,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ANSSI', 'ISO27005'],
          crossWorkshopImpact: ['workshop4', 'workshop5'],
          implementationPriority: 'medium-term',
          coherenceJustification: 'Nécessaire pour prioriser les mesures de sécurité',
          globalAlignment: 81,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    return suggestions;
  }

  private generateWorkshop4Suggestions(
    context: GlobalMissionContext,
    currentData: any
  ): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const { operationalScenarios } = context.workshop4;
    const { strategicScenarios } = context.workshop3;
    const { supportingAssets } = context.workshop1;

    // Suggestion 1: Décliner les scénarios stratégiques en opérationnels
    if (strategicScenarios.length > 0 && operationalScenarios.length < strategicScenarios.length * 2) {
      const highRiskStrategicScenarios = strategicScenarios.filter(ss =>
        ss.riskLevel === 'high' || ss.riskLevel === 'critical'
      );

      if (highRiskStrategicScenarios.length > 0) {
        suggestions.push({
          id: `w4_operational_scenarios_${Date.now()}`,
          type: 'suggestion',
          priority: 'high',
          category: 'operational-scenarios',
          title: 'Décliner les scénarios stratégiques en scénarios opérationnels',
          description: `Vous avez ${highRiskStrategicScenarios.length} scénario(s) stratégique(s) à risque élevé. Créez 2-3 scénarios opérationnels pour chacun.`,
          actionText: 'Créer des scénarios opérationnels',
          confidence: 0.92,
          relevance: 94,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 4,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { strategicScenarios: highRiskStrategicScenarios }
          },
          contextualRelevance: 94,
          missionAlignment: 92,
          sectorSpecific: true,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['EBIOS-RM', 'ANSSI'],
          crossWorkshopImpact: ['workshop3', 'workshop5'],
          implementationPriority: 'immediate',
          coherenceJustification: 'Déclinaison logique des scénarios stratégiques',
          globalAlignment: 93,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 2: Analyser les chemins d'attaque sur les actifs supports
    if (supportingAssets.length > 0 && operationalScenarios.length > 0) {
      const criticalSupportingAssets = supportingAssets.filter(sa =>
        sa.criticalityLevel === 'high' || sa.criticalityLevel === 'critical'
      );

      const uncoveredAssets = criticalSupportingAssets.filter(asset =>
        !operationalScenarios.some(os => os.supportingAssetIds?.includes(asset.id))
      );

      if (uncoveredAssets.length > 0) {
        suggestions.push({
          id: `w4_asset_coverage_${Date.now()}`,
          type: 'warning',
          priority: 'medium',
          category: 'operational-scenarios',
          title: 'Actifs supports critiques non couverts',
          description: `${uncoveredAssets.length} actif(s) support(s) critique(s) ne sont pas couverts par les scénarios opérationnels.`,
          actionText: 'Analyser les chemins d\'attaque',
          confidence: 0.87,
          relevance: 89,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 4,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { uncoveredAssets }
          },
          contextualRelevance: 89,
          missionAlignment: 86,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['EBIOS-RM'],
          crossWorkshopImpact: ['workshop1'],
          implementationPriority: 'short-term',
          coherenceJustification: 'Assurer la couverture des actifs critiques',
          globalAlignment: 88,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 3: Évaluer la vraisemblance et l'impact
    if (operationalScenarios.length > 0) {
      const unassessedScenarios = operationalScenarios.filter(os =>
        !os.likelihood || !os.impact || os.likelihood === 'unknown' || os.impact === 'unknown'
      );

      if (unassessedScenarios.length > 0) {
        suggestions.push({
          id: `w4_scenario_assessment_${Date.now()}`,
          type: 'best-practice',
          priority: 'medium',
          category: 'operational-scenarios',
          title: 'Évaluer la vraisemblance et l\'impact des scénarios',
          description: `${unassessedScenarios.length} scénario(s) opérationnel(s) nécessitent une évaluation de vraisemblance et d'impact.`,
          actionText: 'Évaluer vraisemblance/impact',
          confidence: 0.83,
          relevance: 85,
          source: 'iso27005',
          context: {
            missionId: context.mission.id,
            workshopNumber: 4,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { unassessedScenarios }
          },
          contextualRelevance: 85,
          missionAlignment: 82,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ISO27005', 'ANSSI'],
          crossWorkshopImpact: ['workshop5'],
          implementationPriority: 'medium-term',
          coherenceJustification: 'Nécessaire pour prioriser les mesures de traitement',
          globalAlignment: 84,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 4: Vérifier la cohérence avec les scénarios stratégiques
    if (strategicScenarios.length > 0 && operationalScenarios.length > 0) {
      const orphanOperationalScenarios = operationalScenarios.filter(os =>
        !os.strategicScenarioIds || os.strategicScenarioIds.length === 0
      );

      if (orphanOperationalScenarios.length > 0) {
        suggestions.push({
          id: `w4_coherence_check_${Date.now()}`,
          type: 'optimization',
          priority: 'low',
          category: 'coherence',
          title: 'Lier les scénarios opérationnels aux scénarios stratégiques',
          description: `${orphanOperationalScenarios.length} scénario(s) opérationnel(s) ne sont pas liés à des scénarios stratégiques.`,
          actionText: 'Vérifier les liens',
          confidence: 0.78,
          relevance: 80,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 4,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { orphanOperationalScenarios }
          },
          contextualRelevance: 80,
          missionAlignment: 85,
          sectorSpecific: false,
          organizationSizeRelevant: false,
          regulatoryCompliance: ['EBIOS-RM'],
          crossWorkshopImpact: ['workshop3'],
          implementationPriority: 'long-term',
          coherenceJustification: 'Maintenir la traçabilité entre ateliers',
          globalAlignment: 82,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    return suggestions;
  }

  private generateWorkshop5Suggestions(
    context: GlobalMissionContext,
    currentData: any
  ): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const { securityMeasures } = context.workshop5;
    const { operationalScenarios } = context.workshop4;
    const { strategicScenarios } = context.workshop3;

    // Suggestion 1: Proposer des mesures pour les scénarios à risque élevé
    if (operationalScenarios.length > 0) {
      const highRiskScenarios = operationalScenarios.filter(os =>
        (os.likelihood === 'high' || os.likelihood === 'very_high') &&
        (os.impact === 'high' || os.impact === 'very_high')
      );

      const uncoveredHighRiskScenarios = highRiskScenarios.filter(scenario =>
        !securityMeasures.some(sm => sm.scenarioIds?.includes(scenario.id))
      );

      if (uncoveredHighRiskScenarios.length > 0) {
        suggestions.push({
          id: `w5_high_risk_measures_${Date.now()}`,
          type: 'suggestion',
          priority: 'critical',
          category: 'security-measures',
          title: 'Définir des mesures pour les scénarios à risque élevé',
          description: `${uncoveredHighRiskScenarios.length} scénario(s) à risque élevé n'ont pas de mesures de sécurité associées.`,
          actionText: 'Créer des mesures de sécurité',
          confidence: 0.95,
          relevance: 98,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 5,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { uncoveredHighRiskScenarios }
          },
          contextualRelevance: 98,
          missionAlignment: 95,
          sectorSpecific: true,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['EBIOS-RM', 'ANSSI', 'ISO27001'],
          crossWorkshopImpact: ['workshop4'],
          implementationPriority: 'immediate',
          coherenceJustification: 'Traitement obligatoire des risques élevés',
          globalAlignment: 97,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 2: Équilibrer les types de mesures (préventives, protectives, correctives)
    if (securityMeasures.length > 0) {
      const measuresByType = {
        preventive: securityMeasures.filter(sm => sm.type === 'preventive').length,
        protective: securityMeasures.filter(sm => sm.type === 'protective').length,
        corrective: securityMeasures.filter(sm => sm.type === 'corrective').length,
        detective: securityMeasures.filter(sm => sm.type === 'detective').length
      };

      const totalMeasures = securityMeasures.length;
      const imbalancedTypes = Object.entries(measuresByType).filter(([type, count]) =>
        count / totalMeasures < 0.1 // Moins de 10% du total
      );

      if (imbalancedTypes.length > 0) {
        suggestions.push({
          id: `w5_measure_balance_${Date.now()}`,
          type: 'best-practice',
          priority: 'medium',
          category: 'security-measures',
          title: 'Équilibrer les types de mesures de sécurité',
          description: `Votre plan de traitement manque de mesures ${imbalancedTypes.map(([type]) => type).join(', ')}. Considérez un équilibre entre préventif, protectif, correctif et détectif.`,
          actionText: 'Diversifier les mesures',
          confidence: 0.82,
          relevance: 84,
          source: 'iso27001',
          context: {
            missionId: context.mission.id,
            workshopNumber: 5,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { measuresByType, imbalancedTypes }
          },
          contextualRelevance: 84,
          missionAlignment: 80,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ISO27001', 'ANSSI'],
          crossWorkshopImpact: [],
          implementationPriority: 'medium-term',
          coherenceJustification: 'Défense en profondeur recommandée',
          globalAlignment: 82,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 3: Évaluer l'efficacité et le coût des mesures
    if (securityMeasures.length > 0) {
      const unassessedMeasures = securityMeasures.filter(sm =>
        !sm.effectiveness || !sm.cost || sm.effectiveness === 'unknown' || sm.cost === 'unknown'
      );

      if (unassessedMeasures.length > 0) {
        suggestions.push({
          id: `w5_measure_assessment_${Date.now()}`,
          type: 'optimization',
          priority: 'medium',
          category: 'security-measures',
          title: 'Évaluer l\'efficacité et le coût des mesures',
          description: `${unassessedMeasures.length} mesure(s) nécessitent une évaluation d'efficacité et de coût.`,
          actionText: 'Évaluer efficacité/coût',
          confidence: 0.85,
          relevance: 87,
          source: 'iso27005',
          context: {
            missionId: context.mission.id,
            workshopNumber: 5,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { unassessedMeasures }
          },
          contextualRelevance: 87,
          missionAlignment: 84,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ISO27005'],
          crossWorkshopImpact: [],
          implementationPriority: 'medium-term',
          coherenceJustification: 'Optimisation du retour sur investissement sécurité',
          globalAlignment: 85,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 4: Planifier la mise en œuvre
    if (securityMeasures.length > 0) {
      const unplannedMeasures = securityMeasures.filter(sm =>
        !sm.implementationPriority || !sm.timeline || sm.implementationPriority === 'unknown'
      );

      if (unplannedMeasures.length > 0) {
        suggestions.push({
          id: `w5_implementation_planning_${Date.now()}`,
          type: 'best-practice',
          priority: 'medium',
          category: 'security-measures',
          title: 'Planifier la mise en œuvre des mesures',
          description: `${unplannedMeasures.length} mesure(s) nécessitent une planification de mise en œuvre.`,
          actionText: 'Planifier la mise en œuvre',
          confidence: 0.88,
          relevance: 90,
          source: 'anssi',
          context: {
            missionId: context.mission.id,
            workshopNumber: 5,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { unplannedMeasures }
          },
          contextualRelevance: 90,
          missionAlignment: 88,
          sectorSpecific: false,
          organizationSizeRelevant: true,
          regulatoryCompliance: ['ANSSI', 'ISO27001'],
          crossWorkshopImpact: [],
          implementationPriority: 'short-term',
          coherenceJustification: 'Passage à l\'action nécessaire',
          globalAlignment: 89,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    // Suggestion 5: Vérifier la couverture globale
    if (strategicScenarios.length > 0 && securityMeasures.length > 0) {
      const criticalStrategicScenarios = strategicScenarios.filter(ss =>
        ss.riskLevel === 'critical'
      );

      const uncoveredCriticalScenarios = criticalStrategicScenarios.filter(scenario =>
        !securityMeasures.some(sm =>
          sm.scenarioIds?.includes(scenario.id) ||
          operationalScenarios.some(os =>
            os.strategicScenarioIds?.includes(scenario.id) &&
            sm.scenarioIds?.includes(os.id)
          )
        )
      );

      if (uncoveredCriticalScenarios.length > 0) {
        suggestions.push({
          id: `w5_critical_coverage_${Date.now()}`,
          type: 'warning',
          priority: 'high',
          category: 'security-measures',
          title: 'Scénarios critiques non couverts',
          description: `${uncoveredCriticalScenarios.length} scénario(s) stratégique(s) critique(s) ne sont pas couverts par des mesures de sécurité.`,
          actionText: 'Couvrir les scénarios critiques',
          confidence: 0.93,
          relevance: 96,
          source: 'ebios-rm',
          context: {
            missionId: context.mission.id,
            workshopNumber: 5,
            userProfile: undefined,
            organizationContext: undefined,
            existingData: currentData,
            crossWorkshopData: { uncoveredCriticalScenarios }
          },
          contextualRelevance: 96,
          missionAlignment: 94,
          sectorSpecific: true,
          organizationSizeRelevant: false,
          regulatoryCompliance: ['EBIOS-RM'],
          crossWorkshopImpact: ['workshop3', 'workshop4'],
          implementationPriority: 'immediate',
          coherenceJustification: 'Traitement obligatoire des risques critiques',
          globalAlignment: 95,
          createdAt: new Date().toISOString(),
          appliedAt: undefined,
          isApplied: false
        });
      }
    }

    return suggestions;
  }

  // 🎯 MÉTHODES PRIVÉES - ANALYSE DE COHÉRENCE

  private calculateCoherenceScore(
    businessValues: BusinessValue[],
    supportingAssets: SupportingAsset[],
    dreadedEvents: DreadedEvent[]
  ): number {
    let score = 100;

    // Pénalité pour actifs non liés
    const orphanAssets = supportingAssets.filter(asset => 
      !businessValues.some(value => value.id === asset.businessValueId)
    );
    score -= orphanAssets.length * 10;

    // Pénalité pour événements non liés
    const orphanEvents = dreadedEvents.filter(event => 
      !businessValues.some(value => value.id === event.businessValueId)
    );
    score -= orphanEvents.length * 15;

    return Math.max(0, score);
  }

  private analyzeWorkshop1Coherence(context: GlobalMissionContext): number {
    return this.calculateCoherenceScore(
      context.workshop1.businessValues,
      context.workshop1.supportingAssets,
      context.workshop1.dreadedEvents
    );
  }

  private analyzeWorkshop2Coherence(_context: GlobalMissionContext): number {
    // TODO: Implémenter l'analyse de cohérence pour l'atelier 2
    return 80;
  }

  private analyzeWorkshop3Coherence(_context: GlobalMissionContext): number {
    // TODO: Implémenter l'analyse de cohérence pour l'atelier 3
    return 80;
  }

  private analyzeWorkshop4Coherence(_context: GlobalMissionContext): number {
    // TODO: Implémenter l'analyse de cohérence pour l'atelier 4
    return 80;
  }

  private analyzeWorkshop5Coherence(_context: GlobalMissionContext): number {
    // TODO: Implémenter l'analyse de cohérence pour l'atelier 5
    return 80;
  }

  private detectInconsistencies(context: GlobalMissionContext): string[] {
    const inconsistencies: string[] = [];

    // Détection d'incohérences entre ateliers
    const { businessValues, supportingAssets, dreadedEvents } = context.workshop1;

    if (supportingAssets.length > 0 && businessValues.length === 0) {
      inconsistencies.push('Actifs supports définis sans valeurs métier');
    }

    if (dreadedEvents.length > 0 && businessValues.length === 0) {
      inconsistencies.push('Événements redoutés définis sans valeurs métier');
    }

    return inconsistencies;
  }

  private generateCoherenceRecommendations(context: GlobalMissionContext): string[] {
    const recommendations: string[] = [];

    if (context.workshop1.businessValues.length < 3) {
      recommendations.push('Définir au moins 3 valeurs métier pour une analyse complète');
    }

    if (context.coherenceScore < 70) {
      recommendations.push('Réviser les liens entre valeurs métier, actifs et événements');
    }

    return recommendations;
  }

  private detectMissingLinks(context: GlobalMissionContext): string[] {
    const missingLinks: string[] = [];

    // Détection de liens manquants
    const { businessValues, supportingAssets, dreadedEvents } = context.workshop1;

    businessValues.forEach(value => {
      const hasAssets = supportingAssets.some(asset => asset.businessValueId === value.id);
      const hasEvents = dreadedEvents.some(event => event.businessValueId === value.id);

      if (!hasAssets) {
        missingLinks.push(`Valeur métier "${value.name}" sans actifs supports`);
      }
      if (!hasEvents) {
        missingLinks.push(`Valeur métier "${value.name}" sans événements redoutés`);
      }
    });

    return missingLinks;
  }

  private getSectorSpecificBusinessValues(sector: string): Array<{name: string, category: string}> {
    const sectorValues: Record<string, Array<{name: string, category: string}>> = {
      'healthcare': [
        { name: 'Continuité des soins', category: 'operational' },
        { name: 'Confidentialité des données patients', category: 'data' },
        { name: 'Réputation médicale', category: 'reputation' }
      ],
      'finance': [
        { name: 'Intégrité des transactions', category: 'financial' },
        { name: 'Conformité réglementaire', category: 'compliance' },
        { name: 'Confiance des clients', category: 'reputation' }
      ],
      'education': [
        { name: 'Continuité pédagogique', category: 'operational' },
        { name: 'Protection des données étudiants', category: 'data' },
        { name: 'Réputation académique', category: 'reputation' }
      ]
    };

    return sectorValues[sector] || [];
  }

  // 🎯 MÉTHODES UTILITAIRES

  /**
   * Invalide le cache pour une mission
   */
  invalidateCache(missionId: string): void {
    this.contextCache.delete(missionId);
    this.cacheExpiry.delete(missionId);
  }

  /**
   * Nettoie le cache expiré
   */
  cleanExpiredCache(): void {
    const now = new Date();
    for (const [missionId, expiry] of this.cacheExpiry.entries()) {
      if (expiry <= now) {
        this.contextCache.delete(missionId);
        this.cacheExpiry.delete(missionId);
      }
    }
  }
}

export default GlobalContextAIService;
export { GlobalContextAIService, type ContextualSuggestion, type CoherenceAnalysis };
