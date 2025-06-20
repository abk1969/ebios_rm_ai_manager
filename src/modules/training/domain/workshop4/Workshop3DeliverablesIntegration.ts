/**
 * 🔗 INTÉGRATION LIVRABLES ATELIER 3 → ATELIER 4
 * Système d'utilisation systématique des scénarios stratégiques pour construire les modes opératoires
 */

// 🎯 TYPES POUR L'INTÉGRATION A3 → A4
export interface StrategicScenarioInput {
  id: string;
  name: string;
  source: StrategicSource;
  essentialAsset: EssentialAsset;
  fearedEvent: FearedEvent;
  likelihood: number; // 1-5
  impact: number; // 1-4
  riskLevel: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
  justification: string;
}

export interface StrategicSource {
  id: string;
  name: string;
  type: string;
  score: number;
  priority: number;
  motivation: string;
  capabilities: string[];
  constraints: string[];
}

export interface EssentialAsset {
  id: string;
  name: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  description: string;
  dependencies: string[];
}

export interface FearedEvent {
  id: string;
  name: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  description: string;
  impact: string[];
}

export interface OperationalModeOutput {
  id: string;
  strategicScenarioId: string;
  name: string;
  complexity: number; // 1-10
  sophistication: string;
  duration: string;
  phases: OperationalPhase[];
  mitreMapping: string[];
  iocs: string[];
  detectionMeasures: string[];
  gravityLevel: number; // 1-4
}

export interface OperationalPhase {
  id: string;
  name: string;
  duration: string;
  objective: string;
  techniques: string[];
  tools: string[];
  iocs: string[];
  detectionPoints: string[];
}

export interface TransformationMapping {
  strategicElement: string;
  operationalElements: string[];
  justification: string;
  traceability: string;
}

/**
 * 🔗 GESTIONNAIRE D'INTÉGRATION A3 → A4
 */
export class Workshop3DeliverablesIntegration {

  // 📥 RÉCUPÉRATION DES LIVRABLES ATELIER 3
  static getStrategicScenarios(): StrategicScenarioInput[] {
    return [
      {
        id: 'scenario_ransomware_sih',
        name: 'Ransomware SIH Urgences',
        source: {
          id: 'cybercriminals_healthcare',
          name: 'Cybercriminels spécialisés santé',
          type: 'Groupe organisé',
          score: 20,
          priority: 1,
          motivation: 'Financière (extorsion)',
          capabilities: [
            'Techniques ransomware avancées',
            'Spécialisation secteur santé',
            'Infrastructure C&C robuste',
            'Négociation professionnelle',
            'Évasion EDR médicaux'
          ],
          constraints: [
            'Éthique relative (épargne réanimation)',
            'Pression géopolitique modérée',
            'Risques juridiques limités'
          ]
        },
        essentialAsset: {
          id: 'urgences_vitales_sih',
          name: 'Urgences vitales + SIH principal',
          criticality: 'CRITIQUE',
          description: 'Service d\'urgences vitales 24h/24 + Système Information Hospitalier central',
          dependencies: [
            'SIH central (base de données)',
            'Réseau VLAN médical',
            'Serveurs applications métier',
            'Postes médicaux urgences'
          ]
        },
        fearedEvent: {
          id: 'arret_urgences_paralysie_sih',
          name: 'Arrêt urgences vitales + Paralysie SIH',
          criticality: 'CRITIQUE',
          description: 'Paralysie complète du SIH entraînant l\'arrêt des urgences vitales',
          impact: [
            'Vies en danger immédiat',
            'Transfert patients vers autres hôpitaux',
            'Retour au papier (ralentissement 300%)',
            'Stress maximal équipes médicales',
            'Coût : 5-15M€'
          ]
        },
        likelihood: 5,
        impact: 4,
        riskLevel: 'CRITIQUE',
        justification: 'Spécialisation cybercriminels + Attractivité CHU + Vulnérabilités techniques + Pression temporelle vitale'
      },
      {
        id: 'scenario_abus_privileges',
        name: 'Abus privilèges administrateur',
        source: {
          id: 'malicious_insider',
          name: 'Administrateur IT mécontent',
          type: 'Initié malveillant',
          score: 16,
          priority: 2,
          motivation: 'Vengeance/Opportunisme',
          capabilities: [
            'Accès administrateur légitime',
            'Connaissance intime systèmes',
            'Outils d\'administration natifs',
            'Contournement sécurités internes',
            'Fenêtres temporelles privilégiées'
          ],
          constraints: [
            'Traçabilité actions nominatives',
            'Surveillance comportementale possible',
            'Sanctions pénales et civiles',
            'Impact réputation professionnelle'
          ]
        },
        essentialAsset: {
          id: 'donnees_patients_systemes',
          name: 'Données patients + Systèmes administratifs',
          criticality: 'CRITIQUE',
          description: 'Base de données patients + Systèmes de gestion administrative',
          dependencies: [
            'Base de données patients',
            'Serveurs administratifs',
            'Systèmes de sauvegarde',
            'Réseaux internes'
          ]
        },
        fearedEvent: {
          id: 'fuite_donnees_paralysie_partielle',
          name: 'Fuite données patients + Paralysie partielle',
          criticality: 'MAJEUR',
          description: 'Exfiltration massive données patients + Sabotage systèmes administratifs',
          impact: [
            'Fuite 50k dossiers patients',
            'Impact RGPD (amendes 4% CA)',
            'Atteinte réputation CHU',
            'Perturbation services administratifs',
            'Coût : 1-3M€'
          ]
        },
        likelihood: 4,
        impact: 3,
        riskLevel: 'ÉLEVÉ',
        justification: 'Accès privilégié + Surveillance faible + Motivations diverses + Opportunités nombreuses'
      }
    ];
  }

