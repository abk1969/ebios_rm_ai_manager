import {
  BusinessValue,
  SupportingAsset,
  RiskSource,
  DreadedEvent,
  StrategicScenario,
  SecurityMeasure,
  GravityScale,
  LikelihoodScale,
  RiskLevel
} from '@/types/ebios';
import {
  RISK_SOURCE_CATEGORIES,
  SUPPORTING_ASSET_TYPES,
  EbiosUtils,
  EBIOS_SCALES
} from '@/lib/ebios-constants';
import { dataQualityDetector, DataQualityReport } from './ai/DataQualityDetector';

export interface AISuggestion {
  id: string;
  type: 'suggestion' | 'warning' | 'error' | 'best-practice';
  title: string;
  description: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  relatedData?: any;
  source: 'anssi' | 'iso27005' | 'ebios-rm' | 'expert-knowledge';
}

export interface ValidationResult {
  isValid: boolean;
  errors: AISuggestion[];
  warnings: AISuggestion[];
  suggestions: AISuggestion[];
  score: number; // 0-100
}

export interface ContextualHelp {
  title: string;
  content: string;
  examples: string[];
  bestPractices: string[];
  anssiReferences: string[];
}

class AIAssistantService {
  
  // === ASSISTANCE CONTEXTUELLES MÉTIER ===

  /**
   * Génère des suggestions pour les valeurs métier
   */
  suggestBusinessValues(existingValues: BusinessValue[], organizationType?: string): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const existingCategories = new Set(existingValues.map(v => v.category).filter(Boolean));
    
    // Suggestions basées sur le type d'organisation
    const commonBusinessValues = {
      'commercial': [
        { category: 'financial', name: 'Chiffre d\'affaires', description: 'Revenus générés par l\'activité commerciale' },
        { category: 'reputation', name: 'Image de marque', description: 'Réputation et confiance des clients' },
        { category: 'operational', name: 'Continuité de service', description: 'Capacité à maintenir les services clients' }
      ],
      'public': [
        { category: 'service', name: 'Service public', description: 'Mission de service public aux citoyens' },
        { category: 'legal', name: 'Conformité réglementaire', description: 'Respect des obligations légales' },
        { category: 'operational', name: 'Continuité administrative', description: 'Fonctionnement continu des services' }
      ],
      'healthcare': [
        { category: 'safety', name: 'Sécurité des patients', description: 'Protection et sécurité des soins' },
        { category: 'legal', name: 'Secret médical', description: 'Confidentialité des données de santé' },
        { category: 'operational', name: 'Continuité des soins', description: 'Maintien des soins essentiels' }
      ]
    };

    const orgType = organizationType || 'commercial';
    const recommendedValues = commonBusinessValues[orgType as keyof typeof commonBusinessValues] || commonBusinessValues.commercial;

    recommendedValues.forEach((value, index) => {
      if (!existingCategories.has(value.category as any)) {
        suggestions.push({
          id: `bv-suggest-${index}`,
          type: 'suggestion',
          title: `Valeur métier recommandée : ${value.name}`,
          description: `${value.description}. Cette valeur est typique pour votre type d'organisation.`,
          actionText: 'Ajouter cette valeur métier',
          priority: 'medium',
          category: 'business-values',
          relatedData: value,
          source: 'expert-knowledge'
        });
      }
    });

    // Vérification de la complétude
    if (existingValues.length < 3) {
      suggestions.push({
        id: 'bv-completeness',
        type: 'warning',
        title: 'Nombre insuffisant de valeurs métier',
        description: 'L\'ANSSI recommande d\'identifier au moins 3-5 valeurs métier principales pour une analyse complète.',
        priority: 'medium',
        category: 'completeness',
        source: 'anssi'
      });
    }

