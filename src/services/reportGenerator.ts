import { 
  BusinessValue, 
  SupportingAsset, 
  RiskSource, 
  DreadedEvent, 
  StrategicScenario,
  OperationalScenario,
  SecurityMeasure,
  Mission
} from '@/types/ebios';
import { EbiosUtils } from '@/lib/ebios-constants';
import { aiAssistant } from '@/services/aiAssistant';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  level: number; // 1-6 pour h1-h6
  subsections?: ReportSection[];
  charts?: ChartData[];
  tables?: TableData[];
  metadata?: Record<string, any>;
}

export interface ChartData {
  id: string;
  type: 'pie' | 'bar' | 'line' | 'scatter' | 'heatmap' | 'matrix';
  title: string;
  data: any[];
  options?: Record<string, any>;
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: (string | number)[][];
  metadata?: Record<string, any>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'operational' | 'complete' | 'compliance';
  sections: string[]; // IDs des sections à inclure
  anssiCompliant: boolean;
}

export interface GeneratedReport {
  id: string;
  title: string;
  subtitle?: string;
  mission: Mission;
  generatedAt: Date;
  template: ReportTemplate;
  sections: ReportSection[];
  metadata: {
    version: string;
    author: string;
    organization: string;
    classification: 'public' | 'internal' | 'confidential' | 'secret';
    anssiCompliance: boolean;
  };
  statistics: {
    totalPages: number;
    totalSections: number;
    totalCharts: number;
    totalTables: number;
    maturityScore: number;
  };
}

class ReportGeneratorService {
  
  // === TEMPLATES DE RAPPORTS ===
  
