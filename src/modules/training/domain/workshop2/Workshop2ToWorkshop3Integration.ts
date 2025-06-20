/**
 * 🔗 INTÉGRATION ATELIER 2 → ATELIER 3
 * Système de transmission structuré des sources de risque A2 vers scénarios A3
 */

// 🎯 TYPES POUR L'INTÉGRATION A2 → A3
export interface Workshop2Deliverable {
  id: string;
  type: 'external_source' | 'internal_source' | 'supply_chain_source' | 'threat_intelligence';
  name: string;
  priority: number; // 1-4
  description: string;
  motivations: string[];
  capabilities: SourceCapabilities;
  targets: string[];
  scenarioOrientations: string[];
}

export interface SourceCapabilities {
  technical: number; // 1-10
  organizational: number; // 1-10
  financial: number; // 1-10
  sectoral: number; // 1-10 (connaissance santé)
  sophistication: number; // 1-10
}

export interface PrioritizedSource {
  id: string;
  name: string;
  category: 'external' | 'internal' | 'supply_chain';
  priority: number;
  score: number; // Score global de menace
  motivations: SourceMotivation[];
  capabilities: SourceCapabilities;
  targetedAssets: string[];
  operatingModes: OperatingMode[];
  relevantScenarios: string[];
}

export interface SourceMotivation {
  type: 'financial' | 'ideological' | 'geopolitical' | 'personal' | 'opportunistic';
  description: string;
  intensity: number; // 1-5
  examples: string[];
}

export interface OperatingMode {
  technique: string;
  description: string;
  sophistication: number; // 1-5
  frequency: string;
  examples: string[];
}

export interface Workshop3Orientation {
  strategicScenarios: StrategicScenario[];
  sourceToEventMapping: SourceEventMapping[];
  capacityCalibration: CapacityCalibration[];
  scenarioPrioritization: ScenarioPriority[];
}

export interface StrategicScenario {
  id: string;
  title: string;
  description: string;
  primarySource: string;
  secondarySources: string[];
  targetedAssets: string[];
  expectedImpact: string;
  likelihood: number; // 1-5
  sophisticationRequired: number; // 1-5
}

export interface SourceEventMapping {
  sourceId: string;
  sourceName: string;
  dreaded_events: DreadedEvent[];
}

export interface DreadedEvent {
  event: string;
  impact: 'CATASTROPHIQUE' | 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  likelihood: number; // 1-5
  justification: string;
}

export interface CapacityCalibration {
  securityObjective: string;
  requiredCapacities: string[];
  sophisticationLevel: number; // 1-10
  examples: string[];
}

export interface ScenarioPriority {
  scenario: string;
  priority: number; // 1-5
  justification: string;
  relatedSources: string[];
  impactLevel: string;
}

/**
 * 🎯 CLASSE PRINCIPALE D'INTÉGRATION A2 → A3
 */
export class Workshop2ToWorkshop3Integration {
  