    return suggestions;
  }

  /**
   * 🔍 NOUVEAU : Valide la qualité des données saisies
   */
  validateDataQuality(data: {
    businessValues?: BusinessValue[];
    dreadedEvents?: DreadedEvent[];
    supportingAssets?: SupportingAsset[];
  }): ValidationResult {
    const errors: AISuggestion[] = [];
    const warnings: AISuggestion[] = [];
    const suggestions: AISuggestion[] = [];
    let score = 100;

    // Validation des valeurs métier
    if (data.businessValues) {
      for (const bv of data.businessValues) {
        const qualityReport = dataQualityDetector.analyzeBusinessValue(bv.name, bv.description);

        if (!qualityReport.isValid) {
          for (const issue of qualityReport.issues) {
            if (issue.severity === 'critical' || issue.severity === 'high') {
              errors.push({
                id: `quality-${issue.id}`,
                type: 'error',
                title: `❌ Données invalides : ${bv.name}`,
                description: issue.message,
                actionText: issue.autoFixAvailable ? 'Corriger automatiquement' : 'Corriger manuellement',
                priority: issue.severity === 'critical' ? 'critical' : 'high',
                category: 'data-quality',
                relatedData: {
                  field: issue.field,
                  suggestedValue: issue.suggestedValue,
                  originalValue: issue.value
                },
                source: 'expert-knowledge'
              });
            }
          }
          score -= (100 - qualityReport.overallScore) / 4;
        }
      }
    }

    // Validation des événements redoutés
    if (data.dreadedEvents) {
      for (const de of data.dreadedEvents) {
        const qualityReport = dataQualityDetector.analyzeDreadedEvent(de.name, de.description);

        if (!qualityReport.isValid) {
          for (const issue of qualityReport.issues) {
            if (issue.severity === 'critical' || issue.severity === 'high') {
              errors.push({
                id: `quality-${issue.id}`,
                type: 'error',
                title: `❌ Événement redouté invalide : ${de.name}`,
                description: issue.message,
                actionText: issue.autoFixAvailable ? 'Corriger automatiquement' : 'Corriger manuellement',
                priority: issue.severity === 'critical' ? 'critical' : 'high',
                category: 'data-quality',
                relatedData: {
                  field: issue.field,
                  suggestedValue: issue.suggestedValue,
                  originalValue: issue.value
                },
                source: 'expert-knowledge'
              });
            }
          }
          score -= (100 - qualityReport.overallScore) / 4;
        }
      }
    }

    // Validation des actifs supports
    if (data.supportingAssets) {
      for (const sa of data.supportingAssets) {
        const qualityReport = dataQualityDetector.analyzeSupportingAsset(sa.name, sa.description);

        if (!qualityReport.isValid) {
          for (const issue of qualityReport.issues) {
            if (issue.severity === 'critical' || issue.severity === 'high') {
              warnings.push({
                id: `quality-${issue.id}`,
                type: 'warning',
                title: `⚠️ Actif support suspect : ${sa.name}`,
                description: issue.message,
                actionText: issue.autoFixAvailable ? 'Corriger automatiquement' : 'Corriger manuellement',
                priority: issue.severity === 'critical' ? 'critical' : 'high',
                category: 'data-quality',
                relatedData: {
                  field: issue.field,
                  suggestedValue: issue.suggestedValue,
                  originalValue: issue.value
                },
                source: 'expert-knowledge'
              });
            }
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    };
  }

  /**
   * Valide les actifs de soutien selon EBIOS RM
   */
  validateSupportingAssets(assets: SupportingAsset[], businessValues: BusinessValue[]): ValidationResult {
    const errors: AISuggestion[] = [];
    const warnings: AISuggestion[] = [];
    const suggestions: AISuggestion[] = [];
    let score = 100;

    // Vérification de la couverture des types d'actifs
    const existingTypes = new Set(assets.map(a => a.type));
    const requiredTypes = ['data', 'software', 'hardware', 'network'];
    
    requiredTypes.forEach(type => {
      if (!existingTypes.has(type as any)) {
        warnings.push({
          id: `asset-type-${type}`,
          type: 'warning',
          title: `Type d'actif manquant : ${SUPPORTING_ASSET_TYPES[type as keyof typeof SUPPORTING_ASSET_TYPES]}`,
          description: 'Ce type d\'actif est généralement présent dans la plupart des organisations.',
          priority: 'medium',
          category: 'asset-coverage',
          source: 'ebios-rm'
        });
        score -= 10;
      }
    });

    // Vérification des liaisons avec les valeurs métier
    assets.forEach(asset => {
      if (!asset.relatedBusinessValues || asset.relatedBusinessValues.length === 0) {
        errors.push({
          id: `asset-no-bv-${asset.id}`,
          type: 'error',
          title: `Actif non lié : ${asset.name}`,
          description: 'Chaque actif de soutien doit supporter au moins une valeur métier selon EBIOS RM.',
          priority: 'high',
          category: 'asset-linkage',
          source: 'anssi'
        });
        score -= 15;
      }
    });

    // Suggestions d'amélioration de criticité
    assets.forEach(asset => {
      if (asset.criticality === 'low' && asset.relatedBusinessValues && asset.relatedBusinessValues.length > 2) {
        suggestions.push({
          id: `asset-criticality-${asset.id}`,
          type: 'suggestion',
          title: `Réévaluer la criticité : ${asset.name}`,
          description: 'Cet actif supporte plusieurs valeurs métier, sa criticité pourrait être sous-évaluée.',
          priority: 'medium',
          category: 'risk-assessment',
          source: 'expert-knowledge'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    };
  }

  /**
   * Suggère des sources de risque basées sur le contexte
   */
  suggestRiskSources(existingSources: RiskSource[], assets: SupportingAsset[]): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const existingCategories = new Set(existingSources.map(s => s.category));

    // Sources de risque communes par type d'actif
    const assetTypes = new Set(assets.map(a => a.type));
    
    if (assetTypes.has('data') && !existingCategories.has('cybercriminal')) {
      suggestions.push({
        id: 'rs-cybercriminal',
        type: 'suggestion',
        title: 'Source de risque recommandée : Cybercriminels',
        description: 'Vous avez des actifs de données. Les cybercriminels représentent une menace majeure pour ce type d\'actif.',
        actionText: 'Ajouter cette source de risque',
        priority: 'high',
        category: 'risk-sources',
        relatedData: {
          category: 'cybercriminal',
          name: 'Cybercriminels organisés',
          description: 'Groupes criminels spécialisés dans le vol et le chantage de données'
        },
        source: 'expert-knowledge'
      });
    }

    if (assetTypes.has('software') && !existingCategories.has('insider')) {
      suggestions.push({
        id: 'rs-insider',
        type: 'suggestion',
        title: 'Source de risque recommandée : Menaces internes',
        description: 'Les actifs logiciels sont souvent vulnérables aux menaces internes (employés, prestataires).',
        actionText: 'Ajouter cette source de risque',
        priority: 'medium',
        category: 'risk-sources',
        relatedData: {
          category: 'insider',
          name: 'Personnel interne malveillant',
          description: 'Employés ou prestataires avec accès privilégié'
        },
        source: 'ebios-rm'
      });
    }

    return suggestions;
  }

  /**
   * Valide et améliore les événements redoutés
   */
  validateDreadedEvents(events: DreadedEvent[], businessValues: BusinessValue[]): ValidationResult {
    const errors: AISuggestion[] = [];
    const warnings: AISuggestion[] = [];
    const suggestions: AISuggestion[] = [];
    let score = 100;

    // Vérification de la couverture des valeurs métier
    const coveredBusinessValues = new Set();
    events.forEach(event => {
      event.impactedBusinessValues?.forEach(bvId => coveredBusinessValues.add(bvId));
    });

    businessValues.forEach(bv => {
      if (!coveredBusinessValues.has(bv.id)) {
        warnings.push({
          id: `bv-uncovered-${bv.id}`,
          type: 'warning',
          title: `Valeur métier non couverte : ${bv.name}`,
          description: 'Cette valeur métier n\'est affectée par aucun événement redouté identifié.',
          priority: 'medium',
          category: 'coverage',
          source: 'ebios-rm'
        });
        score -= 10;
      }
    });

    // Suggestions d'événements redoutés classiques
    const commonDreadedEvents = [
      {
        pattern: 'confidentialité',
        name: 'Atteinte à la confidentialité des données',
        description: 'Divulgation non autorisée d\'informations sensibles'
      },
      {
        pattern: 'disponibilité',
        name: 'Perte de disponibilité des services',
        description: 'Interruption ou dégradation des services essentiels'
      },
      {
        pattern: 'intégrité',
        name: 'Altération de l\'intégrité des données',
        description: 'Modification non autorisée d\'informations critiques'
      }
    ];

    commonDreadedEvents.forEach((template, index) => {
      const hasEvent = events.some(event => 
        event.name.toLowerCase().includes(template.pattern) ||
        event.description.toLowerCase().includes(template.pattern)
      );
      
      if (!hasEvent) {
        suggestions.push({
          id: `de-suggest-${index}`,
          type: 'suggestion',
          title: `Événement redouté manquant : ${template.name}`,
          description: `${template.description}. Cet événement est critique dans la plupart des analyses EBIOS RM.`,
          actionText: 'Ajouter cet événement',
          priority: 'high',
          category: 'dreaded-events',
          relatedData: template,
          source: 'anssi'
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    };
  }

  /**
   * Analyse et suggère des améliorations pour les scénarios stratégiques
   */
  analyzeStrategicScenarios(scenarios: StrategicScenario[], riskSources: RiskSource[], events: DreadedEvent[]): ValidationResult {
    const errors: AISuggestion[] = [];
    const warnings: AISuggestion[] = [];
    const suggestions: AISuggestion[] = [];
    let score = 100;

    // Matrice de couverture
    const coverageMatrix = new Map<string, Set<string>>();
    scenarios.forEach(scenario => {
      if (!coverageMatrix.has(scenario.riskSourceId)) {
        coverageMatrix.set(scenario.riskSourceId, new Set());
      }
      coverageMatrix.get(scenario.riskSourceId)?.add(scenario.dreadedEventId);
    });

    // Vérification de la couverture
    riskSources.forEach(source => {
      const coveredEvents = coverageMatrix.get(source.id)?.size || 0;
      if (coveredEvents === 0) {
        warnings.push({
          id: `rs-no-scenarios-${source.id}`,
          type: 'warning',
          title: `Source de risque non exploitée : ${source.name}`,
          description: 'Cette source de risque n\'est associée à aucun scénario stratégique.',
          priority: 'medium',
          category: 'scenario-coverage',
          source: 'ebios-rm'
        });
        score -= 10;
      }
    });

    // Analyse des niveaux de risque
    const highRiskScenarios = scenarios.filter(s => {
      const event = events.find(e => e.id === s.dreadedEventId);
      if (event) {
        const riskLevel = EbiosUtils.calculateRiskLevel(event.gravity, s.likelihood);
        return riskLevel === 'critical' || riskLevel === 'high';
      }
      return false;
    });

    if (highRiskScenarios.length > scenarios.length * 0.7) {
      warnings.push({
        id: 'too-many-high-risks',
        type: 'warning',
        title: 'Trop de scénarios à risque élevé',
        description: 'Plus de 70% de vos scénarios présentent un risque élevé. Vérifiez la calibration de vos cotations.',
        priority: 'medium',
        category: 'risk-calibration',
        source: 'expert-knowledge'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      score: Math.max(0, score)
    };
  }

  /**
   * Génère de l'aide contextuelle pour un atelier donné
   */
  getContextualHelp(workshopId: number, currentData?: any): ContextualHelp {
    const helpContent: Record<number, ContextualHelp> = {
      1: {
        title: 'Atelier 1 : Cadrage et Événements Redoutés',
        content: 'Identifiez vos valeurs métier et les événements redoutés qui pourraient les affecter.',
        examples: [
          'Valeur métier : "Chiffre d\'affaires" - Impact financier direct',
          'Événement redouté : "Atteinte à la confidentialité des données clients"',
          'Liaison : Perte de confiance → Baisse du chiffre d\'affaires'
        ],
        bestPractices: [
          'Limitez-vous à 3-7 valeurs métier principales',
          'Formulez les événements redoutés comme des impacts négatifs',
          'Assurez-vous que chaque valeur métier est couverte par au moins un événement',
          'Cotez la gravité selon l\'échelle ANSSI (1-4)'
        ],
        anssiReferences: [
          'Guide EBIOS Risk Manager - Section 3.1',
          'Méthode EBIOS 2010 - Étude des enjeux',
          'ISO 27005 - Établissement du contexte'
        ]
      },
      2: {
        title: 'Atelier 2 : Sources de Risque',
        content: 'Identifiez qui pourrait s\'intéresser à vos valeurs métier et comment.',
        examples: [
          'Cybercriminels → Motivation financière → Données clients',
          'Concurrents → Espionnage industriel → Secrets techniques',
          'Hacktivistes → Protestation → Image de marque'
        ],
        bestPractices: [
          'Utilisez la taxonomie EBIOS RM (7 catégories)',
          'Caractérisez expertise, ressources et motivation',
          'Évaluez la pertinence pour votre organisation',
          'Ne négligez pas les menaces internes'
        ],
        anssiReferences: [
          'Guide EBIOS Risk Manager - Section 3.2',
          'ANSSI - Panorama de la cybermenace',
          'ENISA Threat Landscape'
        ]
      },
      3: {
        title: 'Atelier 3 : Scénarios Stratégiques',
        content: 'Croisez sources de risque et événements redoutés pour construire des scénarios.',
        examples: [
          'Cybercriminels + Atteinte confidentialité → Ransomware',
          'Insider + Perte intégrité → Sabotage de données',
          'État + Espionnage → APT ciblée'
        ],
        bestPractices: [
          'Un scénario = 1 source de risque + 1 événement redouté',
          'Décrivez le chemin d\'attaque logique',
          'Cotez la vraisemblance selon les capacités de la source',
          'Priorisez selon la matrice de risque ANSSI'
        ],
        anssiReferences: [
          'Guide EBIOS Risk Manager - Section 3.3',
          'MITRE ATT&CK Framework',
          'ANSSI - Matrice de risque'
        ]
      }
    };

    return helpContent[workshopId] || {
      title: 'Aide EBIOS RM',
      content: 'Consultez la documentation ANSSI pour plus d\'informations.',
      examples: [],
      bestPractices: [],
      anssiReferences: []
    };
  }

  /**
   * Suggère des mesures de sécurité basées sur les scénarios
   */
  suggestSecurityMeasures(scenarios: StrategicScenario[], existingMeasures: SecurityMeasure[] = []): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const existingMeasureTypes = new Set(existingMeasures.map(m => m.type));

    // Suggestions basées sur les scénarios à haut risque
    const highRiskScenarios = scenarios.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical');
    
    if (highRiskScenarios.length > 0 && !existingMeasureTypes.has('detective' as any)) {
      suggestions.push({
        id: 'measure-technical',
        type: 'suggestion',
        title: 'Mesures techniques recommandées',
        description: 'Implémentez des contrôles techniques pour réduire la vraisemblance des scénarios critiques.',
        actionText: 'Ajouter des mesures techniques',
        priority: 'high',
        category: 'security-measures',
        relatedData: {
          type: 'technical',
          examples: ['Antivirus', 'Pare-feu', 'Chiffrement', 'Authentification forte']
        },
        source: 'iso27005'
      });
    }

    return suggestions;
  }

  /**
   * Génère un score de maturité EBIOS RM global
   */
  calculateMaturityScore(data: {
    businessValues: BusinessValue[];
    supportingAssets: SupportingAsset[];
    riskSources: RiskSource[];
    dreadedEvents: DreadedEvent[];
    strategicScenarios: StrategicScenario[];
    securityMeasures?: SecurityMeasure[];
  }): {
    overallScore: number;
    workshopScores: Record<number, number>;
    recommendations: AISuggestion[];
  } {
    const recommendations: AISuggestion[] = [];
    
    // Calcul des scores par atelier
    const bvValidation = this.validateSupportingAssets(data.supportingAssets, data.businessValues);
    const deValidation = this.validateDreadedEvents(data.dreadedEvents, data.businessValues);
    const ssValidation = this.analyzeStrategicScenarios(data.strategicScenarios, data.riskSources, data.dreadedEvents);
    
    const workshopScores = {
      1: Math.min(100, (data.businessValues.length * 20) + (data.dreadedEvents.length * 15)),
      2: Math.min(100, data.riskSources.length * 25),
      3: ssValidation.score,
      4: data.strategicScenarios.length > 0 ? 75 : 0, // Placeholder pour l'atelier 4
      5: data.securityMeasures ? Math.min(100, data.securityMeasures.length * 20) : 0
    };

    const overallScore = Object.values(workshopScores).reduce((sum, score) => sum + score, 0) / 5;

    // Recommandations générales
    if (overallScore < 60) {
      recommendations.push({
        id: 'maturity-low',
        type: 'warning',
        title: 'Maturité EBIOS RM insuffisante',
        description: 'Votre analyse nécessite des améliorations significatives pour être conforme aux recommandations ANSSI.',
        priority: 'critical',
        category: 'maturity',
        source: 'anssi'
      });
    }

    return {
      overallScore,
      workshopScores,
      recommendations
    };
  }
}

export const aiAssistant = new AIAssistantService(); 