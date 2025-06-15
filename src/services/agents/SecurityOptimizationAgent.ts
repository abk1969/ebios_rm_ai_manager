/**
 * 🔧 AGENT OPTIMISATION SÉCURITÉ - AMÉLIORATION CONTINUE
 * Agent spécialisé dans l'optimisation continue des mesures de sécurité
 * CRITICITÉ : HIGH - Performance et efficacité des contrôles de sécurité
 */

import { 
  AgentService, 
  AgentCapabilityDetails, 
  AgentTask, 
  AgentResult, 
  AgentStatus 
} from './AgentService';
import type { 
  SecurityControl,
  RiskScenario,
  BusinessAsset,
  SupportingAsset
} from '@/types/ebios';

export interface SecurityOptimizationContext {
  organizationProfile: {
    sector: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    maturityLevel: 'initial' | 'managed' | 'defined' | 'quantitatively_managed' | 'optimizing';
    budget: {
      total: number;
      allocated: number;
      available: number;
    };
    constraints: {
      regulatory: string[];
      operational: string[];
      technical: string[];
    };
  };
  currentControls: SecurityControl[];
  riskProfile: {
    scenarios: RiskScenario[];
    appetite: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    tolerance: number; // 0-1
  };
  performanceMetrics: {
    effectiveness: Record<string, number>;
    efficiency: Record<string, number>;
    coverage: Record<string, number>;
    costs: Record<string, number>;
  };
  businessContext: {
    objectives: string[];
    assets: (BusinessAsset | SupportingAsset)[];
    dependencies: string[];
    changeRate: 'low' | 'medium' | 'high';
  };
}

export interface OptimizationRecommendation {
  id: string;
  type: 'enhance' | 'replace' | 'remove' | 'add' | 'reconfigure';
  priority: 'critical' | 'high' | 'medium' | 'low';
  target: {
    controlId?: string;
    controlName?: string;
    category: string;
    domain: string;
  };
  description: string;
  rationale: {
    currentIssues: string[];
    expectedBenefits: string[];
    riskReduction: number; // 0-1
    costBenefit: number; // ROI
  };
  implementation: {
    effort: 'low' | 'medium' | 'high' | 'very_high';
    duration: number; // weeks
    cost: {
      initial: number;
      recurring: number;
    };
    dependencies: string[];
    risks: string[];
  };
  metrics: {
    before: Record<string, number>;
    expectedAfter: Record<string, number>;
    kpis: string[];
  };
  validation: {
    criteria: string[];
    methods: string[];
    timeline: number; // weeks
  };
}

export interface SecurityOptimizationResult {
  analysis: {
    currentState: {
      maturityScore: number; // 0-100
      coverageGaps: string[];
      inefficiencies: string[];
      redundancies: string[];
      costIssues: string[];
    };
    benchmarking: {
      industryComparison: Record<string, number>;
      bestPractices: string[];
      gaps: string[];
    };
    riskAlignment: {
      coveredRisks: string[];
      uncoveredRisks: string[];
      overProtectedAreas: string[];
      underProtectedAreas: string[];
    };
  };
  recommendations: OptimizationRecommendation[];
  roadmap: {
    phases: {
      name: string;
      duration: number;
      recommendations: string[];
      expectedBenefits: string[];
      budget: number;
    }[];
    timeline: number; // total weeks
    totalCost: number;
    expectedROI: number;
  };
  metrics: {
    current: Record<string, number>;
    projected: Record<string, number>;
    improvement: Record<string, number>;
  };
  monitoring: {
    kpis: string[];
    thresholds: Record<string, number>;
    reviewFrequency: string;
    alertConditions: string[];
  };
}

export interface ControlEffectivenessAnalysis {
  controlId: string;
  controlName: string;
  category: string;
  effectiveness: {
    score: number; // 0-100
    factors: {
      coverage: number;
      accuracy: number;
      timeliness: number;
      reliability: number;
    };
    trends: {
      direction: 'improving' | 'stable' | 'degrading';
      rate: number;
      period: string;
    };
  };
  efficiency: {
    costPerIncident: number;
    resourceUtilization: number;
    automationLevel: number;
    maintenanceOverhead: number;
  };
  gaps: {
    coverage: string[];
    performance: string[];
    integration: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}

/**
 * Agent d'optimisation de la sécurité
 */
export class SecurityOptimizationAgent implements AgentService {
  readonly id = 'security-optimization-agent';
  readonly name = 'Agent Optimisation Sécurité';
  readonly version = '1.0.0';

  private benchmarkDatabase = new Map<string, any>();
  private bestPracticesLibrary = new Map<string, any>();
  private optimizationPatterns = new Map<string, any>();
  private costModels = new Map<string, any>();

  constructor() {
    this.initializeOptimizationKnowledge();
  }

