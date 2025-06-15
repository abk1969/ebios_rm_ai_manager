/**
 * 🔗 SERVICE DE TRAÇABILITÉ INTER-ATELIERS EBIOS RM
 * Assure la cohérence et les liens entre les différents ateliers
 * Conforme aux exigences ANSSI EBIOS RM v1.5
 */

import type { 
  BusinessValue, 
  DreadedEvent, 
  SupportingAsset, 
  RiskSource, 
  StrategicScenario,
  SecurityMeasure,
  Mission 
} from '@/types/ebios';

export interface TraceabilityLink {
  fromWorkshop: number;
  toWorkshop: number;
  fromEntity: string;
  toEntity: string;
  linkType: 'required' | 'recommended' | 'optional';
  status: 'complete' | 'partial' | 'missing';
  description: string;
}

export interface TraceabilityReport {
  missionId: string;
  overallScore: number; // 0-100
  completeness: {
    workshop1to2: number;
    workshop2to3: number;
    workshop3to4: number;
    workshop4to5: number;
    overall: number;
  };
  missingLinks: TraceabilityLink[];
  brokenLinks: TraceabilityLink[];
  recommendations: string[];
  anssiCompliance: {
    isCompliant: boolean;
    gaps: string[];
  };
}

export class InterWorkshopTraceability {

  /**
   * 🔍 ANALYSE COMPLÈTE DE LA TRAÇABILITÉ
   */
  static analyzeTraceability(
    mission: Mission,
    businessValues: BusinessValue[],
    dreadedEvents: DreadedEvent[],
    supportingAssets: SupportingAsset[],
    riskSources: RiskSource[],
    strategicScenarios: StrategicScenario[],
    securityMeasures: SecurityMeasure[]
  ): TraceabilityReport {
    
    const links: TraceabilityLink[] = [];
    const missingLinks: TraceabilityLink[] = [];
    const brokenLinks: TraceabilityLink[] = [];

    // 🔗 TRAÇABILITÉ WORKSHOP 1 → 2
    const w1to2Links = this.checkWorkshop1to2Links(businessValues, riskSources);
    links.push(...w1to2Links.complete);
    missingLinks.push(...w1to2Links.missing);

    // 🔗 TRAÇABILITÉ WORKSHOP 2 → 3
    const w2to3Links = this.checkWorkshop2to3Links(riskSources, dreadedEvents, strategicScenarios);
    links.push(...w2to3Links.complete);
    missingLinks.push(...w2to3Links.missing);

    // 🔗 TRAÇABILITÉ WORKSHOP 3 → 4
    const w3to4Links = this.checkWorkshop3to4Links(strategicScenarios);
    links.push(...w3to4Links.complete);
    missingLinks.push(...w3to4Links.missing);

    // 🔗 TRAÇABILITÉ WORKSHOP 4 → 5
    const w4to5Links = this.checkWorkshop4to5Links(strategicScenarios, securityMeasures);
    links.push(...w4to5Links.complete);
    missingLinks.push(...w4to5Links.missing);

    // 📊 CALCUL DES SCORES
    const completeness = this.calculateCompleteness(links, missingLinks);
    const overallScore = this.calculateOverallScore(completeness);
    
    // 💡 GÉNÉRATION DES RECOMMANDATIONS
    const recommendations = this.generateRecommendations(missingLinks, brokenLinks);
    
    // ✅ VÉRIFICATION CONFORMITÉ ANSSI
    const anssiCompliance = this.checkANSSICompliance(completeness, missingLinks);

    return {
      missionId: mission.id,
      overallScore,
      completeness,
      missingLinks,
      brokenLinks,
      recommendations,
      anssiCompliance
    };
  }

  /**
   * 🔗 VÉRIFICATION LIENS WORKSHOP 1 → 2
   */
  private static checkWorkshop1to2Links(
    businessValues: BusinessValue[],
    riskSources: RiskSource[]
  ) {
    const complete: TraceabilityLink[] = [];
    const missing: TraceabilityLink[] = [];

    // Vérifier que chaque valeur métier est référencée par au moins une source de risque
    businessValues.forEach(bv => {
      const referencingSources = riskSources.filter(rs => 
        rs.objectives?.some(obj => obj.targetBusinessValueId === bv.id)
      );

      if (referencingSources.length > 0) {
        complete.push({
          fromWorkshop: 1,
          toWorkshop: 2,
          fromEntity: `Valeur métier: ${bv.name}`,
          toEntity: `${referencingSources.length} source(s) de risque`,
          linkType: 'required',
          status: 'complete',
          description: `Valeur métier ciblée par ${referencingSources.length} source(s) de risque`
        });
      } else {
        missing.push({
          fromWorkshop: 1,
          toWorkshop: 2,
          fromEntity: `Valeur métier: ${bv.name}`,
          toEntity: 'Aucune source de risque',
          linkType: 'required',
          status: 'missing',
          description: 'Valeur métier non ciblée par les sources de risque'
        });
      }
    });

    return { complete, missing };
  }

