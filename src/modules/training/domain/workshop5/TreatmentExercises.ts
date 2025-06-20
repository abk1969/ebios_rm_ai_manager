/**
 * 🎯 EXERCICES PRATIQUES TRAITEMENT DU RISQUE
 * Exercices spécialisés pour maîtriser la sélection des mesures de sécurité CHU
 */

// 🎯 TYPES POUR LES EXERCICES DE TRAITEMENT
export interface TreatmentExercise {
  id: string;
  title: string;
  description: string;
  type: 'cost_benefit_analysis' | 'measure_prioritization' | 'implementation_planning' | 'kpi_definition' | 'governance_simulation';
  difficulty: 'intermediate' | 'advanced' | 'expert';
  duration: number; // minutes
  points: number;
  category: string;
  scenario: ExerciseScenario;
  questions: ExerciseQuestion[];
  context: CHUContext;
  learningObjectives: string[];
  realWorldExample: string;
  anssiCompliance: string[];
}

export interface ExerciseScenario {
  id: string;
  name: string;
  description: string;
  riskLevel: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE';
  estimatedDamage: number; // euros
  complexity: number; // 1-10
  constraints: ScenarioConstraint[];
  stakeholders: Stakeholder[];
  timeline: string;
  budget: number;
}

export interface ScenarioConstraint {
  type: 'budget' | 'timeline' | 'regulatory' | 'operational' | 'technical';
  description: string;
  impact: 'high' | 'medium' | 'low';
  mandatory: boolean;
}

export interface Stakeholder {
  role: string;
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  concerns: string[];
  requirements: string[];
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'ranking' | 'calculation' | 'scenario_analysis' | 'decision_matrix';
  options?: string[];
  correctAnswer: any;
  explanation: string;
  points: number;
  hints?: string[];
  commonMistakes?: string[];
  expertTips?: string[];
}

export interface CHUContext {
  hospitalType: string;
  bedCount: number;
  specialties: string[];
  itInfrastructure: ITInfrastructure;
  securityMaturity: number; // 1-5
  regulatoryRequirements: string[];
  budgetConstraints: BudgetConstraint[];
  operationalConstraints: OperationalConstraint[];
}

export interface ITInfrastructure {
  endpoints: number;
  servers: number;
  networkSegments: string[];
  criticalSystems: string[];
  existingSecurity: string[];
}

export interface BudgetConstraint {
  category: string;
  maxAmount: number;
  timeframe: string;
  approvalRequired: boolean;
}

export interface OperationalConstraint {
  type: string;
  description: string;
  impact: string;
  workaround?: string;
}

/**
 * 🎯 GÉNÉRATEUR D'EXERCICES TRAITEMENT DU RISQUE
 */
export class TreatmentExercises {

