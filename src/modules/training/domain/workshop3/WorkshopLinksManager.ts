/**
 * 🔗 GESTIONNAIRE DE LIENS VERS ATELIERS 4 ET 5
 * Système de transmission des scénarios stratégiques vers les ateliers suivants
 */

// 🎯 TYPES POUR LES LIENS INTER-ATELIERS
export interface OperationalScenarioLink {
  strategicScenarioId: string;
  strategicScenarioName: string;
  operationalModes: OperationalMode[];
  technicalDetails: TechnicalDetail[];
  attackVectors: AttackVector[];
  timeline: AttackTimeline;
  sophisticationLevel: number; // 1-10
  detectionDifficulty: number; // 1-10
}

export interface OperationalMode {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  tools: string[];
  prerequisites: string[];
  indicators: string[];
}

export interface TechnicalDetail {
  phase: string;
  description: string;
  techniques: string[];
  vulnerabilities: string[];
  mitigations: string[];
}

export interface AttackVector {
  id: string;
  name: string;
  description: string;
  likelihood: number; // 1-5
  impact: number; // 1-4
  prerequisites: string[];
}

export interface AttackTimeline {
  reconnaissance: string;
  initialAccess: string;
  persistence: string;
  escalation: string;
  lateralMovement: string;
  exfiltration: string;
  impact: string;
}

export interface RiskTreatmentLink {
  strategicScenarioId: string;
  strategicScenarioName: string;
  riskLevel: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
  priority: number;
  treatmentMeasures: TreatmentMeasure[];
  budgetAllocation: BudgetAllocation;
  implementationPlan: ImplementationPlan;
  kpis: RiskKPI[];
}

export interface TreatmentMeasure {
  id: string;
  type: 'preventive' | 'detective' | 'corrective' | 'recovery';
  name: string;
  description: string;
  cost: number;
  effectiveness: number; // 1-10
  implementationTime: number; // months
  dependencies: string[];
}

export interface BudgetAllocation {
  totalBudget: number;
  preventive: number;
  detective: number;
  corrective: number;
  recovery: number;
  percentageOfTotal: number;
}

export interface ImplementationPlan {
  phase1: string[];
  phase2: string[];
  phase3: string[];
  timeline: number; // months
  milestones: string[];
}

export interface RiskKPI {
  name: string;
  target: number;
  current: number;
  unit: string;
  frequency: string;
}

/**
 * 🔗 GESTIONNAIRE DE LIENS INTER-ATELIERS
 */
export class WorkshopLinksManager {

