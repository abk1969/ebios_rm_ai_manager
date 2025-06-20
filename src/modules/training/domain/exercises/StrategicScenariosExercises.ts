/**
 * 🎯 EXERCICES PRATIQUES CONSTRUCTION SCÉNARIOS STRATÉGIQUES
 * Exercices spécialisés pour maîtriser la construction de scénarios stratégiques CHU
 */

// 🎯 TYPES POUR LES EXERCICES SCÉNARIOS STRATÉGIQUES
export interface StrategicScenarioExercise {
  id: string;
  title: string;
  category: 'guided_construction' | 'combination_matrix' | 'likelihood_assessment' | 'risk_mapping' | 'role_playing';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // minutes
  description: string;
  context: string;
  questions: ScenarioQuestion[];
  realWorldExample?: string;
  learningObjectives: string[];
  anssiCompliance: string[];
  tools?: ExerciseTool[];
}

export interface ScenarioQuestion {
  id: string;
  type: 'scenario_construction' | 'matrix_evaluation' | 'likelihood_factors' | 'impact_assessment' | 'risk_positioning' | 'role_simulation';
  question: string;
  context?: string;
  options?: string[];
  correctAnswers?: number[];
  matrixData?: MatrixData;
  scenarioTemplate?: ScenarioTemplate;
  roleplaySetup?: RoleplaySetup;
  explanation: string;
  points: number;
  expertInsight?: string;
  anssiReference?: string;
  hints?: string[];
}

export interface MatrixData {
  sources: string[];
  assets: string[];
  combinations: CombinationScore[];
}

export interface CombinationScore {
  sourceIndex: number;
  assetIndex: number;
  relevance: number; // 1-5
  justification: string;
}

export interface ScenarioTemplate {
  source: string;
  asset: string;
  event: string;
  likelihood?: number;
  impact?: number;
}

export interface RoleplaySetup {
  roles: Role[];
  scenario: string;
  objectives: string[];
  constraints: string[];
  duration: number;
}

export interface Role {
  name: string;
  description: string;
  objectives: string[];
  constraints: string[];
}

export interface ExerciseTool {
  name: string;
  description: string;
  usage: string;
}

export interface ExerciseResult {
  exerciseId: string;
  questionId: string;
  userAnswer: any;
  isCorrect: boolean;
  pointsEarned: number;
  feedback: string;
  improvementSuggestions: string[];
}

/**
 * 🎓 GÉNÉRATEUR D'EXERCICES SCÉNARIOS STRATÉGIQUES
 */
export class StrategicScenariosExercises {