  // 💰 EXERCICE 1 - ANALYSE COÛT-BÉNÉFICE
  static getExercise1_CostBenefitAnalysis(): TreatmentExercise {
    return {
      id: 'exercise_cost_benefit_analysis',
      title: 'Analyse coût-bénéfice des mesures de sécurité CHU',
      description: 'Analysez et comparez le ROI de différentes mesures de sécurité pour un scénario ransomware critique',
      type: 'cost_benefit_analysis',
      difficulty: 'advanced',
      duration: 35,
      points: 120,
      category: 'financial_analysis',
      scenario: {
        id: 'scenario_ransomware_chu_regional',
        name: 'Ransomware CHU Régional',
        description: 'CHU régional de 800 lits menacé par groupe ransomware spécialisé santé. Analyse de 4 mesures de protection.',
        riskLevel: 'CRITIQUE',
        estimatedDamage: 15000000,
        complexity: 9,
        constraints: [
          {
            type: 'budget',
            description: 'Budget sécurité limité à 2M€ sur 3 ans',
            impact: 'high',
            mandatory: true
          },
          {
            type: 'operational',
            description: 'Continuité soins 24h/24 obligatoire',
            impact: 'high',
            mandatory: true
          },
          {
            type: 'regulatory',
            description: 'Certification HDS à maintenir',
            impact: 'medium',
            mandatory: true
          },
          {
            type: 'timeline',
            description: 'Déploiement en moins de 12 mois',
            impact: 'medium',
            mandatory: false
          }
        ],
        stakeholders: [
          {
            role: 'Directeur Général CHU',
            influence: 'high',
            interest: 'high',
            concerns: ['Budget', 'Responsabilité pénale', 'Image CHU'],
            requirements: ['ROI démontrable', 'Risque résiduel acceptable']
          },
          {
            role: 'RSSI',
            influence: 'medium',
            interest: 'high',
            concerns: ['Efficacité technique', 'Conformité ANSSI'],
            requirements: ['Mesures techniques robustes', 'Monitoring avancé']
          },
          {
            role: 'DSI',
            influence: 'medium',
            interest: 'medium',
            concerns: ['Intégration SI', 'Performance'],
            requirements: ['Compatibilité existant', 'Support technique']
          },
          {
            role: 'Chef de service Réanimation',
            influence: 'high',
            interest: 'medium',
            concerns: ['Continuité soins', 'Disponibilité systèmes'],
            requirements: ['Aucune interruption', 'Récupération <4h']
          }
        ],
        timeline: '12 mois',
        budget: 2000000
      },
      questions: [
        {
          id: 'q1_measure_selection',
          question: 'Parmi ces 4 mesures de sécurité, sélectionnez les 3 qui offrent le meilleur ROI pour ce scénario ransomware CHU :',
          type: 'multiple_select',
          options: [
            'A) EDR Next-Gen avec IA (400k€) - Efficacité 9/10 - Réduction risque 85%',
            'B) SIEM spécialisé santé (250k€) - Efficacité 8/10 - Réduction risque 70%',
            'C) Sauvegardes air-gap (350k€) - Efficacité 10/10 - Réduction risque 95%',
            'D) Formation anti-phishing (50k€) - Efficacité 6/10 - Réduction risque 40%',
            'E) Assurance cyber (200k€/an) - Efficacité 5/10 - Transfert risque financier',
            'F) Audit de sécurité (80k€) - Efficacité 7/10 - Identification vulnérabilités'
          ],
          correctAnswer: ['A', 'B', 'C'],
          explanation: `Les 3 mesures optimales sont :
          
**A) EDR Next-Gen (400k€)** : ROI = (15M€ × 85%) / 400k€ = 31.9x
- Justification : Efficacité maximale contre ransomware sophistiqué
- Réduction dommages : 12.75M€
- Période de retour : 11 jours

**B) SIEM spécialisé santé (250k€)** : ROI = (15M€ × 70%) / 250k€ = 42x  
- Justification : Détection précoce spécialisée secteur santé
- Réduction dommages : 10.5M€
- Période de retour : 9 jours

**C) Sauvegardes air-gap (350k€)** : ROI = (15M€ × 95%) / 350k€ = 40.7x
- Justification : Récupération garantie même si chiffrement réussi
- Réduction dommages : 14.25M€
- Période de retour : 9 jours

**Total investissement** : 1M€ (50% du budget)
**Total réduction dommages** : 37.5M€
**ROI combiné** : 37.5x (Exceptionnel)

Les options D, E, F ont un ROI inférieur ou ne traitent pas directement le risque critique.`,
          points: 40,
          hints: [
            'Calculez le ROI = (Dommages évités) / Coût de la mesure',
            'Dommages évités = Dommages estimés × % Réduction risque',
            'Priorisez les mesures avec ROI > 10x pour risques critiques'
          ],
          commonMistakes: [
            'Choisir la formation (ROI faible pour risque critique)',
            'Choisir l\'assurance (coût récurrent, pas de réduction technique)',
            'Ignorer les sauvegardes (pourtant essentielles pour ransomware)'
          ],
          expertTips: [
            'Pour ransomware : Prévention (EDR) + Détection (SIEM) + Récupération (Sauvegardes)',
            'ROI > 30x indique investissement très rentable',
            'Combiner mesures complémentaires pour défense en profondeur'
          ]
        },
        {
          id: 'q2_budget_allocation',
          question: 'Avec un budget de 2M€, comment répartiriez-vous optimalement les investissements par catégorie de mesures ?',
          type: 'multiple_choice',
          options: [
            'A) Prévention 40% (800k€) - Détection 35% (700k€) - Réponse 15% (300k€) - Récupération 10% (200k€)',
            'B) Prévention 25% (500k€) - Détection 45% (900k€) - Réponse 20% (400k€) - Récupération 10% (200k€)',
            'C) Prévention 30% (600k€) - Détection 30% (600k€) - Réponse 15% (300k€) - Récupération 25% (500k€)',
            'D) Prévention 50% (1M€) - Détection 25% (500k€) - Réponse 15% (300k€) - Récupération 10% (200k€)'
          ],
          correctAnswer: 'C',
          explanation: `**Répartition optimale C) :**

**Prévention 30% (600k€) :**
- EDR Next-Gen : 400k€
- Formation avancée : 100k€  
- Durcissement systèmes : 100k€
- Justification : Base solide sans sur-investissement

**Détection 30% (600k€) :**
- SIEM spécialisé santé : 250k€
- UEBA comportemental : 150k€
- Threat intelligence : 100k€
- Monitoring réseau : 100k€
- Justification : Détection multicouche essentielle

**Récupération 25% (500k€) :**
- Sauvegardes air-gap : 350k€
- Plan de continuité : 150k€
- Justification : Récupération critique pour ransomware

**Réponse 15% (300k€) :**
- Équipe CERT : 200k€
- Outils investigation : 100k€
- Justification : Réponse rapide mais budget maîtrisé

Cette répartition équilibre prévention/détection tout en renforçant la récupération, essentielle contre ransomware.`,
          points: 30,
          hints: [
            'Ransomware nécessite forte capacité de récupération',
            'Équilibrer prévention et détection',
            'Réponse importante mais moins critique que récupération'
          ]
        },
        {
          id: 'q3_roi_calculation',
          question: 'Calculez le ROI global de votre sélection de mesures (Question 1) et indiquez la période de retour sur investissement :',
          type: 'calculation',
          correctAnswer: {
            roi: 37.5,
            paybackPeriod: '10 jours',
            calculation: 'ROI = (12.75M€ + 10.5M€ + 14.25M€) / 1M€ = 37.5x'
          },
          explanation: `**Calcul détaillé du ROI :**

**Mesures sélectionnées :**
- EDR Next-Gen : 400k€ → Dommages évités : 15M€ × 85% = 12.75M€
- SIEM santé : 250k€ → Dommages évités : 15M€ × 70% = 10.5M€  
- Sauvegardes air-gap : 350k€ → Dommages évités : 15M€ × 95% = 14.25M€

**Calcul ROI global :**
- Investissement total : 400k€ + 250k€ + 350k€ = 1M€
- Dommages évités totaux : 12.75M€ + 10.5M€ + 14.25M€ = 37.5M€
- ROI = 37.5M€ / 1M€ = **37.5x**

**Période de retour :**
- Retour quotidien = 37.5M€ / 365 jours = 102.7k€/jour
- Période de retour = 1M€ / 102.7k€ = **9.7 jours ≈ 10 jours**

Ce ROI exceptionnel justifie pleinement l'investissement pour un risque critique.`,
          points: 30,
          hints: [
            'ROI = Total dommages évités / Total investissement',
            'Période retour = Investissement / (Dommages évités / 365)',
            'Attention aux effets de synergie entre mesures'
          ]
        },
        {
          id: 'q4_stakeholder_presentation',
          question: 'Comment présenteriez-vous ces résultats au Directeur Général pour obtenir l\'approbation budgétaire ?',
          type: 'scenario_analysis',
          correctAnswer: 'structured_business_case',
          explanation: `**Présentation structurée au Directeur Général :**

**1. Contexte et enjeux (2 min) :**
- "Risque ransomware CRITIQUE : 15M€ de dommages potentiels"
- "Responsabilité pénale dirigeants en cas d'incident"
- "Vies en jeu + réputation CHU"

**2. Solution recommandée (3 min) :**
- "3 mesures complémentaires : EDR + SIEM + Sauvegardes"
- "Investissement : 1M€ (50% du budget sécurité)"
- "Défense en profondeur : Prévention + Détection + Récupération"

**3. Bénéfices financiers (2 min) :**
- "ROI exceptionnel : 37.5x"
- "Période de retour : 10 jours"
- "37.5M€ de dommages évités"
- "Comparaison : Coût incident Rouen = 10M€"

**4. Conformité et gouvernance (1 min) :**
- "Conformité ANSSI et certification HDS maintenue"
- "Réduction risque résiduel de 85%"
- "Audit et reporting automatisés"

**5. Planning et validation (2 min) :**
- "Déploiement 12 mois avec phases pilotes"
- "Validation par étapes avec KPIs"
- "Approbation requise pour lancement"

**Message clé :** "1M€ d'investissement pour éviter 37.5M€ de dommages et protéger la continuité des soins"`,
          points: 20,
          hints: [
            'Commencer par les enjeux business et légaux',
            'Présenter ROI et période de retour en premier',
            'Terminer par planning et demande d\'approbation'
          ]
        }
      ],
      context: {
        hospitalType: 'CHU Régional',
        bedCount: 800,
        specialties: ['Réanimation', 'Cardiologie', 'Neurochirurgie', 'Urgences', 'Pédiatrie'],
        itInfrastructure: {
          endpoints: 2500,
          servers: 150,
          networkSegments: ['VLAN Médical', 'VLAN Administratif', 'VLAN Invités', 'DMZ'],
          criticalSystems: ['SIH', 'PACS', 'Monitoring patients', 'Bloc opératoire'],
          existingSecurity: ['Antivirus legacy', 'Firewall périmètre', 'Sauvegardes traditionnelles']
        },
        securityMaturity: 2,
        regulatoryRequirements: ['HDS', 'RGPD', 'Certification ISO 27001'],
        budgetConstraints: [
          {
            category: 'Sécurité IT',
            maxAmount: 2000000,
            timeframe: '3 ans',
            approvalRequired: true
          }
        ],
        operationalConstraints: [
          {
            type: 'Continuité soins',
            description: 'Aucune interruption > 4h acceptable',
            impact: 'Vies en jeu',
            workaround: 'Déploiement progressif par service'
          }
        ]
      },
      learningObjectives: [
        'Maîtriser le calcul du ROI pour mesures de sécurité',
        'Optimiser l\'allocation budgétaire par catégorie de mesures',
        'Présenter un business case sécurité à la direction',
        'Intégrer les contraintes opérationnelles CHU dans l\'analyse'
      ],
      realWorldExample: 'CHU de Rouen (2019) - Coût incident ransomware : 10M€, Durée récupération : 6 semaines',
      anssiCompliance: ['Guide EBIOS RM - Traitement du risque', 'Référentiel sécurité santé ANSSI']
    };
  }

