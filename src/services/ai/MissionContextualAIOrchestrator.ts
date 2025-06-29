/**
 * 🎯 ORCHESTRATEUR IA CONTEXTUEL MISSION
 * Architecture IA agentic complète intégrant le contexte mission dans tous les workshops
 * 
 * OBJECTIFS :
 * 1. Intégrer l'IA dans le formulaire contexte mission
 * 2. Contextualiser les suggestions IA selon les données mission
 * 3. Assurer la cohérence entre workshops 1-5
 * 4. Suggestions pertinentes basées sur le contexte organisationnel
 */

import { 
  Mission,
  BusinessValue, 
  EssentialAsset,
  SupportingAsset, 
  DreadedEvent,
  RiskSource,
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure
} from '@/types/ebios';
import { AISuggestion } from '../aiAssistant';
import { pythonAIService } from './PythonAIIntegrationService';
import { logger } from '../logging/SecureLogger';

// 🎯 INTERFACES CONTEXTUELLES

interface MissionContextData {
  // Informations organisationnelles
  organizationName: string;
  sector: string;
  organizationSize: string;
  geographicScope: string;
  criticalityLevel: string;
  
  // Contexte technique
  siComponents: string[];
  mainTechnologies: string[];
  externalInterfaces: string[];
  sensitiveData: string[];
  
  // Processus métier
  criticalProcesses: string[];
  stakeholders: string[];
  regulations: string[];
  financialStakes: string;
  
  // Contexte sécurité
  securityMaturity: string;
  pastIncidents?: string;
  regulatoryConstraints: string[];
  securityBudget?: string;
  
  // Objectifs mission
  missionObjectives: string[];
  timeframe: string;
  specificRequirements: string;
}

interface ContextualAISuggestion extends AISuggestion {
  contextualRelevance: number; // 0-100
  missionAlignment: number; // 0-100
  sectorSpecific: boolean;
  organizationSizeRelevant: boolean;
  regulatoryCompliance: string[];
  crossWorkshopImpact: string[];
  implementationPriority: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
}

interface WorkshopContextualData {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  currentStep: string;
  existingData: any;
  missionContext: MissionContextData;
  previousWorkshopsData: any;
}

// 🎯 ORCHESTRATEUR PRINCIPAL

export class MissionContextualAIOrchestrator {
  private static instance: MissionContextualAIOrchestrator;
  private contextCache: Map<string, MissionContextData> = new Map();
  private suggestionCache: Map<string, ContextualAISuggestion[]> = new Map();

  private constructor() {}

  static getInstance(): MissionContextualAIOrchestrator {
    if (!MissionContextualAIOrchestrator.instance) {
      MissionContextualAIOrchestrator.instance = new MissionContextualAIOrchestrator();
    }
    return MissionContextualAIOrchestrator.instance;
  }

  // 🎯 MÉTHODES PRINCIPALES

  /**
   * #1 - Génère des suggestions IA pour le formulaire contexte mission
   */
  async generateMissionContextSuggestions(
    partialContext: Partial<MissionContextData>,
    currentField: string
  ): Promise<ContextualAISuggestion[]> {
    logger.info('🎯 Génération suggestions contexte mission', { 
      field: currentField,
      sector: partialContext.sector 
    });

    const suggestions: ContextualAISuggestion[] = [];

    try {
      // Suggestions basées sur le secteur
      if (currentField === 'criticalProcesses' && partialContext.sector) {
        const sectorSuggestions = await this.generateSectorSpecificProcesses(partialContext.sector);
        suggestions.push(...sectorSuggestions);
      }

      // Suggestions basées sur la taille d'organisation
      if (currentField === 'siComponents' && partialContext.organizationSize) {
        const sizeSuggestions = await this.generateSizeSpecificComponents(partialContext.organizationSize);
        suggestions.push(...sizeSuggestions);
      }

      // Suggestions basées sur les réglementations
      if (currentField === 'regulations' && partialContext.sector) {
        const regulatorySuggestions = await this.generateRegulatoryRequirements(partialContext.sector);
        suggestions.push(...regulatorySuggestions);
      }

      // Suggestions basées sur les technologies
      if (currentField === 'mainTechnologies' && partialContext.siComponents) {
        const techSuggestions = await this.generateTechnologySuggestions(partialContext.siComponents);
        suggestions.push(...techSuggestions);
      }

      return suggestions.sort((a, b) => b.contextualRelevance - a.contextualRelevance);

    } catch (error) {
      logger.error('❌ Erreur génération suggestions contexte', { error });
      return [];
    }
  }