  // 🎯 EXERCICE 1 - CONSTRUCTION GUIDÉE
  static getExercise1_GuidedConstruction(): StrategicScenarioExercise {
    return {
      id: 'sse_001_guided_construction',
      title: 'Construction guidée de scénario stratégique',
      category: 'guided_construction',
      difficulty: 'intermediate',
      duration: 25,
      description: 'Apprenez à construire votre premier scénario stratégique CHU étape par étape',
      context: `Vous êtes RSSI du CHU Métropolitain et devez construire un scénario stratégique pour l'analyse de risques.

                **Contexte CHU rappel :**
                - 3 sites hospitaliers interconnectés
                - 3500 employés (médecins, infirmiers, administratifs, IT)
                - Budget annuel : 450M€
                - 50 000 patients/an, données sensibles
                - Recherche clinique active (biobanque, essais)
                - Systèmes critiques : SIH, PACS, urgences 24h/24`,
      questions: [
        {
          id: 'q1_source_selection',
          type: 'scenario_construction',
          question: 'Étape 1 : Sélectionnez la source de risque la plus pertinente pour un scénario prioritaire CHU',
          options: [
            'Cybercriminel généraliste (motivation financière)',
            'Cybercriminel spécialisé santé (Conti Healthcare, LockBit Medical)',
            'Hacktiviste écologiste (protestation pollution)',
            'Script kiddie amateur (défacement site web)',
            'Concurrent commercial direct (autre CHU)'
          ],
          correctAnswers: [1],
          explanation: `**Cybercriminel spécialisé santé** est le choix optimal car :

                       ✅ **Spécialisation secteur** : Groupes comme Conti Healthcare maîtrisent les spécificités hospitalières
                       ✅ **Motivation alignée** : ROI maximal sur hôpitaux (criticité vitale = pression paiement)
                       ✅ **Capacités adaptées** : Techniques spécifiques (évasion EDR médicaux, négociation secteur)
                       ✅ **Précédents nombreux** : 1 hôpital attaqué/semaine en France (2023)
                       ✅ **Impact maximal** : Vies en jeu = levier d'extorsion parfait

                       Les autres sources sont moins pertinentes :
                       ❌ Généraliste : Techniques non adaptées au secteur
                       ❌ Hacktiviste : Motivation non alignée avec CHU
                       ❌ Script kiddie : Capacités insuffisantes
                       ❌ Concurrent : Motivation commerciale faible`,
          points: 20,
          expertInsight: 'La spécialisation sectorielle des cybercriminels est devenue un facteur clé de réussite des attaques.',
          anssiReference: 'Guide ANSSI - Menaces sur les systèmes d\'information de santé'
        },
        {
          id: 'q2_asset_selection',
          type: 'scenario_construction',
          question: 'Étape 2 : Choisissez le bien essentiel le plus attractif pour cette source',
          context: 'Source sélectionnée : Cybercriminel spécialisé santé',
          options: [
            'Site web institutionnel CHU (vitrine publique)',
            'Système de gestion RH (paies, congés)',
            'Urgences vitales + SIH principal (cœur métier)',
            'Système de facturation (revenus)',
            'Réseau WiFi invités (accès public)'
          ],
          correctAnswers: [2],
          explanation: `**Urgences vitales + SIH principal** est la cible optimale car :

                       ✅ **Criticité maximale** : Vies en jeu 24h/24
                       ✅ **Impossibilité d'attendre** : Pression temporelle énorme
                       ✅ **Point unique défaillance** : SIH = paralysie globale
                       ✅ **Cascade d'impact** : Tous services dépendants
                       ✅ **Levier d'extorsion parfait** : Urgence vitale = paiement rapide

                       **Logique cybercriminel :**
                       - Urgences = impossibilité de négocier longtemps
                       - SIH = amplificateur d'impact (cascade)
                       - Vies en jeu = pression psychologique maximale
                       - Budget CHU (450M€) = capacité de paiement

                       Les autres biens sont moins attractifs pour l'extorsion :
                       ❌ Site web : Impact faible, contournement facile
                       ❌ RH : Impact modéré, non vital
                       ❌ Facturation : Impact financier mais non vital
                       ❌ WiFi invités : Vecteur d'accès seulement`,
          points: 25,
          expertInsight: 'Les cybercriminels ciblent systématiquement les biens dont l\'arrêt est intolérable pour maximiser la pression.',
          anssiReference: 'EBIOS RM - Identification des biens essentiels'
        },
        {
          id: 'q3_event_definition',
          type: 'scenario_construction',
          question: 'Étape 3 : Définissez l\'événement redouté correspondant',
          context: 'Source : Cybercriminel spécialisé santé\nBien : Urgences vitales + SIH principal',
          scenarioTemplate: {
            source: 'Cybercriminel spécialisé santé',
            asset: 'Urgences vitales + SIH principal',
            event: ''
          },
          explanation: `**Événement redouté optimal :** "Arrêt des urgences vitales par paralysie du SIH"

                       **Justification de cohérence :**

                       🎭 **Source → Événement :**
                       - Cybercriminel → Paralysie = Objectif d'extorsion
                       - Spécialisation santé → Techniques adaptées SIH
                       - Motivation financière → Événement = levier paiement

                       🎯 **Bien → Événement :**
                       - Urgences vitales → Arrêt = Impact maximal
                       - SIH principal → Paralysie = Conséquence technique
                       - Criticité CRITIQUE → Événement CRITIQUE

                       **Caractéristiques événement :**
                       - **Nature** : Disponibilité (chiffrement/paralysie)
                       - **Gravité** : CRITIQUE (vies en danger)
                       - **Durée** : 3-15 jours (temps négociation + restauration)
                       - **Périmètre** : Global CHU (cascade services)

                       **Impact détaillé :**
                       - Transfert patients vers autres hôpitaux
                       - Retour au papier (ralentissement 300%)
                       - Stress maximal équipes médicales
                       - Risque vital pour patients complexes
                       - Coût : 5-15M€ (rançon + pertes + récupération)`,
          points: 30,
          expertInsight: 'L\'événement redouté doit être la conséquence logique de l\'action de la source sur le bien.',
          anssiReference: 'EBIOS RM - Définition des événements redoutés'
        },
        {
          id: 'q4_likelihood_assessment',
          type: 'likelihood_factors',
          question: 'Étape 4 : Évaluez la vraisemblance de ce scénario (1-5)',
          context: 'Scénario : Cybercriminel spécialisé santé → Urgences vitales + SIH → Arrêt urgences',
          explanation: `**Vraisemblance : 5/5 (Très forte)**

                       **Facteurs d'évaluation :**

                       **1. Motivation source (5/5) :**
                       - ROI maximal : Hôpitaux = cibles les plus rentables
                       - Pression temporelle : Vies en jeu = paiement rapide
                       - Capacité paiement : Budget CHU 450M€
                       - Précédents : 1 hôpital/semaine attaqué en France

                       **2. Capacités techniques (5/5) :**
                       - Groupes spécialisés : Conti Healthcare, LockBit Medical
                       - Techniques adaptées : Évasion EDR médicaux
                       - Négociateurs formés : Vocabulaire médical
                       - Support 24h/24 : Pendant négociations

                       **3. Opportunités CHU (5/5) :**
                       - Vulnérabilités nombreuses : Pas de MFA, EDR absent
                       - Surface d'attaque : 3 sites interconnectés
                       - Personnel non formé : Phishing efficace
                       - Systèmes legacy : Patches manquants

                       **4. Contraintes faibles (5/5) :**
                       - Éthique relative : Épargne réanimation mais chiffre SIH
                       - Risques limités : Anonymat géographique
                       - Sanctions faibles : Poursuites difficiles

                       **Précédents confirmant :**
                       - CHU de Rouen (2019) : Ryuk, 6000 postes
                       - CHU de Düsseldorf (2020) : Premier décès cyber
                       - Tendance 2023 : +300% attaques hôpitaux`,
          points: 25,
          expertInsight: 'La vraisemblance très forte se justifie par la convergence de tous les facteurs favorables.',
          anssiReference: 'EBIOS RM - Grille d\'évaluation de la vraisemblance'
        }
      ],
      realWorldExample: `Cas réel : CHU de Rouen (novembre 2019)
                        - Ransomware Ryuk déployé via phishing
                        - 6000 postes chiffrés en quelques heures
                        - Retour au papier pendant 3 semaines
                        - Coût total : 10M€ (récupération + pertes)
                        - Aucune rançon payée, restauration complète`,
      learningObjectives: [
        'Maîtriser la construction étape par étape d\'un scénario stratégique',
        'Comprendre la logique Source → Bien → Événement',
        'Évaluer la vraisemblance selon les facteurs ANSSI',
        'Appliquer la méthodologie au contexte hospitalier spécifique'
      ],
      anssiCompliance: [
        'EBIOS RM - Construction des scénarios stratégiques',
        'Guide ANSSI - Évaluation de la vraisemblance',
        'Méthodologie officielle - Cohérence des scénarios'
      ],
      tools: [
        {
          name: 'Matrice Source × Bien',
          description: 'Outil de combinaison systématique',
          usage: 'Évaluer toutes les combinaisons possibles'
        },
        {
          name: 'Grille de vraisemblance ANSSI',
          description: 'Échelle officielle 1-5',
          usage: 'Évaluation standardisée des scénarios'
        }
      ]
    };
  }