  // 🎯 EXERCICE 2 - PRIORISATION DES MESURES
  static getExercise2_MeasurePrioritization(): TreatmentExercise {
    return {
      id: 'exercise_measure_prioritization',
      title: 'Priorisation des mesures selon contraintes budgétaires',
      description: 'Priorisez 8 mesures de sécurité avec un budget contraint en optimisant le rapport efficacité/coût',
      type: 'measure_prioritization',
      difficulty: 'expert',
      duration: 40,
      points: 140,
      category: 'strategic_planning',
      scenario: {
        id: 'scenario_budget_constraint',
        name: 'Budget sécurité contraint CHU',
        description: 'CHU de 600 lits avec budget sécurité réduit de 30%. Prioriser 8 mesures selon matrice multicritères.',
        riskLevel: 'ÉLEVÉ',
        estimatedDamage: 8000000,
        complexity: 7,
        constraints: [
          {
            type: 'budget',
            description: 'Budget réduit à 1.2M€ (au lieu de 1.8M€)',
            impact: 'high',
            mandatory: true
          },
          {
            type: 'timeline',
            description: 'Déploiement accéléré en 8 mois',
            impact: 'medium',
            mandatory: true
          }
        ],
        stakeholders: [],
        timeline: '8 mois',
        budget: 1200000
      },
      questions: [
        {
          id: 'q1_prioritization_matrix',
          question: 'Utilisez la matrice de priorisation pour classer ces 8 mesures par ordre de priorité (1=plus prioritaire) :',
          type: 'ranking',
          options: [
            'EDR Next-Gen (400k€) - Efficacité 9/10 - Complexité 7/10 - Délai 3 mois',
            'SIEM santé (250k€) - Efficacité 8/10 - Complexité 6/10 - Délai 2 mois',
            'Sauvegardes air-gap (350k€) - Efficacité 10/10 - Complexité 4/10 - Délai 2 mois',
            'PAM (120k€) - Efficacité 7/10 - Complexité 5/10 - Délai 1.5 mois',
            'Formation (80k€) - Efficacité 6/10 - Complexité 2/10 - Délai 1 mois',
            'DLP (100k€) - Efficacité 6/10 - Complexité 6/10 - Délai 2 mois',
            'UEBA (150k€) - Efficacité 7/10 - Complexité 8/10 - Délai 3 mois',
            'Audit sécurité (60k€) - Efficacité 5/10 - Complexité 3/10 - Délai 1 mois'
          ],
          correctAnswer: [
            'Sauvegardes air-gap',
            'SIEM santé', 
            'EDR Next-Gen',
            'PAM',
            'Formation',
            'DLP',
            'UEBA',
            'Audit sécurité'
          ],
          explanation: `**Matrice de priorisation multicritères :**

**Critères de notation :**
- Efficacité (40%) : Impact sur réduction risque
- Rapport coût/efficacité (30%) : Efficacité / Coût relatif  
- Facilité déploiement (20%) : (11 - Complexité) / 10
- Rapidité mise en œuvre (10%) : Bonus si délai ≤ 2 mois

**Classement justifié :**

**1. Sauvegardes air-gap (Score : 8.9/10)**
- Efficacité maximale (10/10) contre ransomware
- Complexité faible (4/10), déploiement rapide
- ROI : 22.9x (8M€ × 95% / 350k€)

**2. SIEM santé (Score : 8.4/10)**  
- Excellent rapport efficacité/coût
- Déploiement rapide (2 mois)
- ROI : 25.6x

**3. EDR Next-Gen (Score : 7.8/10)**
- Efficacité élevée mais coût important
- Complexité modérée, délai acceptable
- ROI : 18x

**4. PAM (Score : 7.2/10)**
- Bon rapport coût/efficacité
- Déploiement simple et rapide
- ROI : 46.7x

**5-8. Autres mesures** : Scores inférieurs due à efficacité moindre ou complexité élevée.`,
          points: 50,
          hints: [
            'Calculez un score pondéré : Efficacité×0.4 + (Efficacité/Coût)×0.3 + Facilité×0.2 + Rapidité×0.1',
            'Priorisez les mesures avec ROI > 20x',
            'Favorisez déploiement rapide avec budget contraint'
          ]
        }
      ],
      context: {
        hospitalType: 'CHU',
        bedCount: 600,
        specialties: ['Médecine', 'Chirurgie', 'Urgences'],
        itInfrastructure: {
          endpoints: 1800,
          servers: 100,
          networkSegments: ['VLAN Médical', 'VLAN Admin'],
          criticalSystems: ['SIH', 'PACS'],
          existingSecurity: ['Antivirus', 'Firewall']
        },
        securityMaturity: 2,
        regulatoryRequirements: ['HDS', 'RGPD'],
        budgetConstraints: [
          {
            category: 'Sécurité',
            maxAmount: 1200000,
            timeframe: '8 mois',
            approvalRequired: true
          }
        ],
        operationalConstraints: []
      },
      learningObjectives: [
        'Maîtriser les matrices de priorisation multicritères',
        'Optimiser les choix avec contraintes budgétaires',
        'Équilibrer efficacité, coût et faisabilité'
      ],
      realWorldExample: 'Priorisation post-COVID : budgets réduits, besoins sécurité accrus',
      anssiCompliance: ['Guide EBIOS RM - Priorisation des mesures']
    };
  }

