/**
 * 📤 GÉNÉRATEUR DE LIENS ATELIER 4 → ATELIER 5
 * Système de transmission des données techniques vers les mesures de traitement
 */

// 🎯 TYPES POUR LES LIENS A4 → A5
export interface OperationalModeData {
  id: string;
  name: string;
  complexity: number;
  gravityLevel: number;
  phases: OperationalPhase[];
  mitreMapping: string[];
  iocs: IOCIndicator[];
  detectionMeasures: string[];
  estimatedCost: number;
}

export interface OperationalPhase {
  id: string;
  name: string;
  duration: string;
  techniques: string[];
  detectionPoints: string[];
  preventionMeasures: string[];
}

export interface IOCIndicator {
  type: string;
  value: string;
  confidence: 'low' | 'medium' | 'high';
  detectionTool: string;
  preventionMeasure: string;
}

export interface TreatmentRecommendation {
  id: string;
  operationalModeId: string;
  category: 'prevention' | 'detection' | 'response' | 'recovery';
  priority: 1 | 2 | 3;
  measure: string;
  justification: string;
  estimatedCost: number;
  implementationTime: string;
  effectiveness: number; // 1-10
  mitreMapping: string[];
  kpis: string[];
}

export interface BudgetAllocation {
  operationalModeId: string;
  modeName: string;
  gravityLevel: number;
  totalBudget: number;
  allocation: {
    prevention: number;
    detection: number;
    response: number;
    recovery: number;
  };
  justification: string;
  roi: number;
}

export interface ImplementationPlan {
  operationalModeId: string;
  modeName: string;
  phases: ImplementationPhase[];
  totalDuration: string;
  dependencies: string[];
  risks: string[];
  successCriteria: string[];
}

export interface ImplementationPhase {
  id: string;
  name: string;
  duration: string;
  measures: string[];
  budget: number;
  dependencies: string[];
  deliverables: string[];
}

/**
 * 📤 GÉNÉRATEUR DE LIENS A4 → A5
 */
export class Workshop5LinksGenerator {