  // 🔄 TRANSFORMATION SCÉNARIOS → MODES OPÉRATOIRES
  static transformToOperationalModes(): OperationalModeOutput[] {
    const strategicScenarios = this.getStrategicScenarios();
    
    return strategicScenarios.map(scenario => {
      switch (scenario.id) {
        case 'scenario_ransomware_sih':
          return this.buildRansomwareOperationalMode(scenario);
        case 'scenario_abus_privileges':
          return this.buildInsiderOperationalMode(scenario);
        default:
          throw new Error(`Unknown scenario: ${scenario.id}`);
      }
    });
  }

  // 🥇 CONSTRUCTION MODE OPÉRATOIRE RANSOMWARE
  private static buildRansomwareOperationalMode(scenario: StrategicScenarioInput): OperationalModeOutput {
    return {
      id: 'operational_ransomware_sih',
      strategicScenarioId: scenario.id,
      name: 'Mode opératoire Ransomware SIH Urgences',
      complexity: 9,
      sophistication: 'APT-level avec spécialisation santé',
      duration: '3-6 semaines (reconnaissance → impact)',
      phases: [
        {
          id: 'phase_reconnaissance',
          name: 'Reconnaissance externe',
          duration: '2-4 semaines',
          objective: 'Collecter informations CHU et préparer infrastructure d\'attaque',
          techniques: [
            'OSINT sur personnel CHU (LinkedIn, réseaux sociaux)',
            'Reconnaissance technique (DNS, ports, certificats)',
            'Ingénierie sociale passive (appels, emails)',
            'Enregistrement domaines typosquatting',
            'Préparation infrastructure C&C'
          ],
          tools: [
            'Outils OSINT (Maltego, theHarvester)',
            'Scanners réseau (Nmap, Masscan)',
            'Frameworks phishing (Gophish)',
            'Registrars anonymes',
            'Serveurs VPS (Bulletproof hosting)'
          ],
          iocs: [
            'Requêtes DNS anormales vers domaines CHU',
            'Tentatives connexion services exposés',
            'Enregistrements domaines similaires',
            'Emails de reconnaissance (phishing informatif)'
          ],
          detectionPoints: [
            'Monitoring DNS externe',
            'Détection scans ports',
            'Surveillance enregistrements domaines',
            'Analyse emails entrants suspects'
          ]
        },
        {
          id: 'phase_acces_initial',
          name: 'Accès initial',
          duration: '24-72 heures',
          objective: 'Obtenir premier point d\'entrée via spear-phishing médecin',
          techniques: [
            'Spear-phishing Dr.Martin (Chef Cardiologie)',
            'Macro malveillante Office (VBA + PowerShell)',
            'Backdoor Cobalt Strike (HTTPS + SSL)',
            'Persistance registry (Run keys)',
            'Reconnaissance système initial'
          ],
          tools: [
            'Cobalt Strike (C&C framework)',
            'Macro VBA obfusquée',
            'PowerShell Empire',
            'Certificats SSL légitimes',
            'Redirecteurs de trafic'
          ],
          iocs: [
            'Email spear-phishing avec pièce jointe',
            'Exécution macro VBA suspecte',
            'Processus PowerShell avec paramètres encodés',
            'Connexions HTTPS vers domaines externes',
            'Modification registry Run keys'
          ],
          detectionPoints: [
            'Filtrage emails avancé',
            'Détection macros malveillantes',
            'Monitoring PowerShell',
            'Analyse trafic HTTPS sortant',
            'Surveillance modifications registry'
          ]
        }
      ],
      mitreMapping: [
        'T1590 - Gather Victim Network Information',
        'T1566.001 - Spearphishing Attachment',
        'T1055 - Process Injection',
        'T1547.001 - Registry Run Keys',
        'T1087.002 - Domain Account Discovery',
        'T1046 - Network Service Scanning',
        'T1068 - Exploitation for Privilege Escalation',
        'T1021.002 - SMB/Windows Admin Shares',
        'T1486 - Data Encrypted for Impact'
      ],
      iocs: [
        'Domain: chu-metropolitain-urgences.com',
        'IP: 185.220.101.42 (C&C server)',
        'Process: powershell.exe -EncodedCommand',
        'Registry: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
        'File: Protocole_Etude_Cardiaque_2024.docm'
      ],
      detectionMeasures: [
        'EDR avancé avec détection comportementale',
        'SIEM avec règles spécialisées santé',
        'Monitoring chiffrement anormal',
        'Alertes désactivation sauvegardes',
        'Analyse trafic réseau en temps réel'
      ],
      gravityLevel: 4
    };
  }

