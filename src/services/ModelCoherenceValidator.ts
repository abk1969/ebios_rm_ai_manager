/**
 * 🔄 VALIDATEUR DE COHÉRENCE DES MODÈLES
 * Service Frontend pour valider la cohérence des données EBIOS RM
 */

import { 
  Mission, 
  Workshop, 
  BusinessValue, 
  EssentialAsset, 
  SupportingAsset,
  DreadedEvent,
  SecurityMeasure,
  RiskSource,
  StrategicScenario,
  OperationalScenario
} from '../types/ebios';

export interface CoherenceAnalysis {
  overall_score: number;
  workshop_scores: Record<string, number>;
  consistency_checks: Record<string, boolean>;
  cross_workshop_analysis: Record<string, string>;
  issues: CoherenceIssue[];
  recommendations: string[];
}

export interface CoherenceIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  workshop?: string;
  recommendation?: string;
}

export class ModelCoherenceValidator {
  /**
   * Analyse la cohérence d'une mission EBIOS RM
   */
  static async analyzeMissionCoherence(mission: Mission): Promise<CoherenceAnalysis> {
    const analysis: CoherenceAnalysis = {
      overall_score: 0,
      workshop_scores: {},
      consistency_checks: {},
      cross_workshop_analysis: {},
      issues: [],
      recommendations: []
    };

    // Analyser chaque workshop
    analysis.workshop_scores = {
      workshop1: this.analyzeWorkshop1Coherence(mission),
      workshop2: this.analyzeWorkshop2Coherence(mission),
      workshop3: this.analyzeWorkshop3Coherence(mission),
      workshop4: this.analyzeWorkshop4Coherence(mission),
      workshop5: this.analyzeWorkshop5Coherence(mission)
    };

    // Vérifications de cohérence transversales
    analysis.consistency_checks = {
      business_values_alignment: this.checkBusinessValuesAlignment(mission),
      assets_coverage: this.checkAssetsCoverage(mission),
      risks_completeness: this.checkRisksCompleteness(mission),
      measures_adequacy: this.checkMeasuresAdequacy(mission)
    };

    // Analyse inter-workshops
    analysis.cross_workshop_analysis = {
      business_values_to_assets: this.analyzeBVToAssetsCoherence(mission),
      assets_to_events: this.analyzeAssetsToEventsCoherence(mission),
      events_to_scenarios: this.analyzeEventsToScenariosCoherence(mission),
      scenarios_to_measures: this.analyzeScenariosToMeasuresCoherence(mission)
    };

    // Identifier les problèmes
    analysis.issues = this.identifyCoherenceIssues(mission, analysis);

    // Générer des recommandations
    analysis.recommendations = this.generateRecommendations(analysis);

    // Calculer le score global
    analysis.overall_score = this.calculateOverallScore(analysis);

    return analysis;
  }

  /**
   * Analyse la cohérence du Workshop 1
   */
  private static analyzeWorkshop1Coherence(mission: Mission): number {
    let score = 100;
    
    // Vérifier la présence des valeurs métier
    if (!mission.businessValues || mission.businessValues.length === 0) {
      score -= 30;
    }

    // Vérifier la qualité des descriptions
    if (mission.businessValues) {
      const incompleteValues = mission.businessValues.filter(bv => 
        !bv.description || bv.description.length < 10
      );
      score -= incompleteValues.length * 10;
    }

    return Math.max(0, score);
  }

  /**
   * Analyse la cohérence du Workshop 2
   */
  private static analyzeWorkshop2Coherence(mission: Mission): number {
    let score = 100;
    
    // Vérifier la présence des actifs
    if (!mission.essentialAssets || mission.essentialAssets.length === 0) {
      score -= 25;
    }
    
    if (!mission.supportingAssets || mission.supportingAssets.length === 0) {
      score -= 25;
    }

    // Vérifier les sources de risques
    if (!mission.riskSources || mission.riskSources.length === 0) {
      score -= 25;
    }

    return Math.max(0, score);
  }

