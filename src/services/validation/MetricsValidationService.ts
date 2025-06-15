/**
 * 🔍 SERVICE DE VALIDATION DES MÉTRIQUES EBIOS RM
 * Validation des calculs et conformité ANSSI
 * 
 * CONFORMITÉ ANSSI:
 * - Guide EBIOS RM v1.0 (2018)
 * - Validation des métriques officielles
 * - Contrôles de cohérence
 */

import { EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // Score de validation 0-100
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  workshop?: number;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  recommendation: string;
  workshop?: number;
}

/**
 * Service de validation des métriques EBIOS RM
 */
export class MetricsValidationService {
  
  /**
   * Valide les métriques EBIOS RM selon les critères ANSSI
   */
  static validateMetrics(metrics: EbiosRMMetrics): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Validation des métriques par atelier
    this.validateWorkshop1(metrics.workshop1, errors, warnings);
    this.validateWorkshop2(metrics.workshop2, errors, warnings);
    this.validateWorkshop3(metrics.workshop3, errors, warnings);
    this.validateWorkshop4(metrics.workshop4, errors, warnings);
    this.validateWorkshop5(metrics.workshop5, errors, warnings);
    
    // Validation des métriques globales
    this.validateGlobalMetrics(metrics.global, errors, warnings);
    
    // Validation de la séquentialité ANSSI
    this.validateSequentiality(metrics, errors, warnings);
    
    // Calcul du score de validation
    const score = this.calculateValidationScore(errors, warnings);
    