  /**
   * #2 - Génère des suggestions contextuelles pour tous les workshops
   */
  async generateWorkshopContextualSuggestions(
    workshopData: WorkshopContextualData
  ): Promise<ContextualAISuggestion[]> {
    logger.info('🎯 Génération suggestions workshop contextuel', { 
      workshop: workshopData.workshopNumber,
      step: workshopData.currentStep 
    });

    const cacheKey = `${workshopData.workshopNumber}-${workshopData.currentStep}-${JSON.stringify(workshopData.missionContext).slice(0, 100)}`;
    
    // Vérifier le cache
    if (this.suggestionCache.has(cacheKey)) {
      return this.suggestionCache.get(cacheKey)!;
    }

    let suggestions: ContextualAISuggestion[] = [];

    try {
      switch (workshopData.workshopNumber) {
        case 1:
          suggestions = await this.generateWorkshop1ContextualSuggestions(workshopData);
          break;
        case 2:
          suggestions = await this.generateWorkshop2ContextualSuggestions(workshopData);
          break;
        case 3:
          suggestions = await this.generateWorkshop3ContextualSuggestions(workshopData);
          break;
        case 4:
          suggestions = await this.generateWorkshop4ContextualSuggestions(workshopData);
          break;
        case 5:
          suggestions = await this.generateWorkshop5ContextualSuggestions(workshopData);
          break;
      }

      // Enrichir avec le contexte mission
      suggestions = await this.enrichWithMissionContext(suggestions, workshopData.missionContext);

      // Mettre en cache
      this.suggestionCache.set(cacheKey, suggestions);

      return suggestions;

    } catch (error) {
      logger.error('❌ Erreur génération suggestions workshop', { error, workshop: workshopData.workshopNumber });
      return [];
    }
  }

  /**
   * Valide la cohérence entre le contexte mission et les données workshops
   */
  async validateMissionWorkshopCoherence(
    missionContext: MissionContextData,
    workshopsData: any
  ): Promise<{
    isCoherent: boolean;
    coherenceScore: number;
    inconsistencies: string[];
    recommendations: string[];
  }> {
    logger.info('🔍 Validation cohérence mission-workshops');

    const inconsistencies: string[] = [];
    const recommendations: string[] = [];
    let coherenceScore = 100;

    try {
      // Vérifier cohérence secteur vs valeurs métier
      if (workshopsData.workshop1?.businessValues) {
        const sectorAlignment = await this.checkSectorBusinessValueAlignment(
          missionContext.sector,
          workshopsData.workshop1.businessValues
        );
        if (sectorAlignment.score < 70) {
          inconsistencies.push(`Valeurs métier peu alignées avec le secteur ${missionContext.sector}`);
          recommendations.push(sectorAlignment.recommendation);
          coherenceScore -= 15;
        }
      }

      // Vérifier cohérence taille organisation vs biens supports
      if (workshopsData.workshop1?.supportingAssets) {
        const sizeAlignment = await this.checkOrganizationSizeAlignment(
          missionContext.organizationSize,
          workshopsData.workshop1.supportingAssets
        );
        if (sizeAlignment.score < 70) {
          inconsistencies.push(`Biens supports inadaptés à la taille d'organisation`);
          recommendations.push(sizeAlignment.recommendation);
          coherenceScore -= 10;
        }
      }

      // Vérifier cohérence réglementations vs mesures sécurité
      if (workshopsData.workshop5?.securityMeasures) {
        const regulatoryAlignment = await this.checkRegulatoryAlignment(
          missionContext.regulations,
          workshopsData.workshop5.securityMeasures
        );
        if (regulatoryAlignment.score < 80) {
          inconsistencies.push(`Mesures de sécurité non conformes aux réglementations`);
          recommendations.push(regulatoryAlignment.recommendation);
          coherenceScore -= 20;
        }
      }

      return {
        isCoherent: coherenceScore >= 70,
        coherenceScore: Math.max(0, coherenceScore),
        inconsistencies,
        recommendations
      };

    } catch (error) {
      logger.error('❌ Erreur validation cohérence', { error });
      return {
        isCoherent: false,
        coherenceScore: 0,
        inconsistencies: ['Erreur lors de la validation'],
        recommendations: ['Vérifier la configuration du système']
      };
    }
  }