  /**
   * Analyse la cohérence du Workshop 3
   */
  private static analyzeWorkshop3Coherence(mission: Mission): number {
    let score = 100;
    
    // Vérifier la présence des événements redoutés
    if (!mission.dreadedEvents || mission.dreadedEvents.length === 0) {
      score -= 40;
    }

    // Vérifier les scénarios stratégiques
    if (!mission.strategicScenarios || mission.strategicScenarios.length === 0) {
      score -= 40;
    }

    return Math.max(0, score);
  }

  /**
   * Analyse la cohérence du Workshop 4
   */
  private static analyzeWorkshop4Coherence(mission: Mission): number {
    let score = 100;
    
    // Vérifier la présence des scénarios opérationnels
    if (!mission.operationalScenarios || mission.operationalScenarios.length === 0) {
      score -= 50;
    }

    return Math.max(0, score);
  }

  /**
   * Analyse la cohérence du Workshop 5
   */
  private static analyzeWorkshop5Coherence(mission: Mission): number {
    let score = 100;
    
    // Vérifier la présence des mesures de sécurité
    if (!mission.securityMeasures || mission.securityMeasures.length === 0) {
      score -= 50;
    }

    return Math.max(0, score);
  }

  /**
   * Vérifie l'alignement des valeurs métier
   */
  private static checkBusinessValuesAlignment(mission: Mission): boolean {
    if (!mission.businessValues || !mission.essentialAssets) {
      return false;
    }

    // Vérifier que chaque valeur métier a au moins un actif essentiel associé
    return mission.businessValues.every(bv => 
      mission.essentialAssets?.some(asset => 
        asset.businessValueIds?.includes(bv.id)
      )
    );
  }

  /**
   * Vérifie la couverture des actifs
   */
  private static checkAssetsCoverage(mission: Mission): boolean {
    if (!mission.essentialAssets || !mission.supportingAssets) {
      return false;
    }

    // Vérifier que chaque actif essentiel a au moins un actif support
    return mission.essentialAssets.every(essential => 
      mission.supportingAssets?.some(supporting => 
        supporting.essentialAssetIds?.includes(essential.id)
      )
    );
  }

  /**
   * Vérifie la complétude des risques
   */
  private static checkRisksCompleteness(mission: Mission): boolean {
    return !!(mission.riskSources && mission.riskSources.length > 0 &&
             mission.dreadedEvents && mission.dreadedEvents.length > 0);
  }

  /**
   * Vérifie l'adéquation des mesures
   */
  private static checkMeasuresAdequacy(mission: Mission): boolean {
    if (!mission.securityMeasures || !mission.strategicScenarios) {
      return false;
    }

    // Vérifier qu'il y a au moins une mesure par scénario critique
    const criticalScenarios = mission.strategicScenarios.filter(s => 
      s.riskLevel === 'high' || s.riskLevel === 'critical'
    );

    return criticalScenarios.length === 0 || mission.securityMeasures.length > 0;
  }

  /**
   * Analyse la cohérence Valeurs Métier → Actifs
   */
  private static analyzeBVToAssetsCoherence(mission: Mission): string {
    if (!mission.businessValues || !mission.essentialAssets) {
      return 'missing_data';
    }

    const alignmentRate = mission.businessValues.filter(bv => 
      mission.essentialAssets?.some(asset => 
        asset.businessValueIds?.includes(bv.id)
      )
    ).length / mission.businessValues.length;

    if (alignmentRate >= 0.9) return 'consistent';
    if (alignmentRate >= 0.7) return 'mostly_consistent';
    return 'needs_review';
  }

  /**
   * Analyse la cohérence Actifs → Événements
   */
  private static analyzeAssetsToEventsCoherence(mission: Mission): string {
    if (!mission.essentialAssets || !mission.dreadedEvents) {
      return 'missing_data';
    }

    const coverageRate = mission.essentialAssets.filter(asset => 
      mission.dreadedEvents?.some(event => 
        event.assetIds?.includes(asset.id)
      )
    ).length / mission.essentialAssets.length;

    if (coverageRate >= 0.8) return 'consistent';
    if (coverageRate >= 0.6) return 'mostly_consistent';
    return 'needs_review';
  }