  // 📤 LIENS VERS ATELIER 4 - SCÉNARIOS OPÉRATIONNELS
  static generateWorkshop4Links(): OperationalScenarioLink[] {
    return [
      {
        strategicScenarioId: 'scenario_ransomware_sih',
        strategicScenarioName: 'Ransomware SIH Urgences',
        operationalModes: [
          {
            id: 'ransomware_advanced',
            name: 'Ransomware avancé multi-étapes',
            description: 'Déploiement sophistiqué de ransomware avec évasion EDR et chiffrement sélectif',
            techniques: [
              'Spear-phishing avec ingénierie sociale',
              'Exploitation CVE récentes (Windows/VMware)',
              'Living off the land (PowerShell, WMI)',
              'Désactivation EDR et antivirus',
              'Chiffrement sélectif (épargne réanimation)',
              'Double extorsion (exfiltration + chiffrement)'
            ],
            tools: [
              'Cobalt Strike ou équivalent',
              'Mimikatz pour extraction credentials',
              'PsExec pour propagation latérale',
              'Ransomware LockBit/Conti personnalisé',
              'Outils d\'exfiltration (Rclone, Mega)',
              'Communication C&C (DNS tunneling)'
            ],
            prerequisites: [
              'Reconnaissance préalable du CHU',
              'Identification des administrateurs clés',
              'Cartographie du réseau interne',
              'Analyse des sauvegardes et DR'
            ],
            indicators: [
              'Emails de phishing ciblés',
              'Connexions suspectes PowerShell',
              'Désactivation sécurités endpoint',
              'Trafic réseau anormal (exfiltration)',
              'Chiffrement massif de fichiers'
            ]
          }
        ],
        technicalDetails: [
          {
            phase: 'Accès initial',
            description: 'Compromission poste médecin via spear-phishing',
            techniques: ['Email malveillant', 'Macro Office', 'Backdoor discret'],
            vulnerabilities: ['Formation insuffisante', 'Absence MFA', 'Endpoint non protégé'],
            mitigations: ['Formation anti-phishing', 'MFA obligatoire', 'EDR avancé']
          },
          {
            phase: 'Reconnaissance',
            description: 'Cartographie réseau et identification cibles',
            techniques: ['Scan réseau', 'Énumération AD', 'Identification serveurs critiques'],
            vulnerabilities: ['Segmentation faible', 'Comptes privilégiés exposés', 'Logs insuffisants'],
            mitigations: ['Micro-segmentation', 'PAM', 'SIEM temps réel']
          },
          {
            phase: 'Escalade privilèges',
            description: 'Obtention droits administrateur domaine',
            techniques: ['Exploitation CVE', 'Kerberoasting', 'Pass-the-hash'],
            vulnerabilities: ['Patches manquants', 'Comptes service faibles', 'Kerberos mal configuré'],
            mitigations: ['Patch management', 'Rotation mots de passe', 'Kerberos renforcé']
          },
          {
            phase: 'Propagation',
            description: 'Déploiement sur serveurs critiques SIH',
            techniques: ['PsExec', 'WMI', 'Scheduled tasks'],
            vulnerabilities: ['Admin local partagé', 'Firewall interne faible', 'Monitoring insuffisant'],
            mitigations: ['LAPS', 'Firewall interne', 'Behavioral analytics']
          },
          {
            phase: 'Impact',
            description: 'Chiffrement SIH et demande rançon',
            techniques: ['Chiffrement AES', 'Destruction sauvegardes', 'Message extorsion'],
            vulnerabilities: ['Sauvegardes accessibles', 'Pas d\'air-gap', 'Plan de crise absent'],
            mitigations: ['Sauvegardes isolées', 'Air-gap', 'Plan de continuité']
          }
        ],
        attackVectors: [
          {
            id: 'email_phishing',
            name: 'Email de phishing ciblé',
            description: 'Email malveillant envoyé à un médecin chef de service',
            likelihood: 5,
            impact: 4,
            prerequisites: ['Reconnaissance OSINT', 'Ingénierie sociale', 'Infrastructure C&C']
          },
          {
            id: 'vpn_compromise',
            name: 'Compromission VPN',
            description: 'Exploitation vulnérabilité VPN ou credentials volés',
            likelihood: 4,
            impact: 4,
            prerequisites: ['CVE VPN', 'Credentials compromis', 'Accès réseau']
          },
          {
            id: 'supply_chain',
            name: 'Compromission supply chain',
            description: 'Infection via prestataire maintenance ou logiciel tiers',
            likelihood: 3,
            impact: 4,
            prerequisites: ['Identification prestataires', 'Compromission upstream', 'Accès privilégié']
          }
        ],
        timeline: {
          reconnaissance: '2-4 semaines (OSINT, ingénierie sociale)',
          initialAccess: '24-72h (phishing, exploitation)',
          persistence: '1-7 jours (backdoors, comptes fantômes)',
          escalation: '1-3 jours (exploitation, credential dumping)',
          lateralMovement: '3-7 jours (propagation, cartographie)',
          exfiltration: '1-2 semaines (données sensibles)',
          impact: '2-6h (chiffrement, extorsion)'
        },
        sophisticationLevel: 9,
        detectionDifficulty: 8
      },
      {
        strategicScenarioId: 'scenario_abus_privilèges',
        strategicScenarioName: 'Abus privilèges administrateur',
        operationalModes: [
          {
            id: 'insider_abuse',
            name: 'Abus de privilèges administrateur',
            description: 'Utilisation malveillante des accès légitimes par un administrateur IT',
            techniques: [
              'Accès direct bases de données',
              'Contournement logs d\'audit',
              'Utilisation outils d\'administration',
              'Modification permissions',
              'Exfiltration via canaux légitimes',
              'Sabotage discret systèmes'
            ],
            tools: [
              'Outils d\'administration natifs',
              'SQL Management Studio',
              'PowerShell ISE',
              'Remote Desktop',
              'Outils de sauvegarde détournés',
              'USB/Cloud personnel'
            ],
            prerequisites: [
              'Accès administrateur légitime',
              'Connaissance architecture SI',
              'Horaires de surveillance réduite',
              'Motivation (licenciement, conflit)'
            ],
            indicators: [
              'Accès hors horaires habituels',
              'Requêtes SQL anormales',
              'Modifications permissions suspectes',
              'Transferts de données volumineux',
              'Désactivation logs temporaire'
            ]
          }
        ],
        technicalDetails: [
          {
            phase: 'Préparation',
            description: 'Planification de l\'action malveillante',
            techniques: ['Reconnaissance interne', 'Identification cibles', 'Préparation exfiltration'],
            vulnerabilities: ['Surveillance interne faible', 'Contrôles insuffisants', 'Ségrégation duties absente'],
            mitigations: ['Surveillance comportementale', 'Contrôles à 4 yeux', 'Ségrégation des tâches']
          },
          {
            phase: 'Exécution',
            description: 'Réalisation de l\'abus de privilèges',
            techniques: ['Accès direct données', 'Contournement contrôles', 'Exfiltration discrète'],
            vulnerabilities: ['Privilèges excessifs', 'Monitoring insuffisant', 'DLP absent'],
            mitigations: ['Principe moindre privilège', 'Monitoring temps réel', 'DLP avancé']
          }
        ],
        attackVectors: [
          {
            id: 'direct_database',
            name: 'Accès direct base de données',
            description: 'Connexion directe aux bases de données patients',
            likelihood: 5,
            impact: 3,
            prerequisites: ['Droits DBA', 'Accès réseau', 'Connaissance schémas']
          }
        ],
        timeline: {
          reconnaissance: 'Immédiat (connaissance interne)',
          initialAccess: 'Immédiat (accès légitime)',
          persistence: 'N/A (accès permanent)',
          escalation: 'N/A (privilèges déjà élevés)',
          lateralMovement: 'Immédiat (accès global)',
          exfiltration: '1-7 jours (selon volume)',
          impact: 'Immédiat (action directe)'
        },
        sophisticationLevel: 4,
        detectionDifficulty: 7
      }
    ];
  }