  // 📅 EXERCICE 3 - PLANIFICATION D'IMPLÉMENTATION
  static getExercise3_ImplementationPlanning(): TreatmentExercise {
    return {
      id: 'exercise_implementation_planning',
      title: 'Planification d\'implémentation des mesures de sécurité',
      description: 'Créez un plan d\'implémentation détaillé avec phases, jalons et gestion des risques projet',
      type: 'implementation_planning',
      difficulty: 'expert',
      duration: 45,
      points: 160,
      category: 'project_management',
      scenario: {
        id: 'scenario_implementation_chu',
        name: 'Implémentation sécurité CHU',
        description: 'Planifier le déploiement de 5 mesures de sécurité sur 18 mois avec contraintes opérationnelles CHU',
        riskLevel: 'ÉLEVÉ',
        estimatedDamage: 10000000,
        complexity: 8,
        constraints: [
          {
            type: 'operational',
            description: 'Continuité soins 24h/24 obligatoire',
            impact: 'high',
            mandatory: true
          },
          {
            type: 'timeline',
            description: 'Déploiement en 18 mois maximum',
            impact: 'medium',
            mandatory: true
          },
          {
            type: 'budget',
            description: 'Budget étalé sur 3 exercices comptables',
            impact: 'medium',
            mandatory: true
          }
        ],
        stakeholders: [
          {
            role: 'Direction CHU',
            influence: 'high',
            interest: 'medium',
            concerns: ['Budget', 'Planning'],
            requirements: ['Jalons clairs', 'ROI démontrable']
          },
          {
            role: 'Équipes médicales',
            influence: 'medium',
            interest: 'high',
            concerns: ['Continuité soins', 'Formation'],
            requirements: ['Aucune interruption', 'Formation adaptée']
          }
        ],
        timeline: '18 mois',
        budget: 1500000
      },
      questions: [
        {
          id: 'q1_phase_planning',
          question: 'Organisez ces 5 mesures en 3 phases logiques de déploiement (6 mois chacune) :',
          type: 'scenario_analysis',
          options: [
            'EDR Next-Gen (400k€, 3 mois déploiement)',
            'SIEM santé (250k€, 2 mois déploiement)',
            'Sauvegardes air-gap (350k€, 2 mois déploiement)',
            'Formation équipes (100k€, 6 mois continu)',
            'PAM (150k€, 1.5 mois déploiement)'
          ],
          correctAnswer: {
            phase1: ['Sauvegardes air-gap', 'Formation équipes (début)'],
            phase2: ['SIEM santé', 'PAM', 'Formation équipes (suite)'],
            phase3: ['EDR Next-Gen', 'Formation équipes (fin)']
          },
          explanation: `**Planification optimale en 3 phases :**

**Phase 1 (Mois 1-6) - Fondations :**
- Sauvegardes air-gap (Mois 1-2) : Priorité absolue pour récupération
- Formation équipes (Début) : Sensibilisation et bases sécurité
- Justification : Récupération d'abord, puis préparation humaine

**Phase 2 (Mois 7-12) - Détection et contrôle :**
- SIEM santé (Mois 7-8) : Monitoring centralisé
- PAM (Mois 9-10) : Contrôle accès privilégiés
- Formation équipes (Suite) : Formation spécialisée outils
- Justification : Capacités de détection avant prévention

**Phase 3 (Mois 13-18) - Protection avancée :**
- EDR Next-Gen (Mois 13-15) : Protection endpoints sophistiquée
- Formation équipes (Fin) : Maîtrise complète des outils
- Justification : Protection finale quand infrastructure prête

**Logique de progression :** Récupération → Détection → Prévention`,
          points: 50,
          hints: [
            'Commencer par les mesures de récupération (sauvegardes)',
            'Déployer la détection avant la prévention',
            'Étaler la formation sur toute la durée'
          ]
        },
        {
          id: 'q2_risk_management',
          question: 'Identifiez les 3 risques projet les plus critiques et leurs plans de mitigation :',
          type: 'multiple_select',
          options: [
            'A) Résistance utilisateurs → Communication proactive + Formation adaptée',
            'B) Dépassement budget → Suivi mensuel + Budget contingence 10%',
            'C) Retard fournisseur → Clauses contractuelles + Fournisseurs alternatifs',
            'D) Incompatibilité technique → Tests POC + Validation architecture',
            'E) Perte de compétences → Documentation + Formation croisée',
            'F) Interruption soins → Déploiement progressif + Tests hors heures'
          ],
          correctAnswer: ['A', 'D', 'F'],
          explanation: `**3 risques critiques pour CHU :**

**A) Résistance utilisateurs (Probabilité: Élevée, Impact: Élevé)**
- Mitigation : Communication proactive dès le début + Formation adaptée par métier
- Contingence : Ambassadeurs métier + Support renforcé
- Justification : Personnel médical réticent aux changements IT

**D) Incompatibilité technique (Probabilité: Modérée, Impact: Critique)**
- Mitigation : Tests POC systématiques + Validation architecture préalable
- Contingence : Solutions alternatives + Développements spécifiques
- Justification : Environnement médical complexe avec systèmes legacy

**F) Interruption soins (Probabilité: Faible, Impact: Catastrophique)**
- Mitigation : Déploiement progressif par service + Tests hors heures
- Contingence : Rollback immédiat + Procédures dégradées
- Justification : Vies en jeu, tolérance zéro pour interruptions

Les autres risques sont importants mais moins critiques dans le contexte CHU.`,
          points: 40,
          hints: [
            'Prioriser les risques spécifiques au secteur santé',
            'Impact "vies en jeu" = risque critique',
            'Résistance utilisateurs très fréquente en milieu médical'
          ]
        },
        {
          id: 'q3_success_criteria',
          question: 'Définissez 5 critères de succès SMART pour ce projet :',
          type: 'scenario_analysis',
          correctAnswer: [
            'Déploiement complet : 100% des mesures opérationnelles en 18 mois',
            'Performance : KPIs sécurité atteints (détection >95%, MTTD <15min)',
            'Budget : Respect budget ±5% (1.5M€)',
            'Adoption : 90% utilisateurs formés et certifiés',
            'Continuité : Zéro interruption soins >4h pendant déploiement'
          ],
          explanation: `**5 critères SMART définis :**

**1. Déploiement complet (Spécifique, Mesurable, Atteignable, Réaliste, Temporel)**
- Cible : 100% des 5 mesures opérationnelles
- Échéance : 18 mois maximum
- Mesure : Checklist validation par mesure

**2. Performance technique (SMART)**
- Cible : KPIs sécurité atteints (détection >95%, MTTD <15min, faux positifs <2%)
- Échéance : 30 jours après déploiement complet
- Mesure : Monitoring automatique SIEM

**3. Maîtrise budgétaire (SMART)**
- Cible : Respect budget ±5% (1.425M€ - 1.575M€)
- Échéance : Suivi mensuel, validation finale à 18 mois
- Mesure : Reporting financier projet

**4. Adoption utilisateurs (SMART)**
- Cible : 90% utilisateurs formés et certifiés sur nouveaux outils
- Échéance : Formation continue sur 18 mois
- Mesure : Tests de certification + Enquêtes satisfaction

**5. Continuité opérationnelle (SMART)**
- Cible : Zéro interruption soins >4h pendant tout le déploiement
- Échéance : Monitoring continu 18 mois
- Mesure : Logs disponibilité + Incidents déclarés

Ces critères couvrent technique, financier, humain et opérationnel.`,
          points: 40,
          hints: [
            'Critères SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporel',
            'Inclure performance technique, budget, adoption, continuité',
            'Définir méthodes de mesure précises'
          ]
        },
        {
          id: 'q4_governance',
          question: 'Structurez la gouvernance projet avec comités et fréquences de reporting :',
          type: 'scenario_analysis',
          correctAnswer: {
            comitePilotage: 'Mensuel - Direction + RSSI + DSI + Représentants métier',
            comiteTechnique: 'Hebdomadaire - Équipe projet + Architectes + Experts',
            reportingDirection: 'Mensuel - Tableau de bord exécutif',
            communicationUtilisateurs: 'Bimensuel - Newsletter + Sessions info'
          },
          explanation: `**Structure de gouvernance adaptée CHU :**

**Comité de Pilotage (Mensuel) :**
- Participants : Directeur Général, RSSI, DSI, Chef service Réanimation, DRH
- Objectifs : Validation jalons, arbitrages budgétaires, résolution blocages
- Livrables : Décisions stratégiques, validation phases

**Comité Technique (Hebdomadaire) :**
- Participants : Chef projet, Architecte sécurité, Ingénieurs, Experts métier
- Objectifs : Suivi technique, résolution problèmes, coordination équipes
- Livrables : Planning détaillé, résolution incidents

**Reporting Direction (Mensuel) :**
- Format : Tableau de bord 1 page (RAG status)
- Contenu : Avancement, budget, risques, prochains jalons
- Diffusion : COMEX + Conseil surveillance

**Communication Utilisateurs (Bimensuelle) :**
- Format : Newsletter + Sessions information par service
- Contenu : Avancement, formations, impacts métier
- Objectif : Adhésion et préparation changement

Cette gouvernance équilibre pilotage stratégique et suivi opérationnel.`,
          points: 30,
          hints: [
            'Adapter fréquences au niveau hiérarchique',
            'Inclure représentants métier dans gouvernance',
            'Communication utilisateurs essentielle pour adoption'
          ]
        }
      ],
      context: {
        hospitalType: 'CHU',
        bedCount: 800,
        specialties: ['Réanimation', 'Cardiologie', 'Urgences'],
        itInfrastructure: {
          endpoints: 2000,
          servers: 120,
          networkSegments: ['VLAN Médical', 'VLAN Admin'],
          criticalSystems: ['SIH', 'PACS', 'Monitoring'],
          existingSecurity: ['Antivirus', 'Firewall']
        },
        securityMaturity: 2,
        regulatoryRequirements: ['HDS', 'RGPD'],
        budgetConstraints: [
          {
            category: 'Projet sécurité',
            maxAmount: 1500000,
            timeframe: '18 mois',
            approvalRequired: true
          }
        ],
        operationalConstraints: [
          {
            type: 'Continuité soins',
            description: 'Aucune interruption >4h',
            impact: 'Vies en jeu'
          }
        ]
      },
      learningObjectives: [
        'Planifier un projet sécurité complexe en phases',
        'Gérer les risques projet spécifiques au secteur santé',
        'Définir des critères de succès SMART',
        'Structurer une gouvernance projet adaptée'
      ],
      realWorldExample: 'Projet sécurisation CHU Toulouse (2020-2022) - 18 mois, 1.2M€',
      anssiCompliance: ['Guide gestion de projet sécurité ANSSI']
    };
  }