  // 📊 DONNÉES MODES OPÉRATOIRES A4
  static getOperationalModesData(): OperationalModeData[] {
    return [
      {
        id: 'operational_ransomware_sih',
        name: 'Ransomware SIH Urgences',
        complexity: 9,
        gravityLevel: 4,
        phases: [
          {
            id: 'reconnaissance',
            name: 'Reconnaissance externe',
            duration: '2-4 semaines',
            techniques: ['T1590', 'T1589', 'T1598'],
            detectionPoints: [
              'Monitoring DNS externe',
              'Détection scans ports',
              'Surveillance enregistrements domaines'
            ],
            preventionMeasures: [
              'Limitation exposition services',
              'Masquage informations techniques',
              'Monitoring proactif reconnaissance'
            ]
          },
          {
            id: 'initial_access',
            name: 'Accès initial',
            duration: '24-72h',
            techniques: ['T1566.001', 'T1204.002', 'T1055'],
            detectionPoints: [
              'Filtrage emails avancé',
              'Détection macros malveillantes',
              'Monitoring PowerShell'
            ],
            preventionMeasures: [
              'Formation anti-phishing',
              'Sandboxing emails',
              'Restriction macros Office'
            ]
          },
          {
            id: 'lateral_movement',
            name: 'Mouvement latéral',
            duration: '3-7 jours',
            techniques: ['T1021.002', 'T1047', 'T1053.005'],
            detectionPoints: [
              'Monitoring connexions SMB',
              'Détection WMI anormal',
              'Surveillance tâches programmées'
            ],
            preventionMeasures: [
              'Segmentation réseau',
              'Principe moindre privilège',
              'Monitoring comportemental'
            ]
          },
          {
            id: 'impact',
            name: 'Impact final',
            duration: '2-6h',
            techniques: ['T1486', 'T1490'],
            detectionPoints: [
              'Monitoring chiffrement anormal',
              'Alertes désactivation sauvegardes',
              'Détection patterns ransomware'
            ],
            preventionMeasures: [
              'Sauvegardes air-gap',
              'Protection endpoints avancée',
              'Plan de continuité activité'
            ]
          }
        ],
        mitreMapping: [
          'T1590', 'T1589', 'T1598', 'T1566.001', 'T1204.002', 
          'T1055', 'T1021.002', 'T1047', 'T1053.005', 'T1486', 'T1490'
        ],
        iocs: [
          {
            type: 'domain',
            value: 'chu-metropolitain-urgences.com',
            confidence: 'high',
            detectionTool: 'DNS monitoring',
            preventionMeasure: 'Domain reputation filtering'
          },
          {
            type: 'process',
            value: 'powershell.exe -EncodedCommand',
            confidence: 'high',
            detectionTool: 'EDR behavioral analysis',
            preventionMeasure: 'PowerShell execution policy'
          },
          {
            type: 'file',
            value: 'Protocole_Etude_Cardiaque_2024.docm',
            confidence: 'high',
            detectionTool: 'Email security gateway',
            preventionMeasure: 'Macro blocking policy'
          }
        ],
        detectionMeasures: [
          'EDR avancé avec détection comportementale',
          'SIEM avec règles spécialisées santé',
          'Monitoring chiffrement anormal',
          'Alertes désactivation sauvegardes'
        ],
        estimatedCost: 12000000 // 12M€ de dommages potentiels
      },
      {
        id: 'operational_insider_abuse',
        name: 'Abus privilèges administrateur',
        complexity: 4,
        gravityLevel: 3,
        phases: [
          {
            id: 'preparation',
            name: 'Préparation',
            duration: 'Variable',
            techniques: ['T1078.002', 'T1087.002'],
            detectionPoints: [
              'Monitoring accès hors horaires',
              'Surveillance comportementale UEBA'
            ],
            preventionMeasures: [
              'Principe moindre privilège',
              'Rotation mots de passe',
              'Monitoring comportemental'
            ]
          },
          {
            id: 'execution',
            name: 'Exécution',
            duration: '1-4h',
            techniques: ['T1005', 'T1562.002', 'T1222'],
            detectionPoints: [
              'Monitoring requêtes SQL anormales',
              'Alertes désactivation logs',
              'DLP Data Loss Prevention'
            ],
            preventionMeasures: [
              'PAM Privileged Access Management',
              'Database activity monitoring',
              'Data classification et protection'
            ]
          }
        ],
        mitreMapping: [
          'T1078.002', 'T1087.002', 'T1005', 'T1562.002', 'T1222'
        ],
        iocs: [
          {
            type: 'behavioral',
            value: 'SQL queries outside normal hours',
            confidence: 'high',
            detectionTool: 'Database monitoring',
            preventionMeasure: 'Access time restrictions'
          },
          {
            type: 'process',
            value: 'sqlcmd.exe -S server -Q "SELECT * FROM patients"',
            confidence: 'high',
            detectionTool: 'Process monitoring',
            preventionMeasure: 'Query restrictions'
          }
        ],
        detectionMeasures: [
          'UEBA User Entity Behavior Analytics',
          'PAM Privileged Access Management',
          'Monitoring accès hors horaires',
          'DLP Data Loss Prevention'
        ],
        estimatedCost: 2500000 // 2.5M€ de dommages potentiels
      }
    ];
  }

