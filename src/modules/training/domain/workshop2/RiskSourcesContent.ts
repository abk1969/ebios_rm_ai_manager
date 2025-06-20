/**
 * 🎯 CONTENU DÉTAILLÉ ATELIER 2 - SOURCES DE RISQUE
 * Contenu spécialisé pour l'identification et l'analyse des sources de risque CHU
 */

// 🎯 TYPES POUR LE CONTENU ATELIER 2
export interface RiskSourceStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'validation';
  duration: number;
  content: string;
  learningObjectives: string[];
  keyPoints: string[];
  examples: ThreatExample[];
  threatIntelligence: ThreatIntelligenceData[];
  exercises?: RiskSourceExercise[];
  completed: boolean;
}

export interface ThreatExample {
  title: string;
  description: string;
  context: string;
  outcome: string;
  lessons: string[];
  threatActors: string[];
  techniques: string[];
  impact: string;
}

export interface ThreatIntelligenceData {
  source: string;
  reliability: 'A' | 'B' | 'C' | 'D';
  confidence: 'high' | 'medium' | 'low';
  information: string;
  relevance: number; // 1-5
  date: string;
  ioc: string[];
}

export interface RiskSourceExercise {
  id: string;
  question: string;
  type: 'external_identification' | 'internal_analysis' | 'supply_chain_assessment' | 'threat_intelligence';
  options?: string[];
  correctAnswer?: any;
  explanation: string;
  points: number;
}

/**
 * 🎯 CLASSE PRINCIPALE DU CONTENU ATELIER 2
 */
export class RiskSourcesContent {
  
