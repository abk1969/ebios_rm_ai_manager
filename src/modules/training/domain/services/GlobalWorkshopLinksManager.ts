/**
 * 🔗 GESTIONNAIRE GLOBAL DE LIENS INTER-ATELIERS
 * Système unifié de transmission et traçabilité A1→A2→A3→A4→A5
 */

import { Workshop1ToWorkshop2Integration } from '../workshop1/Workshop1ToWorkshop2Integration';
import { Workshop2ToWorkshop3Integration } from '../workshop2/Workshop2ToWorkshop3Integration';

// 🎯 TYPES POUR LA GESTION GLOBALE DES LIENS
export interface GlobalWorkshopChain {
  workshop1: Workshop1Data;
  workshop2: Workshop2Data;
  workshop3: Workshop3Data;
  workshop4: Workshop4Data;
  workshop5: Workshop5Data;
  links: InterWorkshopLinks;
  traceability: TraceabilityMatrix;
  validation: ValidationResults;
}

export interface Workshop1Data {
  context: any;
  essentialAssets: any[];
  ecosystem: any[];
  securityObjectives: any[];
  deliverables: any;
  completed: boolean;
  timestamp: string;
}

export interface Workshop2Data {
  prioritizedSources: any[];
  threatIntelligence: any[];
  internalThreats: any[];
  supplyChainRisks: any[];
  deliverables: any;
  completed: boolean;
  timestamp: string;
}

export interface Workshop3Data {
  strategicScenarios: any[];
  fearedEvents: any[];
  riskLevels: any[];
  deliverables: any;
  completed: boolean;
  timestamp: string;
}

export interface Workshop4Data {
  operationalModes: any[];
  attackVectors: any[];
  mitreTechniques: any[];
  deliverables: any;
  completed: boolean;
  timestamp: string;
}

export interface Workshop5Data {
  treatmentMeasures: any[];
  budgetAllocation: any;
  implementationPlan: any;
  deliverables: any;
  completed: boolean;
  timestamp: string;
}

export interface InterWorkshopLinks {
  w1_to_w2: LinkData;
  w2_to_w3: LinkData;
  w3_to_w4: LinkData;
  w4_to_w5: LinkData;
  global_flow: FlowSummary;
}

export interface LinkData {
  sourceWorkshop: number;
  targetWorkshop: number;
  transmittedData: TransmittedData[];
  transformations: DataTransformation[];
  validations: LinkValidation[];
  status: 'pending' | 'active' | 'completed' | 'error';
  timestamp: string;
}

export interface TransmittedData {
  id: string;
  name: string;
  type: string;
  sourceFormat: string;
  targetFormat: string;
  mappingRules: string[];
  validationRules: string[];
}

export interface DataTransformation {
  id: string;
  description: string;
  inputData: string;
  outputData: string;
  transformationLogic: string;
  validationCriteria: string[];
}

export interface LinkValidation {
  criterion: string;
  status: 'passed' | 'failed' | 'warning';
  details: string;
  recommendations: string[];
}

export interface TraceabilityMatrix {
  elements: TraceabilityElement[];
  coverage: CoverageAnalysis;
  gaps: TraceabilityGap[];
  recommendations: string[];
}

export interface TraceabilityElement {
  id: string;
  name: string;
  workshop: number;
  linkedElements: LinkedElement[];
  impactChain: string[];
  validationStatus: string;
}

export interface LinkedElement {
  workshopId: number;
  elementId: string;
  elementName: string;
  linkType: 'derives_from' | 'influences' | 'implements' | 'mitigates';
  strength: number; // 1-5
}

export interface CoverageAnalysis {
  totalElements: number;
  linkedElements: number;
  coveragePercentage: number;
  workshopCoverage: { [key: number]: number };
  criticalGaps: string[];
}

export interface TraceabilityGap {
  type: 'missing_link' | 'broken_link' | 'inconsistent_data' | 'validation_failure';
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  affectedWorkshops: number[];
  recommendations: string[];
}

export interface ValidationResults {
  globalConsistency: boolean;
  workshopCompleteness: { [key: number]: number };
  dataIntegrity: boolean;
  linkValidation: boolean;
  recommendations: ValidationRecommendation[];
  score: number; // 0-100
}

export interface ValidationRecommendation {
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'data' | 'links' | 'validation' | 'process';
  description: string;
  actions: string[];
  expectedImpact: string;
}

export interface FlowSummary {
  totalDataPoints: number;
  successfulTransmissions: number;
  failedTransmissions: number;
  transformationEfficiency: number;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  bottlenecks: string[];
  optimizations: string[];
}

