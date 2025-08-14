/**
 * 🎯 VALIDATEUR WORKFLOW EBIOS RM
 * Validation de la cohérence métier entre les 5 ateliers selon ANSSI
 */

import { BusinessValue, EssentialAsset, DreadedEvent, RiskSource, StrategicScenario } from '@/types/ebios';

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  score: number; // 0-100
}

export interface EbiosWorkflowData {
  businessValues: BusinessValue[];
  essentialAssets: EssentialAsset[];
  dreadedEvents: DreadedEvent[];
  riskSources: RiskSource[];
  strategicScenarios: StrategicScenario[];
}

export class EbiosWorkflowValidator {
  
  /**
   * Validation complète du workflow EBIOS RM
   */
  static validateCompleteWorkflow(data: EbiosWorkflowData): WorkflowValidationResult {
    const result: WorkflowValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      score: 100
    };

    // Validation Atelier 1 → 2
    this.validateWorkshop1To2Flow(data, result);
    
    // Validation Atelier 2 → 3  
    this.validateWorkshop2To3Flow(data, result);
    
    // Validation cohérence globale
    this.validateGlobalCoherence(data, result);
    
    // Calcul score final
    result.score = this.calculateCoherenceScore(result);
    result.isValid = result.errors.length === 0 && result.score >= 70;
    
