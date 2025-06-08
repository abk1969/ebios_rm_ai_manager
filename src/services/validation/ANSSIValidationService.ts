/**
 * Service de validation stricte selon les critères ANSSI EBIOS RM v1.5
 * Applique les recommandations de l'audit pour renforcer la validation
 */

import type { 
  BusinessValue, 
  DreadedEvent, 
  SupportingAsset, 
  RiskSource, 
  StrategicScenario,
  AttackPath,
  Mission 
} from '@/types/ebios';

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  anssiCompliance: {
    workshop1: number;
    workshop2: number;
    workshop3: number;
    workshop4: number;
    workshop5: number;
    overall: number;
  };
}

export interface WorkshopValidationCriteria {
  required: ValidationCriterion[];
  recommended: ValidationCriterion[];
  anssiSpecific: ValidationCriterion[];
}

export interface ValidationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-10
  category: 'critical' | 'important' | 'recommended';
  anssiReference?: string;
}

/**
 * Service de validation stricte ANSSI
 */
export class ANSSIValidationService {
  
  /**
   * Critères de validation stricts pour Workshop 1
   */
  private static readonly WORKSHOP1_CRITERIA: WorkshopValidationCriteria = {
    required: [
      {
        id: 'w1_business_values_min',
        name: 'Nombre minimum de valeurs métier',
        description: 'Au moins 3 valeurs métier identifiées avec catégorisation',
        weight: 10,
        category: 'critical',
        anssiReference: 'EBIOS RM v1.5 - Atelier 1'
      },
      {
        id: 'w1_dreaded_events_coverage',
        name: 'Couverture des événements redoutés',
        description: 'Au moins 1 événement redouté par valeur métier critique',
        weight: 9,
        category: 'critical',
        anssiReference: 'EBIOS RM v1.5 - Atelier 1'
      },
      {
        id: 'w1_impact_assessment',
        name: 'Évaluation des impacts',
        description: 'Tous les événements redoutés ont des impacts évalués (1-4)',
        weight: 8,
        category: 'critical',
        anssiReference: 'ANSSI - Échelles de cotation'
      },
      {
        id: 'w1_supporting_assets',
        name: 'Actifs supports identifiés',
        description: 'Chaque valeur métier a au moins 2 actifs supports',
        weight: 7,
        category: 'important',
        anssiReference: 'EBIOS RM v1.5 - Atelier 1'
      }
    ],
    recommended: [
      {
        id: 'w1_security_controls',
        name: 'Contrôles de sécurité existants',
        description: 'Documentation des mesures de sécurité en place',
        weight: 5,
        category: 'recommended',
        anssiReference: 'ISO 27002 - Contrôles'
      }
    ],
    anssiSpecific: [
      {
        id: 'w1_anssi_scales',
        name: 'Utilisation des échelles ANSSI',
        description: 'Respect strict des échelles de cotation ANSSI (1-4)',
        weight: 8,
        category: 'critical',
        anssiReference: 'ANSSI - Guide EBIOS RM'
      }
    ]
  };

  /**
   * Critères de validation stricts pour Workshop 2
   */
  private static readonly WORKSHOP2_CRITERIA: WorkshopValidationCriteria = {
    required: [
      {
        id: 'w2_risk_sources_diversity',
        name: 'Diversité des sources de risque',
        description: 'Au moins 3 catégories différentes de sources de risque',
        weight: 9,
        category: 'critical',
        anssiReference: 'EBIOS RM v1.5 - Atelier 2'
      },
      {
        id: 'w2_objectives_mapping',
        name: 'Cartographie des objectifs',
        description: 'Chaque source de risque a des objectifs définis',
        weight: 8,
        category: 'critical',
        anssiReference: 'EBIOS RM v1.5 - Atelier 2'
      },
      {
        id: 'w2_operational_modes',
        name: 'Modes opératoires',
        description: 'Au moins 2 modes opératoires par source de risque critique',
        weight: 7,
        category: 'important',
        anssiReference: 'EBIOS RM v1.5 - Atelier 2'
      }
    ],
    recommended: [
      {
        id: 'w2_mitre_mapping',
        name: 'Référencement MITRE ATT&CK',
        description: 'Techniques MITRE associées aux modes opératoires',
        weight: 6,
        category: 'recommended',
        anssiReference: 'MITRE ATT&CK Framework'
      }
    ],
    anssiSpecific: [
      {
        id: 'w2_expertise_assessment',
        name: 'Évaluation de l\'expertise',
        description: 'Cotation précise de l\'expertise des sources (1-4)',
        weight: 7,
        category: 'important',
        anssiReference: 'ANSSI - Caractérisation des sources'
      }
    ]
  };