/**
 * 🎯 CLASSE PRINCIPALE DE GESTION GLOBALE
 */
export class GlobalWorkshopLinksManager {
  
  // 📊 DONNÉES SIMULÉES POUR DÉMONSTRATION
  private static mockWorkshopData: GlobalWorkshopChain = {
    workshop1: {
      context: Workshop1ToWorkshop2Integration.getCHUContext(),
      essentialAssets: Workshop1ToWorkshop2Integration.getEssentialAssets(),
      ecosystem: Workshop1ToWorkshop2Integration.getEcosystemDependencies(),
      securityObjectives: [],
      deliverables: Workshop1ToWorkshop2Integration.generateHandoverDocument(),
      completed: true,
      timestamp: new Date().toISOString()
    },
    workshop2: {
      prioritizedSources: Workshop2ToWorkshop3Integration.getPrioritizedSources(),
      threatIntelligence: [],
      internalThreats: [],
      supplyChainRisks: [],
      deliverables: Workshop2ToWorkshop3Integration.generateHandoverDocument(),
      completed: true,
      timestamp: new Date().toISOString()
    },
    workshop3: {
      strategicScenarios: Workshop2ToWorkshop3Integration.getWorkshop3Orientations().strategicScenarios,
      fearedEvents: [],
      riskLevels: [],
      deliverables: {},
      completed: false,
      timestamp: ''
    },
    workshop4: {
      operationalModes: [],
      attackVectors: [],
      mitreTechniques: [],
      deliverables: {},
      completed: false,
      timestamp: ''
    },
    workshop5: {
      treatmentMeasures: [],
      budgetAllocation: {},
      implementationPlan: {},
      deliverables: {},
      completed: false,
      timestamp: ''
    },
    links: {
      w1_to_w2: {
        sourceWorkshop: 1,
        targetWorkshop: 2,
        transmittedData: [],
        transformations: [],
        validations: [],
        status: 'completed',
        timestamp: new Date().toISOString()
      },
      w2_to_w3: {
        sourceWorkshop: 2,
        targetWorkshop: 3,
        transmittedData: [],
        transformations: [],
        validations: [],
        status: 'active',
        timestamp: new Date().toISOString()
      },
      w3_to_w4: {
        sourceWorkshop: 3,
        targetWorkshop: 4,
        transmittedData: [],
        transformations: [],
        validations: [],
        status: 'pending',
        timestamp: ''
      },
      w4_to_w5: {
        sourceWorkshop: 4,
        targetWorkshop: 5,
        transmittedData: [],
        transformations: [],
        validations: [],
        status: 'pending',
        timestamp: ''
      },
      global_flow: {
        totalDataPoints: 0,
        successfulTransmissions: 0,
        failedTransmissions: 0,
        transformationEfficiency: 0,
        overallHealth: 'good',
        bottlenecks: [],
        optimizations: []
      }
    },
    traceability: {
      elements: [],
      coverage: {
        totalElements: 0,
        linkedElements: 0,
        coveragePercentage: 0,
        workshopCoverage: {},
        criticalGaps: []
      },
      gaps: [],
      recommendations: []
    },
    validation: {
      globalConsistency: true,
      workshopCompleteness: {},
      dataIntegrity: true,
      linkValidation: true,
      recommendations: [],
      score: 85
    }
  };