  // 📋 MODULE 2.1 - IDENTIFICATION DES SOURCES EXTERNES (30 MINUTES)
  static getModule2_1_ExternalSources(): RiskSourceStep {
    return {
      id: 'module_2_1_external_sources',
      title: 'Identification des Sources Externes',
      description: 'Maîtriser l\'identification des sources de risque externes spécialisées santé',
      type: 'theory',
      duration: 30,
      content: `
# 🌐 IDENTIFICATION DES SOURCES EXTERNES CHU

## 📋 OBJECTIFS D'APPRENTISSAGE
- Identifier les sources externes spécifiques au secteur santé
- Analyser les motivations des attaquants ciblant les hôpitaux
- Évaluer les capacités techniques et organisationnelles requises
- Prioriser les sources selon la menace pour le CHU

## 🔍 1. CYBERCRIMINELS SPÉCIALISÉS SANTÉ

### Groupes ransomware hospitaliers
**🦠 LockBit 3.0 et successeurs :**
- **Spécialisation** : Infrastructures critiques santé
- **Tactiques** : Double extorsion + destruction sauvegardes
- **Rançons** : 1M€-10M€ selon taille établissement
- **Historique** : 40% attaques hôpitaux 2024

**🦠 Conti successeurs (Karakurt, BlackByte) :**
- **Spécialisation** : Expertise secteur santé acquise
- **Tactiques** : Reconnaissance longue + mouvement latéral
- **Rançons** : 500k€-5M€ + menace publication
- **Historique** : Évolution post-démantèlement Conti

**🦠 BlackCat/ALPHV :**
- **Spécialisation** : Ransomware-as-a-Service santé
- **Tactiques** : Techniques d'évasion avancées
- **Rançons** : 2M€-15M€ + leak sites dédiés
- **Historique** : Croissance 300% en 2024

### Trafiquants de données médicales
**💰 Marché noir données santé :**
- **Prix** : 50€-1000€/dossier selon complétude
- **Demande** : Fraude assurance, usurpation identité
- **Volume** : 500M+ dossiers échangés/an
- **Plateformes** : Dark web, forums spécialisés

**💰 Techniques d'exfiltration :**
- **Accès privilégié** : Corruption personnel interne
- **Exploitation vulnérabilités** : Systèmes médicaux non patchés
- **Ingénierie sociale** : Ciblage personnel soignant
- **Supply chain** : Compromission fournisseurs

## 🌍 2. MENACES ÉTATIQUES ET GÉOPOLITIQUES

### Espionnage recherche médicale
**🇨🇳 Chine (APT1, APT40, APT41) :**
- **Cibles** : Recherche vaccins, traitements innovants
- **Méthodes** : Spear phishing, supply chain attacks
- **Objectifs** : Transfert technologique, avantage économique
- **Exemples** : Vol recherche COVID-19 (2020-2024)

**🇷🇺 Russie (APT28, APT29, Sandworm) :**
- **Cibles** : Infrastructures santé occidentales
- **Méthodes** : Malware sophistiqué, living off the land
- **Objectifs** : Déstabilisation, préparation cyberguerre
- **Exemples** : Attaques hôpitaux ukrainiens (2022-2024)

**🇰🇵 Corée du Nord (Lazarus, APT38) :**
- **Cibles** : Laboratoires pharmaceutiques, recherche
- **Méthodes** : Ransomware, vol cryptomonnaies
- **Objectifs** : Financement programme nucléaire
- **Exemples** : WannaCry impact hôpitaux (2017)

### Déstabilisation systèmes santé
**🎯 Objectifs stratégiques :**
- **Affaiblissement moral** populations civiles
- **Test résilience** infrastructures critiques
- **Démonstration capacités** cyber offensives
- **Préparation conflits** futurs (cyber warfare)

**🎯 Techniques privilégiées :**
- **Attaques coordonnées** multi-sites simultanées
- **Compromission long terme** (APT persistantes)
- **Sabotage équipements** médicaux connectés
- **Désinformation** santé publique

## 🏭 3. MENACES ÉCOSYSTÈME SANTÉ

### Fournisseurs équipements biomédicaux
**⚕️ Vulnérabilités matérielles :**
- **Firmware non sécurisé** : IoT médical vulnérable
- **Protocoles non chiffrés** : Communications interceptables
- **Mots de passe par défaut** : Accès non autorisés
- **Mises à jour inexistantes** : Vulnérabilités persistantes

**⚕️ Équipements à risque :**
- **Scanners et IRM** : Connectés réseau, données sensibles
- **Pompes à perfusion** : Protocoles non sécurisés
- **Moniteurs patients** : Données temps réel critiques
- **Systèmes imagerie** : Stockage local non chiffré

### Laboratoires partenaires
**🔬 Risques d'interconnexion :**
- **Échange résultats** non sécurisés (HL7, FHIR)
- **Accès bidirectionnel** systèmes CHU
- **Partage identifiants** patients communs
- **Synchronisation** bases données temps réel

**🔬 Vecteurs de compromission :**
- **Attaque laboratoire** → propagation CHU
- **Interception communications** (MITM)
- **Corruption données** échangées
- **Déni de service** analyses urgentes

## 💰 MOTIVATIONS SPÉCIFIQUES SANTÉ

### Motivations financières
**💸 Rançonnage hospitalier :**
- **Montants** : 100k€-10M€ selon taille
- **Urgence** : Vies en jeu = pression maximale
- **Récurrence** : Hôpitaux cibles privilégiées
- **Impact** : Arrêt activité = 1.2M€/jour

**💸 Fraude données santé :**
- **Revente dossiers** : 50-1000€/dossier complet
- **Usurpation identité** : Faux remboursements
- **Trafic médicaments** : Prescriptions frauduleuses
- **Chantage patients** : Données sensibles (VIH, psychiatrie)

### Motivations idéologiques
**⚡ Hacktivisme santé :**
- **Protestation système** santé (privatisation)
- **Défense droits** patients (confidentialité)
- **Lutte laboratoires** pharmaceutiques (prix)
- **Revendications** personnels santé (conditions)

**⚡ Terrorisme cyber :**
- **Impact psychologique** maximal (vies en jeu)
- **Déstabilisation confiance** système santé
- **Propagande** anti-occidentale (cibles symboliques)
- **Démonstration capacités** (effet d'annonce)

## 🎯 PRIORISATION DES SOURCES

### Matrice de menace CHU
**Score = Motivation × Capacité × Opportunité**

**🔴 PRIORITÉ 1 (Score 18-20) :**
- Cybercriminels spécialisés santé
- États étrangers (espionnage/déstabilisation)
- Menaces internes privilégiées

**🟠 PRIORITÉ 2 (Score 14-17) :**
- Hacktivistes sectoriels santé
- Concurrents économiques
- Prestataires externes critiques

**🟡 PRIORITÉ 3 (Score 10-13) :**
- Script kiddies opportunistes
- Curieux et voyeurs
- Erreurs involontaires

### Facteurs d'attractivité CHU
**🎯 Facteurs aggravants :**
- **Données sensibles** : 500k dossiers patients
- **Criticité vitale** : Vies en jeu, pression paiement
- **Interconnexions** : 25 partenaires, propagation
- **Visibilité** : CHU = cible symbolique
- **Vulnérabilités** : Legacy systems, sous-effectifs IT
      `,
      learningObjectives: [
        'Identifier les sources externes spécialisées secteur santé',
        'Analyser les motivations des attaquants ciblant les hôpitaux',
        'Évaluer les capacités techniques et organisationnelles requises',
        'Prioriser les sources selon la menace pour le CHU'
      ],
      keyPoints: [
        'Les groupes spécialisés santé sont plus dangereux que les généralistes',
        'Les motivations financières dominent (rançons, données)',
        'Les États ciblent la recherche médicale stratégique',
        'L\'écosystème santé multiplie les vecteurs d\'attaque'
      ],
      examples: [
        {
          title: 'LockBit 3.0 - Campagne CHU européens Q1 2024',
          description: 'Attaques coordonnées contre 15 CHU en 48h',
          context: 'Exploitation vulnérabilité 0-day SIH + techniques d\'évasion',
          outcome: '5 CHU paralysés, 2 semaines récupération, 50M€ dommages',
          lessons: [
            'Spécialisation sectorielle = efficacité accrue',
            'Coordination temporelle = saturation défenses',
            'Double extorsion = pression maximale'
          ],
          threatActors: ['LockBit 3.0', 'Affiliés spécialisés santé'],
          techniques: ['T1566 Phishing', 'T1055 Process Injection', 'T1486 Data Encrypted'],
          impact: 'CRITIQUE - Vies en jeu, paralysie complète'
        },
        {
          title: 'APT40 - Espionnage recherche COVID-19 (2020-2024)',
          description: 'Campagne persistante contre laboratoires recherche',
          context: 'Ciblage recherche vaccins et traitements innovants',
          outcome: 'Vol propriété intellectuelle, avantage concurrentiel Chine',
          lessons: [
            'Persistance long terme (4 ans) difficile à détecter',
            'Recherche médicale = cible géopolitique',
            'Techniques APT sophistiquées vs défenses santé'
          ],
          threatActors: ['APT40', 'MSS chinois'],
          techniques: ['T1566 Spear Phishing', 'T1078 Valid Accounts', 'T1041 Exfiltration'],
          impact: 'MAJEUR - Perte avantage concurrentiel'
        }
      ],
      threatIntelligence: [
        {
          source: 'CERT Santé',
          reliability: 'A',
          confidence: 'high',
          information: '70% hôpitaux français ciblés par ransomware en 2024',
          relevance: 5,
          date: '2024-12-01',
          ioc: ['lockbit3.onion', 'SHA256:a1b2c3d4...']
        },
        {
          source: 'ANSSI',
          reliability: 'A',
          confidence: 'high',
          information: 'APT40 campagnes actives contre recherche médicale française',
          relevance: 4,
          date: '2024-11-15',
          ioc: ['health-update.com', 'IP:203.78.45.12']
        },
        {
          source: 'HC3 US',
          reliability: 'B',
          confidence: 'medium',
          information: 'Trafic données santé +300% sur dark web',
          relevance: 5,
          date: '2024-10-30',
          ioc: ['health-market.onion', 'patient-data.ru']
        }
      ],
      exercises: [
        {
          id: 'exercise_external_profiling',
          question: 'Quel groupe cybercriminel présente la plus haute menace pour le CHU ?',
          type: 'external_identification',
          options: [
            'LockBit 3.0 - Spécialisé infrastructures critiques',
            'Script kiddies - Attaques opportunistes',
            'APT40 - Espionnage recherche médicale',
            'Hacktivistes - Protestation système santé'
          ],
          correctAnswer: 'LockBit 3.0 - Spécialisé infrastructures critiques',
          explanation: 'LockBit 3.0 combine spécialisation santé, capacités techniques élevées et motivation financière forte.',
          points: 25
        }
      ],
      completed: false
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllModules(): RiskSourceStep[] {
    return [
      this.getModule2_1_ExternalSources()
      // Les autres modules seront ajoutés
    ];
  }

  static getModuleById(moduleId: string): RiskSourceStep | undefined {
    return this.getAllModules().find(module => module.id === moduleId);
  }

  static getTotalDuration(): number {
    return this.getAllModules().reduce((total, module) => total + module.duration, 0);
  }

  static getThreatIntelligenceByRelevance(minRelevance: number = 3): ThreatIntelligenceData[] {
    return this.getAllModules()
      .flatMap(module => module.threatIntelligence)
      .filter(ti => ti.relevance >= minRelevance)
      .sort((a, b) => b.relevance - a.relevance);
  }

  static getExamplesByImpact(impact: string): ThreatExample[] {
    return this.getAllModules()
      .flatMap(module => module.examples)
      .filter(example => example.impact.includes(impact));
  }
}