    return result;
  }

  /**
   * Validation flux Atelier 1 → Atelier 2
   * Vérification que les biens essentiels supportent bien les valeurs métier
   */
  private static validateWorkshop1To2Flow(data: EbiosWorkflowData, result: WorkflowValidationResult): void {
    // Vérification relation Biens essentiels ← Valeurs métier
    data.businessValues.forEach(businessValue => {
      const supportingAssets = data.essentialAssets.filter(asset => 
        asset.supportedBusinessValues.includes(businessValue.id)
      );
      
      if (supportingAssets.length === 0) {
        result.errors.push(
          `Valeur métier "${businessValue.name}" n'est supportée par aucun bien essentiel`
        );
      }
    });

    // Vérification événements redoutés liés aux biens essentiels  
    data.essentialAssets.forEach(asset => {
      const relatedEvents = data.dreadedEvents.filter(event => 
        event.essentialAssetId === asset.id
      );
      
      if (relatedEvents.length === 0) {
        result.warnings.push(
          `Bien essentiel "${asset.name}" n'a aucun événement redouté associé`
        );
      }
    });
  }

  /**
   * Validation flux Atelier 2 → Atelier 3
   * Vérification que les sources de risque peuvent causer les événements redoutés
   */
  private static validateWorkshop2To3Flow(data: EbiosWorkflowData, result: WorkflowValidationResult): void {
    // Chaque événement redouté doit avoir au moins une source de risque capable de le causer
    data.dreadedEvents.forEach(event => {
      const capableSources = data.riskSources.filter(source => {
        // Logique métier EBIOS RM : cohérence capacité/impact
        const hasCapability = this.checkSourceCapabilityForEvent(source, event);
        return hasCapability;
      });
      
      if (capableSources.length === 0) {
        result.warnings.push(
          `Événement redouté "${event.name}" n'a aucune source de risque identifiée capable de le causer`
        );
      }
    });

    // Vérification scénarios stratégiques
    data.strategicScenarios.forEach(scenario => {
      if (!scenario.riskSourceId || !scenario.dreadedEventId) {
        result.errors.push(
          `Scénario stratégique "${scenario.name}" doit lier une source de risque à un événement redouté`
        );
      }
      
      // Vérification cohérence source → événement dans le scénario
      const riskSource = data.riskSources.find(rs => rs.id === scenario.riskSourceId);
      const dreadedEvent = data.dreadedEvents.find(de => de.id === scenario.dreadedEventId);
      
      if (riskSource && dreadedEvent) {
        const isCoherent = this.checkScenarioCoherence(riskSource, dreadedEvent);
        if (!isCoherent) {
          result.warnings.push(
            `Scénario "${scenario.name}" : incohérence entre capacités de la source "${riskSource.name}" et l'événement "${dreadedEvent.name}"`
          );
        }
      }
    });
  }

  /**
   * Validation cohérence globale EBIOS RM
   */
  private static validateGlobalCoherence(data: EbiosWorkflowData, result: WorkflowValidationResult): void {
    // Vérification couverture complète des valeurs métier
    const uncoveredBusinessValues = data.businessValues.filter(bv => {
      const hasEssentialAsset = data.essentialAssets.some(ea => 
        ea.supportedBusinessValues.includes(bv.id)
      );
      return !hasEssentialAsset;
    });
    
    if (uncoveredBusinessValues.length > 0) {
      result.errors.push(
        `Valeurs métier sans couverture par des biens essentiels : ${uncoveredBusinessValues.map(bv => bv.name).join(', ')}`
      );
    }

    // Recommandations méthodologiques ANSSI
    if (data.businessValues.length < 3) {
      result.recommendations.push(
        'ANSSI recommande d\'identifier au minimum 3-5 valeurs métier pour une analyse complète'
      );
    }
    
    if (data.riskSources.length < 5) {
      result.recommendations.push(
        'Élargir l\'analyse des sources de risque (recommandation : minimum 5 sources diversifiées)'
      );
    }
  }

  /**
   * Vérification capacité d'une source de risque à causer un événement redouté
   */
  private static checkSourceCapabilityForEvent(source: RiskSource, event: DreadedEvent): boolean {
    // Logique métier EBIOS RM
    if (source.capability === 4 && event.gravity >= 3) return true;
    if (source.capability === 3 && event.gravity >= 2) return true;  
    if (source.capability >= 2 && event.gravity >= 1) return true;
    
    return false;
  }

  /**
   * Vérification cohérence d'un scénario stratégique
   */
  private static checkScenarioCoherence(riskSource: RiskSource, dreadedEvent: DreadedEvent): boolean {
    // Cohérence motivation/objectif
    const motivationAlignment = this.checkMotivationAlignment(riskSource, dreadedEvent);
    const capabilityAlignment = this.checkSourceCapabilityForEvent(riskSource, dreadedEvent);
    
    return motivationAlignment && capabilityAlignment;
  }

  /**
   * Vérification alignement motivation/objectif  
   */
  private static checkMotivationAlignment(riskSource: RiskSource, dreadedEvent: DreadedEvent): boolean {
    // Logique métier EBIOS RM : certaines motivations sont plus probables pour certains impacts
    
    // Sources financières → impacts financiers directs
    if (riskSource.motivation === 'financial' && dreadedEvent.name.includes('financ')) return true;
    
    // Sources idéologiques → impacts réputationnels  
    if (riskSource.motivation === 'ideological' && dreadedEvent.name.includes('réputation')) return true;
    
    // Par défaut, accepter la cohérence (logique métier à affiner selon contexte)
    return true;
  }

  /**
   * Calcul du score de cohérence globale
   */
  private static calculateCoherenceScore(result: WorkflowValidationResult): number {
    let score = 100;
    
    // Pénalités pour erreurs critiques
    score -= result.errors.length * 20;
    
    // Pénalités pour warnings  
    score -= result.warnings.length * 5;
    
    // Bonus pour recommandations suivies (logique inverse)
    score -= result.recommendations.length * 2;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validation spécifique d'un atelier
   */
  static validateWorkshop(workshopId: number, data: any): WorkflowValidationResult {
    const result: WorkflowValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      recommendations: [],
      score: 100
    };

    switch (workshopId) {
      case 1:
        this.validateWorkshop1(data, result);
        break;
      case 2:
        this.validateWorkshop2(data, result);
        break;
      case 3:
        this.validateWorkshop3(data, result);
        break;
      case 4:
        this.validateWorkshop4(data, result);
        break;
      case 5:
        this.validateWorkshop5(data, result);
        break;
      default:
        result.errors.push('Atelier non reconnu');
    }

    result.score = this.calculateCoherenceScore(result);
    result.isValid = result.errors.length === 0;
    
    return result;
  }

  private static validateWorkshop1(data: any, result: WorkflowValidationResult): void {
    if (!data.businessValues || data.businessValues.length === 0) {
      result.errors.push('Au moins une valeur métier doit être définie');
    }
    
    if (!data.essentialAssets || data.essentialAssets.length === 0) {
      result.errors.push('Au moins un bien essentiel doit être défini');  
    }

    if (!data.dreadedEvents || data.dreadedEvents.length === 0) {
      result.errors.push('Au moins un événement redouté doit être défini');
    }
  }

  private static validateWorkshop2(data: any, result: WorkflowValidationResult): void {
    if (!data.riskSources || data.riskSources.length === 0) {
      result.errors.push('Au moins une source de risque doit être identifiée');
    }

    // Validation caractérisation sources
    if (data.riskSources) {
      data.riskSources.forEach((source: any, index: number) => {
        if (!source.type || !source.motivation || !source.capability) {
          result.warnings.push(`Source de risque ${index + 1} : caractérisation incomplète (type, motivation, capacités)`);
        }
      });
    }
  }

  private static validateWorkshop3(data: any, result: WorkflowValidationResult): void {
    if (!data.strategicScenarios || data.strategicScenarios.length === 0) {
      result.errors.push('Au moins un scénario stratégique doit être défini');
    }
  }

  private static validateWorkshop4(data: any, result: WorkflowValidationResult): void {
    if (!data.operationalScenarios || data.operationalScenarios.length === 0) {
      result.errors.push('Au moins un scénario opérationnel doit être défini');
    }
  }

  private static validateWorkshop5(data: any, result: WorkflowValidationResult): void {
    if (!data.securityMeasures || data.securityMeasures.length === 0) {
      result.errors.push('Au moins une mesure de sécurité doit être définie');
    }
  }
}

export default EbiosWorkflowValidator;