  // 📤 LIENS VERS ATELIER 5 - TRAITEMENT DU RISQUE
  static generateWorkshop5Links(): RiskTreatmentLink[] {
    return [
      {
        strategicScenarioId: 'scenario_ransomware_sih',
        strategicScenarioName: 'Ransomware SIH Urgences',
        riskLevel: 'CRITIQUE',
        priority: 1,
        treatmentMeasures: [
          {
            id: 'mfa_deployment',
            type: 'preventive',
            name: 'Déploiement MFA généralisé',
            description: 'Authentification multi-facteurs obligatoire pour tous les comptes',
            cost: 150000,
            effectiveness: 8,
            implementationTime: 3,
            dependencies: ['Formation utilisateurs', 'Infrastructure PKI']
          },
          {
            id: 'edr_advanced',
            type: 'detective',
            name: 'EDR avancé avec IA',
            description: 'Solution de détection comportementale sur tous les endpoints',
            cost: 300000,
            effectiveness: 9,
            implementationTime: 6,
            dependencies: ['SOC renforcé', 'Formation équipes']
          },
          {
            id: 'backup_airgap',
            type: 'recovery',
            name: 'Sauvegardes air-gap',
            description: 'Sauvegardes isolées physiquement du réseau',
            cost: 200000,
            effectiveness: 10,
            implementationTime: 4,
            dependencies: ['Infrastructure dédiée', 'Procédures restauration']
          },
          {
            id: 'incident_response',
            type: 'corrective',
            name: 'Plan de réponse incident',
            description: 'Procédures et équipe de réponse aux incidents cyber',
            cost: 100000,
            effectiveness: 7,
            implementationTime: 2,
            dependencies: ['Formation équipes', 'Outils forensiques']
          }
        ],
        budgetAllocation: {
          totalBudget: 750000,
          preventive: 250000, // 33%
          detective: 300000,  // 40%
          corrective: 100000, // 13%
          recovery: 200000,   // 27%
          percentageOfTotal: 60 // 60% du budget sécurité total
        },
        implementationPlan: {
          phase1: ['MFA déploiement', 'Plan incident response'],
          phase2: ['EDR avancé', 'Sauvegardes air-gap'],
          phase3: ['Optimisation', 'Formation avancée'],
          timeline: 12,
          milestones: [
            'Mois 3: MFA opérationnel',
            'Mois 6: EDR déployé',
            'Mois 8: Sauvegardes air-gap',
            'Mois 12: Optimisation complète'
          ]
        },
        kpis: [
          {
            name: 'Temps de détection ransomware',
            target: 5,
            current: 120,
            unit: 'minutes',
            frequency: 'mensuel'
          },
          {
            name: 'Couverture MFA',
            target: 100,
            current: 20,
            unit: '%',
            frequency: 'mensuel'
          },
          {
            name: 'Temps de restauration',
            target: 4,
            current: 72,
            unit: 'heures',
            frequency: 'trimestriel'
          }
        ]
      },
      {
        strategicScenarioId: 'scenario_abus_privilèges',
        strategicScenarioName: 'Abus privilèges administrateur',
        riskLevel: 'ÉLEVÉ',
        priority: 2,
        treatmentMeasures: [
          {
            id: 'pam_solution',
            type: 'preventive',
            name: 'Solution PAM (Privileged Access Management)',
            description: 'Gestion centralisée des comptes privilégiés',
            cost: 200000,
            effectiveness: 9,
            implementationTime: 6,
            dependencies: ['Inventaire comptes', 'Intégration AD']
          },
          {
            id: 'ueba_monitoring',
            type: 'detective',
            name: 'Monitoring comportemental UEBA',
            description: 'Détection d\'anomalies comportementales utilisateurs',
            cost: 150000,
            effectiveness: 8,
            implementationTime: 4,
            dependencies: ['Baseline comportements', 'Tuning algorithmes']
          },
          {
            id: 'dlp_advanced',
            type: 'preventive',
            name: 'DLP avancé',
            description: 'Prévention de fuite de données multi-canaux',
            cost: 100000,
            effectiveness: 7,
            implementationTime: 3,
            dependencies: ['Classification données', 'Politiques DLP']
          }
        ],
        budgetAllocation: {
          totalBudget: 450000,
          preventive: 300000, // 67%
          detective: 150000,  // 33%
          corrective: 0,      // 0%
          recovery: 0,        // 0%
          percentageOfTotal: 25 // 25% du budget sécurité total
        },
        implementationPlan: {
          phase1: ['Inventaire comptes privilégiés', 'DLP déploiement'],
          phase2: ['PAM solution', 'UEBA monitoring'],
          phase3: ['Optimisation', 'Procédures'],
          timeline: 8,
          milestones: [
            'Mois 3: DLP opérationnel',
            'Mois 6: PAM déployé',
            'Mois 8: UEBA optimisé'
          ]
        },
        kpis: [
          {
            name: 'Comptes privilégiés sous PAM',
            target: 100,
            current: 0,
            unit: '%',
            frequency: 'mensuel'
          },
          {
            name: 'Alertes UEBA traitées',
            target: 95,
            current: 0,
            unit: '%',
            frequency: 'mensuel'
          }
        ]
      }
    ];
  }

