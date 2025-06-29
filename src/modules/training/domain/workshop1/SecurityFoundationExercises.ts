/**
 * 🎯 EXERCICES PRATIQUES ATELIER 1 - SOCLE DE SÉCURITÉ
 * Exercices spécialisés pour maîtriser le cadrage et l'identification des biens essentiels CHU
 */

// 🎯 TYPES POUR LES EXERCICES ATELIER 1
export interface SecurityFoundationExercise {
  id: string;
  title: string;
  description: string;
  type: 'scoping_analysis' | 'asset_identification' | 'ecosystem_mapping' | 'security_objectives' | 'governance_simulation';
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
  title: string;
  description: string;
  context: string;
  constraints: string[];
  stakeholders: string[];
  expectedOutcome: string;
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'ranking' | 'classification' | 'scenario_analysis' | 'matrix_analysis';
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
  sites: number;
  employees: number;
  budget: string;
  specialties: string[];
  itInfrastructure: ITInfrastructure;
  regulatoryRequirements: string[];
  operationalConstraints: OperationalConstraint[];
  partners: PartnerInfo[];
}

export interface ITInfrastructure {
  systems: SystemInfo[];
  networks: NetworkInfo[];
  servers: ServerInfo;
  applications: ApplicationInfo[];
}

export interface SystemInfo {
  name: string;
  type: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  users: number;
  availability: string;
}

export interface NetworkInfo {
  name: string;
  type: string;
  coverage: string;
  security: string;
}

export interface ServerInfo {
  physical: number;
  virtual: number;
  locations: string[];
}

export interface ApplicationInfo {
  name: string;
  type: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  users: number;
}

export interface OperationalConstraint {
  type: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface PartnerInfo {
  name: string;
  type: string;
  criticality: string;
  services: string[];
}

/**
 * 🎯 CLASSE PRINCIPALE DES EXERCICES ATELIER 1
 */
export class SecurityFoundationExercises {
  