  getCapabilities(): AgentCapabilityDetails[] {
    return [
      {
        id: 'analyze-security-posture',
        name: 'Analyse posture sécurité',
        description: 'Analyse complète de la posture de sécurité actuelle',
        inputTypes: ['security_controls', 'risk_profile', 'performance_metrics'],
        outputTypes: ['posture_analysis', 'maturity_assessment'],
        workshop: 5,
        criticality: 'high'
      },
      {
        id: 'identify-optimization-opportunities',
        name: 'Identification opportunités',
        description: 'Identification des opportunités d\'optimisation',
        inputTypes: ['current_controls', 'performance_data', 'cost_data'],
        outputTypes: ['optimization_opportunities', 'recommendations'],
        workshop: 5,
        criticality: 'high'
      },
      {
        id: 'benchmark-against-industry',
        name: 'Benchmark sectoriel',
        description: 'Comparaison avec les standards sectoriels',
        inputTypes: ['organization_profile', 'security_metrics'],
        outputTypes: ['benchmark_analysis', 'gap_assessment'],
        workshop: 5,
        criticality: 'medium'
      },
      {
        id: 'optimize-control-portfolio',
        name: 'Optimisation portefeuille contrôles',
        description: 'Optimisation du portefeuille de contrôles de sécurité',
        inputTypes: ['control_portfolio', 'risk_scenarios', 'budget_constraints'],
        outputTypes: ['optimized_portfolio', 'implementation_plan'],
        workshop: 5,
        criticality: 'high'
      },
      {
        id: 'calculate-security-roi',
        name: 'Calcul ROI sécurité',
        description: 'Calcul du retour sur investissement sécurité',
        inputTypes: ['security_investments', 'risk_reduction', 'incident_costs'],
        outputTypes: ['roi_analysis', 'cost_benefit'],
        workshop: 5,
        criticality: 'medium'
      },
      {
        id: 'monitor-optimization-progress',
        name: 'Suivi progrès optimisation',
        description: 'Surveillance du progrès des optimisations',
        inputTypes: ['optimization_plan', 'current_metrics', 'targets'],
        outputTypes: ['progress_report', 'adjustment_recommendations'],
        workshop: 5,
        criticality: 'low'
      }
    ];
  }

  getStatus(): AgentStatus {
    return AgentStatus.ACTIVE;
  }

  async executeTask(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (task.type) {
        case 'analyze-security-posture':
          result = await this.analyzeSecurityPosture(task.input, task.context as any); // 🔧 CORRECTION: Type assertion
          break;
          
        case 'identify-optimization-opportunities':
          result = await this.identifyOptimizationOpportunities(task.input, task.context);
          break;
          
        case 'benchmark-against-industry':
          result = await this.benchmarkAgainstIndustry(task.input, task.context);
          break;
          
        case 'optimize-control-portfolio':
          result = await this.optimizeControlPortfolio(task.input, task.context);
          break;
          
        case 'calculate-security-roi':
          result = await this.calculateSecurityROI(task.input, task.context);
          break;
          
        case 'monitor-optimization-progress':
          result = await this.monitorOptimizationProgress(task.input, task.context);
          break;
          
        default:
          throw new Error(`Type de tâche non supporté: ${task.type}`);
      }
      
      return {
        taskId: task.id,
        success: true,
        data: result,
        confidence: this.calculateConfidence(task.type, result),
        suggestions: this.generateSuggestions(task.type, result),
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version,
          fallbackUsed: false
        }
      };
      
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version,
          fallbackUsed: false
        }
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const hasBenchmarks = this.benchmarkDatabase.size >= 10;
      const hasBestPractices = this.bestPracticesLibrary.size >= 20;
      const hasPatterns = this.optimizationPatterns.size >= 15;
      const hasCostModels = this.costModels.size >= 5;
      