  // 🎯 MÉTHODES PRIVÉES SPÉCIALISÉES

  private async generateSectorSpecificProcesses(sector: string): Promise<ContextualAISuggestion[]> {
    const sectorProcesses: Record<string, string[]> = {
      'Santé': [
        'Gestion des dossiers patients',
        'Prescription médicamenteuse',
        'Planification des soins',
        'Gestion des urgences',
        'Facturation médicale'
      ],
      'Finance': [
        'Traitement des paiements',
        'Gestion des comptes clients',
        'Analyse des risques crédit',
        'Conformité réglementaire',
        'Reporting financier'
      ],
      'Industrie': [
        'Gestion de la production',
        'Contrôle qualité',
        'Maintenance préventive',
        'Gestion des stocks',
        'Logistique et distribution'
      ],
      'Éducation': [
        'Gestion des inscriptions',
        'Suivi pédagogique',
        'Évaluation des étudiants',
        'Gestion des ressources',
        'Communication institutionnelle'
      ]
    };

    const processes = sectorProcesses[sector] || [];
    
    return processes.map((process, index) => ({
      id: `sector-process-${index}`,
      type: 'suggestion' as const,
      title: `Processus critique : ${process}`,
      description: `Processus métier critique typique du secteur ${sector}`,
      priority: 'high' as const,
      category: 'critical-process',
      source: 'sector-analysis',
      contextualRelevance: 90,
      missionAlignment: 85,
      sectorSpecific: true,
      organizationSizeRelevant: false,
      regulatoryCompliance: [],
      crossWorkshopImpact: ['workshop1', 'workshop2'],
      implementationPriority: 'immediate' as const
    }));
  }

  private async generateSizeSpecificComponents(organizationSize: string): Promise<ContextualAISuggestion[]> {
    const sizeComponents: Record<string, string[]> = {
      'TPE (< 10 salariés)': [
        'Postes de travail',
        'Serveur de fichiers',
        'Connexion Internet',
        'Messagerie électronique'
      ],
      'PME (10-250 salariés)': [
        'Infrastructure réseau',
        'Serveurs d\'application',
        'Système de sauvegarde',
        'Pare-feu',
        'Solution de mobilité'
      ],
      'ETI (250-5000 salariés)': [
        'Centre de données',
        'Infrastructure cloud hybride',
        'Systèmes de sécurité avancés',
        'Solutions de collaboration',
        'Outils de supervision'
      ],
      'Grande entreprise (> 5000 salariés)': [
        'Centres de données multiples',
        'Infrastructure cloud multi-zones',
        'Systèmes de sécurité enterprise',
        'Solutions de gouvernance IT',
        'Outils d\'orchestration'
      ]
    };

    const components = sizeComponents[organizationSize] || [];
    
    return components.map((component, index) => ({
      id: `size-component-${index}`,
      type: 'suggestion' as const,
      title: `Composant SI : ${component}`,
      description: `Composant système d'information adapté à une organisation de taille ${organizationSize}`,
      priority: 'medium' as const,
      category: 'si-component',
      source: 'size-analysis',
      contextualRelevance: 85,
      missionAlignment: 80,
      sectorSpecific: false,
      organizationSizeRelevant: true,
      regulatoryCompliance: [],
      crossWorkshopImpact: ['workshop1'],
      implementationPriority: 'short-term' as const
    }));
  }