  // 🥇 EXERCICE 1 - CADRAGE ET PÉRIMÈTRE CHU (25 MIN, 80 PTS)
  static getExercise1_ScopingAnalysis(): SecurityFoundationExercise {
    return {
      id: 'exercise_1_scoping_chu',
      title: 'Cadrage et Périmètre CHU',
      description: 'Maîtriser la définition du périmètre d\'analyse EBIOS RM pour un CHU',
      type: 'scoping_analysis',
      difficulty: 'intermediate',
      duration: 25,
      points: 80,
      category: 'Cadrage méthodologique',
      scenario: {
        id: 'chu_metropolitan_scoping',
        title: 'CHU Métropolitain - Définition périmètre EBIOS RM',
        description: 'Vous êtes consultant EBIOS RM mandaté pour analyser la sécurité du CHU Métropolitain',
        context: `Le CHU Métropolitain est un établissement de 1200 lits répartis sur 3 sites :
        - Site Principal (800 lits) : Urgences, Réanimation, Blocs opératoires
        - Site Spécialisé (250 lits) : Cardiologie, Neurochirurgie, Oncologie  
        - Centre Ambulatoire (150 lits) : Consultations, Hôpital de jour`,
        constraints: [
          'Continuité des soins 24h/24 non négociable',
          'Budget limité : 2M€ sur 3 ans pour la sécurité',
          'Personnel médical réticent aux changements',
          'Conformité HDS et RGPD obligatoire'
        ],
        stakeholders: [
          'Directeur Général', 'Directeur Médical', 'RSSI', 'DSI',
          'Chefs de pôle', 'Directeur des Soins', 'Directeur Qualité'
        ],
        expectedOutcome: 'Périmètre d\'analyse validé par le COMEX et conforme ANSSI'
      },
      questions: [
        {
          id: 'q1_organizational_scope',
          question: 'Définissez le périmètre organisationnel optimal pour cette analyse EBIOS RM :',
          type: 'multiple_select',
          options: [
            '3 sites géographiques du CHU uniquement',
            '3 sites + 25 établissements partenaires régionaux',
            '3 sites + laboratoires externes critiques',
            '3 sites + prestataires maintenance critiques',
            'Site principal uniquement (focus urgences)',
            '3 sites + organismes tutelle (ARS, CPAM)'
          ],
          correctAnswer: ['3 sites géographiques du CHU uniquement', '3 sites + laboratoires externes critiques', '3 sites + prestataires maintenance critiques'],
          explanation: `**Périmètre organisationnel optimal :**
          
✅ **Inclure obligatoirement :**
- 3 sites CHU (périmètre principal)
- Laboratoires externes critiques (analyses urgentes)
- Prestataires maintenance critiques (équipements vitaux)

❌ **Exclure de cette première analyse :**
- 25 partenaires régionaux (trop large, analyse séparée)
- Organismes tutelle (hors périmètre direct)
- Site principal seul (périmètre trop restreint)

**Justification ANSSI :** Le périmètre doit être cohérent avec les enjeux métier et les capacités d'analyse.`,
          points: 20,
          hints: ['Pensez aux dépendances critiques directes', 'Évitez un périmètre trop large pour une première analyse'],
          commonMistakes: ['Inclure tous les partenaires (périmètre ingérable)', 'Exclure les laboratoires externes (dépendance critique)'],
          expertTips: ['Commencez par le périmètre direct, étendez ensuite', 'Validez avec les métiers la faisabilité']
        },
        {
          id: 'q2_business_stakes',
          question: 'Classez ces 8 enjeux métier par ordre de priorité pour le CHU (1=plus prioritaire) :',
          type: 'ranking',
          options: [
            'Continuité des soins 24h/24',
            'Conformité réglementaire (HDS, RGPD)',
            'Sécurité des patients et du personnel',
            'Équilibre financier et maîtrise des coûts',
            'Qualité et traçabilité des soins',
            'Réputation et attractivité territoriale',
            'Innovation et recherche médicale',
            'Partenariats et coopérations'
          ],
          correctAnswer: [
            'Continuité des soins 24h/24',
            'Sécurité des patients et du personnel', 
            'Conformité réglementaire (HDS, RGPD)',
            'Qualité et traçabilité des soins',
            'Équilibre financier et maîtrise des coûts',
            'Réputation et attractivité territoriale',
            'Innovation et recherche médicale',
            'Partenariats et coopérations'
          ],
          explanation: `**Priorisation justifiée secteur santé :**

🥇 **Priorité 1-2 : Enjeux vitaux**
- Continuité soins (vies en jeu)
- Sécurité patients (responsabilité pénale)

🥈 **Priorité 3-4 : Enjeux réglementaires**  
- Conformité (sanctions, fermeture)
- Qualité soins (certification HAS)

🥉 **Priorité 5-8 : Enjeux stratégiques**
- Équilibre financier, réputation, innovation, partenariats`,
          points: 25,
          expertTips: ['Les vies humaines priment toujours en santé', 'La conformité réglementaire est non négociable']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        itInfrastructure: {
          systems: [
            { name: 'SIH Principal', type: 'ERP Santé', criticality: 'CRITIQUE', users: 3000, availability: '99.9%' },
            { name: 'PACS Imagerie', type: 'Imagerie médicale', criticality: 'CRITIQUE', users: 500, availability: '99.8%' }
          ],
          networks: [
            { name: 'Réseau médical', type: 'VLAN sécurisé', coverage: '3 sites', security: 'WPA3 Enterprise' },
            { name: 'Réseau administratif', type: 'VLAN standard', coverage: '3 sites', security: 'WPA2' }
          ],
          servers: { physical: 200, virtual: 800, locations: ['Site Principal', 'Site Spécialisé', 'Cloud HDS'] },
          applications: [
            { name: 'Dossier Patient Informatisé', type: 'Métier critique', criticality: 'CRITIQUE', users: 2800 },
            { name: 'Gestion Administrative', type: 'Support', criticality: 'MAJEUR', users: 700 }
          ]
        },
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI', 'Code de la santé publique'],
        operationalConstraints: [
          { type: 'Continuité', description: 'Soins 24h/24', impact: 'Vies en jeu', mitigation: 'Redondance totale' },
          { type: 'Réglementaire', description: 'Conformité HDS', impact: 'Fermeture', mitigation: 'Audit permanent' }
        ],
        partners: [
          { name: 'Laboratoires Externes', type: 'Prestataire critique', criticality: 'CRITIQUE', services: ['Analyses urgentes'] },
          { name: 'Maintenance Biomédicale', type: 'Prestataire', criticality: 'MAJEUR', services: ['Équipements vitaux'] }
        ]
      },
      learningObjectives: [
        'Définir un périmètre d\'analyse cohérent et réaliste',
        'Prioriser les enjeux métier selon les spécificités santé',
        'Identifier les contraintes réglementaires applicables',
        'Structurer les objectifs de sécurité par domaine'
      ],
      realWorldExample: 'Analyse EBIOS RM du CHU de Rouen post-cyberattaque (2019)',
      anssiCompliance: ['Guide EBIOS RM v1.5 - Étape 1', 'Référentiel sécurité ANSSI secteur santé']
    };
  }

  // 🥈 EXERCICE 2 - IDENTIFICATION BIENS ESSENTIELS (30 MIN, 120 PTS)
  static getExercise2_AssetIdentification(): SecurityFoundationExercise {
    return {
      id: 'exercise_2_asset_identification',
      title: 'Identification des Biens Essentiels',
      description: 'Maîtriser la méthodologie d\'identification et classification des biens essentiels CHU',
      type: 'asset_identification',
      difficulty: 'advanced',
      duration: 30,
      points: 120,
      category: 'Analyse des biens essentiels',
      scenario: {
        id: 'chu_asset_inventory',
        title: 'Inventaire exhaustif des biens essentiels CHU avec matrice BIA',
        description: 'Appliquer la méthodologie ANSSI d\'identification des biens essentiels au contexte CHU',
        context: `Mission : Identifier et classifier tous les biens essentiels du CHU selon la grille BIA adaptée santé.
        Contrainte : Validation obligatoire par le comité multidisciplinaire (7 membres).`,
        constraints: [
          'Méthodologie ANSSI EBIOS RM strictement respectée',
          'Grille BIA adaptée aux spécificités secteur santé',
          'Classification justifiée avec impacts métier',
          'Validation par comité multidisciplinaire obligatoire'
        ],
        stakeholders: [
          'Chef pôle Urgences', 'Directeur Soins', 'RSSI', 'DSI',
          'Pharmacien Chef', 'Chef Laboratoires', 'Directeur Qualité'
        ],
        expectedOutcome: 'Inventaire complet validé avec matrice de criticité'
      },
      questions: [
        {
          id: 'q1_asset_inventory',
          question: 'Identifiez et classifiez ces 15 biens essentiels par catégorie ANSSI :',
          type: 'classification',
          options: [
            'Urgences vitales 24h/24',
            'Dossiers patients informatisés',
            'SIH - Système Information Hospitalier',
            'Images médicales PACS',
            'Bloc opératoire programmé',
            'Laboratoires d\'analyses',
            'Centre de données principal',
            'Réseaux et télécommunications',
            'Pharmacie hospitalière',
            'Recherche clinique',
            'Gestion administrative',
            'Alimentations électriques',
            'Personnel médical spécialisé',
            'Équipements biomédicaux',
            'Partenaires laboratoires externes'
          ],
          correctAnswer: {
            'Processus métier': ['Urgences vitales 24h/24', 'Bloc opératoire programmé', 'Laboratoires d\'analyses', 'Pharmacie hospitalière', 'Recherche clinique', 'Gestion administrative'],
            'Informations': ['Dossiers patients informatisés', 'Images médicales PACS'],
            'Systèmes d\'information': ['SIH - Système Information Hospitalier', 'Réseaux et télécommunications'],
            'Infrastructures': ['Centre de données principal', 'Alimentations électriques', 'Équipements biomédicaux'],
            'Ressources humaines': ['Personnel médical spécialisé'],
            'Partenaires': ['Partenaires laboratoires externes']
          },
          explanation: `**Classification ANSSI adaptée santé :**

📋 **Processus métier** : Activités opérationnelles hospitalières
📊 **Informations** : Données critiques patients et médicales
💻 **Systèmes d'information** : Applications et réseaux
🏗️ **Infrastructures** : Équipements et installations techniques
👥 **Ressources humaines** : Personnel clé spécialisé
🤝 **Partenaires** : Tiers critiques pour l'activité`,
          points: 40,
          hints: ['Suivez la classification ANSSI standard', 'Adaptez au contexte hospitalier'],
          expertTips: ['Les processus métier sont les activités opérationnelles', 'Les informations sont les données manipulées']
        },
        {
          id: 'q2_criticality_matrix',
          question: 'Appliquez la grille BIA spécialisée santé à ces 8 biens essentiels :',
          type: 'matrix_analysis',
          options: [
            'Urgences vitales (Impact soins: 5, Impact financier: 4, Impact réglementaire: 4)',
            'SIH Dossiers patients (Impact soins: 4, Impact financier: 4, Impact réglementaire: 5)',
            'PACS Imagerie (Impact soins: 4, Impact financier: 3, Impact réglementaire: 3)',
            'Laboratoires analyses (Impact soins: 3, Impact financier: 3, Impact réglementaire: 3)',
            'Pharmacie hospitalière (Impact soins: 3, Impact financier: 2, Impact réglementaire: 3)',
            'Recherche clinique (Impact soins: 2, Impact financier: 3, Impact réglementaire: 2)',
            'Gestion administrative (Impact soins: 1, Impact financier: 3, Impact réglementaire: 2)',
            'Centre de données (Impact soins: 5, Impact financier: 4, Impact réglementaire: 4)'
          ],
          correctAnswer: {
            'CRITIQUE (Score 5)': ['Urgences vitales', 'SIH Dossiers patients', 'Centre de données'],
            'MAJEUR (Score 4)': ['PACS Imagerie'],
            'MODÉRÉ (Score 3)': ['Laboratoires analyses', 'Pharmacie hospitalière'],
            'MINEUR (Score 2-1)': ['Recherche clinique', 'Gestion administrative']
          },
          explanation: `**Grille BIA spécialisée santé :**

Score = MAX(Impact soins, Impact financier, Impact réglementaire)

🔴 **CRITIQUE (5)** : Vies en jeu, responsabilité pénale
🟠 **MAJEUR (4)** : Impact patient significatif
🟡 **MODÉRÉ (3)** : Gêne opérationnelle
🟢 **MINEUR (1-2)** : Impact limité`,
          points: 35,
          expertTips: ['L\'impact soins prime en milieu hospitalier', 'Le score max détermine la criticité globale']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        itInfrastructure: {
          systems: [
            { name: 'SIH Principal', type: 'ERP Santé', criticality: 'CRITIQUE', users: 3000, availability: '99.9%' },
            { name: 'PACS Imagerie', type: 'Imagerie médicale', criticality: 'CRITIQUE', users: 500, availability: '99.8%' },
            { name: 'LIS Laboratoires', type: 'Gestion laboratoire', criticality: 'MAJEUR', users: 200, availability: '99.5%' }
          ],
          networks: [
            { name: 'Réseau médical', type: 'VLAN sécurisé', coverage: '3 sites', security: 'WPA3 Enterprise' },
            { name: 'Réseau administratif', type: 'VLAN standard', coverage: '3 sites', security: 'WPA2' }
          ],
          servers: { physical: 200, virtual: 800, locations: ['Site Principal', 'Site Spécialisé', 'Cloud HDS'] },
          applications: [
            { name: 'Dossier Patient Informatisé', type: 'Métier critique', criticality: 'CRITIQUE', users: 2800 },
            { name: 'Gestion Administrative', type: 'Support', criticality: 'MAJEUR', users: 700 },
            { name: 'Recherche Clinique', type: 'Spécialisé', criticality: 'MODÉRÉ', users: 150 }
          ]
        },
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI', 'Code de la santé publique'],
        operationalConstraints: [
          { type: 'Continuité', description: 'Soins 24h/24', impact: 'Vies en jeu', mitigation: 'Redondance totale' },
          { type: 'Réglementaire', description: 'Conformité HDS', impact: 'Fermeture', mitigation: 'Audit permanent' },
          { type: 'Qualité', description: 'Certification HAS', impact: 'Perte accréditation', mitigation: 'Contrôle qualité' }
        ],
        partners: [
          { name: 'Laboratoires Externes', type: 'Prestataire critique', criticality: 'CRITIQUE', services: ['Analyses urgentes', 'Analyses spécialisées'] },
          { name: 'Maintenance Biomédicale', type: 'Prestataire', criticality: 'MAJEUR', services: ['Équipements vitaux', 'Maintenance préventive'] },
          { name: 'Éditeur SIH', type: 'Fournisseur unique', criticality: 'CRITIQUE', services: ['Support 24h/24', 'Mises à jour'] }
        ]
      },
      learningObjectives: [
        'Appliquer la méthodologie ANSSI d\'identification des biens essentiels',
        'Maîtriser la grille BIA adaptée au secteur santé',
        'Classifier les biens selon leur criticité métier',
        'Justifier les choix avec impacts sectoriels'
      ],
      realWorldExample: 'Inventaire biens essentiels CHU Toulouse (certification HAS 2023)',
      anssiCompliance: ['Guide EBIOS RM v1.5 - Identification biens essentiels', 'Méthode BIA ANSSI adaptée santé']
    };
  }

  // 🥉 EXERCICE 3 - ÉCOSYSTÈME ET DÉPENDANCES (25 MIN, 100 PTS)
  static getExercise3_EcosystemMapping(): SecurityFoundationExercise {
    return {
      id: 'exercise_3_ecosystem_mapping',
      title: 'Écosystème et Dépendances',
      description: 'Cartographier l\'écosystème et analyser les dépendances critiques du CHU',
      type: 'ecosystem_mapping',
      difficulty: 'advanced',
      duration: 25,
      points: 100,
      category: 'Analyse des dépendances',
      scenario: {
        id: 'chu_ecosystem_analysis',
        title: 'CHU interconnecté - 25 partenaires et 15 fournisseurs critiques',
        description: 'Analyser l\'écosystème complexe du CHU et identifier les risques de dépendance',
        context: `Le CHU Métropolitain opère dans un écosystème complexe avec de nombreuses interdépendances.
        Objectif : Cartographier les dépendances critiques et évaluer les risques en cascade.`,
        constraints: [
          'Continuité soins 24h/24 non négociable',
          'Fournisseurs uniques pour certains systèmes critiques',
          'Contraintes géographiques (sites distants)',
          'Réglementations spécifiques hébergement données santé'
        ],
        stakeholders: [
          'Direction Générale', 'RSSI', 'DSI', 'Direction Achats',
          'Responsables partenariats', 'Chefs de service', 'Directeur Qualité'
        ],
        expectedOutcome: 'Cartographie complète avec stratégies de mitigation'
      },
      questions: [
        {
          id: 'q1_ecosystem_mapping',
          question: 'Cartographiez l\'écosystème CHU en identifiant les dépendances critiques :',
          type: 'multiple_select',
          options: [
            'Éditeur SIH (fournisseur unique, maintenance 24h/24)',
            'Microsoft Cloud (hébergement Office 365, Teams)',
            'Opérateur télécom principal (connectivité sites)',
            'Laboratoires externes (analyses urgentes)',
            'Prestataires maintenance biomédicale (équipements vitaux)',
            'Fournisseur PACS (imagerie médicale)',
            'Établissements partenaires (transferts patients)',
            'Réseaux santé régionaux (échanges sécurisés)',
            'Organismes tutelle (ARS, CPAM)',
            'Prestataires nettoyage (accès locaux sensibles)'
          ],
          correctAnswer: [
            'Éditeur SIH (fournisseur unique, maintenance 24h/24)',
            'Opérateur télécom principal (connectivité sites)',
            'Laboratoires externes (analyses urgentes)',
            'Prestataires maintenance biomédicale (équipements vitaux)',
            'Fournisseur PACS (imagerie médicale)'
          ],
          explanation: `**Dépendances critiques identifiées :**

🔴 **CRITIQUES (impact immédiat sur soins) :**
- Éditeur SIH : Fournisseur unique, arrêt = paralysie
- Opérateur télécom : Connectivité vitale inter-sites
- Laboratoires externes : Analyses urgences vitales
- Maintenance biomédicale : Équipements patients
- Fournisseur PACS : Imagerie diagnostique

🟡 **IMPORTANTES (impact différé) :**
- Microsoft Cloud, partenaires, réseaux régionaux

🟢 **SECONDAIRES :**
- Tutelle, nettoyage (impact limité court terme)`,
          points: 30,
          hints: ['Focalisez sur l\'impact immédiat sur les soins', 'Identifiez les fournisseurs uniques'],
          expertTips: ['Une dépendance critique = arrêt possible activité vitale', 'Priorisez selon RTO des biens essentiels']
        },
        {
          id: 'q2_dependency_risk_analysis',
          question: 'Évaluez les risques de dépendance selon la matrice Probabilité × Impact :',
          type: 'matrix_analysis',
          options: [
            'Défaillance éditeur SIH (Probabilité: 2/5, Impact: 5/5)',
            'Panne opérateur télécom principal (Probabilité: 3/5, Impact: 4/5)',
            'Cyberattaque fournisseur cloud (Probabilité: 3/5, Impact: 3/5)',
            'Défaillance laboratoire externe (Probabilité: 2/5, Impact: 4/5)',
            'Panne maintenance biomédicale (Probabilité: 3/5, Impact: 3/5)',
            'Compromission fournisseur PACS (Probabilité: 2/5, Impact: 3/5)'
          ],
          correctAnswer: {
            'CRITIQUE (Score 12-15)': ['Panne opérateur télécom principal (Score 12)'],
            'ÉLEVÉ (Score 8-11)': ['Défaillance éditeur SIH (Score 10)', 'Défaillance laboratoire externe (Score 8)', 'Cyberattaque fournisseur cloud (Score 9)', 'Panne maintenance biomédicale (Score 9)'],
            'MODÉRÉ (Score 4-7)': ['Compromission fournisseur PACS (Score 6)']
          },
          explanation: `**Matrice de risque dépendance :**

Score = Probabilité × Impact

🔴 **CRITIQUE (12-15)** : Action immédiate requise
🟠 **ÉLEVÉ (8-11)** : Surveillance renforcée
🟡 **MODÉRÉ (4-7)** : Surveillance standard

**Priorisation :**
1. Opérateur télécom (3×4=12) - Double opérateur urgent
2. Éditeur SIH (2×5=10) - Contrat renforcé
3. Cloud/Laboratoire/Maintenance (9) - Plans de continuité`,
          points: 35,
          expertTips: ['La probabilité évalue la fréquence historique', 'L\'impact mesure l\'effet sur les biens essentiels']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        itInfrastructure: {
          systems: [
            { name: 'SIH Principal', type: 'ERP Santé', criticality: 'CRITIQUE', users: 3000, availability: '99.9%' },
            { name: 'PACS Imagerie', type: 'Imagerie médicale', criticality: 'CRITIQUE', users: 500, availability: '99.8%' }
          ],
          networks: [
            { name: 'Réseau médical', type: 'VLAN sécurisé', coverage: '3 sites', security: 'WPA3 Enterprise' },
            { name: 'Liaison inter-sites', type: 'Fibre dédiée', coverage: 'Multi-sites', security: 'VPN IPSec' }
          ],
          servers: { physical: 200, virtual: 800, locations: ['Site Principal', 'Site Spécialisé', 'Cloud HDS'] },
          applications: [
            { name: 'Dossier Patient Informatisé', type: 'Métier critique', criticality: 'CRITIQUE', users: 2800 },
            { name: 'Imagerie PACS', type: 'Métier critique', criticality: 'CRITIQUE', users: 500 }
          ]
        },
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI', 'Code de la santé publique'],
        operationalConstraints: [
          { type: 'Continuité', description: 'Soins 24h/24', impact: 'Vies en jeu', mitigation: 'Redondance totale' },
          { type: 'Géographique', description: '3 sites distants', impact: 'Complexité réseau', mitigation: 'Liaisons multiples' },
          { type: 'Fournisseur unique', description: 'SIH sans alternative', impact: 'Dépendance critique', mitigation: 'Contrat renforcé' }
        ],
        partners: [
          { name: 'Éditeur SIH', type: 'Fournisseur unique', criticality: 'CRITIQUE', services: ['Support 24h/24', 'Maintenance', 'Évolutions'] },
          { name: 'Laboratoires Externes', type: 'Prestataire critique', criticality: 'CRITIQUE', services: ['Analyses urgentes', 'Analyses spécialisées'] },
          { name: 'Opérateur Télécom', type: 'Fournisseur infrastructure', criticality: 'CRITIQUE', services: ['Connectivité', 'Internet', 'VPN'] },
          { name: 'Maintenance Biomédicale', type: 'Prestataire', criticality: 'MAJEUR', services: ['Équipements vitaux', 'Maintenance préventive'] },
          { name: 'Microsoft Cloud', type: 'Fournisseur cloud', criticality: 'MAJEUR', services: ['Office 365', 'Teams', 'OneDrive'] }
        ]
      },
      learningObjectives: [
        'Cartographier l\'écosystème numérique complexe du CHU',
        'Identifier les dépendances critiques externes',
        'Analyser les risques de la chaîne d\'approvisionnement',
        'Évaluer les impacts des défaillances en cascade'
      ],
      realWorldExample: 'Analyse dépendances CHU Lille post-incident opérateur (2022)',
      anssiCompliance: ['Guide EBIOS RM - Analyse écosystème', 'Référentiel supply chain security ANSSI']
    };
  }

  // 🎯 EXERCICE 4 - OBJECTIFS DE SÉCURITÉ CHU (20 MIN, 80 PTS)
  static getExercise4_SecurityObjectives(): SecurityFoundationExercise {
    return {
      id: 'exercise_4_security_objectives',
      title: 'Objectifs de Sécurité CHU',
      description: 'Définir des objectifs de sécurité adaptés aux contraintes hospitalières',
      type: 'security_objectives',
      difficulty: 'intermediate',
      duration: 20,
      points: 80,
      category: 'Objectifs de sécurité',
      scenario: {
        id: 'chu_security_objectives',
        title: 'Définition des objectifs DICP pour 8 systèmes critiques CHU',
        description: 'Définir les objectifs de sécurité (Disponibilité, Intégrité, Confidentialité, Preuve) adaptés au CHU',
        context: `Mission : Définir des objectifs de sécurité réalistes et conformes aux contraintes hospitalières.
        Contrainte : Équilibrer exigences métier et faisabilité technique.`,
        constraints: [
          'Secret médical : Protection absolue données patients',
          'Continuité vitale : Tolérance zéro pour urgences',
          'Traçabilité légale : Conservation 7 ans minimum',
          'Conformité HDS : Exigences techniques strictes'
        ],
        stakeholders: [
          'Directeur Médical', 'RSSI', 'DSI', 'Directeur Qualité',
          'Chef pôle Urgences', 'Directeur Soins', 'DPO'
        ],
        expectedOutcome: 'Objectifs DICP validés et mesurables'
      },
      questions: [
        {
          id: 'q1_availability_objectives',
          question: 'Définissez les seuils de disponibilité adaptés à chaque système :',
          type: 'multiple_choice',
          options: [
            'Urgences vitales : 99.99% (52min arrêt max/an)',
            'SIH principal : 99.9% (8h arrêt max/an)',
            'PACS imagerie : 99.8% (17h arrêt max/an)',
            'Laboratoires : 99.5% (44h arrêt max/an)',
            'Pharmacie : 99% (87h arrêt max/an)',
            'Administration : 98% (175h arrêt max/an)'
          ],
          correctAnswer: [
            'Urgences vitales : 99.99% (52min arrêt max/an)',
            'SIH principal : 99.9% (8h arrêt max/an)',
            'PACS imagerie : 99.8% (17h arrêt max/an)',
            'Laboratoires : 99.5% (44h arrêt max/an)'
          ],
          explanation: `**Seuils de disponibilité justifiés :**

🔴 **99.99% Urgences** : Vies en jeu, tolérance minimale
🟠 **99.9% SIH** : Activité hospitalière globale
🟡 **99.8% PACS** : Imagerie diagnostique critique
🟢 **99.5% Laboratoires** : Analyses différables partiellement

**Calcul temps d'arrêt annuel :**
- 99.99% = 52 minutes max
- 99.9% = 8h45 max
- 99.8% = 17h30 max`,
          points: 25,
          hints: ['Les urgences ont la priorité absolue', 'Calculez le temps d\'arrêt acceptable'],
          expertTips: ['Alignez sur les RTO des biens essentiels', 'Validez la faisabilité technique']
        },
        {
          id: 'q2_integrity_requirements',
          question: 'Classez ces données par niveau d\'intégrité requis :',
          type: 'ranking',
          options: [
            'Prescriptions médicales',
            'Dossiers patients',
            'Images médicales diagnostiques',
            'Résultats laboratoires',
            'Données administratives patients',
            'Données de recherche clinique',
            'Données RH personnel',
            'Données financières'
          ],
          correctAnswer: [
            'Prescriptions médicales',
            'Dossiers patients',
            'Images médicales diagnostiques',
            'Résultats laboratoires',
            'Données administratives patients',
            'Données de recherche clinique',
            'Données RH personnel',
            'Données financières'
          ],
          explanation: `**Hiérarchie intégrité secteur santé :**

🥇 **100% intègres (vies en jeu) :**
- Prescriptions : Erreur = danger vital
- Dossiers patients : Base décisions médicales

🥈 **Très haute intégrité :**
- Images diagnostiques : Erreurs diagnostic
- Résultats laboratoires : Décisions thérapeutiques

🥉 **Haute intégrité :**
- Données administratives, recherche, RH, finances`,
          points: 20,
          expertTips: ['L\'intégrité suit l\'impact sur les soins', 'Les données vitales sont 100% intègres']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        itInfrastructure: {
          systems: [
            { name: 'Urgences vitales', type: 'Processus critique', criticality: 'CRITIQUE', users: 200, availability: '99.99%' },
            { name: 'SIH Principal', type: 'ERP Santé', criticality: 'CRITIQUE', users: 3000, availability: '99.9%' },
            { name: 'PACS Imagerie', type: 'Imagerie médicale', criticality: 'CRITIQUE', users: 500, availability: '99.8%' },
            { name: 'Laboratoires', type: 'Analyses médicales', criticality: 'MAJEUR', users: 150, availability: '99.5%' }
          ],
          networks: [
            { name: 'Réseau médical', type: 'VLAN sécurisé', coverage: '3 sites', security: 'WPA3 Enterprise' }
          ],
          servers: { physical: 200, virtual: 800, locations: ['Site Principal', 'Site Spécialisé', 'Cloud HDS'] },
          applications: [
            { name: 'Prescriptions électroniques', type: 'Métier vital', criticality: 'CRITIQUE', users: 2800 },
            { name: 'Dossier Patient Informatisé', type: 'Métier critique', criticality: 'CRITIQUE', users: 2800 }
          ]
        },
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI', 'Code de la santé publique', 'Secret médical'],
        operationalConstraints: [
          { type: 'Continuité vitale', description: 'Urgences 24h/24', impact: 'Vies en jeu', mitigation: 'Redondance totale' },
          { type: 'Secret médical', description: 'Confidentialité absolue', impact: 'Sanctions pénales', mitigation: 'Chiffrement + contrôles' },
          { type: 'Traçabilité', description: 'Conservation 7 ans', impact: 'Obligations légales', mitigation: 'Archivage sécurisé' }
        ],
        partners: [
          { name: 'ANSSI', type: 'Autorité', criticality: 'MAJEUR', services: ['Homologation', 'Contrôles'] },
          { name: 'CNIL', type: 'Autorité', criticality: 'MAJEUR', services: ['Conformité RGPD', 'Audits'] }
        ]
      },
      learningObjectives: [
        'Définir des objectifs de sécurité DICP adaptés au CHU',
        'Équilibrer exigences métier et faisabilité technique',
        'Intégrer les contraintes réglementaires spécifiques santé',
        'Mesurer et valider les objectifs définis'
      ],
      realWorldExample: 'Objectifs sécurité CHU Bordeaux (certification HDS 2023)',
      anssiCompliance: ['Guide EBIOS RM - Objectifs de sécurité', 'Référentiel HDS ANSSI']
    };
  }

  // 🏛️ EXERCICE 5 - SIMULATION COMITÉ VALIDATION (20 MIN, 100 PTS)
  static getExercise5_GovernanceSimulation(): SecurityFoundationExercise {
    return {
      id: 'exercise_5_governance_simulation',
      title: 'Simulation Comité Validation',
      description: 'Maîtriser la présentation et validation des biens essentiels en comité',
      type: 'governance_simulation',
      difficulty: 'expert',
      duration: 20,
      points: 100,
      category: 'Gouvernance et validation',
      scenario: {
        id: 'chu_validation_committee',
        title: 'Comité de validation multidisciplinaire CHU avec 7 participants',
        description: 'Présenter et faire valider l\'inventaire des biens essentiels par le comité multidisciplinaire',
        context: `Situation : Vous devez présenter vos conclusions d'analyse des biens essentiels au comité de validation.
        Enjeu : Obtenir la validation officielle pour poursuivre l'analyse EBIOS RM.`,
        constraints: [
          'Comité multidisciplinaire avec enjeux divergents',
          'Temps de présentation limité (30 minutes)',
          'Objections métier prévisibles',
          'Validation unanime requise pour poursuivre'
        ],
        stakeholders: [
          'Directeur Général (enjeux stratégiques)',
          'Directeur Médical (enjeux soins)',
          'Chef pôle Urgences (contraintes opérationnelles)',
          'Directeur Soins (organisation infirmière)',
          'RSSI (sécurité technique)',
          'DSI (faisabilité technique)',
          'Directeur Qualité (conformité réglementaire)'
        ],
        expectedOutcome: 'Validation unanime avec plan d\'action A2'
      },
      questions: [
        {
          id: 'q1_presentation_structure',
          question: 'Structurez votre présentation de 30 minutes pour maximiser l\'adhésion :',
          type: 'ranking',
          options: [
            'Introduction : Contexte et enjeux CHU (5 min)',
            'Méthodologie : Approche ANSSI adaptée santé (5 min)',
            'Résultats : Top 10 biens essentiels avec justifications (15 min)',
            'Impacts : Conséquences opérationnelles et financières (3 min)',
            'Recommandations : Prochaines étapes Atelier 2 (2 min)'
          ],
          correctAnswer: [
            'Introduction : Contexte et enjeux CHU (5 min)',
            'Méthodologie : Approche ANSSI adaptée santé (5 min)',
            'Résultats : Top 10 biens essentiels avec justifications (15 min)',
            'Impacts : Conséquences opérationnelles et financières (3 min)',
            'Recommandations : Prochaines étapes Atelier 2 (2 min)'
          ],
          explanation: `**Structure optimale de présentation :**

🎯 **Introduction (5 min)** : Cadrer les enjeux
📋 **Méthodologie (5 min)** : Rassurer sur l'approche
📊 **Résultats (15 min)** : Cœur de la présentation
💰 **Impacts (3 min)** : Convaincre de l'urgence
🚀 **Recommandations (2 min)** : Mobiliser pour l'action

**Clé du succès :** 50% du temps sur les résultats avec justifications métier`,
          points: 30,
          expertTips: ['Adaptez le discours à chaque interlocuteur', 'Préparez les objections prévisibles']
        },
        {
          id: 'q2_objection_management',
          question: 'Le Chef des Urgences conteste : "Vous classez les urgences en CRITIQUE mais nous n\'avons jamais eu de panne majeure". Comment répondez-vous ?',
          type: 'scenario_analysis',
          options: [
            'Reformuler : "Vous confirmez donc que les urgences sont vitales ?"',
            'Argumenter : "L\'absence de panne passée ne garantit pas l\'avenir"',
            'Illustrer : "Une panne de 4h = combien de vies en danger ?"',
            'Réglementaire : "L\'ANSSI impose cette classification pour les urgences"',
            'Compromis : "Proposons MAJEUR si vous préférez ?"'
          ],
          correctAnswer: ['Reformuler : "Vous confirmez donc que les urgences sont vitales ?"', 'Illustrer : "Une panne de 4h = combien de vies en danger ?"'],
          explanation: `**Gestion d'objection efficace :**

✅ **Reformulation** : Faire dire l'importance par l'objecteur
✅ **Illustration concrète** : Impact vies humaines parlant
❌ **Argument historique** : Faible face à l'expérience terrain
❌ **Autorité réglementaire** : Peut braquer
❌ **Compromis** : Affaiblit la position technique

**Technique :** Transformer l'objection en validation de l'importance`,
          points: 40,
          expertTips: ['Utilisez l\'expertise métier de l\'objecteur', 'Restez sur les faits et impacts']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        itInfrastructure: {
          systems: [
            { name: 'SIH Principal', type: 'ERP Santé', criticality: 'CRITIQUE', users: 3000, availability: '99.9%' }
          ],
          networks: [
            { name: 'Réseau médical', type: 'VLAN sécurisé', coverage: '3 sites', security: 'WPA3 Enterprise' }
          ],
          servers: { physical: 200, virtual: 800, locations: ['Site Principal', 'Site Spécialisé', 'Cloud HDS'] },
          applications: [
            { name: 'Dossier Patient Informatisé', type: 'Métier critique', criticality: 'CRITIQUE', users: 2800 }
          ]
        },
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI', 'Code de la santé publique'],
        operationalConstraints: [
          { type: 'Gouvernance', description: 'Validation comité obligatoire', impact: 'Blocage projet', mitigation: 'Préparation rigoureuse' },
          { type: 'Multidisciplinaire', description: 'Enjeux divergents', impact: 'Conflits intérêts', mitigation: 'Communication adaptée' }
        ],
        partners: [
          { name: 'Comité de Direction', type: 'Gouvernance', criticality: 'CRITIQUE', services: ['Validation stratégique', 'Arbitrage'] }
        ]
      },
      learningObjectives: [
        'Maîtriser la présentation en comité multidisciplinaire',
        'Gérer les objections et conflits d\'intérêts',
        'Adapter la communication par type d\'interlocuteur',
        'Obtenir une validation unanime et actionnable'
      ],
      realWorldExample: 'Comités de validation post-incident WannaCry (2017)',
      anssiCompliance: ['Guide gouvernance sécurité ANSSI', 'Bonnes pratiques comités sécurité']
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllExercises(): SecurityFoundationExercise[] {
    return [
      this.getExercise1_ScopingAnalysis(),
      this.getExercise2_AssetIdentification(),
      this.getExercise3_EcosystemMapping(),
      this.getExercise4_SecurityObjectives(),
      this.getExercise5_GovernanceSimulation()
    ];
  }

  static getExerciseById(exerciseId: string): SecurityFoundationExercise | undefined {
    return this.getAllExercises().find(ex => ex.id === exerciseId);
  }

  static getExercisesByDifficulty(difficulty: 'intermediate' | 'advanced' | 'expert'): SecurityFoundationExercise[] {
    return this.getAllExercises().filter(ex => ex.difficulty === difficulty);
  }

  static getTotalDuration(): number {
    return this.getAllExercises().reduce((total, ex) => total + ex.duration, 0);
  }

  static getTotalPoints(): number {
    return this.getAllExercises().reduce((total, ex) => total + ex.points, 0);
  }
}