  /**
   * 🔗 VÉRIFICATION LIENS WORKSHOP 2 → 3
   */
  private static checkWorkshop2to3Links(
    riskSources: RiskSource[],
    dreadedEvents: DreadedEvent[],
    strategicScenarios: StrategicScenario[]
  ) {
    const complete: TraceabilityLink[] = [];
    const missing: TraceabilityLink[] = [];

    // Vérifier que chaque source de risque pertinente a des scénarios
    const pertinentSources = riskSources.filter(rs => rs.pertinence >= 2);
    
    pertinentSources.forEach(rs => {
      const relatedScenarios = strategicScenarios.filter(ss => ss.riskSourceId === rs.id);

      if (relatedScenarios.length > 0) {
        complete.push({
          fromWorkshop: 2,
          toWorkshop: 3,
          fromEntity: `Source de risque: ${rs.name}`,
          toEntity: `${relatedScenarios.length} scénario(s) stratégique(s)`,
          linkType: 'required',
          status: 'complete',
          description: `Source de risque avec ${relatedScenarios.length} scénario(s) associé(s)`
        });
      } else {
        missing.push({
          fromWorkshop: 2,
          toWorkshop: 3,
          fromEntity: `Source de risque: ${rs.name}`,
          toEntity: 'Aucun scénario stratégique',
          linkType: 'required',
          status: 'missing',
          description: 'Source de risque pertinente sans scénario stratégique'
        });
      }
    });

    // Vérifier que chaque événement redouté a des scénarios
    dreadedEvents.forEach(de => {
      const relatedScenarios = strategicScenarios.filter(ss => ss.dreadedEventId === de.id);

      if (relatedScenarios.length > 0) {
        complete.push({
          fromWorkshop: 1,
          toWorkshop: 3,
          fromEntity: `Événement redouté: ${de.name}`,
          toEntity: `${relatedScenarios.length} scénario(s) stratégique(s)`,
          linkType: 'required',
          status: 'complete',
          description: `Événement redouté avec ${relatedScenarios.length} scénario(s) associé(s)`
        });
      } else {
        missing.push({
          fromWorkshop: 1,
          toWorkshop: 3,
          fromEntity: `Événement redouté: ${de.name}`,
          toEntity: 'Aucun scénario stratégique',
          linkType: 'required',
          status: 'missing',
          description: 'Événement redouté sans scénario stratégique associé'
        });
      }
    });

    return { complete, missing };
  }

  /**
   * 🔗 VÉRIFICATION LIENS WORKSHOP 3 → 4
   */
  private static checkWorkshop3to4Links(strategicScenarios: StrategicScenario[]) {
    const complete: TraceabilityLink[] = [];
    const missing: TraceabilityLink[] = [];

    strategicScenarios.forEach(ss => {
      const hasPathways = ss.pathways && ss.pathways.length > 0;

      if (hasPathways) {
        complete.push({
          fromWorkshop: 3,
          toWorkshop: 4,
          fromEntity: `Scénario stratégique: ${ss.name}`,
          toEntity: `${ss.pathways!.length} chemin(s) d'attaque`,
          linkType: 'required',
          status: 'complete',
          description: `Scénario avec ${ss.pathways!.length} chemin(s) d'attaque détaillé(s)`
        });
      } else {
        missing.push({
          fromWorkshop: 3,
          toWorkshop: 4,
          fromEntity: `Scénario stratégique: ${ss.name}`,
          toEntity: 'Aucun chemin d\'attaque',
          linkType: 'required',
          status: 'missing',
          description: 'Scénario stratégique sans chemin d\'attaque opérationnel'
        });
      }
    });

    return { complete, missing };
  }