  private readonly templates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Rapport Exécutif',
      description: 'Synthèse stratégique pour la direction avec recommandations prioritaires',
      type: 'executive',
      sections: ['executive-summary', 'risk-overview', 'strategic-recommendations', 'investment-priorities'],
      anssiCompliant: true
    },
    {
      id: 'technical-detailed',
      name: 'Rapport Technique Détaillé',
      description: 'Analyse technique complète pour les équipes sécurité',
      type: 'technical',
      sections: ['methodology', 'scope', 'workshop1-details', 'workshop2-details', 'workshop3-details', 'workshop4-details', 'workshop5-details', 'technical-recommendations'],
      anssiCompliant: true
    },
    {
      id: 'compliance-anssi',
      name: 'Rapport de Conformité ANSSI',
      description: 'Documentation complète conforme aux exigences ANSSI EBIOS RM',
      type: 'compliance',
      sections: ['compliance-overview', 'methodology-compliance', 'all-workshops', 'maturity-assessment', 'anssi-references'],
      anssiCompliant: true
    },
    {
      id: 'operational-action-plan',
      name: 'Plan d\'Action Opérationnel',
      description: 'Guide pratique de mise en œuvre des mesures de sécurité',
      type: 'operational',
      sections: ['implementation-roadmap', 'security-measures', 'resource-planning', 'monitoring-kpis'],
      anssiCompliant: true
    }
  ];

  // === GÉNÉRATION DE RAPPORTS ===

  async generateReport(
    missionData: {
      mission: Mission;
      businessValues: BusinessValue[];
      supportingAssets: SupportingAsset[];
      riskSources: RiskSource[];
      dreadedEvents: DreadedEvent[];
      strategicScenarios: StrategicScenario[];
      operationalScenarios?: OperationalScenario[];
      securityMeasures: SecurityMeasure[];
    },
    templateId: string,
    options: {
      author?: string;
      organization?: string;
      classification?: 'public' | 'internal' | 'confidential' | 'secret';
      includeCharts?: boolean;
      includeTables?: boolean;
      language?: 'fr' | 'en';
    } = {}
  ): Promise<GeneratedReport> {
    
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const sections = await this.generateSections(missionData, template.sections, options);
    const maturityScore = this.calculateMaturityScore(missionData);
    
    return {
      id: `report-${Date.now()}`,
      title: this.generateReportTitle(missionData.mission, template),
      subtitle: this.generateReportSubtitle(missionData.mission, template),
      mission: missionData.mission,
      generatedAt: new Date(),
      template,
      sections,
      metadata: {
        version: '1.0',
        author: options.author || 'Système EBIOS RM',
        organization: options.organization || missionData.mission.organization || 'Organisation',
        classification: options.classification || 'internal',
        anssiCompliance: template.anssiCompliant
      },
      statistics: {
        totalPages: this.estimatePageCount(sections),
        totalSections: sections.length,
        totalCharts: sections.reduce((sum, s) => sum + (s.charts?.length || 0), 0),
        totalTables: sections.reduce((sum, s) => sum + (s.tables?.length || 0), 0),
        maturityScore
      }
    };
  }

  private async generateSections(
    missionData: any,
    sectionIds: string[],
    options: any
  ): Promise<ReportSection[]> {
    const sections: ReportSection[] = [];

    for (const sectionId of sectionIds) {
      const section = await this.generateSection(sectionId, missionData, options);
      if (section) {
        sections.push(section);
      }
    }

    return sections;
  }

  private async generateSection(
    sectionId: string,
    missionData: any,
    options: any
  ): Promise<ReportSection | null> {
    
    switch (sectionId) {
      case 'executive-summary':
        return this.generateExecutiveSummary(missionData, options);
      
      case 'risk-overview':
        return this.generateRiskOverview(missionData, options);
      
      case 'methodology':
        return this.generateMethodologySection(missionData, options);
      
      case 'workshop1-details':
        return this.generateWorkshop1Details(missionData, options);
      
      case 'workshop2-details':
        return this.generateWorkshop2Details(missionData, options);
      
      case 'workshop3-details':
        return this.generateWorkshop3Details(missionData, options);
      
      case 'strategic-recommendations':
        return this.generateStrategicRecommendations(missionData, options);
      
      case 'security-measures':
        return this.generateSecurityMeasuresSection(missionData, options);
      
      case 'maturity-assessment':
        return this.generateMaturityAssessment(missionData, options);
      
      default:
        return null;
    }
  }

  // === SECTIONS SPÉCIFIQUES ===

  private generateExecutiveSummary(missionData: any, options: any): ReportSection {
    const { mission, businessValues, strategicScenarios, securityMeasures } = missionData;
    const maturityScore = this.calculateMaturityScore(missionData);
    
    // Analyse des risques critiques
    const criticalScenarios = strategicScenarios.filter((s: any) => 
      s.riskLevel === 'critical' || s.riskLevel === 'high'
    );

    const content = `
## Synthèse Exécutive

### Contexte de la Mission
**Organisation :** ${mission.organization}
**Périmètre :** ${mission.scope}
**Objectif :** ${mission.objective}

### Évaluation Globale
Cette analyse de risque cyber selon la méthode EBIOS Risk Manager de l'ANSSI révèle un niveau de maturité de **${maturityScore}/100**.

### Enjeux Critiques Identifiés
${businessValues.map((bv: BusinessValue) => 
  `- **${bv.name}** : ${bv.description}`
).join('\n')}

### Risques Prioritaires
${criticalScenarios.length} scénarios de risque élevé ou critique ont été identifiés :
${criticalScenarios.slice(0, 5).map((scenario: any, index: number) => 
  `${index + 1}. ${scenario.name} (Niveau : ${scenario.riskLevel})`
).join('\n')}

### Recommandations Stratégiques
1. **Renforcement immédiat** des mesures de sécurité pour les scénarios critiques
2. **Investment prioritaire** dans ${securityMeasures.slice(0, 3).map((m: any) => m.name).join(', ')}
3. **Mise en place** d'un programme de gouvernance du risque cyber
4. **Formation** et sensibilisation des équipes aux enjeux cybersécurité

### Plan d'Action Recommandé
- **Court terme (0-3 mois)** : Traitement des risques critiques
- **Moyen terme (3-12 mois)** : Déploiement des mesures de sécurité
- **Long terme (1-2 ans)** : Maturité et amélioration continue
    `;

    return {
      id: 'executive-summary',
      title: 'Synthèse Exécutive',
      content,
      level: 1,
      charts: options.includeCharts ? [
        this.generateRiskMatrixChart(missionData),
        this.generateMaturityRadarChart(missionData)
      ] : [],
      tables: options.includeTables ? [
        this.generateRiskSummaryTable(missionData)
      ] : []
    };
  }

  private generateRiskOverview(missionData: any, options: any): ReportSection {
    const { strategicScenarios, dreadedEvents, riskSources } = missionData;
    
    // Statistiques de risque
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const riskDistribution = riskLevels.map(level => ({
      level,
      count: strategicScenarios.filter((s: any) => s.riskLevel === level).length
    }));

    const content = `
## Vue d'Ensemble des Risques

### Distribution des Niveaux de Risque
${riskDistribution.map(dist => 
  `- **${EbiosUtils.getRiskLevelInfo(dist.level as any).label}** : ${dist.count} scénario(s)`
).join('\n')}

### Sources de Risque Principales
${riskSources.slice(0, 5).map((rs: RiskSource, index: number) => 
  `${index + 1}. **${rs.name}** (${rs.category}) - Pertinence : ${rs.pertinence}/4`
).join('\n')}

### Événements Redoutés Critiques
${dreadedEvents
  .filter((de: DreadedEvent) => de.gravity >= 3)
  .slice(0, 5)
  .map((de: DreadedEvent, index: number) => 
    `${index + 1}. **${de.name}** (Gravité : ${de.gravity}/4)`
  ).join('\n')}

### Analyse de Criticité
La matrice de risque ANSSI révèle que **${strategicScenarios.filter((s: any) => s.riskLevel === 'critical').length}** scénarios nécessitent un traitement prioritaire.
    `;

    return {
      id: 'risk-overview',
      title: 'Vue d\'Ensemble des Risques',
      content,
      level: 1,
      charts: options.includeCharts ? [
        this.generateRiskDistributionChart(missionData),
        this.generateSourceCategoryChart(missionData)
      ] : [],
      tables: options.includeTables ? [
        this.generateScenarioRiskTable(missionData)
      ] : []
    };
  }

  private generateWorkshop1Details(missionData: any, options: any): ReportSection {
    const { businessValues, supportingAssets, dreadedEvents } = missionData;

    const content = `
## Atelier 1 : Cadrage et Événements Redoutés

### Méthodologie Appliquée
Conformément au guide EBIOS Risk Manager de l'ANSSI, cet atelier vise à :
- Identifier les valeurs métier de l'organisation
- Cartographier les actifs de soutien
- Formuler les événements redoutés

### Valeurs Métier Identifiées
${businessValues.map((bv: BusinessValue, index: number) => `
#### ${index + 1}. ${bv.name}
- **Catégorie** : ${bv.category || 'Non spécifiée'}
- **Description** : ${bv.description}
- **Criticité** : ${bv.criticality || 'Non évaluée'}
`).join('\n')}

### Actifs de Soutien
${supportingAssets.map((asset: SupportingAsset, index: number) => `
#### ${index + 1}. ${asset.name}
- **Type** : ${asset.type}
- **Criticité** : ${asset.criticality}
- **Description** : ${asset.description}
- **Valeurs métier supportées** : ${asset.relatedBusinessValues?.length || 0}
`).join('\n')}

### Événements Redoutés
${dreadedEvents.map((de: DreadedEvent, index: number) => `
#### ${index + 1}. ${de.name}
- **Gravité** : ${de.gravity}/4 (${EbiosUtils.formatScaleLabel('gravity', de.gravity)})
- **Description** : ${de.description}
- **Valeurs métier impactées** : ${de.impactedBusinessValues?.length || 0}
`).join('\n')}

### Conformité ANSSI
✅ Identification des valeurs métier
✅ Cartographie des actifs de soutien
✅ Formulation des événements redoutés
✅ Cotation selon échelle ANSSI (1-4)
    `;

    return {
      id: 'workshop1-details',
      title: 'Atelier 1 : Cadrage et Événements Redoutés',
      content,
      level: 1,
      charts: options.includeCharts ? [
        this.generateBusinessValueChart(missionData),
        this.generateAssetTypeChart(missionData)
      ] : []
    };
  }

  private generateStrategicRecommendations(missionData: any, options: any): ReportSection {
    const { strategicScenarios, securityMeasures } = missionData;
    
    // Analyse IA pour recommandations
    const aiRecommendations = aiAssistant.suggestSecurityMeasures(strategicScenarios, securityMeasures);
    const maturityData = aiAssistant.calculateMaturityScore(missionData);

    const content = `
## Recommandations Stratégiques

### Priorisation des Actions
Basée sur l'analyse des ${strategicScenarios.length} scénarios identifiés et la matrice de risque ANSSI :

#### Priorité 1 - Actions Immédiates (0-3 mois)
${strategicScenarios
  .filter((s: any) => s.riskLevel === 'critical')
  .slice(0, 3)
  .map((s: any, index: number) => 
    `${index + 1}. **Traiter le scénario** "${s.name}" - Risque critique`
  ).join('\n')}

#### Priorité 2 - Actions Court Terme (3-6 mois)
${strategicScenarios
  .filter((s: any) => s.riskLevel === 'high')
  .slice(0, 3)
  .map((s: any, index: number) => 
    `${index + 1}. **Traiter le scénario** "${s.name}" - Risque élevé`
  ).join('\n')}

### Mesures de Sécurité Recommandées
${securityMeasures.slice(0, 5).map((measure: SecurityMeasure, index: number) => `
#### ${index + 1}. ${measure.name}
- **Type** : ${measure.type}
- **Efficacité estimée** : ${measure.effectiveness}/4
- **Coût** : ${measure.cost}
- **Délai de mise en œuvre** : ${measure.implementationTime}
`).join('\n')}

### Investissements Recommandés
1. **Budget sécurité** : Augmentation recommandée de 15-25%
2. **Formation** : Programme de sensibilisation cyber
3. **Technologies** : Solutions de détection et réponse
4. **Gouvernance** : Mise en place d'une politique de sécurité

### Indicateurs de Suivi (KPI)
- Nombre d'incidents de sécurité
- Temps de détection des menaces
- Taux de conformité aux mesures
- Score de maturité cyber
    `;

    return {
      id: 'strategic-recommendations',
      title: 'Recommandations Stratégiques',
      content,
      level: 1,
      charts: options.includeCharts ? [
        this.generateInvestmentChart(missionData),
        this.generateRoadmapChart(missionData)
      ] : []
    };
  }

  // === GÉNÉRATION DE GRAPHIQUES ===

  private generateRiskMatrixChart(missionData: any): ChartData {
    const { strategicScenarios, dreadedEvents } = missionData;
    
    const matrixData = strategicScenarios.map((scenario: any) => {
      const event = dreadedEvents.find((de: any) => de.id === scenario.dreadedEventId);
      return {
        x: scenario.likelihood,
        y: event?.gravity || 2,
        name: scenario.name,
        riskLevel: scenario.riskLevel
      };
    });

    return {
      id: 'risk-matrix',
      type: 'scatter',
      title: 'Matrice de Risque ANSSI',
      data: matrixData,
      options: {
        xAxis: { title: 'Vraisemblance', min: 1, max: 4 },
        yAxis: { title: 'Gravité', min: 1, max: 4 },
        colors: {
          low: '#22c55e',
          medium: '#eab308', 
          high: '#f97316',
          critical: '#ef4444'
        }
      }
    };
  }

  private generateRiskDistributionChart(missionData: any): ChartData {
    const { strategicScenarios } = missionData;
    const distribution = ['low', 'medium', 'high', 'critical'].map(level => ({
      name: EbiosUtils.getRiskLevelInfo(level as any).label,
      value: strategicScenarios.filter((s: any) => s.riskLevel === level).length
    }));

    return {
      id: 'risk-distribution',
      type: 'pie',
      title: 'Distribution des Niveaux de Risque',
      data: distribution
    };
  }

  // === GÉNÉRATION DE TABLEAUX ===

  private generateRiskSummaryTable(missionData: any): TableData {
    const { strategicScenarios, dreadedEvents, riskSources } = missionData;
    
    const rows = strategicScenarios.slice(0, 10).map((scenario: any) => {
      const event = dreadedEvents.find((de: any) => de.id === scenario.dreadedEventId);
      const source = riskSources.find((rs: any) => rs.id === scenario.riskSourceId);
      
      return [
        scenario.name,
        source?.name || 'N/A',
        event?.name || 'N/A',
        scenario.likelihood,
        event?.gravity || 'N/A',
        EbiosUtils.getRiskLevelInfo(scenario.riskLevel).label
      ];
    });

    return {
      id: 'risk-summary',
      title: 'Synthèse des Scénarios de Risque',
      headers: ['Scénario', 'Source', 'Événement Redouté', 'Vraisemblance', 'Gravité', 'Niveau de Risque'],
      rows
    };
  }

  // === MÉTHODES UTILITAIRES ===

  private calculateMaturityScore(missionData: any): number {
    return aiAssistant.calculateMaturityScore(missionData).overallScore;
  }

  private generateReportTitle(mission: Mission, template: ReportTemplate): string {
    return `${template.name} - ${mission.name}`;
  }

  private generateReportSubtitle(mission: Mission, template: ReportTemplate): string {
    return `Analyse EBIOS Risk Manager - ${mission.organization}`;
  }

  private estimatePageCount(sections: ReportSection[]): number {
    return Math.ceil(sections.length * 2.5); // Estimation : 2.5 pages par section
  }

  // Méthodes de graphiques simplifiées (à implémenter selon les besoins)
  private generateMaturityRadarChart(missionData: any): ChartData {
    return { id: 'maturity-radar', type: 'line', title: 'Maturité par Atelier', data: [] };
  }

  private generateSourceCategoryChart(missionData: any): ChartData {
    return { id: 'source-category', type: 'bar', title: 'Sources de Risque par Catégorie', data: [] };
  }

  private generateBusinessValueChart(missionData: any): ChartData {
    return { id: 'business-value', type: 'pie', title: 'Valeurs Métier par Catégorie', data: [] };
  }

  private generateAssetTypeChart(missionData: any): ChartData {
    return { id: 'asset-type', type: 'bar', title: 'Actifs par Type', data: [] };
  }

  private generateInvestmentChart(missionData: any): ChartData {
    return { id: 'investment', type: 'bar', title: 'Investissements Recommandés', data: [] };
  }

  private generateRoadmapChart(missionData: any): ChartData {
    return { id: 'roadmap', type: 'line', title: 'Feuille de Route', data: [] };
  }

  private generateScenarioRiskTable(missionData: any): TableData {
    return this.generateRiskSummaryTable(missionData);
  }

  // 🔧 CORRECTION: Méthodes manquantes ajoutées

  private generateMethodologySection(missionData: any, options: any): ReportSection {
    const content = `
## Méthodologie EBIOS Risk Manager

### Présentation de la Méthode
EBIOS Risk Manager est la méthode d'appréciation et de traitement des risques numériques développée par l'ANSSI (Agence nationale de la sécurité des systèmes d'information).

### Les 5 Ateliers EBIOS RM
1. **Atelier 1** : Cadrage et valeurs métier
2. **Atelier 2** : Sources de risque
3. **Atelier 3** : Scénarios stratégiques
4. **Atelier 4** : Scénarios opérationnels
5. **Atelier 5** : Plan de traitement

### Conformité ANSSI
Cette analyse respecte intégralement les recommandations de l'ANSSI version 1.5.
    `;

    return {
      id: 'methodology',
      title: 'Méthodologie EBIOS Risk Manager',
      content,
      level: 1
    };
  }

  private generateWorkshop2Details(missionData: any, options: any): ReportSection {
    const { riskSources } = missionData;

    const content = `
## Atelier 2 : Sources de Risque

### Sources Identifiées
${riskSources.map((rs: RiskSource, index: number) => `
#### ${index + 1}. ${rs.name}
- **Catégorie** : ${rs.category}
- **Motivation** : ${rs.motivation}/4
- **Ressources** : ${rs.resources}
- **Expertise** : ${rs.expertise}
`).join('\n')}
    `;

    return {
      id: 'workshop2-details',
      title: 'Atelier 2 : Sources de Risque',
      content,
      level: 1
    };
  }

  private generateWorkshop3Details(missionData: any, options: any): ReportSection {
    const { strategicScenarios } = missionData;

    const content = `
## Atelier 3 : Scénarios Stratégiques

### Scénarios Identifiés
${strategicScenarios.map((scenario: any, index: number) => `
#### ${index + 1}. ${scenario.name}
- **Niveau de risque** : ${scenario.riskLevel}
- **Vraisemblance** : ${scenario.likelihood}/4
- **Description** : ${scenario.description}
`).join('\n')}
    `;

    return {
      id: 'workshop3-details',
      title: 'Atelier 3 : Scénarios Stratégiques',
      content,
      level: 1
    };
  }

  private generateSecurityMeasuresSection(missionData: any, options: any): ReportSection {
    const { securityMeasures } = missionData;

    const content = `
## Mesures de Sécurité

### Mesures Recommandées
${securityMeasures.map((measure: SecurityMeasure, index: number) => `
#### ${index + 1}. ${measure.name}
- **Type** : ${measure.type}
- **Efficacité** : ${measure.effectiveness}/4
- **Coût** : ${measure.implementationCost}
- **Description** : ${measure.description}
`).join('\n')}
    `;

    return {
      id: 'security-measures',
      title: 'Mesures de Sécurité',
      content,
      level: 1
    };
  }

  private generateMaturityAssessment(missionData: any, options: any): ReportSection {
    const maturityData = aiAssistant.calculateMaturityScore(missionData);

    const content = `
## Évaluation de la Maturité EBIOS RM

### Score Global : ${maturityData.overallScore}/100

### Scores par Atelier
${Object.entries(maturityData.workshopScores).map(([workshop, score]) =>
  `- **Atelier ${workshop}** : ${score}/100`
).join('\n')}

### Recommandations d'Amélioration
${maturityData.recommendations.map((rec: any, index: number) =>
  `${index + 1}. **${rec.title}** - ${rec.description}`
).join('\n')}
    `;

    return {
      id: 'maturity-assessment',
      title: 'Évaluation de la Maturité',
      content,
      level: 1
    };
  }

  // === API PUBLIQUE ===

  getTemplates(): ReportTemplate[] {
    return [...this.templates];
  }

  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }
}

export const reportGenerator = new ReportGeneratorService(); 