/**
 * 🧮 SERVICE CALCULS EBIOS RM - CONFORMITÉ ANSSI
 * Remplace les valeurs hardcodées par des calculs dynamiques
 * Respecte strictement l'échelle ANSSI EBIOS RM (1-4)
 */

import type { BusinessValue, DreadedEvent, RiskSource, StrategicScenario } from '@/types/ebios';

export interface EBIOSCalculationResult {
  value: number;
  confidence: number;
  methodology: string;
  factors: string[];
}

export class EBIOSCalculationService {
  
  /**
   * Calcule le niveau de vraisemblance selon EBIOS RM
   * @param factors Facteurs influençant la vraisemblance
   * @returns Valeur entre 1-4 (échelle ANSSI)
   */
  static calculateLikelihood(factors: {
    sourceExpertise?: 'limited' | 'moderate' | 'high' | 'expert';
    sourceResources?: 'limited' | 'moderate' | 'high' | 'unlimited';
    targetExposure?: 'low' | 'medium' | 'high' | 'critical';
    historicalData?: number; // Nombre d'incidents similaires
    environmentalFactors?: number; // 1-4
  }): EBIOSCalculationResult {
    
    let baseScore = 1; // Minimum EBIOS RM
    const usedFactors: string[] = [];
    
    // Facteur 1: Expertise de la source
    if (factors.sourceExpertise) {
      const expertiseScores = { limited: 0, moderate: 1, high: 2, expert: 3 };
      baseScore += expertiseScores[factors.sourceExpertise] * 0.3;
      usedFactors.push(`Expertise source: ${factors.sourceExpertise}`);
    }
    
    // Facteur 2: Ressources disponibles
    if (factors.sourceResources) {
      const resourceScores = { limited: 0, moderate: 1, high: 2, unlimited: 3 };
      baseScore += resourceScores[factors.sourceResources] * 0.3;
      usedFactors.push(`Ressources: ${factors.sourceResources}`);
    }
    
    // Facteur 3: Exposition de la cible
    if (factors.targetExposure) {
      const exposureScores = { low: 0, medium: 1, high: 2, critical: 3 };
      baseScore += exposureScores[factors.targetExposure] * 0.25;
      usedFactors.push(`Exposition cible: ${factors.targetExposure}`);
    }
    
    // Facteur 4: Données historiques
    if (factors.historicalData !== undefined) {
      const historicalImpact = Math.min(1, factors.historicalData / 10) * 0.15;
      baseScore += historicalImpact;
      usedFactors.push(`Historique: ${factors.historicalData} incidents`);
    }
    
    // Facteur 5: Environnement
    if (factors.environmentalFactors) {
      baseScore += (factors.environmentalFactors - 1) * 0.1;
      usedFactors.push(`Environnement: ${factors.environmentalFactors}/4`);
    }
    
    // Normalisation vers échelle EBIOS RM (1-4)
    const normalizedScore = Math.max(1, Math.min(4, Math.round(baseScore)));
    
    // Calcul de la confiance basé sur le nombre de facteurs
    const confidence = Math.min(4, Math.max(1, usedFactors.length));
    
    return {
      value: normalizedScore,
      confidence,
      methodology: 'EBIOS RM ANSSI - Calcul dynamique',
      factors: usedFactors
    };
  }
  