  /**
   * Analyse la cohérence Événements → Scénarios
   */
  private static analyzeEventsToScenariosCoherence(mission: Mission): string {
    if (!mission.dreadedEvents || !mission.strategicScenarios) {
      return 'missing_data';
    }

    const coverageRate = mission.dreadedEvents.filter(event => 
      mission.strategicScenarios?.some(scenario => 
        scenario.dreadedEventIds?.includes(event.id)
      )
    ).length / mission.dreadedEvents.length;

    if (coverageRate >= 0.8) return 'consistent';
    if (coverageRate >= 0.6) return 'mostly_consistent';
    return 'needs_review';
  }

  /**
   * Analyse la cohérence Scénarios → Mesures
   */
  private static analyzeScenariosToMeasuresCoherence(mission: Mission): string {
    if (!mission.strategicScenarios || !mission.securityMeasures) {
      return 'missing_data';
    }

    const criticalScenarios = mission.strategicScenarios.filter(s => 
      s.riskLevel === 'high' || s.riskLevel === 'critical'
    );

    if (criticalScenarios.length === 0) return 'consistent';

    const coveredScenarios = criticalScenarios.filter(scenario => 
      mission.securityMeasures?.some(measure => 
        measure.scenarioIds?.includes(scenario.id)
      )
    );

    const coverageRate = coveredScenarios.length / criticalScenarios.length;

    if (coverageRate >= 0.9) return 'consistent';
    if (coverageRate >= 0.7) return 'mostly_consistent';
    return 'needs_review';
  }

  /**
   * Identifie les problèmes de cohérence
   */
  private static identifyCoherenceIssues(mission: Mission, analysis: CoherenceAnalysis): CoherenceIssue[] {
    const issues: CoherenceIssue[] = [];

    // Vérifier les scores faibles
    Object.entries(analysis.workshop_scores).forEach(([workshop, score]) => {
      if (score < 70) {
        issues.push({
          type: 'low_workshop_score',
          severity: score < 50 ? 'high' : 'medium',
          description: `Score faible pour ${workshop}: ${score}/100`,
          workshop,
          recommendation: `Compléter les informations manquantes dans ${workshop}`
        });
      }
    });

    // Vérifier les échecs de cohérence
    Object.entries(analysis.consistency_checks).forEach(([check, passed]) => {
      if (!passed) {
        issues.push({
          type: 'consistency_failure',
          severity: 'medium',
          description: `Échec de vérification: ${check}`,
          recommendation: `Réviser la cohérence pour ${check}`
        });
      }
    });

    return issues;
  }

  /**
   * Génère des recommandations
   */
  private static generateRecommendations(analysis: CoherenceAnalysis): string[] {
    const recommendations: string[] = [];

    // Recommandations basées sur les problèmes
    analysis.issues.forEach(issue => {
      if (issue.recommendation) {
        recommendations.push(issue.recommendation);
      }
    });

    // Recommandations générales
    if (analysis.overall_score < 80) {
      recommendations.push('Améliorer la complétude des données dans tous les workshops');
    }

    if (Object.values(analysis.cross_workshop_analysis).includes('needs_review')) {
      recommendations.push('Réviser la cohérence entre les workshops');
    }

    return [...new Set(recommendations)]; // Supprimer les doublons
  }

  /**
   * Calcule le score global
   */
  private static calculateOverallScore(analysis: CoherenceAnalysis): number {
    const workshopScores = Object.values(analysis.workshop_scores);
    const avgWorkshopScore = workshopScores.reduce((a, b) => a + b, 0) / workshopScores.length;

    const consistencyScore = Object.values(analysis.consistency_checks).filter(Boolean).length / 
                           Object.values(analysis.consistency_checks).length * 100;

    const crossWorkshopScore = Object.values(analysis.cross_workshop_analysis)
      .filter(status => status === 'consistent').length / 
      Object.values(analysis.cross_workshop_analysis).length * 100;

    return Math.round((avgWorkshopScore * 0.5 + consistencyScore * 0.3 + crossWorkshopScore * 0.2));
  }
}

export default ModelCoherenceValidator;
