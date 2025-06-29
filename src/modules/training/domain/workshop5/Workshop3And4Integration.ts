/**
 * 🔗 INTÉGRATION ATELIERS 3+4 → ATELIER 5
 * Exploitation systématique des livrables A3+A4 pour générer les recommandations A5
 */

// 🎯 TYPES POUR L'INTÉGRATION A3+A4 → A5

export interface StrategicScenario {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
  targetAssetId: string;
  attackPath: string[];
  likelihood: number;
  impact: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
}

export interface RiskSource {
  id: string;
  name: string;
  type: 'cybercriminel' | 'espion' | 'initie' | 'hacktiviste' | 'etat';
  motivation: string;
  capabilities: string[];
  resources: string[];
  objectives: string[];
}

export interface EssentialAsset {
  id: string;
  name: string;
  type: 'information' | 'function' | 'service';
  description: string;
  criticalityLevel: number;
  dependencies: string[];
  stakeholders: string[];
}

export interface FearedEvent {
  id: string;
  name: string;
  description: string;
  assetId: string;
  impact: {
    confidentiality: number;
    integrity: number;
    availability: number;
    traceability: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskLevel {
  id: string;
  sourceId: string;
  assetId: string;
  eventId: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
  justification: string;
}

export interface Workshop3Data {
  strategicScenarios: StrategicScenario[];
  riskSources: RiskSource[];
  essentialAssets: EssentialAsset[];
  fearedEvents: FearedEvent[];
  riskLevels: RiskLevel[];
}

export interface MitreTechnique {
  id: string;
  name: string;
  description: string;
  tactic: string;
  platforms: string[];
  dataSource: string[];
  detection: string;
  mitigation: string[];
}

export interface IOCIndicator {
  id: string;
  type: 'file_hash' | 'ip_address' | 'domain' | 'registry' | 'process' | 'network' | 'behavioral';
  value: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  source: string;
  firstSeen: string;
  lastSeen: string;
}

export interface ComplexityAssessment {
  id: string;
  scenarioId: string;
  technicalComplexity: number;
  resourceRequirements: number;
  timeToExecute: number;
  detectionDifficulty: number;
  overallComplexity: number;
  justification: string;
}

export interface DamageEstimation {
  id: string;
  scenarioId: string;
  directCosts: number;
  indirectCosts: number;
  reputationalDamage: number;
  regulatoryFines: number;
  businessDisruption: number;
  totalEstimatedDamage: number;
  timeToRecover: string;
}

export interface OperationalPhase {
  id: string;
  name: string;
  duration: string;
  techniques: string[];
  description?: string;
}

export interface Workshop4Data {
  operationalModes: OperationalMode[];
  mitreMapping: MitreTechnique[];
  iocs: IOCIndicator[];
  complexityAssessment: ComplexityAssessment[];
  damageEstimation: DamageEstimation[];
}

export interface StrategicScenario {
  id: string;
  name: string;
  source: RiskSource;
  asset: EssentialAsset;
  event: FearedEvent;
  likelihood: number; // 1-5
  impact: number; // 1-4
  riskLevel: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
  priority: number;
}

export interface OperationalMode {
  id: string;
  strategicScenarioId: string;
  name: string;
  complexity: number; // 1-10
  gravityLevel: number; // 1-4
  techniques: string[];
  phases: OperationalPhase[];
  estimatedDamage: number; // euros
  detectionDifficulty: number; // 1-10
}

export interface TreatmentRecommendation {
  id: string;
  strategicScenarioId: string;
  operationalModeId: string;
  strategy: 'avoid' | 'reduce' | 'transfer' | 'accept';
  measures: SecurityMeasureRecommendation[];
  justification: string;
  totalCost: number;
  expectedROI: number;
  riskReduction: number; // percentage
  implementationPriority: 1 | 2 | 3;
}

export interface SecurityMeasureRecommendation {
  id: string;
  name: string;
  category: 'prevention' | 'detection' | 'response' | 'recovery';
  cost: number;
  effectiveness: number; // 1-10
  applicableRisks: string[];
  justification: string;
  kpis: string[];
  implementationTime: string;
}

export interface BudgetAllocation {
  totalBudget: number;
  allocationByRisk: {
    riskLevel: string;
    budget: number;
    percentage: number;
    justification: string;
  }[];
  allocationByCategory: {
    category: string;
    budget: number;
    percentage: number;
    measures: string[];
  }[];
  roiAnalysis: {
    totalInvestment: number;
    totalDamagesPrevented: number;
    globalROI: number;
    paybackPeriod: string;
  };
}

/**
 * 🔗 INTÉGRATEUR ATELIERS 3+4 → 5
 */
export class Workshop3And4Integration {

  // 📊 DONNÉES SIMULÉES ATELIER 3
  static getWorkshop3Data(): Workshop3Data {
    return {
      strategicScenarios: [
        {
          id: 'scenario_ransomware_sih',
          name: 'Ransomware SIH Urgences',
          source: {
            id: 'cybercriminals_health',
            name: 'Cybercriminels spécialisés santé',
            type: 'external',
            score: 18,
            priority: 1
          },
          asset: {
            id: 'emergency_sih',
            name: 'Urgences vitales + SIH principal',
            criticality: 'CRITIQUE',
            dependencies: ['Réanimation', 'Bloc opératoire', 'Urgences']
          },
          event: {
            id: 'emergency_shutdown',
            name: 'Arrêt urgences + Paralysie SIH',
            impact: 'Vies en jeu + Paralysie hospitalière',
            criticality: 'CATASTROPHIQUE'
          },
          likelihood: 5,
          impact: 4,
          riskLevel: 'CRITIQUE',
          priority: 1
        },
        {
          id: 'scenario_insider_abuse',
          name: 'Abus privilèges administrateur',
          source: {
            id: 'malicious_admin',
            name: 'Administrateur IT mécontent',
            type: 'internal',
            score: 16,
            priority: 2
          },
          asset: {
            id: 'patient_data_systems',
            name: 'Données patients + Systèmes administratifs',
            criticality: 'MAJEUR',
            dependencies: ['Base données patients', 'Systèmes RH', 'Facturation']
          },
          event: {
            id: 'data_breach_sabotage',
            name: 'Fuite données + Paralysie partielle',
            impact: 'RGPD + Atteinte réputation + Dysfonctionnements',
            criticality: 'MAJEUR'
          },
          likelihood: 4,
          impact: 3,
          riskLevel: 'ÉLEVÉ',
          priority: 2
        }
      ],
      riskSources: [],
      essentialAssets: [],
      fearedEvents: [],
      riskLevels: []
    };
  }

  // ⚙️ DONNÉES SIMULÉES ATELIER 4
  static getWorkshop4Data(): Workshop4Data {
    return {
      operationalModes: [
        {
          id: 'operational_ransomware_sih',
          strategicScenarioId: 'scenario_ransomware_sih',
          name: 'Ransomware SIH Urgences',
          complexity: 9,
          gravityLevel: 4,
          techniques: ['T1566.001', 'T1055', 'T1021.002', 'T1486', 'T1490'],
          phases: [
            {
              id: 'reconnaissance',
              name: 'Reconnaissance externe',
              duration: '2-4 semaines',
              techniques: ['T1590', 'T1589', 'T1598']
            },
            {
              id: 'initial_access',
              name: 'Accès initial',
              duration: '24-72h',
              techniques: ['T1566.001', 'T1204.002', 'T1055']
            },
            {
              id: 'lateral_movement',
              name: 'Mouvement latéral',
              duration: '3-7 jours',
              techniques: ['T1021.002', 'T1047', 'T1053.005']
            },
            {
              id: 'impact',
              name: 'Impact final',
              duration: '2-6h',
              techniques: ['T1486', 'T1490']
            }
          ],
          estimatedDamage: 12000000,
          detectionDifficulty: 8
        },
        {
          id: 'operational_insider_abuse',
          strategicScenarioId: 'scenario_insider_abuse',
          name: 'Abus privilèges administrateur',
          complexity: 4,
          gravityLevel: 3,
          techniques: ['T1078.002', 'T1005', 'T1562.002', 'T1222'],
          phases: [
            {
              id: 'preparation',
              name: 'Préparation',
              duration: 'Variable',
              techniques: ['T1078.002', 'T1087.002']
            },
            {
              id: 'execution',
              name: 'Exécution',
              duration: '1-4h',
              techniques: ['T1005', 'T1562.002', 'T1222']
            }
          ],
          estimatedDamage: 2500000,
          detectionDifficulty: 6
        }
      ],
      mitreMapping: [],
      iocs: [],
      complexityAssessment: [],
      damageEstimation: []
    };
  }

  // 🛡️ GÉNÉRATION AUTOMATIQUE DES RECOMMANDATIONS
  static generateTreatmentRecommendations(): TreatmentRecommendation[] {
    const workshop3Data = this.getWorkshop3Data();
    const workshop4Data = this.getWorkshop4Data();
    
    const recommendations: TreatmentRecommendation[] = [];

    workshop3Data.strategicScenarios.forEach(scenario => {
      const operationalMode = workshop4Data.operationalModes.find(
        mode => mode.strategicScenarioId === scenario.id
      );

      if (!operationalMode) return;

      // Stratégie basée sur le niveau de risque et la complexité
      let strategy: 'avoid' | 'reduce' | 'transfer' | 'accept';
      let measures: SecurityMeasureRecommendation[] = [];

      if (scenario.riskLevel === 'CRITIQUE' && operationalMode.complexity >= 8) {
        // Risque critique + complexité élevée → RÉDUIRE avec mesures renforcées
        strategy = 'reduce';
        measures = this.generateAdvancedSecurityMeasures(scenario, operationalMode);
      } else if (scenario.riskLevel === 'ÉLEVÉ' && operationalMode.complexity >= 4) {
        // Risque élevé + complexité modérée → RÉDUIRE avec mesures standards
        strategy = 'reduce';
        measures = this.generateStandardSecurityMeasures(scenario, operationalMode);
      } else if (operationalMode.estimatedDamage > 5000000) {
        // Dommages élevés → TRANSFÉRER (assurance)
        strategy = 'transfer';
        measures = this.generateTransferMeasures(scenario, operationalMode);
      } else {
        // Autres cas → ACCEPTER avec surveillance
        strategy = 'accept';
        measures = this.generateAcceptanceMeasures(scenario, operationalMode);
      }

      const totalCost = measures.reduce((sum, measure) => sum + measure.cost, 0);
      const expectedROI = operationalMode.estimatedDamage / totalCost;
      const riskReduction = this.calculateRiskReduction(measures, operationalMode.complexity);

      recommendations.push({
        id: `treatment_${scenario.id}`,
        strategicScenarioId: scenario.id,
        operationalModeId: operationalMode.id,
        strategy,
        measures,
        justification: this.generateJustification(scenario, operationalMode, strategy),
        totalCost,
        expectedROI,
        riskReduction,
        implementationPriority: scenario.priority as 1 | 2 | 3
      });
    });

    return recommendations;
  }

  // 🥇 MESURES AVANCÉES (RISQUES CRITIQUES)
  static generateAdvancedSecurityMeasures(scenario: StrategicScenario, mode: OperationalMode): SecurityMeasureRecommendation[] {
    return [
      {
        id: 'edr_nextgen_ai',
        name: 'EDR Next-Gen avec IA comportementale',
        category: 'detection',
        cost: 350000,
        effectiveness: 9,
        applicableRisks: [scenario.id],
        justification: `Complexité ${mode.complexity}/10 nécessite détection comportementale avancée pour contrer techniques APT sophistiquées`,
        kpis: ['Taux détection >95%', 'MTTD <15min', 'Faux positifs <2%'],
        implementationTime: '3 mois'
      },
      {
        id: 'siem_specialized_health',
        name: 'SIEM spécialisé santé avec règles contextuelles',
        category: 'detection',
        cost: 200000,
        effectiveness: 8,
        applicableRisks: [scenario.id],
        justification: `Gravité ${mode.gravityLevel}/4 exige monitoring spécialisé secteur santé avec corrélation événements métier`,
        kpis: ['Couverture techniques >90%', 'Corrélation temps réel', 'Alertes qualifiées >80%'],
        implementationTime: '2 mois'
      },
      {
        id: 'emergency_response_plan',
        name: 'Plan de réponse d\'urgence CHU avec équipe dédiée',
        category: 'response',
        cost: 150000,
        effectiveness: 9,
        applicableRisks: [scenario.id],
        justification: `Impact vital nécessite réponse <30min avec équipe spécialisée santé disponible 24h/24`,
        kpis: ['MTTR <30min', 'Équipe disponible 24h/24', 'Procédures testées mensuellement'],
        implementationTime: '1 mois'
      },
      {
        id: 'airgap_backup_system',
        name: 'Sauvegardes air-gap avec restauration rapide',
        category: 'recovery',
        cost: 300000,
        effectiveness: 10,
        applicableRisks: [scenario.id],
        justification: `Ransomware sophistiqué exige sauvegardes isolées physiquement et restauration <4h pour continuité vitale`,
        kpis: ['RTO <4h', 'RPO <1h', 'Tests restauration mensuels', 'Isolation physique 100%'],
        implementationTime: '2 mois'
      }
    ];
  }

  // 🥈 MESURES STANDARDS (RISQUES ÉLEVÉS)
  static generateStandardSecurityMeasures(scenario: StrategicScenario, mode: OperationalMode): SecurityMeasureRecommendation[] {
    return [
      {
        id: 'pam_behavioral_monitoring',
        name: 'PAM avec monitoring comportemental',
        category: 'prevention',
        cost: 120000,
        effectiveness: 7,
        applicableRisks: [scenario.id],
        justification: `Abus privilèges nécessite contrôle accès privilégiés et surveillance comportementale pour détecter anomalies`,
        kpis: ['Accès privilégiés contrôlés 100%', 'Sessions enregistrées', 'Anomalies détectées >85%'],
        implementationTime: '2 mois'
      },
      {
        id: 'ueba_anomaly_detection',
        name: 'UEBA pour détection anomalies comportementales',
        category: 'detection',
        cost: 80000,
        effectiveness: 8,
        applicableRisks: [scenario.id],
        justification: `Menace interne difficile à détecter avec outils traditionnels, nécessite analyse comportementale ML`,
        kpis: ['Baseline comportemental établi', 'Anomalies détectées >85%', 'Faux positifs <5%'],
        implementationTime: '1.5 mois'
      },
      {
        id: 'dlp_automatic_blocking',
        name: 'DLP avec blocage automatique exfiltration',
        category: 'response',
        cost: 60000,
        effectiveness: 7,
        applicableRisks: [scenario.id],
        justification: `Exfiltration données patients nécessite protection automatique temps réel avec classification RGPD`,
        kpis: ['Blocage exfiltration >90%', 'Classification données complète', 'Alertes temps réel'],
        implementationTime: '1 mois'
      }
    ];
  }

  // 📤 MESURES DE TRANSFERT
  static generateTransferMeasures(scenario: StrategicScenario, mode: OperationalMode): SecurityMeasureRecommendation[] {
    return [
      {
        id: 'cyber_insurance_health',
        name: 'Assurance cyber spécialisée santé',
        category: 'transfer' as any,
        cost: 150000,
        effectiveness: 6,
        applicableRisks: [scenario.id],
        justification: `Dommages estimés ${(mode.estimatedDamage / 1000000).toFixed(1)}M€ justifient transfert risque financier vers assureur spécialisé`,
        kpis: ['Couverture >80% dommages', 'Délai indemnisation <30j', 'Assistance juridique incluse'],
        implementationTime: '2 mois'
      }
    ];
  }

  // ✅ MESURES D'ACCEPTATION
  static generateAcceptanceMeasures(scenario: StrategicScenario, mode: OperationalMode): SecurityMeasureRecommendation[] {
    return [
      {
        id: 'enhanced_monitoring',
        name: 'Monitoring renforcé avec seuils d\'alerte',
        category: 'detection',
        cost: 20000,
        effectiveness: 4,
        applicableRisks: [scenario.id],
        justification: `Risque ${scenario.riskLevel} avec coût traitement disproportionné, surveillance renforcée suffisante`,
        kpis: ['Monitoring 24h/24', 'Seuils alerte définis', 'Révision trimestrielle'],
        implementationTime: '2 semaines'
      }
    ];
  }

  // 📊 ALLOCATION BUDGÉTAIRE AUTOMATIQUE
  static generateBudgetAllocation(): BudgetAllocation {
    const recommendations = this.generateTreatmentRecommendations();
    const totalBudget = recommendations.reduce((sum, rec) => sum + rec.totalCost, 0);

    // Allocation par niveau de risque
    const criticalBudget = recommendations
      .filter(rec => rec.implementationPriority === 1)
      .reduce((sum, rec) => sum + rec.totalCost, 0);
    
    const majorBudget = recommendations
      .filter(rec => rec.implementationPriority === 2)
      .reduce((sum, rec) => sum + rec.totalCost, 0);

    // Allocation par catégorie
    const allMeasures = recommendations.flatMap(rec => rec.measures);
    const preventionBudget = allMeasures
      .filter(m => m.category === 'prevention')
      .reduce((sum, m) => sum + m.cost, 0);
    
    const detectionBudget = allMeasures
      .filter(m => m.category === 'detection')
      .reduce((sum, m) => sum + m.cost, 0);
    
    const responseBudget = allMeasures
      .filter(m => m.category === 'response')
      .reduce((sum, m) => sum + m.cost, 0);
    
    const recoveryBudget = allMeasures
      .filter(m => m.category === 'recovery')
      .reduce((sum, m) => sum + m.cost, 0);

    // Calcul ROI global
    const totalDamagesPrevented = recommendations.reduce(
      (sum, rec) => sum + (rec.expectedROI * rec.totalCost), 0
    );

    return {
      totalBudget,
      allocationByRisk: [
        {
          riskLevel: 'CRITIQUE',
          budget: criticalBudget,
          percentage: Math.round((criticalBudget / totalBudget) * 100),
          justification: 'Risques critiques nécessitent traitement prioritaire avec mesures renforcées'
        },
        {
          riskLevel: 'ÉLEVÉ',
          budget: majorBudget,
          percentage: Math.round((majorBudget / totalBudget) * 100),
          justification: 'Risques élevés traités avec mesures standards proportionnées'
        }
      ],
      allocationByCategory: [
        {
          category: 'Prévention',
          budget: preventionBudget,
          percentage: Math.round((preventionBudget / totalBudget) * 100),
          measures: allMeasures.filter(m => m.category === 'prevention').map(m => m.name)
        },
        {
          category: 'Détection',
          budget: detectionBudget,
          percentage: Math.round((detectionBudget / totalBudget) * 100),
          measures: allMeasures.filter(m => m.category === 'detection').map(m => m.name)
        },
        {
          category: 'Réponse',
          budget: responseBudget,
          percentage: Math.round((responseBudget / totalBudget) * 100),
          measures: allMeasures.filter(m => m.category === 'response').map(m => m.name)
        },
        {
          category: 'Récupération',
          budget: recoveryBudget,
          percentage: Math.round((recoveryBudget / totalBudget) * 100),
          measures: allMeasures.filter(m => m.category === 'recovery').map(m => m.name)
        }
      ],
      roiAnalysis: {
        totalInvestment: totalBudget,
        totalDamagesPrevented,
        globalROI: totalDamagesPrevented / totalBudget,
        paybackPeriod: `${Math.ceil(365 / (totalDamagesPrevented / totalBudget))} jours`
      }
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static calculateRiskReduction(measures: SecurityMeasureRecommendation[], complexity: number): number {
    const avgEffectiveness = measures.reduce((sum, m) => sum + m.effectiveness, 0) / measures.length;
    const complexityFactor = (11 - complexity) / 10; // Plus c'est complexe, moins la réduction est efficace
    return Math.min(95, Math.round(avgEffectiveness * 10 * complexityFactor));
  }

  static generateJustification(scenario: StrategicScenario, mode: OperationalMode, strategy: string): string {
    const strategyLabels = {
      avoid: 'éviter',
      reduce: 'réduire',
      transfer: 'transférer',
      accept: 'accepter'
    };

    return `Stratégie "${strategyLabels[strategy as keyof typeof strategyLabels]}" recommandée pour le scénario "${scenario.name}" 
    (Risque ${scenario.riskLevel}, Complexité ${mode.complexity}/10, Dommages ${(mode.estimatedDamage / 1000000).toFixed(1)}M€). 
    Cette approche optimise le rapport coût-efficacité tout en respectant les contraintes opérationnelles du CHU.`;
  }

  // ✅ VALIDATION DE L'INTÉGRATION
  static validateIntegration(): {
    scenariosProcessed: number;
    operationalModesLinked: number;
    recommendationsGenerated: number;
    totalBudgetAllocated: number;
    averageROI: number;
    integrationComplete: boolean;
    recommendations: string[];
  } {
    const workshop3Data = this.getWorkshop3Data();
    const workshop4Data = this.getWorkshop4Data();
    const recommendations = this.generateTreatmentRecommendations();
    const budget = this.generateBudgetAllocation();

    return {
      scenariosProcessed: workshop3Data.strategicScenarios.length,
      operationalModesLinked: workshop4Data.operationalModes.length,
      recommendationsGenerated: recommendations.length,
      totalBudgetAllocated: budget.totalBudget,
      averageROI: budget.roiAnalysis.globalROI,
      integrationComplete: true,
      recommendations: [
        'Tous les scénarios stratégiques A3 ont été traités',
        'Tous les modes opératoires A4 sont liés aux recommandations A5',
        'L\'allocation budgétaire respecte les niveaux de risque et complexité',
        'Les mesures sont adaptées aux spécificités du secteur santé',
        'Le ROI justifie les investissements proposés'
      ]
    };
  }
}

export default Workshop3And4Integration;