  /**
   * Valide Workshop 1 selon les critères ANSSI stricts
   */
  static validateWorkshop1(
    businessValues: BusinessValue[],
    dreadedEvents: DreadedEvent[],
    supportingAssets: SupportingAsset[]
  ): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Validation critique : Nombre minimum de valeurs métier
    if (businessValues.length < 3) {
      issues.push('Nombre insuffisant de valeurs métier (minimum 3 requis selon ANSSI)');
      score -= 20;
    }

    // Validation critique : Couverture des événements redoutés
    const criticalBusinessValues = businessValues.filter(bv => bv.priority >= 3);
    const eventsPerCriticalValue = criticalBusinessValues.map(bv => ({
      value: bv,
      events: dreadedEvents.filter(de => de.businessValueId === bv.id)
    }));

    const valuesWithoutEvents = eventsPerCriticalValue.filter(item => item.events.length === 0);
    if (valuesWithoutEvents.length > 0) {
      issues.push(`${valuesWithoutEvents.length} valeur(s) métier critique(s) sans événement redouté`);
      score -= 15 * valuesWithoutEvents.length;
    }

    // Validation critique : Évaluation des impacts
    const eventsWithoutImpact = dreadedEvents.filter(de => !de.impact || de.impact < 1 || de.impact > 4);
    if (eventsWithoutImpact.length > 0) {
      issues.push(`${eventsWithoutImpact.length} événement(s) redouté(s) sans évaluation d'impact valide (1-4)`);
      score -= 10 * eventsWithoutImpact.length;
    }

    // Validation importante : Actifs supports
    const valuesWithInsufficientAssets = businessValues.filter(bv => {
      const relatedAssets = supportingAssets.filter(sa => sa.businessValueId === bv.id);
      return relatedAssets.length < 2;
    });

    if (valuesWithInsufficientAssets.length > 0) {
      warnings.push(`${valuesWithInsufficientAssets.length} valeur(s) métier avec moins de 2 actifs supports`);
      score -= 5 * valuesWithInsufficientAssets.length;
    }

    // Validation ANSSI : Échelles de cotation
    const invalidScales = businessValues.filter(bv => 
      !bv.priority || bv.priority < 1 || bv.priority > 4
    );
    if (invalidScales.length > 0) {
      issues.push(`${invalidScales.length} valeur(s) métier avec cotation invalide (échelle ANSSI 1-4)`);
      score -= 8 * invalidScales.length;
    }

    // Recommandations
    if (supportingAssets.filter(sa => sa.vulnerabilities && sa.vulnerabilities.length > 0).length === 0) {
      recommendations.push('Documenter les vulnérabilités et contrôles de sécurité existants pour chaque actif support');
    }