  // 📊 EXERCICE 4 - DÉFINITION DES KPIs
  static getExercise4_KPIDefinition(): TreatmentExercise {
    return {
      id: 'exercise_kpi_definition',
      title: 'Définition des KPIs de sécurité CHU',
      description: 'Définissez des indicateurs de performance adaptés au contexte hospitalier avec seuils et escalades',
      type: 'kpi_definition',
      difficulty: 'advanced',
      duration: 30,
      points: 100,
      category: 'performance_management',
      scenario: {
        id: 'scenario_kpi_chu',
        name: 'KPIs sécurité CHU',
        description: 'Définir 12 KPIs de sécurité pour monitoring opérationnel CHU avec tableaux de bord multi-niveaux',
        riskLevel: 'MODÉRÉ',
        estimatedDamage: 5000000,
        complexity: 6,
        constraints: [],
        stakeholders: [],
        timeline: 'Continu',
        budget: 0
      },
      questions: [
        {
          id: 'q1_technical_kpis',
          question: 'Sélectionnez les 4 KPIs techniques les plus pertinents pour un CHU :',
          type: 'multiple_select',
          options: [
            'A) MTTD (Mean Time To Detection) < 15 minutes',
            'B) Taux de détection malware > 95%',
            'C) Disponibilité systèmes critiques > 99.9%',
            'D) Temps de récupération (RTO) < 4 heures',
            'E) Faux positifs < 2%',
            'F) Couverture antivirus > 98%'
          ],
          correctAnswer: ['A', 'B', 'C', 'D'],
          explanation: `**4 KPIs techniques essentiels CHU :**

**A) MTTD < 15 minutes** : Détection rapide critique pour limiter propagation
**B) Taux détection > 95%** : Efficacité protection contre malware sophistiqué
**C) Disponibilité > 99.9%** : Continuité soins vitale, tolérance très faible
**D) RTO < 4 heures** : Récupération rapide pour éviter impact patient

Les KPIs E et F sont moins critiques car faux positifs gérables et couverture antivirus basique insuffisante.`,
          points: 30
        },
        {
          id: 'q2_operational_kpis',
          question: 'Définissez 3 KPIs opérationnels avec seuils d\'alerte appropriés :',
          type: 'scenario_analysis',
          correctAnswer: [
            'Incidents sécurité résolus en <30 min (critique), <2h (majeur)',
            'Formation sécurité : 95% personnel formé annuellement',
            'Conformité RGPD : 100% traitements documentés et validés'
          ],
          explanation: `**3 KPIs opérationnels CHU :**

**1. Temps de résolution incidents :**
- Critique : <30 min (vies en jeu)
- Majeur : <2h (impact patient)
- Mineur : <24h (impact administratif)

**2. Formation sécurité :**
- Cible : 95% personnel formé/an
- Mesure : Tests certification
- Escalade : Plan rattrapage si <90%

**3. Conformité RGPD :**
- Cible : 100% traitements documentés
- Mesure : Audit trimestriel
- Escalade : Action corrective immédiate`,
          points: 35
        },
        {
          id: 'q3_dashboard_design',
          question: 'Concevez 3 tableaux de bord adaptés aux différents niveaux :',
          type: 'scenario_analysis',
          correctAnswer: {
            direction: 'Mensuel - Niveau risque global, ROI sécurité, incidents majeurs',
            rssi: 'Hebdomadaire - KPIs techniques, tendances, actions correctives',
            soc: 'Temps réel - Alertes actives, performance outils, investigations'
          },
          explanation: `**3 tableaux de bord multi-niveaux :**

**Direction (Mensuel) :**
- Niveau risque résiduel (Vert/Orange/Rouge)
- ROI investissements sécurité
- Incidents majeurs et impact
- Conformité réglementaire

**RSSI (Hebdomadaire) :**
- KPIs techniques détaillés
- Tendances et évolutions
- Actions correctives en cours
- Budget et planning projets

**SOC (Temps réel) :**
- Alertes actives par criticité
- Performance outils (SIEM, EDR)
- Investigations en cours
- Métriques opérationnelles`,
          points: 35
        }
      ],
      context: {
        hospitalType: 'CHU',
        bedCount: 600,
        specialties: ['Médecine', 'Chirurgie'],
        itInfrastructure: {
          endpoints: 1500,
          servers: 80,
          networkSegments: ['VLAN Médical'],
          criticalSystems: ['SIH'],
          existingSecurity: ['SIEM', 'EDR']
        },
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD'],
        budgetConstraints: [],
        operationalConstraints: []
      },
      learningObjectives: [
        'Définir des KPIs techniques adaptés au secteur santé',
        'Structurer des tableaux de bord multi-niveaux',
        'Fixer des seuils d\'alerte appropriés'
      ],
      realWorldExample: 'Tableaux de bord sécurité AP-HP - 39 hôpitaux',
      anssiCompliance: ['Guide métriques sécurité ANSSI']
    };
  }

