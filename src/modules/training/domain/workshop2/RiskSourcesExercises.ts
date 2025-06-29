/**
 * 🎯 EXERCICES PRATIQUES ATELIER 2 - SOURCES DE RISQUE
 * Exercices spécialisés pour maîtriser l'identification et l'analyse des sources de risque CHU
 */

// 🎯 TYPES POUR LES EXERCICES ATELIER 2
export interface RiskSourceExercise {
  id: string;
  title: string;
  description: string;
  type: 'external_sources' | 'internal_threats' | 'supply_chain' | 'threat_intelligence' | 'governance_simulation';
  difficulty: 'intermediate' | 'advanced' | 'expert';
  duration: number; // minutes
  points: number;
  category: string;
  scenario: ExerciseScenario;
  questions: ExerciseQuestion[];
  context: CHUThreatContext;
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
  threatLandscape: ThreatLandscape;
}

export interface ThreatLandscape {
  year: string;
  sector: string;
  incidents: RecentIncident[];
  trends: ThreatTrend[];
  intelligence: ThreatIntelligence[];
}

export interface RecentIncident {
  date: string;
  target: string;
  type: string;
  impact: string;
  source: string;
}

export interface ThreatTrend {
  trend: string;
  description: string;
  impact: string;
  examples: string[];
}

export interface ThreatIntelligence {
  source: string;
  reliability: 'A' | 'B' | 'C' | 'D';
  confidence: 'high' | 'medium' | 'low';
  information: string;
  relevance: number; // 1-5
}

export interface ExerciseQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'multiple_select' | 'ranking' | 'threat_profiling' | 'scenario_analysis' | 'matrix_analysis';
  options?: string[];
  correctAnswer: any;
  explanation: string;
  points: number;
  hints?: string[];
  commonMistakes?: string[];
  expertTips?: string[];
  threatIntelligence?: ThreatIntelligence[];
}

export interface CHUThreatContext {
  hospitalType: string;
  bedCount: number;
  sites: number;
  employees: number;
  budget: string;
  specialties: string[];
  essentialAssets: EssentialAssetRef[];
  securityMaturity: number; // 1-5
  regulatoryRequirements: string[];
  operationalConstraints: OperationalConstraint[];
  ecosystem: EcosystemPartner[];
}

export interface EssentialAssetRef {
  id: string;
  name: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  attractiveness: number; // 1-5 pour les sources
}

export interface OperationalConstraint {
  type: string;
  description: string;
  impact: string;
  mitigation: string;
}

export interface EcosystemPartner {
  name: string;
  type: string;
  criticality: string;
  services: string[];
  riskLevel: number;
}

/**
 * 🎯 CLASSE PRINCIPALE DES EXERCICES ATELIER 2
 */
export class RiskSourcesExercises {
  