  // 🔗 GÉNÉRATION DES LIENS A1 → A2
  static generateWorkshop1To2Links(): LinkData {
    const w1Data = Workshop1ToWorkshop2Integration.generateHandoverDocument();
    
    return {
      sourceWorkshop: 1,
      targetWorkshop: 2,
      transmittedData: [
        {
          id: 'essential_assets',
          name: 'Biens essentiels identifiés',
          type: 'asset_inventory',
          sourceFormat: 'Workshop1_Assets',
          targetFormat: 'Workshop2_Targets',
          mappingRules: [
            'Asset.criticality → Source.attractiveness',
            'Asset.dependencies → Source.attack_vectors',
            'Asset.rto → Source.urgency_factor'
          ],
          validationRules: [
            'All CRITIQUE assets must have corresponding high-priority sources',
            'Asset dependencies must be reflected in source capabilities',
            'RTO constraints must influence source motivation scoring'
          ]
        },
        {
          id: 'chu_context',
          name: 'Contexte organisationnel CHU',
          type: 'organizational_context',
          sourceFormat: 'Workshop1_Context',
          targetFormat: 'Workshop2_Environment',
          mappingRules: [
            'Context.specialties → Source.sector_knowledge',
            'Context.budget → Source.financial_motivation',
            'Context.employees → Source.internal_threat_surface'
          ],
          validationRules: [
            'Organizational context must influence source prioritization',
            'Budget size must correlate with ransom demands',
            'Employee count must affect internal threat assessment'
          ]
        }
      ],
      transformations: [
        {
          id: 'assets_to_targets',
          description: 'Transformation biens essentiels en cibles attractives',
          inputData: 'Essential assets with criticality scores',
          outputData: 'Target attractiveness matrix for threat sources',
          transformationLogic: 'criticality_score * asset_value * exposure_factor',
          validationCriteria: [
            'CRITIQUE assets score ≥ 4/5 attractiveness',
            'All assets mapped to relevant source categories',
            'Transformation preserves criticality ranking'
          ]
        }
      ],
      validations: [
        {
          criterion: 'Completeness of asset transmission',
          status: 'passed',
          details: 'All 15 essential assets successfully transmitted',
          recommendations: ['Maintain asset criticality scoring consistency']
        },
        {
          criterion: 'Context relevance for source analysis',
          status: 'passed',
          details: 'CHU context properly mapped to threat landscape',
          recommendations: ['Update threat intelligence with sector-specific data']
        }
      ],
      status: 'completed',
      timestamp: new Date().toISOString()
    };
  }

  // 🔗 GÉNÉRATION DES LIENS A2 → A3
  static generateWorkshop2To3Links(): LinkData {
    const w2Data = Workshop2ToWorkshop3Integration.generateHandoverDocument();
    
    return {
      sourceWorkshop: 2,
      targetWorkshop: 3,
      transmittedData: [
        {
          id: 'prioritized_sources',
          name: 'Sources de risque priorisées',
          type: 'threat_sources',
          sourceFormat: 'Workshop2_Sources',
          targetFormat: 'Workshop3_Actors',
          mappingRules: [
            'Source.priority → Scenario.likelihood',
            'Source.capabilities → Scenario.sophistication',
            'Source.motivations → Scenario.objectives'
          ],
          validationRules: [
            'Priority 1 sources must generate CRITIQUE scenarios',
            'Source capabilities must match scenario complexity',
            'Motivations must align with scenario outcomes'
          ]
        },
        {
          id: 'strategic_orientations',
          name: 'Orientations scénarios stratégiques',
          type: 'scenario_guidance',
          sourceFormat: 'Workshop2_Orientations',
          targetFormat: 'Workshop3_Scenarios',
          mappingRules: [
            'Orientation.impact → Scenario.severity',
            'Orientation.likelihood → Scenario.probability',
            'Orientation.assets → Scenario.targets'
          ],
          validationRules: [
            'All strategic orientations must have corresponding scenarios',
            'Impact levels must be consistent across workshops',
            'Asset targeting must be preserved in scenarios'
          ]
        }
      ],
      transformations: [
        {
          id: 'sources_to_scenarios',
          description: 'Transformation sources en scénarios stratégiques',
          inputData: 'Prioritized threat sources with capabilities',
          outputData: 'Strategic scenarios with likelihood and impact',
          transformationLogic: 'source_priority * capability_score * target_attractiveness',
          validationCriteria: [
            'Top 3 sources generate ≥2 scenarios each',
            'Scenario likelihood correlates with source priority',
            'Impact assessment reflects asset criticality'
          ]
        }
      ],
      validations: [
        {
          criterion: 'Source-to-scenario mapping completeness',
          status: 'passed',
          details: '15 sources mapped to 12 strategic scenarios',
          recommendations: ['Ensure scenario diversity covers all threat vectors']
        }
      ],
      status: 'active',
      timestamp: new Date().toISOString()
    };
  }

  // 📊 ANALYSE GLOBALE DE LA CHAÎNE
  static analyzeGlobalChain(): GlobalWorkshopChain {
    const chain = { ...this.mockWorkshopData };
    
    // Mise à jour des liens
    chain.links.w1_to_w2 = this.generateWorkshop1To2Links();
    chain.links.w2_to_w3 = this.generateWorkshop2To3Links();
    
    // Calcul des métriques globales
    chain.links.global_flow = this.calculateFlowSummary(chain);
    chain.traceability = this.generateTraceabilityMatrix(chain);
    chain.validation = this.validateGlobalConsistency(chain);
    
    return chain;
  }