  // 🎯 EXERCICE 2 - MATRICE DE COMBINAISONS
  static getExercise2_CombinationMatrix(): StrategicScenarioExercise {
    return {
      id: 'sse_002_combination_matrix',
      title: 'Matrice de combinaisons Sources × Biens essentiels',
      category: 'combination_matrix',
      difficulty: 'advanced',
      duration: 20,
      description: 'Évaluez systématiquement toutes les combinaisons possibles pour identifier les scénarios prioritaires',
      context: `Vous devez évaluer la pertinence de toutes les combinaisons Sources × Biens essentiels du CHU.

                **Sources identifiées (Atelier 2) :**
                - 🥇 Cybercriminels spécialisés santé (Score 20/20)
                - 🥈 Initiés malveillants (Score 16/20)
                - 🥉 Espions industriels (Score 14/20)

                **Biens essentiels (Atelier 1) :**
                - Urgences vitales (CRITIQUE)
                - Données patients (CRITIQUE)
                - Recherche clinique (MAJEUR)
                - Bloc opératoire (CRITIQUE)`,
      questions: [
        {
          id: 'q1_matrix_evaluation',
          type: 'matrix_evaluation',
          question: 'Évaluez la pertinence de chaque combinaison (1-5 étoiles)',
          matrixData: {
            sources: ['Cybercriminels spécialisés', 'Initiés malveillants', 'Espions industriels'],
            assets: ['Urgences vitales', 'Données patients', 'Recherche clinique', 'Bloc opératoire'],
            combinations: [
              // Cybercriminels
              { sourceIndex: 0, assetIndex: 0, relevance: 5, justification: 'Pression temporelle maximale, ROI extorsion optimal' },
              { sourceIndex: 0, assetIndex: 1, relevance: 4, justification: 'Double extorsion possible, valeur marché noir' },
              { sourceIndex: 0, assetIndex: 2, relevance: 3, justification: 'Valeur modérée, pas de pression temporelle' },
              { sourceIndex: 0, assetIndex: 3, relevance: 4, justification: 'Criticité élevée, interventions vitales' },
              // Initiés
              { sourceIndex: 1, assetIndex: 0, relevance: 4, justification: 'Accès privilégié, mais détection risquée' },
              { sourceIndex: 1, assetIndex: 1, relevance: 5, justification: 'Accès direct bases, contournement sécurités' },
              { sourceIndex: 1, assetIndex: 2, relevance: 3, justification: 'Accès possible mais intérêt limité' },
              { sourceIndex: 1, assetIndex: 3, relevance: 3, justification: 'Accès physique requis, risques élevés' },
              // Espions
              { sourceIndex: 2, assetIndex: 0, relevance: 2, justification: 'Pas d\'intérêt stratégique pour espionnage' },
              { sourceIndex: 2, assetIndex: 1, relevance: 3, justification: 'Données sensibles mais non stratégiques' },
              { sourceIndex: 2, assetIndex: 2, relevance: 5, justification: 'Propriété intellectuelle, avantage concurrentiel' },
              { sourceIndex: 2, assetIndex: 3, relevance: 1, justification: 'Aucun intérêt pour espionnage industriel' }
            ]
          },
          explanation: `**Matrice de pertinence Sources × Biens :**

                       | Source \\\\ Bien | Urgences | Données | Recherche | Bloc |
                       |----------------|----------|---------|-----------|------|
                       | **Cybercriminels** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
                       | **Initiés** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
                       | **Espions** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |

                       **Justifications détaillées :**

                       **🥇 Cybercriminels → Urgences (⭐⭐⭐⭐⭐) :**
                       - Pression temporelle maximale (vies en jeu)
                       - Impossibilité d'attendre = paiement rapide
                       - ROI extorsion optimal
                       - Précédents nombreux (1 hôpital/semaine)

                       **🥈 Initiés → Données (⭐⭐⭐⭐⭐) :**
                       - Accès privilégié direct aux bases
                       - Contournement sécurités facilité
                       - Connaissance intime des systèmes
                       - Détection difficile (surveillance interne faible)

                       **🥉 Espions → Recherche (⭐⭐⭐⭐⭐) :**
                       - Propriété intellectuelle précieuse
                       - Avantage concurrentiel énorme
                       - Données uniques (biobanque, essais)
                       - ROI espionnage industriel maximal`,
          points: 40,
          expertInsight: 'La matrice révèle que chaque source a une cible privilégiée selon ses motivations spécifiques.',
          anssiReference: 'EBIOS RM - Matrice de pertinence des scénarios'
        },
        {
          id: 'q2_top_scenarios',
          type: 'scenario_construction',
          question: 'Identifiez les 3 combinaisons prioritaires (5 étoiles) et justifiez',
          explanation: `**Top 3 combinaisons prioritaires (5 étoiles) :**

                       **🥇 Cybercriminels → Urgences vitales**
                       - **Pertinence** : 5/5 (maximale)
                       - **Logique** : Extorsion + Pression temporelle vitale
                       - **Précédents** : CHU Rouen, Düsseldorf, nombreux autres
                       - **Impact** : CRITIQUE (vies en jeu)
                       - **Scénario** : "Ransomware SIH Urgences"

                       **🥈 Initiés → Données patients**
                       - **Pertinence** : 5/5 (maximale)
                       - **Logique** : Accès privilégié + Contournement sécurités
                       - **Opportunité** : Surveillance interne faible
                       - **Impact** : CRITIQUE (RGPD + réputation)
                       - **Scénario** : "Abus privilèges administrateur"

                       **🥉 Espions → Recherche clinique**
                       - **Pertinence** : 5/5 (maximale)
                       - **Logique** : Propriété intellectuelle + Concurrence
                       - **Valeur** : Avantage R&D 10-15 ans
                       - **Impact** : MAJEUR (leadership scientifique)
                       - **Scénario** : "Exfiltration recherche clinique"

                       **Pourquoi ces 3 combinaisons sont prioritaires :**
                       - Alignement parfait motivation source ↔ valeur bien
                       - Capacités source adaptées au bien ciblé
                       - Opportunités réelles d'exploitation
                       - Impact significatif sur les missions CHU
                       - Précédents ou tendances confirmant la vraisemblance`,
          points: 35,
          expertInsight: 'Les combinaisons 5 étoiles révèlent les scénarios où l\'alignement source-bien est parfait.',
          anssiReference: 'EBIOS RM - Priorisation des scénarios stratégiques'
        }
      ],
      realWorldExample: `Exemple matrice réelle : Hôpital Universitaire de Düsseldorf (2020)
                        - Cybercriminels → Urgences = Réalisé (premier décès cyber)
                        - Initiés → Données = Fréquent (cas Anthem 2015)
                        - Espions → Recherche = Tendance (Lazarus vs laboratoires COVID)`,
      learningObjectives: [
        'Maîtriser l\'évaluation systématique des combinaisons',
        'Comprendre les logiques de pertinence par type de source',
        'Identifier les scénarios prioritaires selon la matrice',
        'Justifier les choix selon les motivations et capacités'
      ],
      anssiCompliance: [
        'EBIOS RM - Matrice de combinaisons',
        'Guide ANSSI - Priorisation des scénarios',
        'Méthodologie - Évaluation de la pertinence'
      ]
    };
  }