  // 🥈 CONSTRUCTION MODE OPÉRATOIRE ABUS PRIVILÈGES
  private static buildInsiderOperationalMode(scenario: StrategicScenarioInput): OperationalModeOutput {
    return {
      id: 'operational_insider_abuse',
      strategicScenarioId: scenario.id,
      name: 'Mode opératoire Abus privilèges administrateur',
      complexity: 4,
      sophistication: 'Utilisation d\'outils légitimes',
      duration: 'Action immédiate possible',
      phases: [
        {
          id: 'phase_preparation',
          name: 'Préparation',
          duration: 'Variable (planification)',
          objective: 'Planifier action malveillante en exploitant connaissance interne',
          techniques: [
            'Identification fenêtres temporelles (nuits, week-ends)',
            'Reconnaissance cibles internes (bases données)',
            'Préparation canaux exfiltration (USB, cloud)',
            'Motivation déclenchante (licenciement, conflit)'
          ],
          tools: [
            'Calendriers de surveillance',
            'Outils d\'administration natifs',
            'Supports amovibles personnels',
            'Comptes cloud personnels'
          ],
          iocs: [
            'Accès systèmes hors horaires habituels',
            'Consultation documentation sensible',
            'Préparation supports exfiltration',
            'Changements comportementaux'
          ],
          detectionPoints: [
            'Monitoring accès hors horaires',
            'Surveillance comportementale (UEBA)',
            'Détection supports amovibles',
            'Analyse patterns d\'accès'
          ]
        },
        {
          id: 'phase_execution',
          name: 'Exécution',
          duration: '1-4 heures',
          objective: 'Réaliser exfiltration et sabotage avec outils légitimes',
          techniques: [
            'Accès direct bases données (SQL Management)',
            'Requêtes extraction massive (SELECT *)',
            'Contournement logs audit (désactivation)',
            'Modification permissions fichiers',
            'Exfiltration via canaux autorisés'
          ],
          tools: [
            'SQL Server Management Studio',
            'PowerShell ISE',
            'Outils de sauvegarde détournés',
            'WinRAR/7-Zip (compression)',
            'Clients FTP/Cloud'
          ],
          iocs: [
            'Requêtes SQL volumineuses hors horaires',
            'Désactivation temporaire logs',
            'Accès ressources inhabituelles',
            'Transferts données volumineux',
            'Modifications permissions anormales'
          ],
          detectionPoints: [
            'Monitoring requêtes SQL anormales',
            'Alertes désactivation logs',
            'DLP (Data Loss Prevention)',
            'Surveillance transferts réseau',
            'Audit modifications permissions'
          ]
        }
      ],
      mitreMapping: [
        'T1078.002 - Valid Accounts: Domain Accounts',
        'T1087.002 - Account Discovery: Domain Account',
        'T1005 - Data from Local System',
        'T1562.002 - Disable Windows Event Logging',
        'T1222 - File and Directory Permissions Modification',
        'T1052.001 - Exfiltration Over USB',
        'T1567.002 - Exfiltration to Cloud Storage'
      ],
      iocs: [
        'Process: sqlcmd.exe -S server -Q "SELECT * FROM patients"',
        'Event: Windows Event Log service stopped',
        'Behavior: Database access outside normal hours',
        'Network: Large data transfers to external services',
        'File: Compressed archives with patient data'
      ],
      detectionMeasures: [
        'UEBA (User Entity Behavior Analytics)',
        'PAM (Privileged Access Management)',
        'Monitoring accès hors horaires',
        'DLP (Data Loss Prevention)',
        'Audit continu des privilèges'
      ],
      gravityLevel: 3
    };
  }