  /**
   * Calcule le niveau de gravité selon EBIOS RM
   * @param impact Impact sur les valeurs métier
   * @returns Valeur entre 1-4 (échelle ANSSI)
   */
  static calculateGravity(impact: {
    businessValueCriticality?: 'low' | 'medium' | 'high' | 'critical';
    operationalImpact?: 'minimal' | 'limited' | 'significant' | 'severe';
    financialImpact?: number; // En euros
    reputationalImpact?: 'low' | 'medium' | 'high' | 'critical';
    legalImpact?: 'none' | 'minor' | 'significant' | 'major';
  }): EBIOSCalculationResult {
    
    let baseScore = 1;
    const usedFactors: string[] = [];
    
    // Facteur 1: Criticité de la valeur métier
    if (impact.businessValueCriticality) {
      const criticalityScores = { low: 0, medium: 1, high: 2, critical: 3 };
      baseScore += criticalityScores[impact.businessValueCriticality] * 0.4;
      usedFactors.push(`Criticité métier: ${impact.businessValueCriticality}`);
    }
    
    // Facteur 2: Impact opérationnel
    if (impact.operationalImpact) {
      const operationalScores = { minimal: 0, limited: 1, significant: 2, severe: 3 };
      baseScore += operationalScores[impact.operationalImpact] * 0.25;
      usedFactors.push(`Impact opérationnel: ${impact.operationalImpact}`);
    }
    
    // Facteur 3: Impact financier
    if (impact.financialImpact !== undefined) {
      let financialScore = 0;
      if (impact.financialImpact > 1000000) financialScore = 3; // > 1M€
      else if (impact.financialImpact > 100000) financialScore = 2; // > 100k€
      else if (impact.financialImpact > 10000) financialScore = 1; // > 10k€
      
      baseScore += financialScore * 0.2;
      usedFactors.push(`Impact financier: ${impact.financialImpact}€`);
    }
    
    // Facteur 4: Impact réputationnel
    if (impact.reputationalImpact) {
      const reputationScores = { low: 0, medium: 1, high: 2, critical: 3 };
      baseScore += reputationScores[impact.reputationalImpact] * 0.1;
      usedFactors.push(`Impact réputation: ${impact.reputationalImpact}`);
    }
    
    // Facteur 5: Impact légal/réglementaire
    if (impact.legalImpact) {
      const legalScores = { none: 0, minor: 1, significant: 2, major: 3 };
      baseScore += legalScores[impact.legalImpact] * 0.05;
      usedFactors.push(`Impact légal: ${impact.legalImpact}`);
    }
    
    // Normalisation vers échelle EBIOS RM (1-4)
    const normalizedScore = Math.max(1, Math.min(4, Math.round(baseScore)));
    const confidence = Math.min(4, Math.max(1, usedFactors.length));
    
    return {
      value: normalizedScore,
      confidence,
      methodology: 'EBIOS RM ANSSI - Évaluation gravité',
      factors: usedFactors
    };
  }
  
  /**
   * Calcule le score de risque EBIOS RM
   * @param likelihood Vraisemblance (1-4)
   * @param gravity Gravité (1-4)
   * @returns Score de risque (1-16) et niveau
   */
  static calculateRiskScore(likelihood: number, gravity: number): {
    score: number;
    level: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
    color: string;
    priority: number;
  } {
    
    // Validation des échelles EBIOS RM
    if (likelihood < 1 || likelihood > 4 || gravity < 1 || gravity > 4) {
      throw new Error('Échelles EBIOS RM : vraisemblance et gravité doivent être entre 1 et 4');
    }
    
    const score = likelihood * gravity; // 1-16
    
    // Classification selon ANSSI EBIOS RM
    let level: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
    let color: string;
    let priority: number;
    
    if (score >= 12) {
      level = 'Critique';
      color = '#dc2626'; // Rouge
      priority = 4;
    } else if (score >= 8) {
      level = 'Élevé';
      color = '#ea580c'; // Orange
      priority = 3;
    } else if (score >= 4) {
      level = 'Modéré';
      color = '#d97706'; // Jaune
      priority = 2;
    } else {
      level = 'Faible';
      color = '#16a34a'; // Vert
      priority = 1;
    }
    
    return { score, level, color, priority };
  }
  