  // 📊 SOURCES PRIORISÉES ISSUES DE L'ATELIER 2
  static getPrioritizedSources(): PrioritizedSource[] {
    return [
      {
        id: 'cybercriminals_health_specialized',
        name: 'Cybercriminels spécialisés santé',
        category: 'external',
        priority: 1,
        score: 20,
        motivations: [
          {
            type: 'financial',
            description: 'Rançons élevées secteur santé (1-10M€)',
            intensity: 5,
            examples: ['LockBit 3.0 CHU européens', 'Conti successeurs']
          },
          {
            type: 'opportunistic',
            description: 'Pression maximale paiement (vies en jeu)',
            intensity: 5,
            examples: ['Urgences fermées', 'Blocs opératoires arrêtés']
          }
        ],
        capabilities: {
          technical: 9,
          organizational: 8,
          financial: 8,
          sectoral: 9,
          sophistication: 9
        },
        targetedAssets: [
          'Urgences vitales',
          'SIH Dossiers patients',
          'PACS Imagerie',
          'Centre de données'
        ],
        operatingModes: [
          {
            technique: 'Ransomware double extorsion',
            description: 'Chiffrement + menace publication données',
            sophistication: 5,
            frequency: 'Hebdomadaire',
            examples: ['LockBit 3.0', 'BlackCat/ALPHV']
          },
          {
            technique: 'Supply chain compromise',
            description: 'Compromission fournisseurs SIH',
            sophistication: 4,
            frequency: 'Mensuelle',
            examples: ['Éditeurs logiciels', 'MSP santé']
          }
        ],
        relevantScenarios: [
          'Ransomware paralysant urgences vitales',
          'Chiffrement SIH avec exfiltration données',
          'Attaque coordonnée multi-sites CHU',
          'Double extorsion avec leak patients VIP'
        ]
      },
      {
        id: 'foreign_states_espionage',
        name: 'États étrangers - Espionnage recherche',
        category: 'external',
        priority: 2,
        score: 19,
        motivations: [
          {
            type: 'geopolitical',
            description: 'Espionnage recherche médicale stratégique',
            intensity: 4,
            examples: ['Recherche COVID-19', 'Vaccins innovants']
          },
          {
            type: 'financial',
            description: 'Avantage concurrentiel économique',
            intensity: 4,
            examples: ['Propriété intellectuelle', 'Brevets pharmaceutiques']
          }
        ],
        capabilities: {
          technical: 10,
          organizational: 10,
          financial: 10,
          sectoral: 7,
          sophistication: 10
        },
        targetedAssets: [
          'Recherche clinique',
          'SIH Dossiers patients',
          'PACS Imagerie',
          'Données gouvernementales'
        ],
        operatingModes: [
          {
            technique: 'APT persistante long terme',
            description: 'Infiltration discrète >2 ans',
            sophistication: 5,
            frequency: 'Continue',
            examples: ['APT40 recherche COVID', 'APT29 laboratoires']
          },
          {
            technique: 'Spear phishing ciblé',
            description: 'Emails personnalisés chercheurs',
            sophistication: 4,
            frequency: 'Quotidienne',
            examples: ['Faux appels à projets', 'Invitations conférences']
          }
        ],
        relevantScenarios: [
          'Exfiltration recherche COVID/vaccins',
          'Espionnage données patients politiques',
          'Sabotage essais cliniques concurrents',
          'Infiltration long terme systèmes recherche'
        ]
      },
      {
        id: 'privileged_internal_threats',
        name: 'Menaces internes privilégiées',
        category: 'internal',
        priority: 3,
        score: 18,
        motivations: [
          {
            type: 'financial',
            description: 'Revente données patients marché noir',
            intensity: 4,
            examples: ['250€/dossier complet', 'Réseaux dark web']
          },
          {
            type: 'personal',
            description: 'Vengeance suite licenciement/sanction',
            intensity: 3,
            examples: ['Sabotage systèmes', 'Fuite données sensibles']
          }
        ],
        capabilities: {
          technical: 7,
          organizational: 6,
          financial: 3,
          sectoral: 10,
          sophistication: 6
        },
        targetedAssets: [
          'Tous biens essentiels (accès privilégié)',
          'SIH Dossiers patients',
          'Centre de données',
          'Systèmes administration'
        ],
        operatingModes: [
          {
            technique: 'Abus privilèges légitimes',
            description: 'Utilisation accès autorisés à des fins illégitimes',
            sophistication: 3,
            frequency: 'Opportuniste',
            examples: ['Admin IT accès root', 'Médecin consultation massive']
          },
          {
            technique: 'Exfiltration discrète',
            description: 'Vol données par petites quantités',
            sophistication: 4,
            frequency: 'Continue',
            examples: ['USB personnelles', 'Email personnel']
          }
        ],
        relevantScenarios: [
          'Administrateur IT compromet infrastructure',
          'Médecin revend données patients',
          'Sabotage interne suite licenciement',
          'Négligence critique exposant systèmes'
        ]
      }
    ];
  }