  // 🏛️ EXERCICE 5 - SIMULATION COMITÉ DE PILOTAGE
  static getExercise5_GovernanceSimulation(): TreatmentExercise {
    return {
      id: 'exercise_governance_simulation',
      title: 'Simulation comité de pilotage sécurité CHU',
      description: 'Participez à une simulation de comité de pilotage avec arbitrages budgétaires et décisions stratégiques',
      type: 'governance_simulation',
      difficulty: 'expert',
      duration: 35,
      points: 120,
      category: 'governance',
      scenario: {
        id: 'scenario_governance_chu',
        name: 'Comité pilotage sécurité',
        description: 'Comité de pilotage trimestriel avec 3 décisions majeures à prendre sur budget et priorités sécurité',
        riskLevel: 'ÉLEVÉ',
        estimatedDamage: 12000000,
        complexity: 8,
        constraints: [
          {
            type: 'budget',
            description: 'Dépassement budget 15% nécessite arbitrage',
            impact: 'high',
            mandatory: true
          }
        ],
        stakeholders: [
          {
            role: 'Directeur Général',
            influence: 'high',
            interest: 'medium',
            concerns: ['Budget', 'Responsabilité'],
            requirements: ['ROI démontrable']
          },
          {
            role: 'RSSI',
            influence: 'medium',
            interest: 'high',
            concerns: ['Efficacité technique'],
            requirements: ['Mesures robustes']
          }
        ],
        timeline: '1 réunion',
        budget: 2000000
      },
      questions: [
        {
          id: 'q1_budget_arbitrage',
          question: 'Le projet dépasse de 300k€. Quelle décision recommandez-vous au Directeur ?',
          type: 'multiple_choice',
          options: [
            'A) Approuver le dépassement - Risque critique justifie investissement',
            'B) Réduire périmètre - Supprimer mesures moins prioritaires',
            'C) Reporter phase 3 - Étaler sur exercice comptable suivant',
            'D) Rechercher financement - Subventions ARS ou fonds européens'
          ],
          correctAnswer: 'A',
          explanation: `**Décision A recommandée :**

**Justification :**
- Risque critique (12M€ dommages potentiels)
- ROI reste excellent : (12M€ × 85%) / 2.3M€ = 4.4x
- Dépassement 15% acceptable pour projet critique
- Responsabilité pénale dirigeants en cas d'incident

**Arguments pour le Directeur :**
- "300k€ supplémentaires pour éviter 12M€ de dommages"
- "ROI reste très favorable à 4.4x"
- "Risque juridique et réputationnel majeur si incident"
- "Certification HDS et conformité ANSSI garanties"

Les options B, C, D introduisent des risques ou retards inacceptables.`,
          points: 40
        },
        {
          id: 'q2_priority_decision',
          question: 'Conflit de priorités : RSSI veut EDR avancé, DSI préfère infrastructure. Votre arbitrage ?',
          type: 'scenario_analysis',
          correctAnswer: 'Compromis séquencé : Infrastructure d\'abord (3 mois) puis EDR, avec budget partagé',
          explanation: `**Arbitrage équilibré :**

**Décision : Approche séquencée**
- Phase 1 (3 mois) : Infrastructure critique (serveurs, réseau)
- Phase 2 (6 mois) : EDR avancé sur infrastructure renforcée
- Budget : 60% infrastructure, 40% EDR

**Justification :**
- Infrastructure stable = prérequis EDR performant
- Séquencement évite conflits techniques
- Les deux parties obtiennent satisfaction
- Risque maîtrisé par approche progressive

**Communication :**
- RSSI : "EDR plus efficace sur infrastructure robuste"
- DSI : "Infrastructure prioritaire validée"
- Direction : "Approche pragmatique et consensuelle"`,
          points: 40
        },
        {
          id: 'q3_communication_crisis',
          question: 'Incident sécurité pendant le projet. Comment communiquer au comité ?',
          type: 'scenario_analysis',
          correctAnswer: 'Transparence totale : Faits, impact, actions correctives, leçons apprises, renforcement mesures',
          explanation: `**Communication de crise transparente :**

**Structure de présentation :**
1. **Faits objectifs** (2 min) : Chronologie, périmètre, durée
2. **Impact mesuré** (1 min) : Patients, systèmes, données
3. **Actions immédiates** (2 min) : Containment, investigation, communication
4. **Leçons apprises** (2 min) : Causes racines, failles identifiées
5. **Renforcement** (3 min) : Mesures supplémentaires, accélération projet

**Messages clés :**
- "Incident maîtrisé, aucun impact patient"
- "Procédures de crise ont fonctionné"
- "Renforcement sécurité accéléré"
- "Transparence totale avec autorités"

La transparence renforce la confiance et justifie les investissements.`,
          points: 40
        }
      ],
      context: {
        hospitalType: 'CHU',
        bedCount: 1000,
        specialties: ['Toutes spécialités'],
        itInfrastructure: {
          endpoints: 3000,
          servers: 200,
          networkSegments: ['Multiple'],
          criticalSystems: ['SIH', 'PACS', 'Monitoring'],
          existingSecurity: ['Basique']
        },
        securityMaturity: 2,
        regulatoryRequirements: ['HDS', 'RGPD', 'ISO 27001'],
        budgetConstraints: [
          {
            category: 'Sécurité',
            maxAmount: 2000000,
            timeframe: '2 ans',
            approvalRequired: true
          }
        ],
        operationalConstraints: []
      },
      learningObjectives: [
        'Maîtriser les arbitrages budgétaires en comité',
        'Gérer les conflits de priorités entre parties prenantes',
        'Communiquer efficacement en situation de crise'
      ],
      realWorldExample: 'Comités de pilotage post-incident WannaCry (2017)',
      anssiCompliance: ['Guide gouvernance sécurité ANSSI']
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllExercises(): TreatmentExercise[] {
    return [
      this.getExercise1_CostBenefitAnalysis(),
      this.getExercise2_MeasurePrioritization(),
      this.getExercise3_ImplementationPlanning(),
      this.getExercise4_KPIDefinition(),
      this.getExercise5_GovernanceSimulation()
    ];
  }

  static getExerciseById(exerciseId: string): TreatmentExercise | undefined {
    return this.getAllExercises().find(ex => ex.id === exerciseId);
  }

  static getExercisesByDifficulty(difficulty: 'intermediate' | 'advanced' | 'expert'): TreatmentExercise[] {
    return this.getAllExercises().filter(ex => ex.difficulty === difficulty);
  }

  static getTotalDuration(): number {
    return this.getAllExercises().reduce((sum, ex) => sum + ex.duration, 0);
  }

  static getTotalPoints(): number {
    return this.getAllExercises().reduce((sum, ex) => sum + ex.points, 0);
  }

  static getExerciseStats(): {
    totalExercises: number;
    totalDuration: number;
    totalPoints: number;
    byDifficulty: { [key: string]: number };
    byCategory: { [key: string]: number };
  } {
    const exercises = this.getAllExercises();
    
    const byDifficulty = exercises.reduce((acc, ex) => {
      acc[ex.difficulty] = (acc[ex.difficulty] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const byCategory = exercises.reduce((acc, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalExercises: exercises.length,
      totalDuration: this.getTotalDuration(),
      totalPoints: this.getTotalPoints(),
      byDifficulty,
      byCategory
    };
  }
}

export default TreatmentExercises;