  // 🎯 EXERCICE 3 - ÉVALUATION VRAISEMBLANCE
  static getExercise3_LikelihoodAssessment(): StrategicScenarioExercise {
    return {
      id: 'sse_003_likelihood_assessment',
      title: 'Évaluation vraisemblance scénarios complexes',
      category: 'likelihood_assessment',
      difficulty: 'expert',
      duration: 30,
      description: 'Maîtrisez l\'évaluation rigoureuse de la vraisemblance selon les facteurs ANSSI',
      context: `Vous devez évaluer la vraisemblance de 3 scénarios stratégiques selon la méthodologie ANSSI.

                **Grille ANSSI (1-5) :**
                - 1 = Très faible (théorique, jamais observé)
                - 2 = Faible (possible mais peu probable)
                - 3 = Moyenne (plausible, quelques précédents)
                - 4 = Forte (probable, précédents nombreux)
                - 5 = Très forte (quasi-certain, tendance confirmée)

                **Facteurs d'évaluation :**
                - Motivation de la source (1-5)
                - Capacités techniques requises (1-5)
                - Opportunités disponibles (1-5)
                - Contraintes opérationnelles (1-5)`,
      questions: [
        {
          id: 'q1_ransomware_likelihood',
          type: 'likelihood_factors',
          question: 'Scénario 1 : "Ransomware SIH Urgences" - Évaluez chaque facteur (1-5)',
          context: 'Cybercriminel spécialisé santé → Urgences vitales + SIH → Arrêt urgences + Paralysie SI',
          explanation: `**Évaluation détaillée "Ransomware SIH Urgences" :**

                       **1. Motivation source : 5/5 (Très forte)**
                       - ROI maximal : Hôpitaux = cibles les plus rentables
                       - Pression temporelle : Vies en jeu = paiement rapide
                       - Capacité paiement : Budget CHU 450M€
                       - Spécialisation : Groupes dédiés santé (Conti Healthcare)
                       - Précédents : 1 hôpital/semaine attaqué en France

                       **2. Capacités techniques : 5/5 (Très élevées)**
                       - Groupes sophistiqués : Conti, LockBit, BlackCat
                       - Techniques adaptées : Évasion EDR médicaux
                       - Ransomware avancé : Chiffrement sélectif (épargne réa)
                       - Support 24h/24 : Négociateurs formés vocabulaire médical
                       - Infrastructure : C&C robuste, anonymisation

                       **3. Opportunités CHU : 5/5 (Très nombreuses)**
                       - Vulnérabilités : Pas de MFA (80% CHU), EDR absent
                       - Surface d'attaque : 3 sites interconnectés
                       - Personnel : Formation cybersécurité insuffisante
                       - Systèmes legacy : Patches manquants, Windows 7
                       - Interconnexions : Prestataires, télémédecine

                       **4. Contraintes : 4/5 (Faibles)**
                       - Éthique relative : Épargne réanimation mais chiffre SIH
                       - Risques géopolitiques : Limités (anonymat)
                       - Poursuites : Difficiles (juridictions multiples)
                       - Réputation : Impact limité (spécialisation)

                       **Score global : (5+5+5+4)/4 = 4.75 → 5/5 (Très forte)**

                       **Justification vraisemblance très forte :**
                       - Convergence de tous les facteurs favorables
                       - Spécialisation sectorielle confirmée
                       - Tendance 2023 : +300% attaques hôpitaux
                       - Précédents nombreux et récents`,
          points: 30,
          expertInsight: 'La vraisemblance très forte résulte de la spécialisation croissante des cybercriminels sur le secteur santé.',
          anssiReference: 'EBIOS RM - Grille d\'évaluation de la vraisemblance'
        },
        {
          id: 'q2_insider_likelihood',
          type: 'likelihood_factors',
          question: 'Scénario 2 : "Abus privilèges administrateur" - Évaluez la vraisemblance',
          context: 'Administrateur IT mécontent → Données patients + Systèmes → Fuite données + Paralysie partielle',
          explanation: `**Évaluation détaillée "Abus privilèges administrateur" :**

                       **1. Motivation source : 4/5 (Forte)**
                       - Stress professionnel : Secteur santé sous pression
                       - Licenciements : Restructurations CHU fréquentes
                       - Conflits hiérarchiques : Tensions IT vs médical
                       - Motivations diverses : Vengeance, corruption, chantage
                       - Opportunisme : Période de départ (golden hour)

                       **2. Capacités techniques : 4/5 (Variables mais privilégiées)**
                       - Accès administrateur : Contournement sécurités
                       - Connaissance intime : Architecture, vulnérabilités
                       - Outils légitimes : PowerShell, SQL, RDP
                       - Horaires privilégiés : Accès hors surveillance
                       - Légitimité : Actions non suspectes initialement

                       **3. Opportunités : 5/5 (Très nombreuses)**
                       - Surveillance interne : Faible ou inexistante
                       - Contrôles : Absence ségrégation des tâches
                       - Monitoring : Logs insuffisants ou non analysés
                       - DLP : Absent dans 70% des CHU
                       - Fenêtres temporelles : Nuits, week-ends, congés

                       **4. Contraintes : 3/5 (Modérées)**
                       - Détection : Possible si monitoring comportemental
                       - Traçabilité : Logs nominatifs des actions
                       - Sanctions : Pénales + civiles + professionnelles
                       - Réputation : Impact personnel et professionnel
                       - Preuves : Difficiles à effacer complètement

                       **Score global : (4+4+5+3)/4 = 4/5 (Forte)**

                       **Justification vraisemblance forte :**
                       - Stress professionnel élevé secteur santé
                       - Opportunités nombreuses (surveillance faible)
                       - Précédents : Cas Anthem (2015), nombreux autres
                       - Facilité d'exécution avec accès privilégié`,
          points: 25,
          expertInsight: 'Les initiés restent la menace la plus difficile à détecter malgré les contrôles.',
          anssiReference: 'ANSSI - Menaces internes et contrôles associés'
        },
        {
          id: 'q3_espionage_likelihood',
          type: 'likelihood_factors',
          question: 'Scénario 3 : "Exfiltration recherche clinique" - Analysez les facteurs limitants',
          context: 'Espion industriel pharmaceutique → Recherche clinique + Biobanque → Vol PI + Sabotage',
          explanation: `**Évaluation détaillée "Exfiltration recherche clinique" :**

                       **1. Motivation source : 4/5 (Forte)**
                       - Concurrence pharmaceutique : Marché 1000 milliards $
                       - Avantage R&D : Économie 10-15 ans développement
                       - Biobanque unique : Données génétiques françaises
                       - Essais cliniques : Résultats avant publication
                       - ROI espionnage : Très élevé (brevets, formules)

                       **2. Capacités techniques : 4/5 (Sophistiquées)**
                       - APT persistantes : Lazarus, APT1, Cozy Bear
                       - Techniques furtives : Living off the land
                       - Persistance longue : Campagnes 2-3 ans
                       - Ressources importantes : Budgets étatiques/industriels
                       - Spécialisation : Ciblage propriété intellectuelle

                       **3. Opportunités : 3/5 (Modérées)**
                       - Segmentation recherche : Souvent faible
                       - Accès externe : VPN, collaborations
                       - Personnel recherche : Moins sensibilisé cyber
                       - Systèmes spécialisés : LIMS, bases génétiques
                       - **MAIS** : Cibles spécialisées (pas tous CHU)

                       **4. Contraintes : 3/5 (Modérées)**
                       - Détection : Difficile (techniques furtives)
                       - Géopolitique : Tensions selon origine
                       - Juridique : Complexe (juridictions multiples)
                       - **MAIS** : Cibles spécifiques (recherche avancée)
                       - **MAIS** : Concurrence limitée (secteur de niche)

                       **Score global : (4+4+3+3)/4 = 3.5 → 3/5 (Moyenne)**

                       **Facteurs limitants :**
                       - Cibles spécialisées : Pas tous les CHU
                       - Recherche avancée : Seulement CHU universitaires
                       - Concurrence limitée : Secteur de niche
                       - Opportunités modérées : Segmentation variable

                       **Justification vraisemblance moyenne :**
                       - Motivation forte mais cibles spécialisées
                       - Capacités élevées mais contraintes géopolitiques
                       - Précédents : Lazarus vs laboratoires COVID
                       - Tendance confirmée mais échelle limitée`,
          points: 25,
          expertInsight: 'L\'espionnage industriel se concentre sur les CHU avec recherche avancée de pointe.',
          anssiReference: 'ANSSI - Menaces APT et espionnage économique'
        }
      ],
      realWorldExample: `Cas réels d'évaluation vraisemblance :
                        - Ransomware : CHU Rouen (2019) = Vraisemblance confirmée
                        - Initiés : Anthem (2015) = 78.8M dossiers par initié + APT
                        - Espionnage : Lazarus vs laboratoires COVID (2020-2021)`,
      learningObjectives: [
        'Maîtriser l\'évaluation multicritères de la vraisemblance',
        'Comprendre l\'impact des facteurs limitants',
        'Différencier les niveaux de vraisemblance selon ANSSI',
        'Justifier les scores par des éléments factuels'
      ],
      anssiCompliance: [
        'EBIOS RM - Évaluation de la vraisemblance',
        'Guide ANSSI - Facteurs d\'influence',
        'Méthodologie - Scoring multicritères'
      ]
    };
  }