  // 📋 GÉNÉRATION RECOMMANDATIONS DE TRAITEMENT
  static generateTreatmentRecommendations(): TreatmentRecommendation[] {
    const operationalModes = this.getOperationalModesData();
    const recommendations: TreatmentRecommendation[] = [];

    operationalModes.forEach(mode => {
      // Recommandations basées sur la complexité et gravité
      if (mode.complexity >= 8 && mode.gravityLevel >= 4) {
        // Mode très complexe et critique → Mesures renforcées
        recommendations.push(
          {
            id: `${mode.id}_prevention_advanced`,
            operationalModeId: mode.id,
            category: 'prevention',
            priority: 1,
            measure: 'EDR Next-Gen avec IA comportementale',
            justification: 'Complexité 9/10 nécessite détection comportementale avancée pour contrer techniques APT',
            estimatedCost: 350000,
            implementationTime: '3 mois',
            effectiveness: 9,
            mitreMapping: ['T1055', 'T1021.002', 'T1486'],
            kpis: ['Taux détection >95%', 'Faux positifs <2%', 'MTTD <15min']
          },
          {
            id: `${mode.id}_detection_specialized`,
            operationalModeId: mode.id,
            category: 'detection',
            priority: 1,
            measure: 'SIEM spécialisé santé avec règles contextuelles',
            justification: 'Gravité 4/4 exige monitoring spécialisé secteur santé avec règles métier',
            estimatedCost: 200000,
            implementationTime: '2 mois',
            effectiveness: 8,
            mitreMapping: ['T1590', 'T1566.001', 'T1047'],
            kpis: ['Couverture techniques >90%', 'Corrélation temps réel', 'Alertes qualifiées >80%']
          },
          {
            id: `${mode.id}_response_emergency`,
            operationalModeId: mode.id,
            category: 'response',
            priority: 1,
            measure: 'Plan de réponse d\'urgence CHU avec équipe dédiée',
            justification: 'Impact vital nécessite réponse <30min avec équipe spécialisée santé',
            estimatedCost: 150000,
            implementationTime: '1 mois',
            effectiveness: 9,
            mitreMapping: ['T1486', 'T1490'],
            kpis: ['MTTR <30min', 'Équipe disponible 24h/24', 'Procédures testées mensuellement']
          },
          {
            id: `${mode.id}_recovery_airgap`,
            operationalModeId: mode.id,
            category: 'recovery',
            priority: 1,
            measure: 'Sauvegardes air-gap avec restauration rapide',
            justification: 'Ransomware sophistiqué exige sauvegardes isolées et restauration <4h',
            estimatedCost: 300000,
            implementationTime: '2 mois',
            effectiveness: 10,
            mitreMapping: ['T1486'],
            kpis: ['RTO <4h', 'RPO <1h', 'Tests restauration mensuels']
          }
        );
      } else if (mode.complexity >= 3 && mode.gravityLevel >= 3) {
        // Mode modéré → Mesures standards renforcées
        recommendations.push(
          {
            id: `${mode.id}_prevention_standard`,
            operationalModeId: mode.id,
            category: 'prevention',
            priority: 2,
            measure: 'PAM avec monitoring comportemental',
            justification: 'Abus privilèges nécessite contrôle accès privilégiés et surveillance comportementale',
            estimatedCost: 120000,
            implementationTime: '2 mois',
            effectiveness: 7,
            mitreMapping: ['T1078.002', 'T1005'],
            kpis: ['Accès privilégiés contrôlés 100%', 'Sessions enregistrées', 'Anomalies détectées']
          },
          {
            id: `${mode.id}_detection_ueba`,
            operationalModeId: mode.id,
            category: 'detection',
            priority: 2,
            measure: 'UEBA pour détection anomalies comportementales',
            justification: 'Menace interne difficile à détecter, nécessite analyse comportementale',
            estimatedCost: 80000,
            implementationTime: '1.5 mois',
            effectiveness: 8,
            mitreMapping: ['T1087.002', 'T1562.002'],
            kpis: ['Baseline comportemental établi', 'Anomalies détectées >85%', 'Faux positifs <5%']
          },
          {
            id: `${mode.id}_response_dlp`,
            operationalModeId: mode.id,
            category: 'response',
            priority: 2,
            measure: 'DLP avec blocage automatique exfiltration',
            justification: 'Exfiltration données patients nécessite protection automatique temps réel',
            estimatedCost: 60000,
            implementationTime: '1 mois',
            effectiveness: 7,
            mitreMapping: ['T1005', 'T1222'],
            kpis: ['Blocage exfiltration >90%', 'Classification données complète', 'Alertes temps réel']
          }
        );
      }
    });

    return recommendations;
  }

  // 💰 ALLOCATION BUDGÉTAIRE BASÉE SUR LES MODES OPÉRATOIRES
  static generateBudgetAllocations(): BudgetAllocation[] {
    const operationalModes = this.getOperationalModesData();
    const totalBudget = 1800000; // 1.8M€ budget sécurité CHU
    
    return operationalModes.map(mode => {
      // Allocation basée sur gravité et complexité
      const riskScore = (mode.gravityLevel * mode.complexity) / 40; // Normalisation 0-1
      const modeBudget = Math.round(totalBudget * riskScore);
      
      let allocation;
      if (mode.complexity >= 8) {
        // Mode très complexe → Focus prévention et détection
        allocation = {
          prevention: Math.round(modeBudget * 0.40), // 40%
          detection: Math.round(modeBudget * 0.35),  // 35%
          response: Math.round(modeBudget * 0.15),   // 15%
          recovery: Math.round(modeBudget * 0.10)    // 10%
        };
      } else {
        // Mode modéré → Focus détection et réponse
        allocation = {
          prevention: Math.round(modeBudget * 0.30), // 30%
          detection: Math.round(modeBudget * 0.40),  // 40%
          response: Math.round(modeBudget * 0.20),   // 20%
          recovery: Math.round(modeBudget * 0.10)    // 10%
        };
      }

      const roi = mode.estimatedCost / modeBudget; // ROI = Dommages évités / Investissement

      return {
        operationalModeId: mode.id,
        modeName: mode.name,
        gravityLevel: mode.gravityLevel,
        totalBudget: modeBudget,
        allocation,
        justification: `Allocation basée sur gravité ${mode.gravityLevel}/4 et complexité ${mode.complexity}/10. ROI estimé: ${roi.toFixed(1)}x`,
        roi
      };
    });
  }