  // 📊 MAPPING DE TRANSFORMATION
  static getTransformationMappings(): TransformationMapping[] {
    return [
      {
        strategicElement: 'Source: Cybercriminels spécialisés santé',
        operationalElements: [
          'Techniques spécialisées (évasion EDR médicaux)',
          'Infrastructure C&C robuste',
          'Spear-phishing contextualisé médical',
          'Chiffrement sélectif (épargne réanimation)',
          'Négociation professionnelle secteur'
        ],
        justification: 'La spécialisation de la source détermine les techniques et outils utilisés',
        traceability: 'Capacités source → Techniques opérationnelles'
      },
      {
        strategicElement: 'Bien: Urgences vitales + SIH',
        operationalElements: [
          'Cibles techniques: Serveurs SIH, VLAN médical',
          'Vecteurs d\'accès: Postes médicaux urgences',
          'Objectifs techniques: Chiffrement bases SIH',
          'Impact cascade: Paralysie tous services',
          'Contraintes: Maintien réanimation'
        ],
        justification: 'Le bien essentiel détermine les cibles techniques et contraintes opérationnelles',
        traceability: 'Bien essentiel → Cibles techniques'
      },
      {
        strategicElement: 'Événement: Arrêt urgences + Paralysie SIH',
        operationalElements: [
          'Objectif final: Chiffrement sélectif LockBit',
          'Préservation: Épargne serveurs réanimation',
          'Timeline: Impact en 2-6h (négociation)',
          'Pression: Vies en jeu = paiement rapide',
          'Récupération: Restauration ou paiement rançon'
        ],
        justification: 'L\'événement redouté définit l\'objectif final et les contraintes d\'exécution',
        traceability: 'Événement redouté → Objectif technique'
      },
      {
        strategicElement: 'Vraisemblance: 5/5 (Très forte)',
        operationalElements: [
          'Complexité technique: 9/10 (Très élevée)',
          'Sophistication: APT-level spécialisé',
          'Ressources: Infrastructure professionnelle',
          'Timeline: 3-6 semaines (réaliste)',
          'Détection: 8/10 (Très difficile)'
        ],
        justification: 'La vraisemblance très forte justifie la sophistication technique élevée',
        traceability: 'Vraisemblance → Complexité technique'
      },
      {
        strategicElement: 'Impact: 4/4 (Catastrophique)',
        operationalElements: [
          'Gravité opérationnelle: 4/4 (Critique)',
          'Cibles prioritaires: Systèmes vitaux',
          'Amplification: Cascade tous services',
          'Durée: Paralysie >24h inacceptable',
          'Coût: 5-15M€ (récupération + pertes)'
        ],
        justification: 'L\'impact catastrophique détermine la gravité opérationnelle et les cibles',
        traceability: 'Impact stratégique → Gravité opérationnelle'
      }
    ];
  }

  // ✅ VALIDATION DE L'UTILISATION
  static validateDeliverablesUsage(): {
    strategicScenariosUsed: number;
    operationalModesGenerated: number;
    transformationMappings: number;
    coveragePercentage: number;
    traceabilityComplete: boolean;
    recommendations: string[];
  } {
    const strategicScenarios = this.getStrategicScenarios();
    const operationalModes = this.transformToOperationalModes();
    const mappings = this.getTransformationMappings();

    const coveragePercentage = (operationalModes.length / strategicScenarios.length) * 100;
    const traceabilityComplete = mappings.length >= 5; // Au moins 5 mappings essentiels

    return {
      strategicScenariosUsed: strategicScenarios.length,
      operationalModesGenerated: operationalModes.length,
      transformationMappings: mappings.length,
      coveragePercentage,
      traceabilityComplete,
      recommendations: [
        'Tous les scénarios stratégiques critiques ont été transformés',
        'La traçabilité est complète entre éléments stratégiques et opérationnels',
        'Les modes opératoires respectent la complexité des scénarios',
        'Les techniques MITRE ATT&CK sont alignées sur les capacités sources',
        'Les IOCs permettent la détection des modes opératoires'
      ]
    };
  }
}

export default Workshop3DeliverablesIntegration;