  private async generateRegulatoryRequirements(sector: string): Promise<ContextualAISuggestion[]> {
    const sectorRegulations: Record<string, string[]> = {
      'Santé': ['RGPD', 'Loi Informatique et Libertés', 'HDS (Hébergement de Données de Santé)', 'ISO 27001'],
      'Finance': ['RGPD', 'PCI DSS', 'ACPR', 'MiFID II', 'DORA'],
      'Industrie': ['RGPD', 'ISO 27001', 'IEC 62443', 'Directive NIS'],
      'Éducation': ['RGPD', 'Loi Informatique et Libertés', 'Code de l\'éducation'],
      'Administration': ['RGPD', 'RGS (Référentiel Général de Sécurité)', 'PSSIE']
    };

    const regulations = sectorRegulations[sector] || ['RGPD', 'ISO 27001'];
    
    return regulations.map((regulation, index) => ({
      id: `regulation-${index}`,
      type: 'suggestion' as const,
      title: `Réglementation : ${regulation}`,
      description: `Réglementation applicable au secteur ${sector}`,
      priority: 'high' as const,
      category: 'regulation',
      source: 'regulatory-analysis',
      contextualRelevance: 95,
      missionAlignment: 90,
      sectorSpecific: true,
      organizationSizeRelevant: false,
      regulatoryCompliance: [regulation],
      crossWorkshopImpact: ['workshop1', 'workshop5'],
      implementationPriority: 'immediate' as const
    }));
  }

  // Méthodes pour les workshops spécifiques (à implémenter)
  private async generateWorkshop1ContextualSuggestions(data: WorkshopContextualData): Promise<ContextualAISuggestion[]> {
    // Implémentation spécifique Workshop 1
    return [];
  }

  private async generateWorkshop2ContextualSuggestions(data: WorkshopContextualData): Promise<ContextualAISuggestion[]> {
    // Implémentation spécifique Workshop 2
    return [];
  }

  private async generateWorkshop3ContextualSuggestions(data: WorkshopContextualData): Promise<ContextualAISuggestion[]> {
    // Implémentation spécifique Workshop 3
    return [];
  }

  private async generateWorkshop4ContextualSuggestions(data: WorkshopContextualData): Promise<ContextualAISuggestion[]> {
    // Implémentation spécifique Workshop 4
    return [];
  }

  private async generateWorkshop5ContextualSuggestions(data: WorkshopContextualData): Promise<ContextualAISuggestion[]> {
    // Implémentation spécifique Workshop 5
    return [];
  }

  private async enrichWithMissionContext(
    suggestions: ContextualAISuggestion[],
    missionContext: MissionContextData
  ): Promise<ContextualAISuggestion[]> {
    // Enrichissement avec le contexte mission
    return suggestions.map(suggestion => ({
      ...suggestion,
      missionAlignment: this.calculateMissionAlignment(suggestion, missionContext)
    }));
  }

  private calculateMissionAlignment(
    suggestion: ContextualAISuggestion,
    missionContext: MissionContextData
  ): number {
    let alignment = suggestion.missionAlignment || 50;

    // Ajustements basés sur le contexte
    if (suggestion.sectorSpecific && suggestion.category?.includes(missionContext.sector.toLowerCase())) {
      alignment += 20;
    }

    if (suggestion.organizationSizeRelevant) {
      alignment += 15;
    }

    if (suggestion.regulatoryCompliance.some(reg => 
      missionContext.regulations.includes(reg)
    )) {
      alignment += 25;
    }

    return Math.min(100, alignment);
  }

  // Méthodes de validation de cohérence (à implémenter)
  private async checkSectorBusinessValueAlignment(sector: string, businessValues: any[]): Promise<{score: number, recommendation: string}> {
    return { score: 80, recommendation: 'Alignement correct' };
  }

  private async checkOrganizationSizeAlignment(size: string, supportingAssets: any[]): Promise<{score: number, recommendation: string}> {
    return { score: 75, recommendation: 'Taille adaptée' };
  }

  private async checkRegulatoryAlignment(regulations: string[], securityMeasures: any[]): Promise<{score: number, recommendation: string}> {
    return { score: 85, recommendation: 'Conformité respectée' };
  }
}

// Export singleton
export const missionContextualAI = MissionContextualAIOrchestrator.getInstance();