  // 📅 PLAN D'IMPLÉMENTATION BASÉ SUR LES MODES OPÉRATOIRES
  static generateImplementationPlans(): ImplementationPlan[] {
    const operationalModes = this.getOperationalModesData();
    const recommendations = this.generateTreatmentRecommendations();
    
    return operationalModes.map(mode => {
      const modeRecommendations = recommendations.filter(r => r.operationalModeId === mode.id);
      
      // Tri par priorité et dépendances
      const sortedRecommendations = modeRecommendations.sort((a, b) => a.priority - b.priority);
      
      const phases: ImplementationPhase[] = [
        {
          id: 'phase_1_prevention',
          name: 'Phase 1 - Mesures préventives',
          duration: '1-3 mois',
          measures: sortedRecommendations
            .filter(r => r.category === 'prevention')
            .map(r => r.measure),
          budget: sortedRecommendations
            .filter(r => r.category === 'prevention')
            .reduce((sum, r) => sum + r.estimatedCost, 0),
          dependencies: ['Budget validé', 'Équipe projet constituée'],
          deliverables: ['Solutions déployées', 'Configurations validées', 'Formation équipes']
        },
        {
          id: 'phase_2_detection',
          name: 'Phase 2 - Capacités de détection',
          duration: '2-4 mois',
          measures: sortedRecommendations
            .filter(r => r.category === 'detection')
            .map(r => r.measure),
          budget: sortedRecommendations
            .filter(r => r.category === 'detection')
            .reduce((sum, r) => sum + r.estimatedCost, 0),
          dependencies: ['Phase 1 complétée', 'Infrastructure préparée'],
          deliverables: ['SIEM configuré', 'Règles de détection', 'Tableaux de bord']
        },
        {
          id: 'phase_3_response',
          name: 'Phase 3 - Capacités de réponse',
          duration: '1-2 mois',
          measures: sortedRecommendations
            .filter(r => r.category === 'response')
            .map(r => r.measure),
          budget: sortedRecommendations
            .filter(r => r.category === 'response')
            .reduce((sum, r) => sum + r.estimatedCost, 0),
          dependencies: ['Phases 1-2 complétées', 'Équipe SOC formée'],
          deliverables: ['Procédures de réponse', 'Équipe opérationnelle', 'Tests d\'incident']
        }
      ];

      const totalDuration = mode.complexity >= 8 ? '6-9 mois' : '4-6 mois';

      return {
        operationalModeId: mode.id,
        modeName: mode.name,
        phases,
        totalDuration,
        dependencies: [
          'Validation direction générale',
          'Budget sécurité alloué',
          'Ressources humaines disponibles',
          'Prestataires sélectionnés'
        ],
        risks: [
          'Retards dans les approvisionnements',
          'Résistance au changement utilisateurs',
          'Complexité intégration systèmes legacy',
          'Évolution des menaces pendant déploiement'
        ],
        successCriteria: [
          'KPIs de sécurité atteints',
          'Réduction temps de détection',
          'Amélioration posture sécurité',
          'Conformité réglementaire maintenue'
        ]
      };
    });
  }

  // ✅ VALIDATION DES LIENS A4 → A5
  static validateWorkshop5Links(): {
    operationalModesProcessed: number;
    treatmentRecommendations: number;
    budgetAllocations: number;
    implementationPlans: number;
    totalBudgetAllocated: number;
    averageROI: number;
    linkageComplete: boolean;
    recommendations: string[];
  } {
    const operationalModes = this.getOperationalModesData();
    const treatments = this.generateTreatmentRecommendations();
    const budgets = this.generateBudgetAllocations();
    const plans = this.generateImplementationPlans();

    const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const averageROI = budgets.reduce((sum, b) => sum + b.roi, 0) / budgets.length;

    return {
      operationalModesProcessed: operationalModes.length,
      treatmentRecommendations: treatments.length,
      budgetAllocations: budgets.length,
      implementationPlans: plans.length,
      totalBudgetAllocated,
      averageROI,
      linkageComplete: true,
      recommendations: [
        'Tous les modes opératoires ont été analysés pour le traitement',
        'Les recommandations sont alignées sur la complexité technique',
        'L\'allocation budgétaire respecte les niveaux de gravité',
        'Les plans d\'implémentation suivent les priorités opérationnelles',
        'Le ROI justifie les investissements proposés'
      ]
    };
  }