      return hasBenchmarks && hasBestPractices && hasPatterns && hasCostModels;
    } catch {
      return false;
    }
  }

  async configure(config: Record<string, any>): Promise<void> {
    if (config.benchmarkData) {
      this.loadBenchmarkData(config.benchmarkData);
    }
    
    if (config.bestPractices) {
      this.loadBestPractices(config.bestPractices);
    }
    
    if (config.costModels) {
      this.loadCostModels(config.costModels);
    }
    
    console.log('Configuration Agent Optimisation Sécurité:', config);
  }

  /**
   * Analyse de la posture de sécurité
   */
  private async analyzeSecurityPosture(
    input: {
      securityControls: SecurityControl[];
      riskProfile: any;
      performanceMetrics: any;
    },
    context?: SecurityOptimizationContext
  ): Promise<SecurityOptimizationResult> {
    const { securityControls, riskProfile, performanceMetrics } = input;
    
    // 1. Analyse de l'état actuel
    const currentState = this.analyzeCurrentState(securityControls, performanceMetrics);
    
    // 2. Benchmarking sectoriel
    const benchmarking = this.performBenchmarking(securityControls, context?.organizationProfile);
    
    // 3. Analyse d'alignement avec les risques
    const riskAlignment = this.analyzeRiskAlignment(securityControls, riskProfile);
    
    // 4. Identification des opportunités d'optimisation
    const recommendations = this.generateOptimizationRecommendations(
      currentState,
      benchmarking,
      riskAlignment,
      context
    );
    
    // 5. Génération de la roadmap
    const roadmap = this.generateOptimizationRoadmap(recommendations, context);
    
    // 6. Calcul des métriques
    const metrics = this.calculateOptimizationMetrics(currentState, recommendations);
    
    // 7. Configuration du monitoring
    const monitoring = this.setupOptimizationMonitoring(recommendations, metrics);
    
    return {
      analysis: {
        currentState,
        benchmarking,
        riskAlignment
      },
      recommendations,
      roadmap,
      metrics,
      monitoring
    };
  }

  /**
   * Identification des opportunités d'optimisation
   */
  private async identifyOptimizationOpportunities(
    input: {
      currentControls: SecurityControl[];
      performanceData: any;
      costData: any;
    },
    context?: any
  ): Promise<{ opportunities: OptimizationRecommendation[]; prioritization: any; impact: any }> {
    const { currentControls, performanceData, costData } = input;
    
    // 1. Analyse d'efficacité des contrôles
    const effectivenessAnalysis = this.analyzeControlEffectiveness(currentControls, performanceData);
    
    // 2. Analyse de coût-bénéfice
    const costBenefitAnalysis = this.analyzeCostBenefit(currentControls, costData);
    
    // 3. Identification des redondances
    const redundancyAnalysis = this.identifyRedundancies(currentControls);
    
    // 4. Identification des gaps
    const gapAnalysis = this.identifyControlGaps(currentControls, context);
    
    // 5. Génération des opportunités
    const opportunities = this.generateOpportunities(
      effectivenessAnalysis,
      costBenefitAnalysis,
      redundancyAnalysis,
      gapAnalysis
    );
    
    // 6. Priorisation
    const prioritization = this.prioritizeOpportunities(opportunities);
    
    // 7. Analyse d'impact
    const impact = this.analyzeOptimizationImpact(opportunities);
    
    return {
      opportunities,
      prioritization,
      impact
    };
  }

  /**
   * Benchmark contre l'industrie
   */
  private async benchmarkAgainstIndustry(
    input: { organizationProfile: any; securityMetrics: any },
    context?: any
  ): Promise<{ comparison: any; gaps: string[]; recommendations: string[] }> {
    const { organizationProfile, securityMetrics } = input;
    
    // Récupération des benchmarks sectoriels
    const industryBenchmarks = this.getIndustryBenchmarks(organizationProfile.sector);
    
    // Comparaison des métriques
    const comparison = this.compareMetrics(securityMetrics, industryBenchmarks);
    
    // Identification des gaps
    const gaps = this.identifyBenchmarkGaps(comparison);
    
    // Génération des recommandations
    const recommendations = this.generateBenchmarkRecommendations(gaps, industryBenchmarks);
    
    return {
      comparison,
      gaps,
      recommendations
    };
  }

  /**
   * Optimisation du portefeuille de contrôles
   */
  private async optimizeControlPortfolio(
    input: {
      controlPortfolio: SecurityControl[];
      riskScenarios: RiskScenario[];
      budgetConstraints: any;
    },
    context?: any
  ): Promise<{ optimizedPortfolio: any; implementationPlan: any; costBenefit: any }> {
    const { controlPortfolio, riskScenarios, budgetConstraints } = input;
    
    // 1. Analyse du portefeuille actuel
    const currentAnalysis = this.analyzeCurrentPortfolio(controlPortfolio);
    
    // 2. Modélisation des risques
    const riskModel = this.buildRiskModel(riskScenarios, controlPortfolio);
    
    // 3. Optimisation sous contraintes
    const optimizedPortfolio = this.optimizeUnderConstraints(
      currentAnalysis,
      riskModel,
      budgetConstraints
    );
    
    // 4. Plan d'implémentation
    const implementationPlan = this.generateImplementationPlan(optimizedPortfolio);
    
    // 5. Analyse coût-bénéfice
    const costBenefit = this.calculatePortfolioCostBenefit(optimizedPortfolio, currentAnalysis);
    
    return {
      optimizedPortfolio,
      implementationPlan,
      costBenefit
    };
  }

  /**
   * Calcul du ROI sécurité
   */
  private async calculateSecurityROI(
    input: {
      securityInvestments: any[];
      riskReduction: any;
      incidentCosts: any;
    },
    context?: any
  ): Promise<{ roiAnalysis: any; costBenefit: any; recommendations: string[] }> {
    const { securityInvestments, riskReduction, incidentCosts } = input;
    
    // 1. Calcul des coûts d'investissement
    const investmentCosts = this.calculateInvestmentCosts(securityInvestments);
    
    // 2. Calcul des bénéfices (réduction de risque)
    const benefits = this.calculateSecurityBenefits(riskReduction, incidentCosts);
    
    // 3. Calcul du ROI
    const roiAnalysis = this.calculateROI(investmentCosts, benefits);
    
    // 4. Analyse coût-bénéfice détaillée
    const costBenefit = this.performDetailedCostBenefitAnalysis(investmentCosts, benefits);
    
    // 5. Recommandations d'optimisation
    const recommendations = this.generateROIRecommendations(roiAnalysis, costBenefit);
    
    return {
      roiAnalysis,
      costBenefit,
      recommendations
    };
  }

  /**
   * Surveillance du progrès d'optimisation
   */
  private async monitorOptimizationProgress(
    input: {
      optimizationPlan: any;
      currentMetrics: any;
      targets: any;
    },
    context?: any
  ): Promise<{ progressReport: any; adjustmentRecommendations: string[] }> {
    const { optimizationPlan, currentMetrics, targets } = input;
    
    // 1. Analyse du progrès
    const progressAnalysis = this.analyzeProgress(optimizationPlan, currentMetrics, targets);
    
    // 2. Identification des écarts
    const deviations = this.identifyDeviations(progressAnalysis);
    
    // 3. Génération du rapport de progrès
    const progressReport = this.generateProgressReport(progressAnalysis, deviations);
    
    // 4. Recommandations d'ajustement
    const adjustmentRecommendations = this.generateAdjustmentRecommendations(deviations);
    
    return {
      progressReport,
      adjustmentRecommendations
    };
  }

  // Méthodes utilitaires privées
  
  private initializeOptimizationKnowledge(): void {
    // Benchmarks sectoriels
    this.benchmarkDatabase.set('finance', {
      maturityScore: 75,
      controlCoverage: 85,
      automationLevel: 60,
      incidentResponseTime: 4, // hours
      securityBudgetRatio: 0.12 // % of IT budget
    });

    this.benchmarkDatabase.set('healthcare', {
      maturityScore: 70,
      controlCoverage: 80,
      automationLevel: 45,
      incidentResponseTime: 6,
      securityBudgetRatio: 0.08
    });

    this.benchmarkDatabase.set('manufacturing', {
      maturityScore: 65,
      controlCoverage: 75,
      automationLevel: 50,
      incidentResponseTime: 8,
      securityBudgetRatio: 0.06
    });

    // Meilleures pratiques
    this.bestPracticesLibrary.set('access_control', {
      practices: [
        'Zero Trust Architecture',
        'Multi-factor Authentication',
        'Privileged Access Management',
        'Regular Access Reviews'
      ],
      metrics: {
        effectiveness: 0.85,
        cost: 'medium',
        complexity: 'medium'
      }
    });

    this.bestPracticesLibrary.set('threat_detection', {
      practices: [
        'SIEM/SOAR Integration',
        'Behavioral Analytics',
        'Threat Intelligence Integration',
        'Automated Response'
      ],
      metrics: {
        effectiveness: 0.90,
        cost: 'high',
        complexity: 'high'
      }
    });

    // Patterns d'optimisation
    this.optimizationPatterns.set('consolidation', {
      description: 'Consolidation de contrôles redondants',
      applicability: ['overlapping_controls', 'multiple_vendors'],
      benefits: ['cost_reduction', 'simplified_management'],
      risks: ['single_point_of_failure', 'vendor_lock_in']
    });

    this.optimizationPatterns.set('automation', {
      description: 'Automatisation des processus manuels',
      applicability: ['repetitive_tasks', 'high_volume_operations'],
      benefits: ['efficiency_gain', 'error_reduction', 'cost_savings'],
      risks: ['over_automation', 'skill_degradation']
    });

    // Modèles de coût
    this.costModels.set('security_control', {
      initialCost: {
        software: 0.6,
        hardware: 0.2,
        implementation: 0.15,
        training: 0.05
      },
      recurringCost: {
        licensing: 0.4,
        maintenance: 0.3,
        operations: 0.25,
        updates: 0.05
      }
    });
  }

  private analyzeCurrentState(controls: SecurityControl[], metrics: any): any {
    const maturityScore = this.calculateMaturityScore(controls, metrics);
    const coverageGaps = this.identifyCoverageGaps(controls);
    const inefficiencies = this.identifyInefficiencies(controls, metrics);
    const redundancies = this.identifyControlRedundancies(controls);
    const costIssues = this.identifyCostIssues(controls, metrics);
    
    return {
      maturityScore,
      coverageGaps,
      inefficiencies,
      redundancies,
      costIssues
    };
  }

  private performBenchmarking(controls: SecurityControl[], orgProfile?: any): any {
    if (!orgProfile) {
      return {
        industryComparison: {},
        bestPractices: [],
        gaps: []
      };
    }
    
    const industryBenchmark = this.benchmarkDatabase.get(orgProfile.sector);
    if (!industryBenchmark) {
      return {
        industryComparison: {},
        bestPractices: [],
        gaps: ['Pas de benchmark disponible pour ce secteur']
      };
    }
    
    const currentMetrics = this.calculateCurrentMetrics(controls);
    const comparison = this.compareWithBenchmark(currentMetrics, industryBenchmark);
    const bestPractices = this.identifyApplicableBestPractices(orgProfile.sector);
    const gaps = this.identifyBenchmarkingGaps(comparison);
    
    return {
      industryComparison: comparison,
      bestPractices,
      gaps
    };
  }

  private analyzeRiskAlignment(controls: SecurityControl[], riskProfile: any): any {
    const controlRiskMapping = this.mapControlsToRisks(controls, riskProfile.scenarios);
    
    const coveredRisks = controlRiskMapping
      .filter(mapping => mapping.coverage > 0.7)
      .map(mapping => mapping.riskId);
    
    const uncoveredRisks = riskProfile.scenarios
      .filter((scenario: any) => !coveredRisks.includes(scenario.id))
      .map((scenario: any) => scenario.id);
    
    const overProtectedAreas = controlRiskMapping
      .filter(mapping => mapping.redundancy > 1.5)
      .map(mapping => mapping.area);
    
    const underProtectedAreas = controlRiskMapping
      .filter(mapping => mapping.coverage < 0.5)
      .map(mapping => mapping.area);
    
    return {
      coveredRisks,
      uncoveredRisks,
      overProtectedAreas,
      underProtectedAreas
    };
  }

  private generateOptimizationRecommendations(
    currentState: any,
    benchmarking: any,
    riskAlignment: any,
    context?: SecurityOptimizationContext
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Recommandations basées sur les gaps de couverture
    currentState.coverageGaps.forEach((gap: string, index: number) => {
      recommendations.push({
        id: `coverage-${index}`,
        type: 'add',
        priority: 'high',
        target: {
          category: gap,
          domain: 'security_controls'
        },
        description: `Ajouter des contrôles pour couvrir le gap: ${gap}`,
        rationale: {
          currentIssues: [`Gap de couverture: ${gap}`],
          expectedBenefits: ['Réduction du risque', 'Amélioration de la posture'],
          riskReduction: 0.3,
          costBenefit: 2.5
        },
        implementation: {
          effort: 'medium',
          duration: 8,
          cost: {
            initial: 50000,
            recurring: 10000
          },
          dependencies: [],
          risks: ['Complexité d\'intégration']
        },
        metrics: {
          before: { coverage: 0 },
          expectedAfter: { coverage: 0.8 },
          kpis: ['Coverage rate', 'Risk reduction']
        },
        validation: {
          criteria: ['Couverture effective', 'Intégration réussie'],
          methods: ['Tests de pénétration', 'Audit de conformité'],
          timeline: 4
        }
      });
    });
    
    // Recommandations basées sur les inefficacités
    currentState.inefficiencies.forEach((inefficiency: string, index: number) => {
      recommendations.push({
        id: `efficiency-${index}`,
        type: 'enhance',
        priority: 'medium',
        target: {
          category: 'efficiency',
          domain: 'operations'
        },
        description: `Optimiser l'efficacité: ${inefficiency}`,
        rationale: {
          currentIssues: [`Inefficacité: ${inefficiency}`],
          expectedBenefits: ['Réduction des coûts', 'Amélioration des performances'],
          riskReduction: 0.1,
          costBenefit: 3.0
        },
        implementation: {
          effort: 'low',
          duration: 4,
          cost: {
            initial: 20000,
            recurring: 5000
          },
          dependencies: [],
          risks: ['Résistance au changement']
        },
        metrics: {
          before: { efficiency: 0.6 },
          expectedAfter: { efficiency: 0.8 },
          kpis: ['Efficiency ratio', 'Cost per incident']
        },
        validation: {
          criteria: ['Amélioration mesurable', 'Satisfaction utilisateur'],
          methods: ['Métriques de performance', 'Enquêtes utilisateur'],
          timeline: 2
        }
      });
    });
    
    // Recommandations basées sur les redondances
    currentState.redundancies.forEach((redundancy: string, index: number) => {
      recommendations.push({
        id: `redundancy-${index}`,
        type: 'remove',
        priority: 'low',
        target: {
          category: 'redundancy',
          domain: 'cost_optimization'
        },
        description: `Éliminer la redondance: ${redundancy}`,
        rationale: {
          currentIssues: [`Redondance: ${redundancy}`],
          expectedBenefits: ['Réduction des coûts', 'Simplification'],
          riskReduction: 0.0,
          costBenefit: 1.5
        },
        implementation: {
          effort: 'low',
          duration: 2,
          cost: {
            initial: 5000,
            recurring: -15000 // économie
          },
          dependencies: ['Validation de non-impact'],
          risks: ['Perte de redondance voulue']
        },
        metrics: {
          before: { cost: 100000 },
          expectedAfter: { cost: 85000 },
          kpis: ['Cost reduction', 'Complexity reduction']
        },
        validation: {
          criteria: ['Pas de dégradation de sécurité', 'Économies réalisées'],
          methods: ['Tests de régression', 'Audit financier'],
          timeline: 1
        }
      });
    });
    
    return recommendations;
  }

  private generateOptimizationRoadmap(recommendations: OptimizationRecommendation[], context?: SecurityOptimizationContext): any {
    // Tri par priorité et dépendances
    const sortedRecommendations = this.sortRecommendationsByPriority(recommendations);
    
    // Groupement en phases
    const phases = this.groupIntoPhases(sortedRecommendations, context?.organizationProfile?.budget);
    
    const totalCost = phases.reduce((sum, phase) => sum + phase.budget, 0);
    const timeline = phases.reduce((sum, phase) => sum + phase.duration, 0);
    const expectedROI = this.calculateExpectedROI(recommendations);
    
    return {
      phases,
      timeline,
      totalCost,
      expectedROI
    };
  }

  private calculateOptimizationMetrics(currentState: any, recommendations: OptimizationRecommendation[]): any {
    const current = {
      maturityScore: currentState.maturityScore,
      efficiency: 0.6,
      coverage: 0.7,
      cost: 1000000
    };
    
    const projected = {
      maturityScore: current.maturityScore + 15,
      efficiency: 0.8,
      coverage: 0.9,
      cost: current.cost * 0.9
    };
    
    const improvement = {
      maturityScore: projected.maturityScore - current.maturityScore,
      efficiency: projected.efficiency - current.efficiency,
      coverage: projected.coverage - current.coverage,
      cost: (current.cost - projected.cost) / current.cost
    };
    
    return {
      current,
      projected,
      improvement
    };
  }

  private setupOptimizationMonitoring(recommendations: OptimizationRecommendation[], metrics: any): any {
    const kpis = [
      'Security Maturity Score',
      'Control Effectiveness',
      'Cost per Protected Asset',
      'Mean Time to Detection',
      'Mean Time to Response'
    ];
    
    const thresholds = {
      'maturityScore': 80,
      'effectiveness': 0.85,
      'costPerAsset': 10000,
      'mttr': 4, // hours
      'mttd': 1 // hour
    };
    
    const alertConditions = [
      'Maturity score below threshold',
      'Effectiveness degradation > 10%',
      'Cost increase > 20%',
      'Response time increase > 50%'
    ];
    
    return {
      kpis,
      thresholds,
      reviewFrequency: 'monthly',
      alertConditions
    };
  }

  // Méthodes utilitaires supplémentaires
  
  private calculateMaturityScore(controls: SecurityControl[], metrics: any): number {
    // Calcul simplifié basé sur la couverture et l'efficacité
    const coverageScore = Math.min(100, controls.length * 5);
    const effectivenessScore = metrics.effectiveness ? metrics.effectiveness * 100 : 60;
    
    return Math.round((coverageScore + effectivenessScore) / 2);
  }

  private identifyCoverageGaps(controls: SecurityControl[]): string[] {
    const requiredDomains = [
      'Access Control',
      'Asset Management',
      'Cryptography',
      'Physical Security',
      'Operations Security',
      'Communications Security',
      'System Acquisition',
      'Supplier Relationships',
      'Information Security Incident Management',
      'Business Continuity',
      'Compliance'
    ];
    
    const coveredDomains = controls.map(control => control.domain || control.category);
    
    return requiredDomains.filter(domain => 
      !coveredDomains.some(covered => 
        covered?.toLowerCase().includes(domain.toLowerCase())
      )
    );
  }

  private identifyInefficiencies(controls: SecurityControl[], metrics: any): string[] {
    const inefficiencies: string[] = [];
    
    // Contrôles avec faible efficacité
    controls.forEach(control => {
      if (control.effectiveness && control.effectiveness < 0.6) {
        inefficiencies.push(`Faible efficacité: ${control.name}`);
      }
    });
    
    // Processus manuels
    if (metrics.automationLevel && metrics.automationLevel < 0.5) {
      inefficiencies.push('Niveau d\'automatisation faible');
    }
    
    // Temps de réponse élevés
    if (metrics.responseTime && metrics.responseTime > 8) {
      inefficiencies.push('Temps de réponse aux incidents élevé');
    }
    
    return inefficiencies;
  }

  private identifyControlRedundancies(controls: SecurityControl[]): string[] {
    const redundancies: string[] = [];
    const controlsByFunction = new Map<string, SecurityControl[]>();
    
    // Groupement par fonction
    controls.forEach(control => {
      const func = control.function || control.type || 'unknown';
      if (!controlsByFunction.has(func)) {
        controlsByFunction.set(func, []);
      }
      controlsByFunction.get(func)!.push(control);
    });
    
    // Identification des redondances
    controlsByFunction.forEach((controlList, func) => {
      if (controlList.length > 1) {
        redundancies.push(`Redondance dans ${func}: ${controlList.length} contrôles`);
      }
    });
    
    return redundancies;
  }

  private identifyCostIssues(controls: SecurityControl[], metrics: any): string[] {
    const issues: string[] = [];
    
    // Contrôles coûteux avec faible ROI
    controls.forEach(control => {
      if (control.cost && control.effectiveness) {
        const roi = control.effectiveness / (Number(control.cost) / 100000); // 🔧 CORRECTION: Conversion en nombre
        if (roi < 0.5) {
          issues.push(`ROI faible: ${control.name}`);
        }
      }
    });
    
    // Budget sécurité disproportionné
    if (metrics.securityBudgetRatio && metrics.securityBudgetRatio > 0.15) {
      issues.push('Budget sécurité disproportionné');
    }
    
    return issues;
  }

  private analyzeControlEffectiveness(controls: SecurityControl[], performanceData: any): ControlEffectivenessAnalysis[] {
    return controls.map(control => ({
      controlId: control.id,
      controlName: control.name,
      category: control.category || 'Unknown',
      effectiveness: {
        score: (control.effectiveness || 0.7) * 100,
        factors: {
          coverage: 0.8,
          accuracy: 0.75,
          timeliness: 0.9,
          reliability: 0.85
        },
        trends: {
          direction: 'stable' as const,
          rate: 0.02,
          period: '3 months'
        }
      },
      efficiency: {
        costPerIncident: control.cost ? Number(control.cost) / 10 : 5000, // 🔧 CORRECTION: Conversion en nombre
        resourceUtilization: 0.7,
        automationLevel: 0.6,
        maintenanceOverhead: 0.2
      },
      gaps: {
        coverage: ['Couverture partielle des scénarios avancés'],
        performance: ['Temps de réponse perfectible'],
        integration: ['Intégration limitée avec SIEM']
      },
      recommendations: {
        immediate: ['Ajuster les seuils de détection'],
        shortTerm: ['Améliorer l\'intégration'],
        longTerm: ['Automatiser les réponses']
      }
    }));
  }

  private analyzeCostBenefit(controls: SecurityControl[], costData: any): any {
    return {
      totalCost: controls.reduce((sum, control) => sum + (Number(control.cost) || 0), 0), // 🔧 CORRECTION: Conversion en nombre
      averageROI: 2.5,
      costPerRiskReduction: 50000,
      recommendations: ['Optimiser les contrôles à faible ROI']
    };
  }

  private identifyRedundancies(controls: SecurityControl[]): any {
    return {
      redundantControls: controls.filter((_, index) => index % 3 === 0), // Simulation
      potentialSavings: 150000,
      consolidationOpportunities: ['Unification des outils de monitoring']
    };
  }

  private identifyControlGaps(controls: SecurityControl[], context: any): any {
    return {
      missingControls: ['Advanced Threat Protection', 'Zero Trust Network'],
      priorityGaps: ['Endpoint Detection and Response'],
      estimatedCost: 200000
    };
  }

  private generateOpportunities(
    effectiveness: any,
    costBenefit: any,
    redundancy: any,
    gaps: any
  ): OptimizationRecommendation[] {
    // Génération simplifiée d'opportunités
    return [
      {
        id: 'opp-1',
        type: 'enhance',
        priority: 'high',
        target: { category: 'detection', domain: 'security' },
        description: 'Améliorer la détection des menaces',
        rationale: {
          currentIssues: ['Détection limitée'],
          expectedBenefits: ['Meilleure couverture'],
          riskReduction: 0.3,
          costBenefit: 2.0
        },
        implementation: {
          effort: 'medium',
          duration: 12,
          cost: { initial: 100000, recurring: 20000 },
          dependencies: [],
          risks: ['Complexité d\'intégration']
        },
        metrics: {
          before: { detection: 0.7 },
          expectedAfter: { detection: 0.9 },
          kpis: ['Detection rate']
        },
        validation: {
          criteria: ['Amélioration mesurable'],
          methods: ['Tests de détection'],
          timeline: 4
        }
      }
    ];
  }

  private prioritizeOpportunities(opportunities: OptimizationRecommendation[]): any {
    const prioritized = opportunities.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    return {
      critical: prioritized.filter(o => o.priority === 'critical'),
      high: prioritized.filter(o => o.priority === 'high'),
      medium: prioritized.filter(o => o.priority === 'medium'),
      low: prioritized.filter(o => o.priority === 'low')
    };
  }

  private analyzeOptimizationImpact(opportunities: OptimizationRecommendation[]): any {
    const totalRiskReduction = opportunities.reduce((sum, opp) => sum + opp.rationale.riskReduction, 0);
    const totalCost = opportunities.reduce((sum, opp) => sum + opp.implementation.cost.initial, 0);
    const averageROI = opportunities.reduce((sum, opp) => sum + opp.rationale.costBenefit, 0) / opportunities.length;
    
    return {
      totalRiskReduction,
      totalCost,
      averageROI,
      timeToValue: 6 // months
    };
  }

  // Méthodes pour les autres capacités (implémentation simplifiée)
  
  private getIndustryBenchmarks(sector: string): any {
    return this.benchmarkDatabase.get(sector) || {};
  }

  private compareMetrics(current: any, benchmark: any): any {
    return {
      maturityScore: { current: 65, benchmark: 75, gap: -10 },
      automationLevel: { current: 0.4, benchmark: 0.6, gap: -0.2 }
    };
  }

  private identifyBenchmarkGaps(comparison: any): string[] {
    return Object.entries(comparison)
      .filter(([_, data]: [string, any]) => data.gap < 0)
      .map(([metric, _]) => `Gap in ${metric}`);
  }

  private generateBenchmarkRecommendations(gaps: string[], benchmarks: any): string[] {
    return gaps.map(gap => `Améliorer ${gap} pour atteindre le niveau sectoriel`);
  }

  private analyzeCurrentPortfolio(portfolio: SecurityControl[]): any {
    return {
      totalControls: portfolio.length,
      coverage: 0.75,
      effectiveness: 0.8,
      cost: portfolio.reduce((sum, control) => sum + (Number(control.cost) || 0), 0) // 🔧 CORRECTION: Conversion en nombre
    };
  }

  private buildRiskModel(scenarios: RiskScenario[], controls: SecurityControl[]): any {
    return {
      totalRisk: scenarios.length * 0.6,
      mitigatedRisk: scenarios.length * 0.4,
      residualRisk: scenarios.length * 0.2
    };
  }

  private optimizeUnderConstraints(current: any, riskModel: any, constraints: any): any {
    return {
      recommendedControls: ['Enhanced monitoring', 'Automated response'],
      expectedImprovement: 0.3,
      budgetUtilization: 0.9
    };
  }

  private generateImplementationPlan(portfolio: any): any {
    return {
      phases: [
        { name: 'Phase 1', duration: 8, activities: ['Setup monitoring'] },
        { name: 'Phase 2', duration: 12, activities: ['Deploy automation'] }
      ],
      totalDuration: 20,
      resources: ['Security team', 'IT team']
    };
  }

  private calculatePortfolioCostBenefit(optimized: any, current: any): any {
    return {
      costReduction: 0.15,
      riskReduction: 0.25,
      roi: 2.8,
      paybackPeriod: 18 // months
    };
  }

  private calculateInvestmentCosts(investments: any[]): any {
    return {
      total: investments.reduce((sum, inv) => sum + inv.cost, 0),
      breakdown: { software: 0.6, hardware: 0.2, services: 0.2 }
    };
  }

  private calculateSecurityBenefits(riskReduction: any, incidentCosts: any): any {
    return {
      avoidedCosts: riskReduction.value * incidentCosts.average,
      productivityGains: 50000,
      complianceBenefits: 25000
    };
  }

  private calculateROI(costs: any, benefits: any): any {
    const roi = (benefits.avoidedCosts - costs.total) / costs.total;
    return {
      roi,
      npv: benefits.avoidedCosts - costs.total,
      paybackPeriod: costs.total / (benefits.avoidedCosts / 12)
    };
  }

  private performDetailedCostBenefitAnalysis(costs: any, benefits: any): any {
    return {
      costBreakdown: costs.breakdown,
      benefitBreakdown: {
        riskReduction: benefits.avoidedCosts,
        productivity: benefits.productivityGains,
        compliance: benefits.complianceBenefits
      },
      sensitivity: {
        optimistic: 1.2,
        pessimistic: 0.8
      }
    };
  }

  private generateROIRecommendations(roi: any, costBenefit: any): string[] {
    const recommendations = [];
    
    if (roi.roi < 1.0) {
      recommendations.push('Revoir les investissements à faible ROI');
    }
    
    if (roi.paybackPeriod > 24) {
      recommendations.push('Prioriser les investissements à retour rapide');
    }
    
    recommendations.push('Surveiller les métriques de performance');
    
    return recommendations;
  }

  private analyzeProgress(plan: any, current: any, targets: any): any {
    return {
      completionRate: 0.65,
      onTrack: true,
      delayedItems: [],
      achievedTargets: ['Target 1', 'Target 2']
    };
  }

  private identifyDeviations(progress: any): any {
    return {
      scheduleDeviations: [],
      budgetDeviations: [{ item: 'Software licenses', variance: 0.1 }],
      performanceDeviations: []
    };
  }

  private generateProgressReport(progress: any, deviations: any): any {
    return {
      summary: 'Progrès satisfaisant avec quelques écarts budgétaires',
      completionRate: progress.completionRate,
      keyAchievements: progress.achievedTargets,
      issues: deviations.budgetDeviations,
      nextSteps: ['Ajuster le budget', 'Continuer l\'implémentation']
    };
  }

  private generateAdjustmentRecommendations(deviations: any): string[] {
    const recommendations = [];
    
    if (deviations.budgetDeviations.length > 0) {
      recommendations.push('Réviser l\'allocation budgétaire');
    }
    
    if (deviations.scheduleDeviations.length > 0) {
      recommendations.push('Ajuster le planning');
    }
    
    recommendations.push('Renforcer le suivi des métriques');
    
    return recommendations;
  }

  // Méthodes utilitaires finales
  
  private mapControlsToRisks(controls: SecurityControl[], scenarios: RiskScenario[]): any[] {
    return scenarios.map(scenario => ({
      riskId: scenario.id,
      area: scenario.category || 'Unknown',
      coverage: ((Date.now() % 1000) / 1000) * 0.8 + 0.2, // Simulation
      redundancy: ((Date.now() % 1000) / 1000) * 2 + 0.5
    }));
  }

  private calculateCurrentMetrics(controls: SecurityControl[]): any {
    return {
      maturityScore: 65,
      controlCoverage: 0.75,
      automationLevel: 0.45,
      incidentResponseTime: 6,
      securityBudgetRatio: 0.08
    };
  }

  private compareWithBenchmark(current: any, benchmark: any): any {
    const comparison: any = {};
    
    Object.keys(benchmark).forEach(key => {
      if (current[key] !== undefined) {
        comparison[key] = {
          current: current[key],
          benchmark: benchmark[key],
          gap: current[key] - benchmark[key],
          percentage: ((current[key] - benchmark[key]) / benchmark[key]) * 100
        };
      }
    });
    
    return comparison;
  }

  private identifyApplicableBestPractices(sector: string): string[] {
    const practices = [];
    
    for (const [category, data] of this.bestPracticesLibrary.entries()) {
      practices.push(...data.practices);
    }
    
    return practices;
  }

  private identifyBenchmarkingGaps(comparison: any): string[] {
    return Object.entries(comparison)
      .filter(([_, data]: [string, any]) => data.gap < 0)
      .map(([metric, data]: [string, any]) => 
        `${metric}: ${Math.abs(data.percentage).toFixed(1)}% en dessous du benchmark`
      );
  }

  private sortRecommendationsByPriority(recommendations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    
    return recommendations.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Si même priorité, trier par ROI
      return b.rationale.costBenefit - a.rationale.costBenefit;
    });
  }

  private groupIntoPhases(recommendations: OptimizationRecommendation[], budget?: any): any[] {
    const phases = [];
    let currentPhase = {
      name: 'Phase 1 - Quick Wins',
      duration: 0,
      recommendations: [] as string[],
      expectedBenefits: [] as string[],
      budget: 0
    };
    
    let phaseNumber = 1;
    let phaseBudget = 0;
    const maxPhaseBudget = budget?.available ? budget.available / 3 : 200000;
    
    recommendations.forEach(rec => {
      if (phaseBudget + rec.implementation.cost.initial > maxPhaseBudget && currentPhase.recommendations.length > 0) {
        phases.push(currentPhase);
        phaseNumber++;
        currentPhase = {
          name: `Phase ${phaseNumber}`,
          duration: 0,
          recommendations: [],
          expectedBenefits: [],
          budget: 0
        };
        phaseBudget = 0;
      }
      
      currentPhase.recommendations.push(rec.id);
      currentPhase.expectedBenefits.push(...rec.rationale.expectedBenefits);
      currentPhase.duration = Math.max(currentPhase.duration, rec.implementation.duration);
      currentPhase.budget += rec.implementation.cost.initial;
      phaseBudget += rec.implementation.cost.initial;
    });
    
    if (currentPhase.recommendations.length > 0) {
      phases.push(currentPhase);
    }
    
    return phases;
  }

  private calculateExpectedROI(recommendations: OptimizationRecommendation[]): number {
    const totalInvestment = recommendations.reduce((sum, rec) => sum + rec.implementation.cost.initial, 0);
    const totalBenefit = recommendations.reduce((sum, rec) => sum + (rec.rationale.costBenefit * rec.implementation.cost.initial), 0);
    
    return totalInvestment > 0 ? (totalBenefit - totalInvestment) / totalInvestment : 0;
  }

  private calculateConfidence(taskType: string, result: any): number {
    const baseConfidence: Record<string, number> = {
      'analyze-security-posture': 0.85,
      'identify-optimization-opportunities': 0.8,
      'benchmark-against-industry': 0.75,
      'optimize-control-portfolio': 0.8,
      'calculate-security-roi': 0.7,
      'monitor-optimization-progress': 0.9
    };
    return baseConfidence[taskType] || 0.75;
  }

  private generateSuggestions(taskType: string, result: any): string[] {
    const suggestions: Record<string, string[]> = {
      'analyze-security-posture': [
        'Valider l\'analyse avec les équipes opérationnelles',
        'Compléter avec des audits externes',
        'Mettre à jour régulièrement l\'évaluation'
      ],
      'identify-optimization-opportunities': [
        'Prioriser selon les contraintes budgétaires',
        'Valider la faisabilité technique',
        'Considérer l\'impact sur les opérations'
      ],
      'benchmark-against-industry': [
        'Enrichir avec des données sectorielles récentes',
        'Considérer les spécificités organisationnelles',
        'Surveiller l\'évolution des benchmarks'
      ],
      'optimize-control-portfolio': [
        'Tester les optimisations en environnement pilote',
        'Planifier la migration progressive',
        'Prévoir des mécanismes de rollback'
      ],
      'calculate-security-roi': [
        'Valider les hypothèses de coût et bénéfice',
        'Considérer les bénéfices intangibles',
        'Mettre à jour régulièrement les calculs'
      ],
      'monitor-optimization-progress': [
        'Automatiser la collecte de métriques',
        'Définir des seuils d\'alerte appropriés',
        'Prévoir des revues périodiques'
      ]
    };
    return suggestions[taskType] || [];
  }

  private loadBenchmarkData(data: any): void {
    console.log('Chargement données benchmark:', data);
  }

  private loadBestPractices(practices: any): void {
    console.log('Chargement meilleures pratiques:', practices);
  }

  private loadCostModels(models: any): void {
    console.log('Chargement modèles de coût:', models);
  }
}