  /**
   * 🔗 VÉRIFICATION LIENS WORKSHOP 4 → 5
   */
  private static checkWorkshop4to5Links(
    strategicScenarios: StrategicScenario[],
    securityMeasures: SecurityMeasure[]
  ) {
    const complete: TraceabilityLink[] = [];
    const missing: TraceabilityLink[] = [];

    // Vérifier que les scénarios critiques ont des mesures de sécurité
    const criticalScenarios = strategicScenarios.filter(ss => Number(ss.riskLevel) >= 3); // 🔧 CORRECTION: Conversion en nombre

    criticalScenarios.forEach(ss => {
      const relatedMeasures = securityMeasures.filter(sm => 
        sm.targetedScenarios?.includes(ss.id)
      );

      if (relatedMeasures.length > 0) {
        complete.push({
          fromWorkshop: 4,
          toWorkshop: 5,
          fromEntity: `Scénario critique: ${ss.name}`,
          toEntity: `${relatedMeasures.length} mesure(s) de sécurité`,
          linkType: 'required',
          status: 'complete',
          description: `Scénario critique couvert par ${relatedMeasures.length} mesure(s)`
        });
      } else {
        missing.push({
          fromWorkshop: 4,
          toWorkshop: 5,
          fromEntity: `Scénario critique: ${ss.name}`,
          toEntity: 'Aucune mesure de sécurité',
          linkType: 'required',
          status: 'missing',
          description: 'Scénario critique sans mesure de sécurité associée'
        });
      }
    });

    return { complete, missing };
  }

  /**
   * 📊 CALCUL DE LA COMPLÉTUDE
   */
  private static calculateCompleteness(
    completeLinks: TraceabilityLink[],
    missingLinks: TraceabilityLink[]
  ) {
    const calculateRatio = (workshop: string) => {
      const complete = completeLinks.filter(l => 
        l.description.includes(workshop) || 
        (l.fromWorkshop.toString() + l.toWorkshop.toString()) === workshop
      ).length;
      const missing = missingLinks.filter(l => 
        l.description.includes(workshop) ||
        (l.fromWorkshop.toString() + l.toWorkshop.toString()) === workshop
      ).length;
      const total = complete + missing;
      return total > 0 ? Math.round((complete / total) * 100) : 100;
    };

    const workshop1to2 = calculateRatio('12');
    const workshop2to3 = calculateRatio('23');
    const workshop3to4 = calculateRatio('34');
    const workshop4to5 = calculateRatio('45');
    const overall = Math.round((workshop1to2 + workshop2to3 + workshop3to4 + workshop4to5) / 4);

    return {
      workshop1to2,
      workshop2to3,
      workshop3to4,
      workshop4to5,
      overall
    };
  }

  /**
   * 📈 CALCUL DU SCORE GLOBAL
   */
  private static calculateOverallScore(completeness: any): number {
    return completeness.overall;
  }

  /**
   * 💡 GÉNÉRATION DES RECOMMANDATIONS
   */
  private static generateRecommendations(
    missingLinks: TraceabilityLink[],
    brokenLinks: TraceabilityLink[]
  ): string[] {
    const recommendations: string[] = [];

    if (missingLinks.length > 0) {
      recommendations.push(`Compléter ${missingLinks.length} lien(s) de traçabilité manquant(s)`);
    }

    if (brokenLinks.length > 0) {
      recommendations.push(`Réparer ${brokenLinks.length} lien(s) de traçabilité brisé(s)`);
    }

    // Recommandations spécifiques par type de lien manquant
    const w1to2Missing = missingLinks.filter(l => l.fromWorkshop === 1 && l.toWorkshop === 2);
    if (w1to2Missing.length > 0) {
      recommendations.push('Associer toutes les valeurs métier à des sources de risque pertinentes');
    }

    const w2to3Missing = missingLinks.filter(l => l.fromWorkshop === 2 && l.toWorkshop === 3);
    if (w2to3Missing.length > 0) {
      recommendations.push('Créer des scénarios stratégiques pour toutes les sources de risque pertinentes');
    }

    return recommendations;
  }

  /**
   * ✅ VÉRIFICATION CONFORMITÉ ANSSI
   */
  private static checkANSSICompliance(
    completeness: any,
    missingLinks: TraceabilityLink[]
  ) {
    const isCompliant = completeness.overall >= 80 && 
                       missingLinks.filter(l => l.linkType === 'required').length === 0;

    const gaps: string[] = [];
    if (completeness.overall < 80) {
      gaps.push('Traçabilité globale insuffisante (< 80%)');
    }

    const requiredMissing = missingLinks.filter(l => l.linkType === 'required');
    if (requiredMissing.length > 0) {
      gaps.push(`${requiredMissing.length} lien(s) obligatoire(s) manquant(s)`);
    }

    return { isCompliant, gaps };
  }
}
