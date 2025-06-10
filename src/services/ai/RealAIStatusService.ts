/**
 * 🤖 SERVICE STATUT IA RÉEL - DONNÉES FIREBASE UNIQUEMENT
 * Service conforme ANSSI pour calculer le statut réel de l'IA
 * Basé sur les données réelles de la mission EBIOS RM
 * 
 * CONFORMITÉ ANSSI:
 * - Métriques basées sur données réelles
 * - Calculs conformes guide EBIOS RM
 * - Aucune donnée fictive tolérée
 */

import EbiosRMMetricsService, { EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';

export interface RealAIStatus {
  globalScore: number; // Score global basé sur métriques réelles
  components: {
    businessValues: {
      active: boolean;
      coverage: number;
      confidence: number;
      lastAnalysis: string;
      suggestions: string[];
    };
    dreadedEvents: {
      active: boolean;
      coverage: number;
      confidence: number;
      lastAnalysis: string;
      suggestions: string[];
    };
    riskSources: {
      active: boolean;
      coverage: number;
      confidence: number;
      lastAnalysis: string;
      suggestions: string[];
    };
    attackPaths: {
      active: boolean;
      coverage: number;
      confidence: number;
      lastAnalysis: string;
      suggestions: string[];
    };
    securityMeasures: {
      active: boolean;
      coverage: number;
      confidence: number;
      lastAnalysis: string;
      suggestions: string[];
    };
  };
  lastCalculation: string;
  dataQuality: number;
  anssiCompliance: number;
}

/**
 * Service de calcul du statut IA réel
 */
export class RealAIStatusService {
  
  /**
   * Calcule le statut IA réel basé sur les métriques EBIOS RM
   */
  static async calculateRealAIStatus(missionId: string): Promise<RealAIStatus> {
    console.log(`🤖 Calcul du statut IA réel pour mission: ${missionId}`);
    
    try {
      // Récupération des métriques EBIOS RM réelles
      const metrics = await EbiosRMMetricsService.calculateMetrics(missionId);
      
      // Calcul du statut IA basé sur les données réelles
      const aiStatus = this.convertMetricsToAIStatus(metrics);
      
      console.log('✅ Statut IA réel calculé avec succès');
      return aiStatus;
      
    } catch (error) {
      console.error('❌ Erreur calcul statut IA réel:', error);
      throw new Error('Échec du calcul du statut IA réel');
    }
  }

  /**
   * Convertit les métriques EBIOS RM en statut IA
   */
  private static convertMetricsToAIStatus(metrics: EbiosRMMetrics): RealAIStatus {
    const now = new Date().toISOString();
    
    // Calcul du score global basé sur les métriques réelles
    const globalScore = this.calculateGlobalScore(metrics);
    
    return {
      globalScore,
      components: {
        businessValues: {
          active: metrics.workshop1.businessValuesCount > 0,
          coverage: this.calculateBusinessValuesCoverage(metrics.workshop1),
          confidence: this.calculateConfidence(metrics.workshop1.conformityScore),
          lastAnalysis: now,
          suggestions: this.generateBusinessValuesSuggestions(metrics.workshop1)
        },
        dreadedEvents: {
          active: metrics.workshop1.dreadedEventsCount > 0,
          coverage: this.calculateDreadedEventsCoverage(metrics.workshop1),
          confidence: this.calculateConfidence(metrics.workshop1.conformityScore),
          lastAnalysis: now,
          suggestions: this.generateDreadedEventsSuggestions(metrics.workshop1)
        },
        riskSources: {
          active: metrics.workshop2.riskSourcesCount > 0,
          coverage: metrics.workshop2.completionRate,
          confidence: this.calculateConfidence(metrics.workshop2.mitreAttackCoverage),
          lastAnalysis: now,
          suggestions: this.generateRiskSourcesSuggestions(metrics.workshop2)
        },
        attackPaths: {
          active: metrics.workshop4.operationalScenariosCount > 0,
          coverage: this.calculateAttackPathsCoverage(metrics.workshop4),
          confidence: this.calculateConfidence(metrics.workshop4.technicalDepth),
          lastAnalysis: now,
          suggestions: this.generateAttackPathsSuggestions(metrics.workshop4)
        },
        securityMeasures: {
          active: metrics.workshop5.securityMeasuresCount > 0,
          coverage: metrics.workshop5.treatmentCoverage,
          confidence: this.calculateConfidence(metrics.workshop5.completionRate),
          lastAnalysis: now,
          suggestions: this.generateSecurityMeasuresSuggestions(metrics.workshop5)
        }
      },
      lastCalculation: now,
      dataQuality: metrics.global.dataQualityScore,
      anssiCompliance: metrics.global.anssiComplianceScore
    };
  }

  /**
   * Calcule le score global basé sur les métriques réelles
   */
  private static calculateGlobalScore(metrics: EbiosRMMetrics): number {
    const workshopScores = [
      metrics.workshop1.completionRate,
      metrics.workshop2.completionRate,
      metrics.workshop3.completionRate,
      metrics.workshop4.completionRate,
      metrics.workshop5.completionRate
    ];
    
    // Moyenne pondérée selon importance ANSSI
    const weights = [0.25, 0.20, 0.25, 0.15, 0.15];
    const weightedScore = workshopScores.reduce((sum, score, index) => {
      return sum + (score * weights[index]);
    }, 0);
    
    return Math.round(weightedScore);
  }

  /**
   * Calcule la couverture des valeurs métier
   */
  private static calculateBusinessValuesCoverage(workshop1: any): number {
    // Basé sur le nombre et la qualité des valeurs métier
    const minRequired = 3; // Minimum ANSSI
    const coverage = Math.min(100, (workshop1.businessValuesCount / minRequired) * 100);
    
    // Bonus pour la qualité (conformité ANSSI)
    const qualityBonus = (workshop1.conformityScore / 100) * 20;
    
    return Math.round(Math.min(100, coverage + qualityBonus));
  }

  /**
   * Calcule la couverture des événements redoutés
   */
  private static calculateDreadedEventsCoverage(workshop1: any): number {
    // Basé sur le ratio événements/valeurs métier
    const ratio = workshop1.businessValuesCount > 0 
      ? workshop1.dreadedEventsCount / workshop1.businessValuesCount 
      : 0;
    
    // ANSSI recommande 2-3 événements par valeur métier
    const optimalRatio = 2.5;
    const coverage = Math.min(100, (ratio / optimalRatio) * 100);
    
    return Math.round(coverage);
  }

  /**
   * Calcule la couverture des chemins d'attaque
   */
  private static calculateAttackPathsCoverage(workshop4: any): number {
    // Basé sur la profondeur technique et le nombre de scénarios
    const depthScore = workshop4.technicalDepth;
    const volumeScore = Math.min(100, workshop4.operationalScenariosCount * 20);
    
    return Math.round((depthScore + volumeScore) / 2);
  }

  /**
   * Calcule le niveau de confiance basé sur un score
   */
  private static calculateConfidence(score: number): number {
    // Conversion du score en niveau de confiance
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 75;
    if (score >= 60) return 65;
    if (score >= 50) return 55;
    return 45;
  }

  /**
   * Génère des suggestions réelles pour les valeurs métier
   */
  private static generateBusinessValuesSuggestions(workshop1: any): string[] {
    const suggestions: string[] = [];
    
    if (workshop1.businessValuesCount < 3) {
      suggestions.push('Identifier au minimum 3 valeurs métier selon ANSSI');
    }
    
    if (workshop1.conformityScore < 80) {
      suggestions.push('Améliorer la description et la catégorisation des valeurs métier');
    }
    
    if (workshop1.supportingAssetsCount < workshop1.businessValuesCount * 2) {
      suggestions.push('Associer plus de biens supports aux valeurs métier');
    }
    
    return suggestions;
  }

  /**
   * Génère des suggestions réelles pour les événements redoutés
   */
  private static generateDreadedEventsSuggestions(workshop1: any): string[] {
    const suggestions: string[] = [];
    
    const ratio = workshop1.businessValuesCount > 0 
      ? workshop1.dreadedEventsCount / workshop1.businessValuesCount 
      : 0;
    
    if (ratio < 2) {
      suggestions.push('Identifier 2-3 événements redoutés par valeur métier');
    }
    
    if (workshop1.conformityScore < 70) {
      suggestions.push('Préciser l\'impact et la gravité des événements redoutés');
    }
    
    return suggestions;
  }

  /**
   * Génère des suggestions réelles pour les sources de risque
   */
  private static generateRiskSourcesSuggestions(workshop2: any): string[] {
    const suggestions: string[] = [];
    
    if (workshop2.riskSourcesCount < 5) {
      suggestions.push('Identifier au minimum 5 sources de risque selon ANSSI');
    }
    
    if (workshop2.mitreAttackCoverage < 30) {
      suggestions.push('Enrichir avec plus de techniques MITRE ATT&CK');
    }
    
    if (workshop2.threatActorsIdentified < 3) {
      suggestions.push('Identifier plus d\'acteurs de menace pertinents');
    }
    
    return suggestions;
  }

  /**
   * Génère des suggestions réelles pour les chemins d'attaque
   */
  private static generateAttackPathsSuggestions(workshop4: any): string[] {
    const suggestions: string[] = [];
    
    if (workshop4.operationalScenariosCount < 2) {
      suggestions.push('Développer plus de scénarios opérationnels détaillés');
    }
    
    if (workshop4.technicalDepth < 60) {
      suggestions.push('Approfondir les étapes techniques des attaques');
    }
    
    if (workshop4.vulnerabilitiesIdentified < 5) {
      suggestions.push('Identifier plus de vulnérabilités exploitables');
    }
    
    return suggestions;
  }

  /**
   * Génère des suggestions réelles pour les mesures de sécurité
   */
  private static generateSecurityMeasuresSuggestions(workshop5: any): string[] {
    const suggestions: string[] = [];
    
    if (workshop5.securityMeasuresCount < 5) {
      suggestions.push('Définir plus de mesures de sécurité');
    }
    
    if (workshop5.treatmentCoverage < 80) {
      suggestions.push('Améliorer la couverture du traitement des risques');
    }
    
    if (workshop5.residualRiskLevel > 2.5) {
      suggestions.push('Renforcer les mesures pour réduire le risque résiduel');
    }
    
    return suggestions;
  }
}

export default RealAIStatusService;