  // 🥇 EXERCICE 1 - IDENTIFICATION SOURCES EXTERNES (30 MIN, 100 PTS)
  static getExercise1_ExternalSources(): RiskSourceExercise {
    return {
      id: 'exercise_1_external_sources',
      title: 'Identification Sources Externes',
      description: 'Maîtriser l\'identification des sources externes spécialisées santé',
      type: 'external_sources',
      difficulty: 'advanced',
      duration: 30,
      points: 100,
      category: 'Sources externes',
      scenario: {
        id: 'chu_threat_landscape_2024',
        title: 'CHU Métropolitain - Analyse threat landscape secteur santé 2024',
        description: 'Analyser le paysage des menaces spécifiques au secteur santé pour identifier les sources prioritaires',
        context: `Mission : Identifier et prioriser les sources de risque externes menaçant le CHU Métropolitain.
        Contrainte : Utiliser la threat intelligence 2024 actualisée et les incidents récents du secteur.`,
        constraints: [
          'Threat intelligence 2024 actualisée obligatoire',
          'Focus sur les sources spécialisées santé',
          'Priorisation selon attractivité CHU',
          'Validation avec incidents récents secteur'
        ],
        stakeholders: [
          'RSSI', 'CERT Santé', 'Direction Médicale', 'DSI',
          'Threat Intelligence Analyst', 'SOC Manager'
        ],
        expectedOutcome: 'Top 15 sources externes priorisées avec justifications',
        threatLandscape: {
          year: '2024',
          sector: 'Santé',
          incidents: [
            { date: '2024-Q1', target: 'CHU européens', type: 'Ransomware', impact: 'Paralysie 3-7 jours', source: 'LockBit 3.0' },
            { date: '2024-Q2', target: 'Laboratoires US', type: 'Exfiltration', impact: '2M dossiers patients', source: 'APT chinois' },
            { date: '2024-Q3', target: 'Hôpitaux UK', type: 'Supply chain', impact: 'Compromission SIH', source: 'Éditeur compromis' }
          ],
          trends: [
            { trend: 'Spécialisation santé', description: 'Groupes dédiés au secteur médical', impact: 'Efficacité accrue', examples: ['Ryuk successeurs', 'Conti évolutions'] },
            { trend: 'Double extorsion', description: 'Chiffrement + menace publication', impact: 'Pression maximale', examples: ['LockBit', 'BlackCat'] },
            { trend: 'Supply chain', description: 'Attaques via fournisseurs', impact: 'Propagation massive', examples: ['SolarWinds santé', 'Kaseya MSP'] }
          ],
          intelligence: [
            { source: 'CERT Santé', reliability: 'A', confidence: 'high', information: '70% hôpitaux ciblés ransomware 2024', relevance: 5 },
            { source: 'ANSSI', reliability: 'A', confidence: 'high', information: 'APT chinois ciblent recherche COVID', relevance: 4 },
            { source: 'HC3 US', reliability: 'B', confidence: 'medium', information: 'Trafic données santé +300% dark web', relevance: 5 }
          ]
        }
      },
      questions: [
        {
          id: 'q1_cybercriminals_profiling',
          question: 'Identifiez et profilez les 3 groupes cybercriminels les plus menaçants pour le CHU :',
          type: 'threat_profiling',
          options: [
            'LockBit 3.0 - Ransomware spécialisé infrastructures critiques',
            'BlackCat/ALPHV - Double extorsion avec leak sites',
            'Conti successeurs - Expertise secteur santé développée',
            'Lazarus (Corée du Nord) - Financement programme nucléaire',
            'APT40 (Chine) - Espionnage recherche médicale',
            'FIN7 - Fraude financière et vol données',
            'Script kiddies - Attaques opportunistes non ciblées',
            'REvil successeurs - Ransomware-as-a-Service'
          ],
          correctAnswer: [
            'LockBit 3.0 - Ransomware spécialisé infrastructures critiques',
            'Conti successeurs - Expertise secteur santé développée', 
            'APT40 (Chine) - Espionnage recherche médicale'
          ],
          explanation: `**Top 3 sources cybercriminelles pour CHU :**

🥇 **LockBit 3.0** : Spécialisation infrastructures critiques
- Motivation : Rançons élevées (1-10M€)
- Capacités : Techniques avancées, double extorsion
- Historique : 40% attaques hôpitaux 2024

🥈 **Conti successeurs** : Expertise secteur santé
- Motivation : Connaissance spécialisée acquise
- Capacités : Réseaux établis, outils dédiés
- Historique : Évolution post-démantèlement

🥉 **APT40 (Chine)** : Espionnage recherche médicale
- Motivation : Intelligence économique/géopolitique
- Capacités : Sophistication étatique, persistance
- Historique : Campagnes COVID-19, vaccins`,
          points: 30,
          hints: ['Focalisez sur la spécialisation santé', 'Analysez les motivations spécifiques au CHU'],
          expertTips: ['Les groupes spécialisés sont plus dangereux que les généralistes', 'L\'historique d\'attaques santé est prédictif'],
          threatIntelligence: [
            { source: 'CERT Santé', reliability: 'A', confidence: 'high', information: 'LockBit responsable 40% ransomware santé 2024', relevance: 5 },
            { source: 'ANSSI', reliability: 'A', confidence: 'high', information: 'APT40 campagnes actives recherche médicale', relevance: 4 }
          ]
        },
        {
          id: 'q2_state_threats_analysis',
          question: 'Analysez les menaces étatiques selon leurs objectifs géopolitiques :',
          type: 'matrix_analysis',
          options: [
            'Chine (APT1, APT40) - Espionnage recherche médicale et vaccins',
            'Russie (APT28, APT29) - Déstabilisation systèmes santé occidentaux',
            'Corée du Nord (Lazarus) - Financement via ransomware et cryptojacking',
            'Iran (APT35) - Espionnage géopolitique données gouvernementales',
            'États-Unis (NSA) - Surveillance globale communications',
            'Israël (Unit 8200) - Cyber-défense et contre-espionnage'
          ],
          correctAnswer: {
            'PRIORITÉ 1 (Impact direct CHU)': [
              'Chine (APT1, APT40) - Espionnage recherche médicale et vaccins',
              'Russie (APT28, APT29) - Déstabilisation systèmes santé occidentaux'
            ],
            'PRIORITÉ 2 (Impact indirect)': [
              'Corée du Nord (Lazarus) - Financement via ransomware et cryptojacking'
            ],
            'PRIORITÉ 3 (Faible probabilité)': [
              'Iran (APT35) - Espionnage géopolitique données gouvernementales'
            ]
          },
          explanation: `**Analyse menaces étatiques par priorité :**

🔴 **PRIORITÉ 1 - Impact direct :**
- **Chine** : Intérêt stratégique recherche médicale française
- **Russie** : Déstabilisation infrastructures critiques occidentales

🟠 **PRIORITÉ 2 - Impact indirect :**
- **Corée du Nord** : Opportunisme financier (ransomware)

🟡 **PRIORITÉ 3 - Faible probabilité :**
- **Iran** : Pas d'intérêt spécifique CHU régional
- **Alliés** : Risque négligeable (coopération)`,
          points: 25,
          expertTips: ['Les motivations géopolitiques déterminent les cibles', 'L\'espionnage recherche médicale est stratégique']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Recherche'],
        essentialAssets: [
          { id: 'urgences_vitales', name: 'Urgences vitales', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'sih_patients', name: 'SIH Dossiers patients', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'recherche_clinique', name: 'Recherche clinique', criticality: 'MAJEUR', attractiveness: 4 }
        ],
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI'],
        operationalConstraints: [
          { type: 'Continuité', description: 'Soins 24h/24', impact: 'Vies en jeu', mitigation: 'Redondance' },
          { type: 'Attractivité', description: 'Données santé valorisées', impact: 'Cible privilégiée', mitigation: 'Protection renforcée' }
        ],
        ecosystem: [
          { name: 'Éditeur SIH', type: 'Fournisseur unique', criticality: 'CRITIQUE', services: ['Support 24h/24'], riskLevel: 10 },
          { name: 'Laboratoires externes', type: 'Partenaire', criticality: 'CRITIQUE', services: ['Analyses urgentes'], riskLevel: 8 }
        ]
      },
      learningObjectives: [
        'Identifier les sources externes spécialisées secteur santé',
        'Analyser les motivations des attaquants ciblant les hôpitaux',
        'Évaluer les capacités techniques et organisationnelles requises',
        'Prioriser les sources selon la menace pour le CHU'
      ],
      realWorldExample: 'Analyse threat intelligence post-attaques CHU européens Q1 2024',
      anssiCompliance: ['Guide EBIOS RM - Identification sources', 'Méthode threat intelligence ANSSI']
    };
  }

  // 🥈 EXERCICE 2 - ANALYSE MENACES INTERNES (25 MIN, 120 PTS)
  static getExercise2_InternalThreats(): RiskSourceExercise {
    return {
      id: 'exercise_2_internal_threats',
      title: 'Analyse Menaces Internes',
      description: 'Maîtriser l\'analyse des risques internes spécifiques au milieu hospitalier',
      type: 'internal_threats',
      difficulty: 'expert',
      duration: 25,
      points: 120,
      category: 'Menaces internes',
      scenario: {
        id: 'chu_internal_risk_assessment',
        title: 'CHU 3500 employés - Évaluation risques internes par profil',
        description: 'Analyser les risques internes en tenant compte des spécificités du milieu hospitalier',
        context: `Mission : Évaluer les risques internes par catégorie de personnel et définir les profils à risque.
        Contrainte : Intégrer les facteurs de stress spécifiques au milieu hospitalier.`,
        constraints: [
          'Analyse comportementale spécialisée santé',
          'Facteurs de stress milieu hospitalier',
          'Statistiques incidents internes ANSSI',
          'Profils psychologiques à risque'
        ],
        stakeholders: [
          'DRH', 'Direction Médicale', 'RSSI', 'Médecin du travail',
          'Représentants syndicaux', 'Psychologue du travail'
        ],
        expectedOutcome: 'Matrice de risque interne avec mesures préventives',
        threatLandscape: {
          year: '2024',
          sector: 'Santé',
          incidents: [
            { date: '2024', target: 'Hôpitaux français', type: 'Menace interne', impact: '35% incidents sécurité', source: 'Statistiques ANSSI' },
            { date: '2024', target: 'Personnel soignant', type: 'Burnout', impact: '40% taux épuisement', source: 'Enquête DREES' },
            { date: '2024', target: 'Administrateurs IT', type: 'Surcharge', impact: '60% en sous-effectif', source: 'Baromètre DSIH' }
          ],
          trends: [
            { trend: 'Épuisement professionnel', description: 'Burnout post-COVID persistant', impact: 'Négligence sécurité', examples: ['Partage comptes', 'Procédures contournées'] },
            { trend: 'Turnover élevé', description: 'Rotation personnel importante', impact: 'Formation insuffisante', examples: ['Intérimaires', 'Nouveaux arrivants'] },
            { trend: 'Télétravail hybride', description: 'Travail à distance partiel', impact: 'Contrôle réduit', examples: ['Accès non sécurisés', 'Équipements personnels'] }
          ],
          intelligence: [
            { source: 'ANSSI', reliability: 'A', confidence: 'high', information: '35% incidents sécurité origine interne secteur santé', relevance: 5 },
            { source: 'CNIL', reliability: 'A', confidence: 'high', information: '60% violations RGPD santé par négligence interne', relevance: 5 },
            { source: 'CERT Santé', reliability: 'B', confidence: 'medium', information: 'Corrélation burnout/incidents sécurité observée', relevance: 4 }
          ]
        }
      },
      questions: [
        {
          id: 'q1_medical_staff_profiling',
          question: 'Analysez les 4 profils médicaux selon leur niveau de risque interne :',
          type: 'threat_profiling',
          options: [
            'Médecin chef de service (20 ans ancienneté, accès étendu, pression hiérarchique)',
            'Infirmière intérimaire (contrat 3 mois, formation express, stress adaptation)',
            'Interne en médecine (stage 6 mois, curiosité apprentissage, supervision variable)',
            'Médecin urgentiste (10 ans expérience, burnout élevé, accès privilégié urgences)'
          ],
          correctAnswer: {
            'RISQUE ÉLEVÉ': ['Infirmière intérimaire (contrat 3 mois, formation express, stress adaptation)', 'Médecin urgentiste (10 ans expérience, burnout élevé, accès privilégié urgences)'],
            'RISQUE MODÉRÉ': ['Interne en médecine (stage 6 mois, curiosité apprentissage, supervision variable)'],
            'RISQUE FAIBLE': ['Médecin chef de service (20 ans ancienneté, accès étendu, pression hiérarchique)']
          },
          explanation: `**Analyse risque par profil médical :**

🔴 **RISQUE ÉLEVÉ :**
- **Infirmière intérimaire** : Formation insuffisante + stress adaptation + turnover
- **Médecin urgentiste** : Burnout + accès privilégié + pression temporelle

🟠 **RISQUE MODÉRÉ :**
- **Interne médecine** : Curiosité + supervision variable (facteur d'apprentissage)

🟢 **RISQUE FAIBLE :**
- **Chef de service** : Ancienneté + responsabilité + formation complète

**Facteurs aggravants :** Stress, formation insuffisante, accès privilégié, burnout`,
          points: 35,
          hints: ['Analysez stress + accès + formation', 'Le burnout est un facteur critique en santé'],
          expertTips: ['Les intérimaires cumulent les facteurs de risque', 'Le burnout corrèle avec les incidents sécurité']
        },
        {
          id: 'q2_technical_staff_assessment',
          question: 'Évaluez les risques du personnel technique selon la matrice Probabilité × Impact :',
          type: 'matrix_analysis',
          options: [
            'Administrateur IT (accès root, surcharge travail, sous-effectifs) - P:4, I:5',
            'Technicien biomédical externe (accès équipements, interventions urgentes) - P:3, I:4',
            'Personnel nettoyage nuit (accès locaux sensibles, surveillance réduite) - P:3, I:2',
            'Stagiaire informatique (accès temporaire, formation incomplète) - P:2, I:3',
            'Prestataire maintenance (accès physique, équipements test) - P:3, I:4',
            'Agent sécurité (accès badges, rondes nocturnes) - P:2, I:2'
          ],
          correctAnswer: {
            'CRITIQUE (Score 16-20)': ['Administrateur IT (accès root, surcharge travail, sous-effectifs) - P:4, I:5'],
            'ÉLEVÉ (Score 12-15)': ['Technicien biomédical externe (accès équipements, interventions urgentes) - P:3, I:4', 'Prestataire maintenance (accès physique, équipements test) - P:3, I:4'],
            'MODÉRÉ (Score 6-11)': ['Personnel nettoyage nuit (accès locaux sensibles, surveillance réduite) - P:3, I:2', 'Stagiaire informatique (accès temporaire, formation incomplète) - P:2, I:3'],
            'FAIBLE (Score 1-5)': ['Agent sécurité (accès badges, rondes nocturnes) - P:2, I:2']
          },
          explanation: `**Matrice de risque technique :**

Score = Probabilité × Impact

🔴 **CRITIQUE (20)** : Admin IT - Accès total + surcharge + sous-effectifs
🟠 **ÉLEVÉ (12)** : Biomédicaux/Maintenance - Accès critique + externe
🟡 **MODÉRÉ (6-9)** : Nettoyage/Stagiaires - Accès limité ou temporaire
🟢 **FAIBLE (4)** : Sécurité - Accès contrôlé + formation

**Priorisation :** Admin IT > Prestataires techniques > Personnel support`,
          points: 30,
          expertTips: ['L\'accès technique amplifie l\'impact', 'Les prestataires externes cumulent les risques']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie'],
        essentialAssets: [
          { id: 'urgences_vitales', name: 'Urgences vitales', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'sih_patients', name: 'SIH Dossiers patients', criticality: 'CRITIQUE', attractiveness: 5 }
        ],
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI'],
        operationalConstraints: [
          { type: 'Stress professionnel', description: 'Burnout post-COVID', impact: 'Négligence sécurité', mitigation: 'Support psychologique' },
          { type: 'Turnover élevé', description: 'Rotation 25%/an', impact: 'Formation insuffisante', mitigation: 'Onboarding renforcé' },
          { type: 'Sous-effectifs', description: 'IT en tension', impact: 'Surcharge travail', mitigation: 'Recrutement prioritaire' }
        ],
        ecosystem: [
          { name: 'Personnel médical', type: 'Interne', criticality: 'CRITIQUE', services: ['Soins patients'], riskLevel: 6 },
          { name: 'Personnel technique', type: 'Interne', criticality: 'CRITIQUE', services: ['Support IT'], riskLevel: 8 },
          { name: 'Prestataires', type: 'Externe', criticality: 'MAJEUR', services: ['Maintenance'], riskLevel: 7 }
        ]
      },
      learningObjectives: [
        'Identifier les menaces internes spécifiques au milieu hospitalier',
        'Analyser les facteurs de risque du personnel médical et technique',
        'Évaluer l\'impact des prestataires et visiteurs',
        'Définir des profils de risque par catégorie de personnel'
      ],
      realWorldExample: 'Analyse post-incident interne CHU Marseille (2023)',
      anssiCompliance: ['Guide EBIOS RM - Menaces internes', 'Référentiel RH sécurisées ANSSI']
    };
  }

  // 🥉 EXERCICE 3 - ÉCOSYSTÈME ET SUPPLY CHAIN (25 MIN, 110 PTS)
  static getExercise3_SupplyChain(): RiskSourceExercise {
    return {
      id: 'exercise_3_supply_chain',
      title: 'Écosystème et Supply Chain',
      description: 'Analyser les risques de la chaîne d\'approvisionnement santé',
      type: 'supply_chain',
      difficulty: 'advanced',
      duration: 25,
      points: 110,
      category: 'Chaîne d\'approvisionnement',
      scenario: {
        id: 'chu_supply_chain_analysis',
        title: 'CHU interconnecté - 15 fournisseurs critiques, 25 partenaires',
        description: 'Analyser les risques de l\'écosystème complexe du CHU et identifier les vulnérabilités supply chain',
        context: `Mission : Analyser les risques de la chaîne d'approvisionnement et des partenaires critiques.
        Contrainte : Évaluer les risques de propagation et les effets domino.`,
        constraints: [
          'Dépendances critiques uniques (SIH, PACS)',
          'Interconnexions complexes (25 partenaires)',
          'Réglementations spécifiques (HDS, certification)',
          'Continuité soins non négociable'
        ],
        stakeholders: [
          'Direction Achats', 'RSSI', 'DSI', 'Direction Partenariats',
          'Responsables contrats', 'Auditeurs externes'
        ],
        expectedOutcome: 'Cartographie risques supply chain avec stratégies mitigation',
        threatLandscape: {
          year: '2024',
          sector: 'Santé',
          incidents: [
            { date: '2024-Q1', target: 'Éditeurs SIH', type: 'Compromission', impact: 'Backdoor 50+ hôpitaux', source: 'Supply chain attack' },
            { date: '2024-Q2', target: 'Microsoft 365', type: 'Panne globale', impact: '8h interruption', source: 'Défaillance cloud' },
            { date: '2024-Q3', target: 'Laboratoires réseau', type: 'Propagation malware', impact: 'Contamination 15 sites', source: 'Mouvement latéral' }
          ],
          trends: [
            { trend: 'Attaques supply chain', description: 'Compromission fournisseurs pour atteindre clients', impact: 'Propagation massive', examples: ['SolarWinds', 'Kaseya', 'Log4j'] },
            { trend: 'Dépendances cloud', description: 'Concentration sur quelques acteurs', impact: 'Points de défaillance unique', examples: ['Microsoft', 'Google', 'AWS'] },
            { trend: 'Interconnexions santé', description: 'Réseaux régionaux étendus', impact: 'Effet domino inter-établissements', examples: ['GRADeS', 'Réseaux imagerie'] }
          ],
          intelligence: [
            { source: 'ANSSI', reliability: 'A', confidence: 'high', information: '60% incidents supply chain visent secteur critique', relevance: 5 },
            { source: 'CERT-EU', reliability: 'A', confidence: 'high', information: 'Attaques éditeurs logiciels +200% en 2024', relevance: 5 },
            { source: 'ENISA', reliability: 'B', confidence: 'medium', information: 'Dépendances cloud créent vulnérabilités systémiques', relevance: 4 }
          ]
        }
      },
      questions: [
        {
          id: 'q1_critical_suppliers',
          question: 'Identifiez les 5 fournisseurs critiques présentant le plus haut risque supply chain :',
          type: 'multiple_select',
          options: [
            'Éditeur SIH (fournisseur unique, 3000 utilisateurs, maintenance 24h/24)',
            'Microsoft Cloud (Office 365, Teams, 3500 utilisateurs)',
            'Fournisseur PACS (imagerie, 500 utilisateurs, données critiques)',
            'Opérateur télécom principal (connectivité inter-sites)',
            'Laboratoires externes (analyses urgentes, partenariat critique)',
            'Prestataires maintenance biomédicale (équipements vitaux)',
            'Fournisseur badges (contrôle accès, 3500 badges)',
            'Prestataires nettoyage (accès locaux, surveillance limitée)',
            'Constructeur serveurs (infrastructure, support standard)',
            'Éditeur antivirus (sécurité, mise à jour automatique)'
          ],
          correctAnswer: [
            'Éditeur SIH (fournisseur unique, 3000 utilisateurs, maintenance 24h/24)',
            'Opérateur télécom principal (connectivité inter-sites)',
            'Laboratoires externes (analyses urgentes, partenariat critique)',
            'Fournisseur PACS (imagerie, 500 utilisateurs, données critiques)',
            'Prestataires maintenance biomédicale (équipements vitaux)'
          ],
          explanation: `**Top 5 fournisseurs critiques supply chain :**

🥇 **Éditeur SIH** : Fournisseur unique = SPOF critique
🥈 **Opérateur télécom** : Connectivité vitale inter-sites
🥉 **Laboratoires externes** : Analyses urgences vitales
🏅 **Fournisseur PACS** : Imagerie diagnostique critique
🏅 **Maintenance biomédicale** : Équipements patients vitaux

**Critères de criticité :**
- Impact direct sur soins patients
- Absence d'alternative (SPOF)
- Accès privilégié systèmes/données
- Délai de remplacement élevé`,
          points: 35,
          hints: ['Focalisez sur l\'impact direct soins patients', 'Identifiez les fournisseurs uniques (SPOF)'],
          expertTips: ['Un fournisseur unique = risque critique automatique', 'L\'accès privilégié amplifie le risque']
        },
        {
          id: 'q2_propagation_scenarios',
          question: 'Analysez les scénarios de propagation en cascade selon leur probabilité et impact :',
          type: 'scenario_analysis',
          options: [
            'Compromission éditeur SIH → Backdoor → 50+ hôpitaux clients',
            'Panne Microsoft 365 → Perte communication → Coordination dégradée',
            'Malware laboratoire externe → Propagation réseau → Contamination CHU',
            'Cyberattaque opérateur télécom → Isolement sites → Perte coordination',
            'Défaillance prestataire maintenance → Panne équipements → Arrêt soins',
            'Compromission fournisseur PACS → Accès images → Chantage patients'
          ],
          correctAnswer: {
            'CRITIQUE (P×I ≥ 12)': [
              'Compromission éditeur SIH → Backdoor → 50+ hôpitaux clients',
              'Cyberattaque opérateur télécom → Isolement sites → Perte coordination'
            ],
            'ÉLEVÉ (P×I = 8-11)': [
              'Malware laboratoire externe → Propagation réseau → Contamination CHU',
              'Défaillance prestataire maintenance → Panne équipements → Arrêt soins'
            ],
            'MODÉRÉ (P×I = 4-7)': [
              'Panne Microsoft 365 → Perte communication → Coordination dégradée',
              'Compromission fournisseur PACS → Accès images → Chantage patients'
            ]
          },
          explanation: `**Analyse scénarios propagation :**

🔴 **CRITIQUE** : Impact systémique + Probabilité élevée
- **SIH compromis** : 1 fournisseur → 50+ clients (effet multiplicateur)
- **Télécom attaqué** : Isolement sites → paralysie coordination

🟠 **ÉLEVÉ** : Impact direct soins + Probabilité modérée
- **Laboratoire contaminé** : Propagation réseau établie
- **Maintenance défaillante** : Équipements vitaux en panne

🟡 **MODÉRÉ** : Impact indirect + Solutions contournement
- **Microsoft 365** : Communication dégradée mais alternatives
- **PACS compromis** : Impact localisé imagerie`,
          points: 35,
          expertTips: ['Les effets multiplicateurs créent les risques critiques', 'Analysez les dépendances en cascade']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie'],
        essentialAssets: [
          { id: 'sih_principal', name: 'SIH Principal', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'connectivite_sites', name: 'Connectivité inter-sites', criticality: 'CRITIQUE', attractiveness: 4 }
        ],
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI'],
        operationalConstraints: [
          { type: 'Fournisseur unique', description: 'SIH sans alternative', impact: 'Dépendance critique', mitigation: 'Contrat renforcé' },
          { type: 'Interconnexions', description: '25 partenaires connectés', impact: 'Propagation risques', mitigation: 'Segmentation réseau' },
          { type: 'Réglementaire', description: 'Certification HDS obligatoire', impact: 'Choix fournisseurs limité', mitigation: 'Due diligence renforcée' }
        ],
        ecosystem: [
          { name: 'Éditeur SIH', type: 'Fournisseur unique', criticality: 'CRITIQUE', services: ['SIH', 'Support'], riskLevel: 10 },
          { name: 'Opérateur télécom', type: 'Infrastructure', criticality: 'CRITIQUE', services: ['Connectivité'], riskLevel: 9 },
          { name: 'Laboratoires externes', type: 'Partenaire', criticality: 'CRITIQUE', services: ['Analyses'], riskLevel: 8 },
          { name: 'Microsoft', type: 'Cloud provider', criticality: 'MAJEUR', services: ['Office 365'], riskLevel: 7 }
        ]
      },
      learningObjectives: [
        'Cartographier l\'écosystème numérique complexe du CHU',
        'Identifier les dépendances critiques externes',
        'Analyser les risques de la chaîne d\'approvisionnement',
        'Évaluer les impacts des défaillances en cascade'
      ],
      realWorldExample: 'Analyse supply chain post-incident SolarWinds santé (2020)',
      anssiCompliance: ['Guide EBIOS RM - Analyse écosystème', 'Référentiel supply chain security ANSSI']
    };
  }

  // 🎯 EXERCICE 4 - THREAT INTELLIGENCE SANTÉ (25 MIN, 90 PTS)
  static getExercise4_ThreatIntelligence(): RiskSourceExercise {
    return {
      id: 'exercise_4_threat_intelligence',
      title: 'Threat Intelligence Santé',
      description: 'Maîtriser la collecte et analyse de threat intelligence sectorielle',
      type: 'threat_intelligence',
      difficulty: 'advanced',
      duration: 25,
      points: 90,
      category: 'Intelligence des menaces',
      scenario: {
        id: 'chu_threat_intelligence',
        title: 'Veille sécurité CHU - Sources et IOC spécialisés santé',
        description: 'Structurer la collecte et l\'analyse de threat intelligence pour le secteur santé',
        context: `Mission : Mettre en place un système de threat intelligence adapté au CHU.
        Contrainte : Intégrer sources spécialisées santé et IOC sectoriels.`,
        constraints: [
          'Sources spécialisées santé prioritaires',
          'IOC sectoriels validés et pertinents',
          'Corrélation avec incidents CHU',
          'Partage collaboratif CERT Santé'
        ],
        stakeholders: [
          'RSSI', 'SOC Manager', 'Threat Intelligence Analyst',
          'CERT Santé', 'Partenaires CHU', 'Éditeurs sécurité'
        ],
        expectedOutcome: 'Système TI opérationnel avec sources et processus',
        threatLandscape: {
          year: '2024',
          sector: 'Santé',
          incidents: [
            { date: '2024-Q1', target: 'CHU européens', type: 'Ransomware', impact: 'LockBit 3.0 campagne', source: 'CERT-EU' },
            { date: '2024-Q2', target: 'Recherche médicale', type: 'Espionnage', impact: 'APT40 campagne COVID', source: 'ANSSI' },
            { date: '2024-Q3', target: 'Supply chain santé', type: 'Compromission', impact: 'Éditeur SIH backdoor', source: 'HC3' }
          ],
          trends: [
            { trend: 'IOC spécialisés', description: 'Indicateurs ciblant spécifiquement santé', impact: 'Détection améliorée', examples: ['Hash malware santé', 'Domaines C2 sectoriels'] },
            { trend: 'Partage collaboratif', description: 'Échange TI entre établissements', impact: 'Défense collective', examples: ['CERT Santé', 'Réseaux régionaux'] },
            { trend: 'Automatisation TI', description: 'Intégration SIEM/SOAR', impact: 'Réponse accélérée', examples: ['MISP', 'STIX/TAXII'] }
          ],
          intelligence: [
            { source: 'CERT Santé', reliability: 'A', confidence: 'high', information: 'IOC LockBit 3.0 spécialisés santé disponibles', relevance: 5 },
            { source: 'ANSSI', reliability: 'A', confidence: 'high', information: 'Campagne APT40 recherche médicale confirmée', relevance: 4 },
            { source: 'HC3 US', reliability: 'B', confidence: 'medium', information: 'Backdoor éditeur SIH détecté 15 établissements', relevance: 5 }
          ]
        }
      },
      questions: [
        {
          id: 'q1_ti_sources_prioritization',
          question: 'Priorisez ces 8 sources de threat intelligence selon leur pertinence pour le CHU :',
          type: 'ranking',
          options: [
            'CERT Santé (France) - Spécialisé secteur, IOC validés, partage collaboratif',
            'ANSSI - Autorité nationale, incidents critiques, recommandations officielles',
            'HC3 (US Healthcare) - Expertise santé mondiale, incidents internationaux',
            'ENISA - Union européenne, tendances sectorielles, bonnes pratiques',
            'CrowdStrike - Commercial, threat hunting, intelligence premium',
            'MITRE ATT&CK - Framework public, techniques documentées, mapping',
            'VirusTotal - IOC communautaires, hash malware, domaines suspects',
            'Forums dark web - Intelligence brute, discussions criminelles, prix données'
          ],
          correctAnswer: [
            'CERT Santé (France) - Spécialisé secteur, IOC validés, partage collaboratif',
            'ANSSI - Autorité nationale, incidents critiques, recommandations officielles',
            'HC3 (US Healthcare) - Expertise santé mondiale, incidents internationaux',
            'ENISA - Union européenne, tendances sectorielles, bonnes pratiques',
            'MITRE ATT&CK - Framework public, techniques documentées, mapping',
            'CrowdStrike - Commercial, threat hunting, intelligence premium',
            'VirusTotal - IOC communautaires, hash malware, domaines suspects',
            'Forums dark web - Intelligence brute, discussions criminelles, prix données'
          ],
          explanation: `**Priorisation sources TI pour CHU :**

🥇 **CERT Santé** : Spécialisation sectorielle maximale
🥈 **ANSSI** : Autorité nationale de référence
🥉 **HC3** : Expertise santé internationale reconnue
🏅 **ENISA** : Perspective européenne sectorielle
🏅 **MITRE ATT&CK** : Framework technique standard
🏅 **CrowdStrike** : Intelligence commerciale premium
🏅 **VirusTotal** : IOC communautaires massifs
🏅 **Dark web** : Intelligence brute (expertise requise)

**Critères :** Spécialisation santé > Fiabilité > Pertinence géographique`,
          points: 25,
          hints: ['Priorisez la spécialisation santé', 'La fiabilité prime sur la quantité'],
          expertTips: ['CERT Santé est la référence sectorielle française', 'Combinez sources officielles et commerciales']
        },
        {
          id: 'q2_ioc_analysis',
          question: 'Analysez ces 6 IOC selon leur pertinence pour la détection CHU :',
          type: 'multiple_select',
          options: [
            'Hash SHA256: a1b2c3... (LockBit 3.0 variant santé, détecté 5 CHU)',
            'Domaine C2: health-update[.]com (APT40 campagne recherche médicale)',
            'IP: 192.168.1.100 (Adresse interne générique, non spécifique)',
            'Registry: HKLM\\Software\\HealthMalware (Persistance malware santé)',
            'Process: svchost.exe (Processus Windows légitime, faux positif probable)',
            'Network: TCP/443 vers health-data[.]ru (Exfiltration données patients)'
          ],
          correctAnswer: [
            'Hash SHA256: a1b2c3... (LockBit 3.0 variant santé, détecté 5 CHU)',
            'Domaine C2: health-update[.]com (APT40 campagne recherche médicale)',
            'Registry: HKLM\\Software\\HealthMalware (Persistance malware santé)',
            'Network: TCP/443 vers health-data[.]ru (Exfiltration données patients)'
          ],
          explanation: `**Analyse IOC pertinents CHU :**

✅ **PERTINENTS :**
- **Hash LockBit santé** : Spécifique secteur + confirmé 5 CHU
- **Domaine C2 APT40** : Campagne ciblée recherche médicale
- **Registry malware** : Indicateur technique spécialisé
- **Exfiltration réseau** : Pattern données patients

❌ **NON PERTINENTS :**
- **IP interne** : Générique, non spécifique menace
- **svchost.exe** : Processus légitime, faux positif

**Critères qualité IOC :** Spécificité + Contexte + Validation terrain`,
          points: 25,
          expertTips: ['Les IOC spécialisés santé sont plus fiables', 'Validez avec incidents terrain confirmés']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Recherche'],
        essentialAssets: [
          { id: 'sih_principal', name: 'SIH Principal', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'recherche_clinique', name: 'Recherche clinique', criticality: 'MAJEUR', attractiveness: 4 }
        ],
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI'],
        operationalConstraints: [
          { type: 'Spécialisation', description: 'Menaces santé spécifiques', impact: 'IOC génériques inefficaces', mitigation: 'Sources spécialisées' },
          { type: 'Partage', description: 'Collaboration CERT Santé', impact: 'Intelligence collective', mitigation: 'Plateforme MISP' },
          { type: 'Automatisation', description: 'Intégration SIEM', impact: 'Réponse temps réel', mitigation: 'STIX/TAXII' }
        ],
        ecosystem: [
          { name: 'CERT Santé', type: 'Partenaire TI', criticality: 'CRITIQUE', services: ['IOC', 'Alertes'], riskLevel: 2 },
          { name: 'ANSSI', type: 'Autorité', criticality: 'MAJEUR', services: ['Bulletins', 'Recommandations'], riskLevel: 1 },
          { name: 'Éditeurs sécurité', type: 'Fournisseur', criticality: 'MAJEUR', services: ['Intelligence premium'], riskLevel: 3 }
        ]
      },
      learningObjectives: [
        'Maîtriser la collecte et analyse de threat intelligence sectorielle',
        'Identifier les sources spécialisées santé prioritaires',
        'Analyser et valider les IOC sectoriels',
        'Structurer le partage collaboratif avec partenaires'
      ],
      realWorldExample: 'Mise en place TI collaborative CERT Santé (2023)',
      anssiCompliance: ['Guide threat intelligence ANSSI', 'Référentiel partage IOC']
    };
  }

  // 🏛️ EXERCICE 5 - SIMULATION COMITÉ THREAT INTELLIGENCE (25 MIN, 120 PTS)
  static getExercise5_GovernanceSimulation(): RiskSourceExercise {
    return {
      id: 'exercise_5_governance_simulation',
      title: 'Simulation Comité Threat Intelligence',
      description: 'Maîtriser la présentation et validation des sources de risque en comité',
      type: 'governance_simulation',
      difficulty: 'expert',
      duration: 25,
      points: 120,
      category: 'Gouvernance TI',
      scenario: {
        id: 'chu_ti_committee',
        title: 'Comité mensuel threat intelligence CHU avec 6 participants',
        description: 'Présenter l\'analyse des sources de risque et gérer une alerte critique en temps réel',
        context: `Situation : Comité mensuel TI + Alerte critique en cours de réunion.
        Enjeu : Présenter l'analyse sources + Gérer crise en temps réel.`,
        constraints: [
          'Comité multidisciplinaire avec niveaux techniques variés',
          'Alerte critique LockBit 4.0 pendant la réunion',
          'Décisions rapides requises sous pression',
          'Communication adaptée par interlocuteur'
        ],
        stakeholders: [
          'RSSI (pilotage threat intelligence)',
          'DSI (impact technique)',
          'Directeur Médical (impact opérationnel)',
          'Directeur Qualité (conformité réglementaire)',
          'Chef projet sécurité (mise en œuvre)',
          'Représentant CERT Santé (coordination externe)'
        ],
        expectedOutcome: 'Décisions validées + Plan de réponse activé',
        threatLandscape: {
          year: '2024',
          sector: 'Santé',
          incidents: [
            { date: '2024-12-15 14:30', target: 'CHU européens', type: 'Ransomware', impact: 'LockBit 4.0 nouvelle campagne', source: 'CERT-EU FLASH' },
            { date: '2024-12-15 14:45', target: 'CHU Bordeaux', type: 'Compromission', impact: 'SIH chiffré, urgences fermées', source: 'CERT Santé URGENT' },
            { date: '2024-12-15 15:00', target: 'Votre CHU', type: 'Tentative', impact: 'IOC détectés, attaque en cours', source: 'SOC interne' }
          ],
          trends: [
            { trend: 'LockBit 4.0', description: 'Nouvelle version plus agressive', impact: 'Chiffrement + destruction sauvegardes', examples: ['Techniques anti-forensic', 'Propagation accélérée'] },
            { trend: 'Ciblage coordonné', description: 'Attaques simultanées multiples CHU', impact: 'Saturation capacités réponse', examples: ['5 CHU touchés en 2h', 'CERT Santé débordé'] },
            { trend: 'Exploitation 0-day', description: 'Vulnérabilité SIH inconnue', impact: 'Défenses contournées', examples: ['Patch non disponible', 'Mitigation complexe'] }
          ],
          intelligence: [
            { source: 'CERT Santé', reliability: 'A', confidence: 'high', information: 'LockBit 4.0 campagne active, 5 CHU touchés', relevance: 5 },
            { source: 'SOC interne', reliability: 'A', confidence: 'high', information: 'IOC LockBit détectés sur réseau CHU', relevance: 5 },
            { source: 'CERT-EU', reliability: 'A', confidence: 'medium', information: 'Vulnérabilité 0-day SIH exploitée', relevance: 5 }
          ]
        }
      },
      questions: [
        {
          id: 'q1_crisis_briefing',
          question: 'Structurez votre briefing de crise (5 minutes) pour le comité :',
          type: 'scenario_analysis',
          correctAnswer: {
            'Situation (1 min)': 'LockBit 4.0 campagne active, 5 CHU touchés, IOC détectés chez nous',
            'Impact (1 min)': 'Risque paralysie SIH, fermeture urgences, vies en jeu',
            'Actions (2 min)': 'Isolement préventif, activation PCA, coordination CERT',
            'Décisions (1 min)': 'Validation mesures d\'urgence, communication de crise'
          },
          explanation: `**Structure briefing de crise optimale :**

⏱️ **1 min - SITUATION** : Faits essentiels sans détails techniques
⚠️ **1 min - IMPACT** : Conséquences métier concrètes
🛡️ **2 min - ACTIONS** : Mesures prises et en cours
✅ **1 min - DÉCISIONS** : Validations requises du comité

**Clé du succès :** Clarté + Concision + Orientation action`,
          points: 35,
          hints: ['Restez factuel et concis', 'Focalisez sur les décisions à prendre'],
          expertTips: ['En crise, la clarté prime sur l\'exhaustivité', 'Préparez les décisions, pas les explications']
        },
        {
          id: 'q2_stakeholder_management',
          question: 'Le Directeur Médical interrompt : "Faut-il fermer les urgences maintenant ?" Comment répondez-vous ?',
          type: 'scenario_analysis',
          options: [
            'Réponse technique : "Les IOC ne confirment pas encore une compromission"',
            'Réponse prudente : "Par précaution, je recommande la fermeture immédiate"',
            'Réponse équilibrée : "Isolement préventif en cours, décision dans 30 minutes"',
            'Réponse déléguée : "C\'est votre décision médicale, nous vous assistons"',
            'Réponse procédurale : "Le plan de crise prévoit cette situation, appliquons-le"'
          ],
          correctAnswer: ['Réponse équilibrée : "Isolement préventif en cours, décision dans 30 minutes"'],
          explanation: `**Gestion optimale de la pression décisionnelle :**

✅ **Réponse équilibrée** : Mesures immédiates + délai raisonnable
- Montre l'action en cours (isolement)
- Donne un délai précis (30 min)
- Évite décision précipitée sous stress

❌ **Autres approches :**
- **Technique** : Trop complexe en crise
- **Prudente** : Peut être excessive
- **Déléguée** : Évite la responsabilité
- **Procédurale** : Rigide, non adaptée

**Principe :** Action immédiate + Évaluation rapide + Décision éclairée`,
          points: 40,
          expertTips: ['En crise, équilibrez prudence et continuité', 'Donnez des délais précis pour rassurer']
        }
      ],
      context: {
        hospitalType: 'CHU Métropolitain',
        bedCount: 1200,
        sites: 3,
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie'],
        essentialAssets: [
          { id: 'urgences_vitales', name: 'Urgences vitales', criticality: 'CRITIQUE', attractiveness: 5 },
          { id: 'sih_principal', name: 'SIH Principal', criticality: 'CRITIQUE', attractiveness: 5 }
        ],
        securityMaturity: 3,
        regulatoryRequirements: ['HDS', 'RGPD', 'HAS', 'ANSSI'],
        operationalConstraints: [
          { type: 'Crise temps réel', description: 'Décisions sous pression', impact: 'Stress décisionnel', mitigation: 'Procédures claires' },
          { type: 'Multidisciplinaire', description: 'Niveaux techniques variés', impact: 'Communication complexe', mitigation: 'Adaptation discours' },
          { type: 'Vies en jeu', description: 'Enjeux vitaux', impact: 'Pression maximale', mitigation: 'Sang-froid professionnel' }
        ],
        ecosystem: [
          { name: 'CERT Santé', type: 'Partenaire crise', criticality: 'CRITIQUE', services: ['Coordination', 'Intelligence'], riskLevel: 2 },
          { name: 'Comité direction', type: 'Gouvernance', criticality: 'CRITIQUE', services: ['Décisions stratégiques'], riskLevel: 1 }
        ]
      },
      learningObjectives: [
        'Maîtriser la présentation en comité multidisciplinaire',
        'Gérer une crise de sécurité en temps réel',
        'Adapter la communication par type d\'interlocuteur',
        'Prendre des décisions rapides sous pression'
      ],
      realWorldExample: 'Gestion crise LockBit CHU Bordeaux (2024)',
      anssiCompliance: ['Guide gestion de crise ANSSI', 'Procédures d\'urgence secteur santé']
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllExercises(): RiskSourceExercise[] {
    return [
      this.getExercise1_ExternalSources(),
      this.getExercise2_InternalThreats(),
      this.getExercise3_SupplyChain(),
      this.getExercise4_ThreatIntelligence(),
      this.getExercise5_GovernanceSimulation()
    ];
  }

  static getExerciseById(exerciseId: string): RiskSourceExercise | undefined {
    return this.getAllExercises().find(ex => ex.id === exerciseId);
  }

  static getExercisesByDifficulty(difficulty: 'intermediate' | 'advanced' | 'expert'): RiskSourceExercise[] {
    return this.getAllExercises().filter(ex => ex.difficulty === difficulty);
  }

  static getTotalDuration(): number {
    return this.getAllExercises().reduce((total, ex) => total + ex.duration, 0);
  }

  static getTotalPoints(): number {
    return this.getAllExercises().reduce((total, ex) => total + ex.points, 0);
  }
}