    return {
      isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0,
      errors,
      warnings,
      score
    };
  }
  
  /**
   * Valide les métriques de l'Atelier 1
   */
  private static validateWorkshop1(workshop1: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    // Validation des seuils ANSSI
    if (workshop1.businessValuesCount < 3) {
      errors.push({
        code: 'W1_INSUFFICIENT_BUSINESS_VALUES',
        message: 'Nombre insuffisant de valeurs métier (minimum ANSSI: 3)',
        severity: 'high',
        workshop: 1,
        field: 'businessValuesCount'
      });
    }
    
    if (workshop1.supportingAssetsCount < 5) {
      errors.push({
        code: 'W1_INSUFFICIENT_SUPPORTING_ASSETS',
        message: 'Nombre insuffisant de biens supports (minimum ANSSI: 5)',
        severity: 'high',
        workshop: 1,
        field: 'supportingAssetsCount'
      });
    }
    
    if (workshop1.dreadedEventsCount < 2) {
      errors.push({
        code: 'W1_INSUFFICIENT_DREADED_EVENTS',
        message: 'Nombre insuffisant d\'événements redoutés (minimum ANSSI: 2)',
        severity: 'high',
        workshop: 1,
        field: 'dreadedEventsCount'
      });
    }
    
    // Validation de la conformité
    if (workshop1.conformityScore < 70) {
      warnings.push({
        code: 'W1_LOW_CONFORMITY',
        message: 'Score de conformité ANSSI faible pour l\'Atelier 1',
        recommendation: 'Améliorer la qualité et la complétude des données',
        workshop: 1
      });
    }
  }
  
  /**
   * Valide les métriques de l'Atelier 2
   */
  private static validateWorkshop2(workshop2: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    if (workshop2.riskSourcesCount < 5) {
      errors.push({
        code: 'W2_INSUFFICIENT_RISK_SOURCES',
        message: 'Nombre insuffisant de sources de risque (minimum ANSSI: 5)',
        severity: 'high',
        workshop: 2,
        field: 'riskSourcesCount'
      });
    }
    
    if (workshop2.threatActorsIdentified < 3) {
      warnings.push({
        code: 'W2_LIMITED_THREAT_ACTORS',
        message: 'Diversité limitée des acteurs de menace',
        recommendation: 'Identifier au moins 3 types d\'acteurs différents',
        workshop: 2
      });
    }
    
    if (workshop2.mitreAttackCoverage < 20) {
      warnings.push({
        code: 'W2_LOW_MITRE_COVERAGE',
        message: 'Couverture MITRE ATT&CK insuffisante',
        recommendation: 'Référencer plus de techniques MITRE ATT&CK',
        workshop: 2
      });
    }
  }
  
  /**
   * Valide les métriques de l'Atelier 3
   */
  private static validateWorkshop3(workshop3: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    if (workshop3.strategicScenariosCount < 3) {
      errors.push({
        code: 'W3_INSUFFICIENT_STRATEGIC_SCENARIOS',
        message: 'Nombre insuffisant de scénarios stratégiques (minimum ANSSI: 3)',
        severity: 'high',
        workshop: 3,
        field: 'strategicScenariosCount'
      });
    }
    
    // Validation de la distribution des risques
    const totalRisks = Object.values(workshop3.riskLevelDistribution).reduce((sum: number, count: any) => sum + count, 0);
    if (totalRisks === 0) {
      errors.push({
        code: 'W3_NO_RISK_DISTRIBUTION',
        message: 'Aucune distribution de risque définie',
        severity: 'critical',
        workshop: 3,
        field: 'riskLevelDistribution'
      });
    }
  }
  
  /**
   * Valide les métriques de l'Atelier 4
   */
  private static validateWorkshop4(workshop4: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    if (workshop4.operationalScenariosCount < 2) {
      errors.push({
        code: 'W4_INSUFFICIENT_OPERATIONAL_SCENARIOS',
        message: 'Nombre insuffisant de scénarios opérationnels (minimum ANSSI: 2)',
        severity: 'high',
        workshop: 4,
        field: 'operationalScenariosCount'
      });
    }
    
    if (workshop4.technicalDepth < 30) {
      warnings.push({
        code: 'W4_LOW_TECHNICAL_DEPTH',
        message: 'Profondeur technique insuffisante des scénarios',
        recommendation: 'Détailler davantage les étapes techniques',
        workshop: 4
      });
    }
  }
  
  /**
   * Valide les métriques de l'Atelier 5
   */
  private static validateWorkshop5(workshop5: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    if (workshop5.securityMeasuresCount < 5) {
      errors.push({
        code: 'W5_INSUFFICIENT_SECURITY_MEASURES',
        message: 'Nombre insuffisant de mesures de sécurité (minimum ANSSI: 5)',
        severity: 'high',
        workshop: 5,
        field: 'securityMeasuresCount'
      });
    }
    
    if (workshop5.residualRiskLevel > 3.5) {
      warnings.push({
        code: 'W5_HIGH_RESIDUAL_RISK',
        message: 'Niveau de risque résiduel élevé',
        recommendation: 'Renforcer les mesures de sécurité',
        workshop: 5
      });
    }
    
    if (workshop5.treatmentCoverage < 80) {
      warnings.push({
        code: 'W5_LOW_TREATMENT_COVERAGE',
        message: 'Couverture du traitement des risques insuffisante',
        recommendation: 'Traiter au moins 80% des risques identifiés',
        workshop: 5
      });
    }
  }
  
  /**
   * Valide les métriques globales
   */
  private static validateGlobalMetrics(global: any, errors: ValidationError[], warnings: ValidationWarning[]) {
    if (global.anssiComplianceScore < 70) {
      errors.push({
        code: 'GLOBAL_LOW_ANSSI_COMPLIANCE',
        message: 'Score de conformité ANSSI global insuffisant (minimum: 70%)',
        severity: 'critical',
        field: 'anssiComplianceScore'
      });
    }
    
    if (global.riskMaturityLevel < 3) {
      warnings.push({
        code: 'GLOBAL_LOW_MATURITY',
        message: 'Niveau de maturité risque faible',
        recommendation: 'Améliorer la complétude et la qualité des ateliers',
      });
    }
    
    if (global.dataQualityScore < 60) {
      warnings.push({
        code: 'GLOBAL_LOW_DATA_QUALITY',
        message: 'Qualité des données insuffisante',
        recommendation: 'Réviser et compléter les données saisies',
      });
    }
  }
  
  /**
   * Valide la séquentialité ANSSI
   */
  private static validateSequentiality(metrics: EbiosRMMetrics, errors: ValidationError[], warnings: ValidationWarning[]) {
    const workshops = [
      { num: 1, completion: metrics.workshop1.completionRate },
      { num: 2, completion: metrics.workshop2.completionRate },
      { num: 3, completion: metrics.workshop3.completionRate },
      { num: 4, completion: metrics.workshop4.completionRate },
      { num: 5, completion: metrics.workshop5.completionRate }
    ];
    
    for (let i = 1; i < workshops.length; i++) {
      const current = workshops[i];
      const previous = workshops[i - 1];
      
      if (current.completion > 0 && previous.completion < 100) {
        errors.push({
          code: 'SEQUENTIALITY_VIOLATION',
          message: `L'atelier ${current.num} ne peut progresser tant que l'atelier ${previous.num} n'est pas terminé à 100%`,
          severity: 'critical',
          workshop: current.num
        });
      }
    }
  }
  
  /**
   * Calcule le score de validation
   */
  private static calculateValidationScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    
    // Pénalités pour les erreurs
    errors.forEach(error => {
      switch (error.severity) {
        case 'critical': score -= 25; break;
        case 'high': score -= 15; break;
        case 'medium': score -= 10; break;
        case 'low': score -= 5; break;
      }
    });
    
    // Pénalités pour les avertissements
    warnings.forEach(() => {
      score -= 2;
    });
    
    return Math.max(0, score);
  }
}

export default MetricsValidationService;