  // 🎯 EXERCICE 4 - CARTOGRAPHIE DES RISQUES
  static getExercise4_RiskMapping(): StrategicScenarioExercise {
    return {
      id: 'sse_004_risk_mapping',
      title: 'Cartographie des risques CHU Métropolitain',
      category: 'risk_mapping',
      difficulty: 'expert',
      duration: 25,
      description: 'Créez la cartographie des risques et positionnez les scénarios selon vraisemblance et impact',
      context: `Vous devez positionner les scénarios stratégiques sur la matrice Vraisemblance × Impact.

                **Axes de la matrice :**
                - **X (Vraisemblance)** : 1-5 (Très faible → Très forte)
                - **Y (Impact)** : 1-4 (Mineur → Catastrophique)

                **Zones de risque :**
                - 🟢 ACCEPTABLE : Vraisemblance faible ET impact faible
                - 🟡 TOLÉRABLE : Combinaisons moyennes
                - 🔴 INACCEPTABLE : Vraisemblance forte ET/OU impact élevé`,
      questions: [
        {
          id: 'q1_risk_positioning',
          type: 'risk_positioning',
          question: 'Positionnez les 3 scénarios sur la matrice et déterminez les zones de risque',
          explanation: `**Cartographie des risques CHU Métropolitain :**

                       \`\`\`
                       IMPACT (1-4)
                         4 |     |     |  🔴 |  🔴 | Catastrophique
                           |     |     | ÉLEVÉ|CRITIQUE|
                         3 |     |  🟡 |  🔴 |  🔴 | Critique
                           |     |MODÉRÉ|ÉLEVÉ|CRITIQUE|
                         2 |  🟢 |  🟡 |  🟡 |  🔴 | Majeur
                           |FAIBLE|MODÉRÉ|MODÉRÉ|ÉLEVÉ|
                         1 |  🟢 |  🟢 |  🟡 |  🟡 | Mineur
                           |FAIBLE|FAIBLE|MODÉRÉ|MODÉRÉ|
                           +-----+-----+-----+-----+
                             1     2     3     4     5
                                     VRAISEMBLANCE (1-5)
                       \`\`\`

                       **Positionnement des scénarios :**

                       **🥇 Ransomware SIH Urgences : (V:5, I:4) = CRITIQUE**
                       - Vraisemblance : 5/5 (Très forte)
                       - Impact : 4/4 (Catastrophique)
                       - Zone : 🔴 INACCEPTABLE
                       - Action : Immédiate et prioritaire

                       **🥈 Abus privilèges administrateur : (V:4, I:3) = ÉLEVÉ**
                       - Vraisemblance : 4/5 (Forte)
                       - Impact : 3/4 (Critique)
                       - Zone : 🔴 INACCEPTABLE
                       - Action : Prioritaire

                       **🥉 Exfiltration recherche clinique : (V:3, I:3) = ÉLEVÉ**
                       - Vraisemblance : 3/5 (Moyenne)
                       - Impact : 3/4 (Critique)
                       - Zone : 🟡 TOLÉRABLE (limite ÉLEVÉ)
                       - Action : Surveillance renforcée

                       **Interprétation pour la direction :**
                       - 2 scénarios en zone CRITIQUE → Action immédiate
                       - 1 scénario en zone ÉLEVÉE → Surveillance
                       - Priorisation budgétaire : 60% + 25% + 15%
                       - Timeline : Ransomware (3 mois) → Abus (6 mois) → Espionnage (12 mois)`,
          points: 35,
          expertInsight: 'La cartographie guide la priorisation des investissements sécurité selon l\'acceptabilité du risque.',
          anssiReference: 'EBIOS RM - Cartographie des risques'
        },
        {
          id: 'q2_risk_appetite',
          type: 'risk_positioning',
          question: 'Définissez l\'appétence au risque du CHU et les seuils d\'acceptabilité',
          explanation: `**Appétence au risque CHU Métropolitain :**

                       **Contexte spécifique santé :**
                       - Vies humaines en jeu → Tolérance très faible
                       - Service public → Responsabilité sociétale
                       - Données ultra-sensibles → Exigences RGPD renforcées
                       - Continuité obligatoire → Impossibilité d'arrêter

                       **Seuils d'acceptabilité définis :**

                       **🔴 INACCEPTABLE (Action immédiate) :**
                       - Impact ≥ 3 (Critique/Catastrophique) ET Vraisemblance ≥ 3
                       - OU Impact = 4 (Catastrophique) quelle que soit vraisemblance
                       - OU Vraisemblance = 5 (Très forte) quel que soit impact

                       **🟡 TOLÉRABLE (Surveillance renforcée) :**
                       - Impact = 2 (Majeur) ET Vraisemblance ≥ 3
                       - OU Impact = 3 (Critique) ET Vraisemblance ≤ 2

                       **🟢 ACCEPTABLE (Surveillance normale) :**
                       - Impact ≤ 2 (Majeur) ET Vraisemblance ≤ 2

                       **Justification seuils CHU :**
                       - Vies humaines = Impact catastrophique inacceptable
                       - Données patients = Criticité RGPD
                       - Réputation = Confiance publique essentielle
                       - Continuité = Mission de service public

                       **Allocation budgétaire selon zones :**
                       - Zone CRITIQUE : 60-70% budget sécurité
                       - Zone ÉLEVÉE : 20-30% budget sécurité
                       - Zone MODÉRÉE : 5-15% budget sécurité
                       - Zone ACCEPTABLE : Surveillance uniquement`,
          points: 30,
          expertInsight: 'L\'appétence au risque en santé est très faible en raison de l\'impact vital potentiel.',
          anssiReference: 'ANSSI - Définition de l\'appétence au risque'
        }
      ],
      realWorldExample: `Cartographie réelle post-incident :
                        CHU de Düsseldorf (2020) : Ransomware → Premier décès cyber
                        → Révision appétence risque : Tolérance zéro impact vital`,
      learningObjectives: [
        'Maîtriser la construction de cartographies de risques',
        'Comprendre les zones d\'acceptabilité selon le contexte',
        'Définir l\'appétence au risque spécifique au secteur santé',
        'Guider la priorisation des investissements sécurité'
      ],
      anssiCompliance: [
        'EBIOS RM - Cartographie des risques',
        'ISO 27005 - Gestion des risques',
        'Guide ANSSI - Appétence au risque'
      ]
    };
  }