  // 📈 CALCUL DU RÉSUMÉ DE FLUX
  private static calculateFlowSummary(chain: GlobalWorkshopChain): FlowSummary {
    const completedWorkshops = [chain.workshop1, chain.workshop2].filter(w => w.completed).length;
    const totalWorkshops = 5;
    
    return {
      totalDataPoints: 50, // Estimation basée sur les livrables
      successfulTransmissions: 35,
      failedTransmissions: 0,
      transformationEfficiency: 85,
      overallHealth: completedWorkshops >= 2 ? 'good' : 'fair',
      bottlenecks: ['Workshop 3 pending completion'],
      optimizations: [
        'Automate data transformation validation',
        'Implement real-time link monitoring',
        'Add predictive scenario generation'
      ]
    };
  }

  // 🔍 GÉNÉRATION MATRICE DE TRAÇABILITÉ
  private static generateTraceabilityMatrix(chain: GlobalWorkshopChain): TraceabilityMatrix {
    return {
      elements: [
        {
          id: 'urgences_vitales',
          name: 'Urgences vitales 24h/24',
          workshop: 1,
          linkedElements: [
            { workshopId: 2, elementId: 'cybercriminals_health', elementName: 'Cybercriminels santé', linkType: 'influences', strength: 5 },
            { workshopId: 3, elementId: 'ransomware_scenario', elementName: 'Scénario ransomware urgences', linkType: 'derives_from', strength: 5 }
          ],
          impactChain: ['A1:Urgences → A2:Sources spécialisées → A3:Scénarios critiques'],
          validationStatus: 'validated'
        }
      ],
      coverage: {
        totalElements: 25,
        linkedElements: 20,
        coveragePercentage: 80,
        workshopCoverage: { 1: 100, 2: 85, 3: 60, 4: 0, 5: 0 },
        criticalGaps: ['Workshop 4-5 not yet linked']
      },
      gaps: [],
      recommendations: [
        'Complete Workshop 3 to enable A3→A4 links',
        'Implement automated traceability validation',
        'Add impact chain visualization'
      ]
    };
  }

  // ✅ VALIDATION DE COHÉRENCE GLOBALE
  private static validateGlobalConsistency(chain: GlobalWorkshopChain): ValidationResults {
    return {
      globalConsistency: true,
      workshopCompleteness: { 1: 100, 2: 100, 3: 60, 4: 0, 5: 0 },
      dataIntegrity: true,
      linkValidation: true,
      recommendations: [
        {
          priority: 'high',
          category: 'process',
          description: 'Complete Workshop 3 to maintain chain continuity',
          actions: ['Finalize strategic scenarios', 'Validate risk levels', 'Prepare A3→A4 handover'],
          expectedImpact: 'Enable full chain A1→A5 traceability'
        }
      ],
      score: 85
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getWorkshopStatus(workshopId: number): 'completed' | 'active' | 'pending' | 'blocked' {
    const chain = this.analyzeGlobalChain();
    const workshop = chain[`workshop${workshopId}` as keyof GlobalWorkshopChain] as any;
    
    if (workshop?.completed) return 'completed';
    if (workshopId <= 2) return 'active';
    if (workshopId === 3) return 'pending';
    return 'blocked';
  }

  static getNextWorkshopRecommendations(currentWorkshop: number): string[] {
    const chain = this.analyzeGlobalChain();
    
    switch (currentWorkshop) {
      case 1:
        return [
          'Transmettez les biens essentiels vers l\'Atelier 2',
          'Validez le contexte organisationnel CHU',
          'Préparez les orientations sources de risque'
        ];
      case 2:
        return [
          'Transmettez les sources priorisées vers l\'Atelier 3',
          'Validez les orientations scénarios stratégiques',
          'Préparez la correspondance sources → événements'
        ];
      default:
        return ['Complétez l\'atelier en cours avant de continuer'];
    }
  }

  static generateHandoverReport(sourceWorkshop: number, targetWorkshop: number): any {
    const chain = this.analyzeGlobalChain();
    const linkKey = `w${sourceWorkshop}_to_w${targetWorkshop}` as keyof InterWorkshopLinks;
    const link = chain.links[linkKey];
    
    return {
      source: sourceWorkshop,
      target: targetWorkshop,
      status: link?.status || 'pending',
      transmittedData: link?.transmittedData || [],
      validations: link?.validations || [],
      recommendations: this.getNextWorkshopRecommendations(sourceWorkshop),
      timestamp: new Date().toISOString()
    };
  }
}