    return {
      isValid: issues.length === 0,
      score: Math.max(0, score),
      criticalIssues: issues,
      warnings,
      recommendations,
      anssiCompliance: {
        workshop1: Math.max(0, score),
        workshop2: 0,
        workshop3: 0,
        workshop4: 0,
        workshop5: 0,
        overall: Math.max(0, score) / 5
      }
    };
  }

  /**
   * Valide Workshop 2 selon les critères ANSSI stricts
   */
  static validateWorkshop2(
    riskSources: RiskSource[],
    businessValues: BusinessValue[]
  ): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Validation critique : Diversité des sources de risque
    const categories = [...new Set(riskSources.map(rs => rs.category))];
    if (categories.length < 3) {
      issues.push(`Diversité insuffisante des sources de risque (${categories.length}/3 catégories minimum)`);
      score -= 25;
    }

    // Validation critique : Cartographie des objectifs
    const sourcesWithoutObjectives = riskSources.filter(rs => 
      !rs.objectives || rs.objectives.length === 0
    );
    if (sourcesWithoutObjectives.length > 0) {
      issues.push(`${sourcesWithoutObjectives.length} source(s) de risque sans objectifs définis`);
      score -= 15 * sourcesWithoutObjectives.length;
    }

    // Validation importante : Modes opératoires
    const criticalSources = riskSources.filter(rs => 
      (typeof rs.expertise === 'number' ? rs.expertise : 2) >= 3 || 
      (typeof rs.resources === 'number' ? rs.resources : 2) >= 3
    );
    
    const criticalSourcesWithoutModes = criticalSources.filter(rs => 
      !rs.operationalModes || rs.operationalModes.length < 2
    );
    
    if (criticalSourcesWithoutModes.length > 0) {
      warnings.push(`${criticalSourcesWithoutModes.length} source(s) critique(s) avec moins de 2 modes opératoires`);
      score -= 8 * criticalSourcesWithoutModes.length;
    }

    // Validation ANSSI : Évaluation de l'expertise
    const invalidExpertise = riskSources.filter(rs => {
      const expertise = typeof rs.expertise === 'number' ? rs.expertise : 0;
      return expertise < 1 || expertise > 4;
    });
    
    if (invalidExpertise.length > 0) {
      issues.push(`${invalidExpertise.length} source(s) avec évaluation d'expertise invalide (échelle ANSSI 1-4)`);
      score -= 10 * invalidExpertise.length;
    }

    // Recommandations
    const sourcesWithoutTechniques = riskSources.filter(rs =>
      !rs.operationalModes || rs.operationalModes.every(om => !om.techniques || om.techniques.length === 0)
    );

    if (sourcesWithoutTechniques.length > 0) {
      recommendations.push(`Associer des techniques MITRE ATT&CK aux modes opératoires (${sourcesWithoutTechniques.length} sources concernées)`);
    }

    return {
      isValid: issues.length === 0,
      score: Math.max(0, score),
      criticalIssues: issues,
      warnings,
      recommendations,
      anssiCompliance: {
        workshop1: 0,
        workshop2: Math.max(0, score),
        workshop3: 0,
        workshop4: 0,
        workshop5: 0,
        overall: Math.max(0, score) / 5
      }
    };
  }

  /**
   * Validation globale de la mission selon ANSSI
   */
  static validateMission(mission: Mission): ValidationResult {
    // Validation consolidée de tous les workshops
    const results: ValidationResult[] = [];
    
    // Ajouter les validations spécifiques selon les données disponibles
    // Cette méthode sera étendue avec les autres workshops
    
    return {
      isValid: false,
      score: 0,
      criticalIssues: ['Validation globale non implémentée'],
      warnings: [],
      recommendations: ['Implémenter la validation globale'],
      anssiCompliance: {
        workshop1: 0,
        workshop2: 0,
        workshop3: 0,
        workshop4: 0,
        workshop5: 0,
        overall: 0
      }
    };
  }

  /**
   * Génère un rapport de conformité ANSSI
   */
  static generateComplianceReport(validationResult: ValidationResult): string {
    const { score, criticalIssues, warnings, recommendations, anssiCompliance } = validationResult;
    
    let report = `# Rapport de Conformité ANSSI EBIOS RM v1.5\n\n`;
    report += `## Score Global : ${score}/100\n\n`;
    
    if (criticalIssues.length > 0) {
      report += `## ❌ Problèmes Critiques (${criticalIssues.length})\n`;
      criticalIssues.forEach((issue, index) => {
        report += `${index + 1}. ${issue}\n`;
      });
      report += '\n';
    }
    
    if (warnings.length > 0) {
      report += `## ⚠️ Avertissements (${warnings.length})\n`;
      warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
      report += '\n';
    }
    
    if (recommendations.length > 0) {
      report += `## 💡 Recommandations (${recommendations.length})\n`;
      recommendations.forEach((rec, index) => {
        report += `${index + 1}. ${rec}\n`;
      });
      report += '\n';
    }
    
    report += `## Conformité par Atelier\n`;
    report += `- Atelier 1 : ${anssiCompliance.workshop1}/100\n`;
    report += `- Atelier 2 : ${anssiCompliance.workshop2}/100\n`;
    report += `- Atelier 3 : ${anssiCompliance.workshop3}/100\n`;
    report += `- Atelier 4 : ${anssiCompliance.workshop4}/100\n`;
    report += `- Atelier 5 : ${anssiCompliance.workshop5}/100\n`;
    
    return report;
  }
}