  // 🎯 ORIENTATIONS POUR ATELIER 3
  static getWorkshop3Orientations(): Workshop3Orientation {
    return {
      strategicScenarios: [
        {
          id: 'ransomware_emergency_paralysis',
          title: 'Ransomware paralysant urgences vitales',
          description: 'Attaque ransomware ciblée paralysant les urgences pendant >4h',
          primarySource: 'cybercriminals_health_specialized',
          secondarySources: ['supply_chain_compromise', 'internal_negligence'],
          targetedAssets: ['Urgences vitales', 'SIH Principal', 'PACS'],
          expectedImpact: 'CATASTROPHIQUE - Vies en jeu, responsabilité pénale',
          likelihood: 4,
          sophisticationRequired: 7
        },
        {
          id: 'medical_research_espionage',
          title: 'Espionnage recherche médicale stratégique',
          description: 'Exfiltration discrète données recherche COVID/vaccins sur 2 ans',
          primarySource: 'foreign_states_espionage',
          secondarySources: ['internal_corruption', 'supply_chain_infiltration'],
          targetedAssets: ['Recherche clinique', 'Données patients VIP'],
          expectedImpact: 'CRITIQUE - Perte avantage concurrentiel national',
          likelihood: 3,
          sophisticationRequired: 9
        },
        {
          id: 'massive_patient_data_breach',
          title: 'Fuite massive données patients',
          description: 'Exfiltration 500k dossiers patients avec publication dark web',
          primarySource: 'privileged_internal_threats',
          secondarySources: ['cybercriminals_health_specialized', 'supply_chain_compromise'],
          targetedAssets: ['SIH Dossiers patients', 'PACS Imagerie'],
          expectedImpact: 'CRITIQUE - Sanctions RGPD, perte confiance',
          likelihood: 4,
          sophisticationRequired: 5
        }
      ],
      sourceToEventMapping: [
        {
          sourceId: 'cybercriminals_health_specialized',
          sourceName: 'Cybercriminels spécialisés santé',
          dreaded_events: [
            {
              event: 'Arrêt urgences vitales >4h',
              impact: 'CATASTROPHIQUE',
              likelihood: 4,
              justification: 'Spécialisation santé + motivation financière forte'
            },
            {
              event: 'Paralysie SIH >24h',
              impact: 'CRITIQUE',
              likelihood: 4,
              justification: 'Cible privilégiée ransomware, techniques éprouvées'
            },
            {
              event: 'Fuite 500k dossiers patients',
              impact: 'CRITIQUE',
              likelihood: 3,
              justification: 'Double extorsion standard, pression maximale'
            }
          ]
        },
        {
          sourceId: 'foreign_states_espionage',
          sourceName: 'États étrangers - Espionnage',
          dreaded_events: [
            {
              event: 'Vol recherche stratégique',
              impact: 'CRITIQUE',
              likelihood: 3,
              justification: 'Intérêt géopolitique confirmé, capacités étatiques'
            },
            {
              event: 'Espionnage données gouvernementales',
              impact: 'CRITIQUE',
              likelihood: 2,
              justification: 'Patients VIP, informations sensibles'
            }
          ]
        }
      ],
      capacityCalibration: [
        {
          securityObjective: 'Disponibilité 99.99% urgences',
          requiredCapacities: [
            'DDoS massifs >100Gbps',
            'Ransomware avec destruction sauvegardes',
            'Coordination multi-vecteurs simultanés'
          ],
          sophisticationLevel: 8,
          examples: ['LockBit 3.0 campagne coordonnée', 'Botnet Mirai médical']
        },
        {
          securityObjective: 'Intégrité 100% prescriptions',
          requiredCapacities: [
            'Accès privilégié bases données',
            'Modification discrète sans détection',
            'Connaissance protocoles médicaux'
          ],
          sophisticationLevel: 6,
          examples: ['Corruption admin IT', 'Malware ciblé SIH']
        }
      ],
      scenarioPrioritization: [
        {
          scenario: 'Ransomware paralysant urgences vitales',
          priority: 1,
          justification: 'Vies en jeu + probabilité élevée + impact maximal',
          relatedSources: ['cybercriminals_health_specialized'],
          impactLevel: 'CATASTROPHIQUE'
        },
        {
          scenario: 'Fuite massive données patients',
          priority: 2,
          justification: 'Probabilité élevée + sanctions RGPD + perte confiance',
          relatedSources: ['privileged_internal_threats', 'cybercriminals_health_specialized'],
          impactLevel: 'CRITIQUE'
        },
        {
          scenario: 'Espionnage recherche médicale',
          priority: 3,
          justification: 'Enjeu stratégique + sophistication étatique',
          relatedSources: ['foreign_states_espionage'],
          impactLevel: 'CRITIQUE'
        }
      ]
    };
  }

  // 🔄 MÉTHODES DE TRANSFORMATION A2 → A3
  static transformSourcesToScenarios(): StrategicScenario[] {
    const sources = this.getPrioritizedSources();
    const scenarios: StrategicScenario[] = [];
    
    sources.forEach(source => {
      source.relevantScenarios.forEach(scenarioTitle => {
        scenarios.push({
          id: `scenario_${source.id}_${scenarios.length}`,
          title: scenarioTitle,
          description: `Scénario impliquant ${source.name}`,
          primarySource: source.id,
          secondarySources: [],
          targetedAssets: source.targetedAssets,
          expectedImpact: this.calculateImpact(source.score),
          likelihood: Math.min(5, Math.floor(source.score / 4)),
          sophisticationRequired: source.capabilities.sophistication
        });
      });
    });
    
    return scenarios;
  }

  static calculateImpact(score: number): string {
    if (score >= 18) return 'CATASTROPHIQUE';
    if (score >= 15) return 'CRITIQUE';
    if (score >= 12) return 'MAJEUR';
    if (score >= 8) return 'MODÉRÉ';
    return 'MINEUR';
  }

  static generateHandoverDocument(): any {
    return {
      prioritizedSources: this.getPrioritizedSources(),
      workshop3Orientations: this.getWorkshop3Orientations(),
      strategicScenarios: this.transformSourcesToScenarios(),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        workshop: 'A2 → A3 Integration',
        status: 'Ready for Workshop 3',
        totalSources: this.getPrioritizedSources().length,
        totalScenarios: this.getWorkshop3Orientations().strategicScenarios.length
      }
    };
  }

  static getSourceById(sourceId: string): PrioritizedSource | undefined {
    return this.getPrioritizedSources().find(source => source.id === sourceId);
  }

  static getScenariosByPriority(priority: number): StrategicScenario[] {
    return this.getWorkshop3Orientations().strategicScenarios
      .filter(scenario => scenario.likelihood >= priority)
      .sort((a, b) => b.likelihood - a.likelihood);
  }
}