  // 🎯 EXERCICE 5 - JEU DE RÔLES SCÉNARIOS
  static getExercise5_RolePlaying(): StrategicScenarioExercise {
    return {
      id: 'sse_005_role_playing',
      title: 'Simulation construction scénarios en équipe',
      category: 'role_playing',
      difficulty: 'expert',
      duration: 40,
      description: 'Jeu de rôles collaboratif pour construire et valider des scénarios stratégiques',
      context: `Simulation d'un comité de pilotage EBIOS RM du CHU Métropolitain.
                Chaque participant endosse un rôle avec objectifs et contraintes spécifiques.

                **Mission collective :** Construire et valider 3 scénarios stratégiques consensus
                **Durée :** 40 minutes (10 min préparation + 25 min débat + 5 min synthèse)
                **Méthode :** Débat contradictoire puis vote pondéré`,
      questions: [
        {
          id: 'q1_role_simulation',
          type: 'role_simulation',
          question: 'Participez au jeu de rôles selon votre personnage assigné',
          roleplaySetup: {
            roles: [
              {
                name: 'RSSI CHU',
                description: 'Responsable Sécurité des Systèmes d\'Information',
                objectives: [
                  'Prioriser les scénarios selon le risque cyber',
                  'Défendre les investissements sécurité nécessaires',
                  'Assurer la conformité ANSSI et réglementaire',
                  'Sensibiliser aux menaces émergentes'
                ],
                constraints: [
                  'Budget sécurité limité (2% budget IT)',
                  'Résistance utilisateurs aux contraintes',
                  'Manque de personnel cyber qualifié',
                  'Pression direction pour ROI rapide'
                ]
              },
              {
                name: 'Directeur Médical',
                description: 'Responsable des activités médicales et soins',
                objectives: [
                  'Garantir la continuité des soins 24h/24',
                  'Préserver la qualité et sécurité patients',
                  'Minimiser l\'impact sur les équipes médicales',
                  'Maintenir la réputation médicale du CHU'
                ],
                constraints: [
                  'Impossibilité d\'arrêter les urgences',
                  'Personnel médical réticent aux changements IT',
                  'Pression temporelle (vies en jeu)',
                  'Responsabilité pénale en cas d\'incident'
                ]
              },
              {
                name: 'DSI (Directeur Systèmes Information)',
                description: 'Responsable de l\'infrastructure IT',
                objectives: [
                  'Assurer la disponibilité des systèmes',
                  'Optimiser les coûts d\'infrastructure',
                  'Gérer la dette technique (legacy)',
                  'Planifier les évolutions technologiques'
                ],
                constraints: [
                  'Systèmes legacy critiques (Windows 7)',
                  'Budget IT contraint (-5% par an)',
                  'Manque de compétences techniques',
                  'Pression pour digitalisation rapide'
                ]
              },
              {
                name: 'Directeur Général',
                description: 'Direction exécutive du CHU',
                objectives: [
                  'Optimiser la performance économique',
                  'Préserver la réputation institutionnelle',
                  'Assurer la conformité réglementaire',
                  'Gérer les relations avec les tutelles'
                ],
                constraints: [
                  'Équilibre budgétaire obligatoire',
                  'Pression politique et médiatique',
                  'Responsabilité pénale dirigeant',
                  'Arbitrages difficiles (soin vs sécurité)'
                ]
              },
              {
                name: 'Expert EBIOS RM',
                description: 'Consultant spécialisé méthodologie ANSSI',
                objectives: [
                  'Garantir la conformité méthodologique',
                  'Faciliter les débats et consensus',
                  'Apporter l\'expertise technique',
                  'Documenter les décisions'
                ],
                constraints: [
                  'Neutralité méthodologique',
                  'Respect des standards ANSSI',
                  'Gestion des conflits d\'intérêts',
                  'Pédagogie pour non-experts'
                ]
              }
            ],
            scenario: `Le CHU Métropolitain lance son analyse EBIOS RM. Les ateliers 1 et 2 sont terminés.
                      Vous devez maintenant construire les scénarios stratégiques prioritaires.

                      **Données disponibles :**
                      - 3 sources prioritaires identifiées
                      - 4 biens essentiels critiques
                      - Budget sécurité : 1.5M€ disponible
                      - Contrainte temps : Déploiement en 12 mois max

                      **Tensions à arbitrer :**
                      - Sécurité vs Facilité d'usage
                      - Investissement vs Fonctionnement
                      - Court terme vs Long terme
                      - Conformité vs Performance`,
            objectives: [
              'Construire 3 scénarios stratégiques consensus',
              'Prioriser selon vraisemblance et impact',
              'Allouer le budget 1.5M€ entre scénarios',
              'Définir un planning de déploiement réaliste'
            ],
            constraints: [
              'Chaque rôle doit défendre ses intérêts',
              'Décisions par consensus ou vote pondéré',
              'Respect de la méthodologie EBIOS RM',
              'Justification de tous les choix'
            ],
            duration: 40
          },
          explanation: `**Déroulement du jeu de rôles :**

                       **Phase 1 - Préparation (10 min) :**
                       - Chaque participant étudie son rôle
                       - Préparation des arguments selon objectifs/contraintes
                       - Identification des alliances possibles
                       - Stratégie de négociation

                       **Phase 2 - Débat (25 min) :**

                       **Tour 1 - Positions initiales (5 min) :**
                       - RSSI : "Priorisons le ransomware SIH (risque vital)"
                       - Directeur Médical : "Aucune interruption acceptable"
                       - DSI : "Budget insuffisant pour tout sécuriser"
                       - Directeur Général : "ROI et conformité obligatoires"
                       - Expert EBIOS : "Respectons la méthodologie ANSSI"

                       **Tour 2 - Négociations (15 min) :**
                       - Débat sur priorisation des scénarios
                       - Arbitrages budget vs sécurité
                       - Compromis sur planning déploiement
                       - Recherche de consensus

                       **Tour 3 - Décisions (5 min) :**
                       - Vote pondéré sur les 3 scénarios
                       - Allocation budgétaire finale
                       - Planning de déploiement validé

                       **Phase 3 - Synthèse (5 min) :**
                       - Documentation des décisions
                       - Justifications méthodologiques
                       - Plan d'action pour Atelier 4

                       **Résultats attendus :**
                       - 3 scénarios stratégiques validés
                       - Budget 1.5M€ réparti (ex: 60%/25%/15%)
                       - Planning 12 mois avec jalons
                       - Consensus documenté et justifié

                       **Apprentissages :**
                       - Gestion des parties prenantes
                       - Arbitrages sécurité vs contraintes
                       - Négociation et recherche de consensus
                       - Application pratique EBIOS RM`,
          points: 50,
          expertInsight: 'Le jeu de rôles révèle la complexité des arbitrages dans un contexte multi-contraintes réel.',
          anssiReference: 'EBIOS RM - Gouvernance et parties prenantes'
        }
      ],
      realWorldExample: `Retour d'expérience : CHU de Lyon (2022)
                        Comité EBIOS RM similaire → Consensus sur 3 scénarios prioritaires
                        Budget 2M€ réparti : Ransomware (70%), Initiés (20%), APT (10%)`,
      learningObjectives: [
        'Expérimenter la gouvernance EBIOS RM en situation réelle',
        'Comprendre les enjeux et contraintes de chaque partie prenante',
        'Maîtriser la négociation et recherche de consensus',
        'Appliquer la méthodologie dans un contexte multi-contraintes'
      ],
      anssiCompliance: [
        'EBIOS RM - Gouvernance et pilotage',
        'Guide ANSSI - Parties prenantes',
        'Méthodologie - Validation des scénarios'
      ]
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllStrategicScenariosExercises(): StrategicScenarioExercise[] {
    return [
      this.getExercise1_GuidedConstruction(),
      this.getExercise2_CombinationMatrix(),
      this.getExercise3_LikelihoodAssessment(),
      this.getExercise4_RiskMapping(),
      this.getExercise5_RolePlaying()
    ];
  }

  static getExercisesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'): StrategicScenarioExercise[] {
    return this.getAllStrategicScenariosExercises().filter(ex => ex.difficulty === difficulty);
  }

  static getExercisesByCategory(category: string): StrategicScenarioExercise[] {
    return this.getAllStrategicScenariosExercises().filter(ex => ex.category === category);
  }

  static getTotalDuration(): number {
    return this.getAllStrategicScenariosExercises().reduce((sum, ex) => sum + ex.duration, 0);
  }

  static getTotalPoints(): number {
    return this.getAllStrategicScenariosExercises().reduce((sum, ex) =>
      sum + ex.questions.reduce((qSum, q) => qSum + q.points, 0), 0
    );
  }

  static validateExerciseAnswer(exerciseId: string, questionId: string, userAnswer: any): ExerciseResult {
    const exercise = this.getAllStrategicScenariosExercises().find(ex => ex.id === exerciseId);
    if (!exercise) {
      throw new Error(`Exercise ${exerciseId} not found`);
    }

    const question = exercise.questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Question ${questionId} not found in exercise ${exerciseId}`);
    }

    let isCorrect = false;
    let pointsEarned = 0;
    let feedback = question.explanation;
    let improvementSuggestions: string[] = [];

    // Validation selon le type de question
    switch (question.type) {
      case 'scenario_construction':
        if (question.correctAnswers && Array.isArray(userAnswer)) {
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswer);
          isCorrect = correctSet.size === userSet.size &&
                     [...correctSet].every(x => userSet.has(x));
        } else if (question.correctAnswers && typeof userAnswer === 'number') {
          isCorrect = question.correctAnswers.includes(userAnswer);
        }
        break;

      case 'matrix_evaluation':
        // Validation complexe pour matrice - simplifié ici
        isCorrect = true; // À implémenter selon logique métier
        break;

      case 'likelihood_factors':
        // Validation des facteurs de vraisemblance
        isCorrect = true; // À implémenter selon logique métier
        break;

      default:
        isCorrect = true; // Validation par défaut
    }

    if (isCorrect) {
      pointsEarned = question.points;
    } else {
      pointsEarned = Math.floor(question.points * 0.3); // Points partiels
      improvementSuggestions = question.hints || [
        'Relisez la méthodologie EBIOS RM',
        'Analysez les exemples du monde réel',
        'Consultez les références ANSSI'
      ];
    }

    return {
      exerciseId,
      questionId,
      userAnswer,
      isCorrect,
      pointsEarned,
      feedback,
      improvementSuggestions
    };
  }
}

export default StrategicScenariosExercises;