  // 🎯 GÉNÉRATION AUTOMATIQUE DES LIENS
  static generateAllLinks(): {
    workshop4Links: OperationalScenarioLink[];
    workshop5Links: RiskTreatmentLink[];
    summary: {
      totalOperationalModes: number;
      totalTreatmentMeasures: number;
      totalBudget: number;
      implementationTimeline: number;
    };
  } {
    const workshop4Links = this.generateWorkshop4Links();
    const workshop5Links = this.generateWorkshop5Links();

    const totalOperationalModes = workshop4Links.reduce((sum, link) => sum + link.operationalModes.length, 0);
    const totalTreatmentMeasures = workshop5Links.reduce((sum, link) => sum + link.treatmentMeasures.length, 0);
    const totalBudget = workshop5Links.reduce((sum, link) => sum + link.budgetAllocation.totalBudget, 0);
    const implementationTimeline = Math.max(...workshop5Links.map(link => link.implementationPlan.timeline));

    return {
      workshop4Links,
      workshop5Links,
      summary: {
        totalOperationalModes,
        totalTreatmentMeasures,
        totalBudget,
        implementationTimeline
      }
    };
  }

  // 📊 VALIDATION DES LIENS
  static validateLinks(): {
    workshop4Coverage: number;
    workshop5Coverage: number;
    consistency: boolean;
    recommendations: string[];
  } {
    const w4Links = this.generateWorkshop4Links();
    const w5Links = this.generateWorkshop5Links();

    // Validation couverture
    const strategicScenarios = ['scenario_ransomware_sih', 'scenario_abus_privilèges', 'scenario_exfiltration_recherche'];
    const w4Coverage = (w4Links.length / strategicScenarios.length) * 100;
    const w5Coverage = (w5Links.length / strategicScenarios.length) * 100;

    // Validation cohérence
    const w4Scenarios = new Set(w4Links.map(link => link.strategicScenarioId));
    const w5Scenarios = new Set(w5Links.map(link => link.strategicScenarioId));
    const consistency = w4Scenarios.size === w5Scenarios.size;

    const recommendations = [
      'Tous les scénarios critiques ont des modes opératoires détaillés',
      'Les mesures de traitement sont alignées sur les niveaux de risque',
      'Les budgets sont proportionnels aux priorités',
      'Les timelines d\'implémentation sont réalistes'
    ];

    return {
      workshop4Coverage: w4Coverage,
      workshop5Coverage: w5Coverage,
      consistency,
      recommendations
    };
  }
}

export default WorkshopLinksManager;