  /**
   * Calcule le score de conformité ANSSI dynamiquement
   * @param workshop Numéro de l'atelier (1-5)
   * @param data Données de l'atelier
   * @returns Score de conformité (0-100)
   */
  static calculateComplianceScore(workshop: number, data: any): EBIOSCalculationResult {
    
    let score = 0;
    const factors: string[] = [];
    
    switch (workshop) {
      case 1: // Cadrage et socle
        if (data.businessValues?.length >= 3) {
          score += 40;
          factors.push(`${data.businessValues.length} valeurs métier identifiées`);
        }
        if (data.dreadedEvents?.length >= 2) {
          score += 30;
          factors.push(`${data.dreadedEvents.length} événements redoutés`);
        }
        if (data.supportingAssets?.length >= 5) {
          score += 30;
          factors.push(`${data.supportingAssets.length} biens supports`);
        }
        break;
        
      case 2: // Sources de risque
        if (data.riskSources?.length >= 3) {
          score += 50;
          factors.push(`${data.riskSources.length} sources de risque`);
        }
        if (data.threatActors?.length >= 2) {
          score += 30;
          factors.push(`${data.threatActors.length} acteurs de menace`);
        }
        if (data.attackMethods?.length >= 5) {
          score += 20;
          factors.push(`${data.attackMethods.length} méthodes d'attaque`);
        }
        break;
        
      case 3: // Scénarios stratégiques
        const validScenarios = data.scenarios?.filter((s: any) => 
          s.likelihood >= 1 && s.likelihood <= 4 &&
          s.gravity >= 1 && s.gravity <= 4
        ).length || 0;
        
        if (validScenarios >= 3) {
          score += 60;
          factors.push(`${validScenarios} scénarios conformes EBIOS RM`);
        }
        
        const riskDistribution = this.analyzeRiskDistribution(data.scenarios || []);
        if (riskDistribution.hasVariety) {
          score += 40;
          factors.push('Distribution équilibrée des niveaux de risque');
        }
        break;
        
      case 4: // Scénarios opérationnels
        if (data.attackPaths?.length >= 2) {
          score += 50;
          factors.push(`${data.attackPaths.length} chemins d'attaque détaillés`);
        }
        if (data.vulnerabilities?.length >= 5) {
          score += 30;
          factors.push(`${data.vulnerabilities.length} vulnérabilités identifiées`);
        }
        if (data.technicalDepth > 7) {
          score += 20;
          factors.push('Profondeur technique suffisante');
        }
        break;
        
      case 5: // Traitement du risque
        if (data.securityMeasures?.length >= 3) {
          score += 40;
          factors.push(`${data.securityMeasures.length} mesures de sécurité`);
        }
        
        const coverageRate = this.calculateTreatmentCoverage(
          data.securityMeasures || [], 
          data.identifiedRisks || []
        );
        
        if (coverageRate >= 80) {
          score += 35;
          factors.push(`${coverageRate}% des risques traités`);
        }
        
        if (data.residualRisk <= 4) {
          score += 25;
          factors.push('Risque résiduel acceptable');
        }
        break;
    }
    
    const confidence = Math.min(4, Math.max(1, factors.length));
    
    return {
      value: Math.min(100, score),
      confidence,
      methodology: `EBIOS RM ANSSI - Atelier ${workshop}`,
      factors
    };
  }
  
  /**
   * Analyse la distribution des niveaux de risque
   */
  private static analyzeRiskDistribution(scenarios: any[]): { hasVariety: boolean; distribution: any } {
    const riskLevels = scenarios.map(s => 
      this.calculateRiskScore(s.likelihood || 2, s.gravity || 2).level
    );
    
    const distribution = {
      Faible: riskLevels.filter(r => r === 'Faible').length,
      Modéré: riskLevels.filter(r => r === 'Modéré').length,
      Élevé: riskLevels.filter(r => r === 'Élevé').length,
      Critique: riskLevels.filter(r => r === 'Critique').length
    };
    
    const nonZeroLevels = Object.values(distribution).filter(count => count > 0).length;
    
    return {
      hasVariety: nonZeroLevels >= 2, // Au moins 2 niveaux différents
      distribution
    };
  }
  
  /**
   * Calcule le taux de couverture du traitement des risques
   */
  private static calculateTreatmentCoverage(measures: any[], risks: any[]): number {
    if (risks.length === 0) return 100;
    
    const treatedRisks = risks.filter(risk => 
      measures.some(measure => 
        measure.targetRisks?.includes(risk.id) || 
        measure.relatedScenarios?.includes(risk.scenarioId)
      )
    );
    
    return Math.round((treatedRisks.length / risks.length) * 100);
  }
}

export default EBIOSCalculationService;