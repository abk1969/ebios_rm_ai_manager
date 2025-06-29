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

    // Tri par pertinence contextuelle
    return suggestions.sort((a, b) => b.contextualRelevance - a.contextualRelevance);
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
    _context: GlobalMissionContext,
    _currentData: any
  ): ContextualSuggestion[] {
    // TODO: Implémenter les suggestions pour l'atelier 3
    return [];
  }

  private generateWorkshop4Suggestions(
    _context: GlobalMissionContext,
    _currentData: any
  ): ContextualSuggestion[] {
    // TODO: Implémenter les suggestions pour l'atelier 4
    return [];
  }

  private generateWorkshop5Suggestions(
    _context: GlobalMissionContext,
    _currentData: any
  ): ContextualSuggestion[] {
    // TODO: Implémenter les suggestions pour l'atelier 5
    return [];
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