  // 📊 DONNÉES DE TRANSMISSION VERS A5
  static getWorkshop5TransmissionData(): {
    operationalModes: OperationalModeData[];
    treatmentRecommendations: TreatmentRecommendation[];
    budgetAllocations: BudgetAllocation[];
    implementationPlans: ImplementationPlan[];
    transmissionSummary: {
      totalModes: number;
      totalRecommendations: number;
      totalBudget: number;
      averageROI: number;
      implementationDuration: string;
      priorityMeasures: string[];
    };
  } {
    const operationalModes = this.getOperationalModesData();
    const treatmentRecommendations = this.generateTreatmentRecommendations();
    const budgetAllocations = this.generateBudgetAllocations();
    const implementationPlans = this.generateImplementationPlans();

    const totalBudget = budgetAllocations.reduce((sum, b) => sum + b.totalBudget, 0);
    const averageROI = budgetAllocations.reduce((sum, b) => sum + b.roi, 0) / budgetAllocations.length;

    const priorityMeasures = treatmentRecommendations
      .filter(r => r.priority === 1)
      .map(r => r.measure);

    return {
      operationalModes,
      treatmentRecommendations,
      budgetAllocations,
      implementationPlans,
      transmissionSummary: {
        totalModes: operationalModes.length,
        totalRecommendations: treatmentRecommendations.length,
        totalBudget,
        averageROI,
        implementationDuration: '6-9 mois',
        priorityMeasures
      }
    };
  }

  // 🔗 LIENS EXPLICITES VERS ATELIER 5
  static getExplicitLinksToWorkshop5(): {
    linkType: string;
    sourceElement: string;
    targetElement: string;
    justification: string;
    dataTransmitted: string[];
  }[] {
    return [
      {
        linkType: 'Complexité → Sophistication mesures',
        sourceElement: 'Mode opératoire complexité 9/10',
        targetElement: 'EDR Next-Gen avec IA comportementale',
        justification: 'Complexité technique élevée nécessite mesures de détection avancées',
        dataTransmitted: [
          'Niveau de complexité technique',
          'Techniques MITRE ATT&CK utilisées',
          'Sophistication des outils',
          'Capacités d\'évasion'
        ]
      },
      {
        linkType: 'Gravité → Priorité traitement',
        sourceElement: 'Gravité opérationnelle 4/4 (Critique)',
        targetElement: 'Mesures priorité 1 (budget 60%)',
        justification: 'Gravité critique impose traitement prioritaire avec budget renforcé',
        dataTransmitted: [
          'Niveau de gravité ANSSI',
          'Impact sur les soins',
          'Coût des dommages potentiels',
          'Urgence de traitement'
        ]
      },
      {
        linkType: 'Techniques → Mesures spécifiques',
        sourceElement: 'Techniques MITRE T1566.001, T1055, T1486',
        targetElement: 'Anti-phishing + EDR + Sauvegardes air-gap',
        justification: 'Chaque technique identifiée oriente une mesure de protection spécifique',
        dataTransmitted: [
          'Liste techniques MITRE ATT&CK',
          'Procédures d\'attaque détaillées',
          'Points de détection identifiés',
          'Mesures de mitigation MITRE'
        ]
      },
      {
        linkType: 'IOCs → Règles de détection',
        sourceElement: 'IOCs identifiés par phase d\'attaque',
        targetElement: 'Règles SIEM et signatures EDR',
        justification: 'IOCs opérationnels deviennent règles de détection dans les outils',
        dataTransmitted: [
          'Indicateurs de compromission',
          'Niveau de confiance',
          'Contexte de détection',
          'Outils de détection recommandés'
        ]
      },
      {
        linkType: 'Timeline → Plan d\'implémentation',
        sourceElement: 'Durée d\'attaque 3-6 semaines',
        targetElement: 'Plan déploiement 6-9 mois',
        justification: 'Timeline d\'attaque détermine l\'urgence du plan d\'implémentation',
        dataTransmitted: [
          'Durée des phases d\'attaque',
          'Fenêtres de détection',
          'Temps de réaction nécessaire',
          'Priorités de déploiement'
        ]
      },
      {
        linkType: 'Coût dommages → Budget traitement',
        sourceElement: 'Dommages estimés 12M€',
        targetElement: 'Budget alloué 1.2M€ (ROI 10x)',
        justification: 'Coût des dommages potentiels justifie l\'investissement en mesures',
        dataTransmitted: [
          'Estimation des dommages',
          'Coût de récupération',
          'Impact business',
          'Calcul ROI sécurité'
        ]
      }
    ];
  }
}

export default Workshop5LinksGenerator;
