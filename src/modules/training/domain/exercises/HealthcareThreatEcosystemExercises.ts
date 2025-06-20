/**
 * 🎯 EXERCICES PRATIQUES - ÉCOSYSTÈME DE MENACES SANTÉ
 * Exercices spécialisés pour l'Atelier 2 - Secteur hospitalier
 */

// 🎯 TYPES POUR LES EXERCICES
export interface HealthcareExercise {
  id: string;
  title: string;
  category: 'threat_landscape' | 'source_identification' | 'motivation_analysis' | 'capability_assessment' | 'case_study';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // minutes
  description: string;
  context: string;
  questions: ExerciseQuestion[];
  realWorldExample: string;
  learningObjectives: string[];
  anssiCompliance: string[];
}

export interface ExerciseQuestion {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'open_text' | 'scenario_analysis' | 'threat_modeling' | 'risk_matrix';
  question: string;
  context?: string;
  options?: string[];
  correctAnswers?: (string | number)[];
  explanation: string;
  points: number;
  hints?: string[];
  expertInsight?: string;
  anssiReference?: string;
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
 * 🏥 EXERCICES SPÉCIALISÉS ÉCOSYSTÈME MENACES SANTÉ
 */
export class HealthcareThreatEcosystemExercises {

  // 🌐 EXERCICE 1 - PAYSAGE DES MENACES SECTEUR SANTÉ
  static getExercise1_ThreatLandscape(): HealthcareExercise {
    return {
      id: 'hte_001_threat_landscape',
      title: 'Analyse du paysage des menaces secteur santé',
      category: 'threat_landscape',
      difficulty: 'intermediate',
      duration: 15,
      description: 'Analysez les spécificités du secteur santé qui en font une cible privilégiée des cyberattaquants',
      context: `Le CHU Métropolitain (3 sites, 3500 employés, 50 000 patients/an, budget 450M€)
                fait face à un écosystème de menaces spécifique au secteur hospitalier.
                Analysez pourquoi les hôpitaux sont particulièrement attractifs pour les cybercriminels.`,
      questions: [
        {
          id: 'q1_attractivity',
          type: 'multiple_select',
          question: 'Quels facteurs rendent le secteur santé particulièrement attractif pour les cyberattaquants ?',
          options: [
            'Criticité vitale des services (vies en jeu)',
            'Données ultra-sensibles (médicales, génétiques)',
            'Budgets IT limités (2-3% vs 8-12% autres secteurs)',
            'Systèmes legacy non patchables',
            'Personnel peu sensibilisé à la cybersécurité',
            'Interconnexions multiples (laboratoires, pharmacies)',
            'Tolérance zéro aux interruptions de service',
            'Capacité de paiement élevée (pression temporelle)'
          ],
          correctAnswers: [0, 1, 2, 3, 4, 5, 6, 7], // Toutes les réponses sont correctes
          explanation: `Tous ces facteurs contribuent à faire du secteur santé une cible privilégiée :
                       - La criticité vitale crée une pression temporelle énorme
                       - Les données médicales valent 250€/dossier sur le marché noir
                       - Les budgets IT limités réduisent les défenses
                       - Les systèmes legacy créent des vulnérabilités persistantes
                       - Le personnel médical n'est pas formé à la cybersécurité
                       - L'écosystème complexe multiplie les vecteurs d'attaque
                       - L'impossibilité d'arrêter les soins facilite l'extorsion`,
          points: 25,
          expertInsight: 'Le secteur santé cumule tous les facteurs de risque : criticité + vulnérabilités + valeur des données + capacité de paiement.',
          anssiReference: 'Guide ANSSI - Sécurité des systèmes d\'information de santé'
        },
        {
          id: 'q2_statistics',
          type: 'multiple_choice',
          question: 'Selon les statistiques 2023, quelle est la fréquence d\'attaques contre les hôpitaux en France ?',
          options: [
            '1 hôpital attaqué par mois',
            '1 hôpital attaqué par semaine',
            '1 hôpital attaqué par jour',
            '1 hôpital attaqué par trimestre'
          ],
          correctAnswers: [1],
          explanation: `En 2023, on observe environ 1 hôpital français attaqué par semaine, soit plus de 50 incidents majeurs par an.
                       Cette fréquence alarmante s'explique par l'attractivité du secteur et la professionnalisation des cybercriminels.
                       Le coût moyen d'un incident majeur est de 4,5M€ avec un temps de récupération de 6-12 mois.`,
          points: 15,
          hints: ['Pensez à l\'augmentation massive des attaques post-COVID'],
          expertInsight: 'Cette fréquence place la France parmi les pays les plus touchés en Europe pour le secteur santé.'
        },
        {
          id: 'q3_vulnerability_analysis',
          type: 'scenario_analysis',
          question: 'Analysez les vulnérabilités spécifiques du CHU Métropolitain qui facilitent les cyberattaques',
          context: `Le CHU dispose de :
                   - 3 sites interconnectés par VPN
                   - 500 équipements IoMT (Internet of Medical Things)
                   - Système d'information vieux de 8 ans
                   - Personnel travaillant 24h/24 en rotation
                   - Accès WiFi invités dans les chambres
                   - Maintenance externalisée des équipements médicaux`,
          explanation: `Vulnérabilités identifiées :
                       1. **Multi-sites** : Surface d'attaque étendue, difficultés de surveillance centralisée
                       2. **IoMT** : 500 équipements souvent non sécurisés, mots de passe par défaut
                       3. **SI legacy** : Systèmes obsolètes, vulnérabilités non corrigées
                       4. **Personnel 24h/24** : Fatigue, horaires décalés, surveillance réduite la nuit
                       5. **WiFi invités** : Vecteur d'attaque, segmentation insuffisante
                       6. **Maintenance externe** : Accès privilégié tiers, supply chain risk`,
          points: 30,
          expertInsight: 'La combinaison multi-sites + IoMT + legacy + maintenance externe crée un "parfait storm" de vulnérabilités.'
        }
      ],
      realWorldExample: `Cas réel : CHU de Rouen (2019) - Attaque Ryuk
                        - 6000 postes chiffrés en quelques heures
                        - Retour au papier pendant 3 semaines
                        - Coût estimé : 10M€
                        - Vecteur : Email de phishing sur un poste administratif`,
      learningObjectives: [
        'Comprendre les spécificités du secteur santé comme cible',
        'Identifier les vulnérabilités structurelles des hôpitaux',
        'Analyser l\'attractivité économique pour les cybercriminels',
        'Évaluer l\'impact de la criticité vitale sur la cybersécurité'
      ],
      anssiCompliance: [
        'Référentiel HDS (Hébergement Données de Santé)',
        'Guide ANSSI sécurité SI santé',
        'Doctrine ANSSI établissements de santé'
      ]
    };
  }

  // 🎯 EXERCICE 2 - IDENTIFICATION DES SOURCES SPÉCIALISÉES SANTÉ
  static getExercise2_HealthcareSpecificSources(): HealthcareExercise {
    return {
      id: 'hte_002_healthcare_sources',
      title: 'Sources de risques spécialisées secteur santé',
      category: 'source_identification',
      difficulty: 'advanced',
      duration: 20,
      description: 'Identifiez et analysez les sources de risques qui ciblent spécifiquement le secteur hospitalier',
      context: `Certaines sources de risques se spécialisent dans le secteur santé en raison de sa rentabilité.
                Analysez les groupes cybercriminels, espions et autres acteurs qui ciblent spécifiquement les hôpitaux.`,
      questions: [
        {
          id: 'q1_ransomware_groups',
          type: 'multiple_select',
          question: 'Quels groupes de ransomware se sont spécialisés dans le secteur santé ?',
          options: [
            'Conti (spécialisation hôpitaux depuis 2020)',
            'LockBit (ciblage préférentiel santé)',
            'BlackCat/ALPHV (techniques anti-forensique)',
            'Ryuk (précurseur attaques hôpitaux)',
            'Maze (double extorsion données patients)',
            'REvil/Sodinokibi (rançons record santé)',
            'DarkSide (évite généralement la santé)',
            'WannaCry (impact massif NHS 2017)'
          ],
          correctAnswers: [0, 1, 2, 3, 4, 5, 7], // DarkSide évitait la santé
          explanation: `Groupes spécialisés santé :
                       - **Conti** : Développement d'outils spécifiques hôpitaux, négociateurs formés au secteur
                       - **LockBit** : RaaS avec modules dédiés systèmes médicaux
                       - **BlackCat** : Techniques d'évasion adaptées aux EDR hospitaliers
                       - **Ryuk** : Pionnier des attaques hôpitaux (2018-2020)
                       - **Maze** : Inventeur double extorsion avec données patients
                       - **REvil** : Rançons record (40M$ Kaseya, impact hôpitaux)
                       - **WannaCry** : 300 000 postes NHS, révélateur vulnérabilités santé`,
          points: 25,
          expertInsight: 'La spécialisation secteur santé génère 3x plus de revenus que les attaques généralistes.',
          anssiReference: 'CERT-FR alertes ransomware secteur santé'
        },
        {
          id: 'q2_apt_healthcare',
          type: 'multiple_choice',
          question: 'Quel groupe APT s\'est illustré par l\'espionnage du secteur santé pendant la pandémie COVID-19 ?',
          options: [
            'APT1 (Comment Crew) - Chine',
            'Lazarus Group - Corée du Nord',
            'Fancy Bear (APT28) - Russie',
            'Cozy Bear (APT29) - Russie'
          ],
          correctAnswers: [1],
          explanation: `**Lazarus Group** (Corée du Nord) s'est particulièrement illustré pendant COVID-19 :
                       - Ciblage laboratoires développant vaccins (Pfizer, AstraZeneca)
                       - Vol de données recherche sur traitements
                       - Tentatives d'accès aux systèmes OMS
                       - Motivation : contournement sanctions + avantage géopolitique

                       Les autres groupes ont aussi ciblé la santé mais moins spécifiquement pendant COVID.`,
          points: 20,
          hints: ['Pensez aux motivations géopolitiques pendant la pandémie'],
          expertInsight: 'COVID-19 a transformé les données de santé en enjeu de souveraineté nationale.'
        },
        {
          id: 'q3_insider_healthcare',
          type: 'threat_modeling',
          question: 'Modélisez les profils d\'initiés malveillants spécifiques au secteur hospitalier',
          context: `Dans un CHU de 3500 employés, identifiez les profils d'initiés les plus dangereux :
                   - Personnel médical (médecins, infirmiers)
                   - Personnel technique (IT, biomédicaux)
                   - Personnel administratif
                   - Prestataires externes (maintenance, nettoyage)
                   - Intérimaires et stagiaires`,
          explanation: `**Profils d'initiés dangereux secteur santé :**

                       1. **Administrateur IT mécontent** (Risque CRITIQUE)
                          - Accès privilégié à tous les systèmes
                          - Capacité de désactiver les sécurités
                          - Connaissance intime de l'architecture
                          - Horaires décalés (nuits, week-ends)

                       2. **Médecin corrompu** (Risque ÉLEVÉ)
                          - Accès légitime aux données patients VIP
                          - Crédibilité et confiance établie
                          - Motivation financière (revente données)
                          - Difficile à suspecter

                       3. **Technicien biomédical** (Risque ÉLEVÉ)
                          - Accès physique aux équipements critiques
                          - Maintenance des systèmes de monitoring
                          - Possibilité de sabotage discret
                          - Prestataire externe = contrôle réduit

                       4. **Infirmier de nuit** (Risque MOYEN)
                          - Accès aux systèmes pendant surveillance réduite
                          - Stress professionnel élevé
                          - Rotation importante = instabilité
                          - Accès aux données patients sensibles`,
          points: 35,
          expertInsight: 'Le secteur santé cumule stress professionnel + accès privilégié + surveillance réduite = cocktail explosif pour les menaces internes.'
        }
      ],
      realWorldExample: `Cas réel : Anthem (2015) - Initié + APT
                        - 78,8 millions de dossiers patients volés
                        - Combinaison initié malveillant + groupe APT chinois
                        - Accès maintenu pendant 11 mois
                        - Coût total : 2,5 milliards de dollars`,
      learningObjectives: [
        'Identifier les groupes spécialisés dans le secteur santé',
        'Analyser les motivations spécifiques aux données médicales',
        'Comprendre les profils d\'initiés dangereux en milieu hospitalier',
        'Évaluer l\'évolution des menaces post-COVID'
      ],
      anssiCompliance: [
        'Analyse des menaces ANSSI secteur santé',
        'Bulletins d\'alerte CERT-FR ransomware',
        'Recommandations sécurité établissements de santé'
      ]
    };
  }

  // 🎯 EXERCICE 3 - ANALYSE DES MOTIVATIONS SECTEUR SANTÉ
  static getExercise3_HealthcareMotivations(): HealthcareExercise {
    return {
      id: 'hte_003_healthcare_motivations',
      title: 'Motivations spécifiques au secteur santé',
      category: 'motivation_analysis',
      difficulty: 'expert',
      duration: 25,
      description: 'Analysez en profondeur les motivations qui poussent les attaquants à cibler spécifiquement le secteur hospitalier',
      context: `Le secteur santé présente des motivations uniques pour les attaquants.
                Analysez pourquoi un cybercriminel préférera cibler un hôpital plutôt qu'une banque,
                et pourquoi les espions industriels s'intéressent aux données de recherche médicale.`,
      questions: [
        {
          id: 'q1_financial_motivation',
          type: 'scenario_analysis',
          question: 'Analysez pourquoi la motivation financière est particulièrement efficace contre les hôpitaux',
          context: `Scénario : Un groupe cybercriminel hésite entre cibler :
                   A) Une banque régionale (2000 employés, systèmes sécurisés, sauvegarde robuste)
                   B) Un CHU (3500 employés, systèmes legacy, criticité vitale)

                   Analysez les facteurs qui orientent vers le CHU.`,
          explanation: `**Pourquoi les cybercriminels préfèrent les hôpitaux :**

                       **1. Pression temporelle maximale**
                       - Vies en jeu = impossibilité d'attendre
                       - Banque peut fermer 2-3 jours, hôpital NON
                       - Négociation accélérée sous pression vitale

                       **2. Capacité de paiement prouvée**
                       - Budgets publics importants (450M€ CHU)
                       - Assurances cyber souvent souscrites
                       - Précédents de paiements (Düsseldorf, Rouen)

                       **3. Vulnérabilités structurelles**
                       - Systèmes legacy non patchables
                       - Budgets IT limités vs banques
                       - Personnel moins sensibilisé

                       **4. Impact médiatique**
                       - Publicité pour le groupe criminel
                       - Pression publique sur l'établissement
                       - Effet de terreur sur le secteur

                       **ROI cybercriminel : Hôpital = 5x plus rentable que banque**`,
          points: 30,
          expertInsight: 'La criticité vitale transforme une cyberattaque en prise d\'otages avec des vies humaines comme levier.'
        },
        {
          id: 'q2_data_value',
          type: 'risk_matrix',
          question: 'Établissez la matrice de valeur des données selon les motivations des attaquants',
          context: `Évaluez la valeur (1-10) de chaque type de données pour différents attaquants :
                   - Dossiers patients standards
                   - Données de personnalités (VIP)
                   - Données génétiques (biobanque)
                   - Données d'essais cliniques
                   - Images médicales (PACS)
                   - Données administratives`,
          explanation: `**Matrice de valeur des données santé :**

                       | Type de données | Cybercriminels | Espions industriels | États hostiles | Marché noir |
                       |-----------------|----------------|---------------------|----------------|-------------|
                       | Dossiers patients | 7/10 | 3/10 | 5/10 | 250€/dossier |
                       | Données VIP | 9/10 | 6/10 | 8/10 | 10 000€/dossier |
                       | Biobanque génétique | 6/10 | 9/10 | 7/10 | 1 000€/profil |
                       | Essais cliniques | 5/10 | 10/10 | 6/10 | 100 000€/étude |
                       | Images PACS | 4/10 | 2/10 | 3/10 | 50€/image |
                       | Données admin | 8/10 | 1/10 | 4/10 | 10€/dossier |

                       **Justifications :**
                       - **VIP** : Chantage, extorsion, valeur médiatique
                       - **Biobanque** : Recherche concurrentielle, brevets
                       - **Essais cliniques** : Propriété intellectuelle, avantage R&D
                       - **Admin** : Identités complètes pour fraude`,
          points: 35,
          expertInsight: 'Les données de santé sont 10x plus chères que les données financières sur le marché noir.'
        }
      ],
      realWorldExample: `Cas réel : Medibank (Australie, 2022)
                        - 9,7 millions de clients impactés
                        - Refus de payer la rançon de 15M$
                        - Publication données sensibles VIP
                        - Chantage individuel des patients
                        - Démonstration de la valeur des données santé`,
      learningObjectives: [
        'Comprendre la spécificité de la motivation financière en santé',
        'Analyser la valeur des différents types de données médicales',
        'Évaluer l\'impact de la criticité vitale sur les négociations',
        'Identifier les facteurs psychologiques de pression'
      ],
      anssiCompliance: [
        'RGPD - Données de santé catégorie spéciale',
        'Référentiel HDS sécurité données',
        'Guide ANSSI classification données sensibles'
      ]
    };
  }

  // 🎯 EXERCICE 4 - CAS PRATIQUE COMPLEXE CHU
  static getExercise4_CHUCaseStudy(): HealthcareExercise {
    return {
      id: 'hte_004_chu_case_study',
      title: 'Cas pratique : Cyberattaque du CHU Métropolitain',
      category: 'case_study',
      difficulty: 'expert',
      duration: 30,
      description: 'Analysez un scénario d\'attaque complexe contre le CHU et identifiez les sources de risques impliquées',
      context: `ALERTE CYBER - CHU MÉTROPOLITAIN

                **Chronologie des événements :**
                - **J-30** : Email de phishing ciblé reçu par Dr. Martin (chef de service cardiologie)
                - **J-28** : Compromission du poste du Dr. Martin, installation backdoor discrète
                - **J-15** : Reconnaissance réseau, identification serveurs critiques
                - **J-7** : Escalade de privilèges via vulnérabilité Windows non patchée
                - **J-3** : Propagation latérale vers serveurs SIH et PACS
                - **J-1** : Exfiltration de 15 000 dossiers patients VIP
                - **J-0** : Déploiement ransomware sur 2 800 postes, demande de rançon 3M€

                **Indices techniques :**
                - Malware utilisant certificats volés pour éviter détection
                - Communication C&C via DNS tunneling
                - Chiffrement avec clés uniques par poste
                - Message de rançon en français parfait avec références médicales précises
                - Épargne volontaire des systèmes de réanimation (éthique)`,
      questions: [
        {
          id: 'q1_source_identification',
          type: 'multiple_choice',
          question: 'Quel type de source de risque correspond le mieux à ce profil d\'attaque ?',
          options: [
            'Cybercriminel généraliste opportuniste',
            'Cybercriminel spécialisé secteur santé',
            'Groupe APT étatique',
            'Initié malveillant avec complicité externe',
            'Hacktiviste avec agenda politique'
          ],
          correctAnswers: [1],
          explanation: `**Cybercriminel spécialisé secteur santé** - Indices :
                       - Ciblage spécifique médecin (spear-phishing)
                       - Connaissance terminologie médicale (message rançon)
                       - Éthique professionnelle (épargne réanimation)
                       - Double extorsion (exfiltration + chiffrement)
                       - Montant rançon calibré pour hôpital (3M€)
                       - Techniques sophistiquées mais pas niveau étatique

                       Ce profil correspond aux groupes comme Conti ou LockBit spécialisés santé.`,
          points: 25,
          expertInsight: 'La spécialisation secteur santé se reconnaît à l\'adaptation des techniques et du discours au milieu médical.'
        },
        {
          id: 'q2_attack_chain_analysis',
          type: 'threat_modeling',
          question: 'Analysez la chaîne d\'attaque et identifiez les vulnérabilités exploitées du CHU',
          context: 'Décomposez l\'attaque en phases et identifiez à chaque étape les failles de sécurité du CHU qui ont été exploitées.',
          explanation: `**Analyse de la chaîne d'attaque :**

                       **Phase 1 - Accès initial (J-30)**
                       - Vulnérabilité : Formation anti-phishing insuffisante
                       - Exploitation : Spear-phishing ciblé Dr. Martin
                       - Faille CHU : Personnel médical non sensibilisé

                       **Phase 2 - Persistance (J-28)**
                       - Vulnérabilité : Absence d'EDR sur postes médicaux
                       - Exploitation : Backdoor indétectable
                       - Faille CHU : Surveillance endpoint insuffisante

                       **Phase 3 - Reconnaissance (J-15)**
                       - Vulnérabilité : Segmentation réseau faible
                       - Exploitation : Scan réseau depuis poste compromis
                       - Faille CHU : VLAN médical mal isolé

                       **Phase 4 - Escalade (J-7)**
                       - Vulnérabilité : Patch management défaillant
                       - Exploitation : CVE Windows non corrigée
                       - Faille CHU : Systèmes legacy non maintenus

                       **Phase 5 - Propagation (J-3)**
                       - Vulnérabilité : Comptes privilégiés partagés
                       - Exploitation : Mouvement latéral facilité
                       - Faille CHU : Gestion des identités insuffisante

                       **Phase 6 - Exfiltration (J-1)**
                       - Vulnérabilité : Absence de DLP
                       - Exploitation : Transfert 15k dossiers non détecté
                       - Faille CHU : Surveillance des flux de données inexistante

                       **Phase 7 - Impact (J-0)**
                       - Vulnérabilité : Sauvegardes accessibles
                       - Exploitation : Chiffrement + sauvegardes
                       - Faille CHU : Sauvegarde non isolée (air-gap)`,
          points: 40,
          expertInsight: 'Cette attaque exploite systématiquement les vulnérabilités typiques des hôpitaux : formation, EDR, segmentation, patch, DLP, sauvegarde.'
        },
        {
          id: 'q3_impact_assessment',
          type: 'scenario_analysis',
          question: 'Évaluez l\'impact de cette attaque sur les différents services du CHU',
          context: `Le CHU dispose de :
                   - Service urgences (50 lits)
                   - Réanimation (30 lits)
                   - Bloc opératoire (12 salles)
                   - Cardiologie (80 lits)
                   - Maternité (40 lits)
                   - Laboratoire central
                   - Pharmacie hospitalière
                   - Radiologie/Imagerie`,
          explanation: `**Impact par service :**

                       **🚨 CRITIQUE - Urgences**
                       - Impossibilité d'accéder aux antécédents patients
                       - Retour au papier = ralentissement 300%
                       - Risque vital pour patients complexes
                       - Transferts vers autres hôpitaux

                       **🚨 CRITIQUE - Réanimation**
                       - Systèmes épargnés mais SIH inaccessible
                       - Surveillance manuelle des constantes
                       - Impossibilité de consulter historiques
                       - Stress maximal équipes médicales

                       **🔴 MAJEUR - Bloc opératoire**
                       - Annulation interventions non vitales
                       - Imagerie pré-opératoire inaccessible
                       - Planification manuelle complexe
                       - Perte de productivité 70%

                       **🟠 IMPORTANT - Cardiologie**
                       - Service du Dr. Martin = épicentre
                       - ECG et monitoring perturbés
                       - Examens reportés massivement
                       - Impact psychologique équipes

                       **🟡 MODÉRÉ - Maternité**
                       - Dossiers grossesse inaccessibles
                       - Suivi prénatal perturbé
                       - Mais urgences vitales gérables

                       **🔴 MAJEUR - Laboratoire**
                       - Résultats analyses bloqués
                       - Retard diagnostics critiques
                       - Transmission manuelle résultats

                       **🟠 IMPORTANT - Pharmacie**
                       - Prescriptions électroniques bloquées
                       - Retour aux ordonnances papier
                       - Risques d'erreurs médicamenteuses

                       **🔴 MAJEUR - Radiologie**
                       - PACS compromis = imagerie inaccessible
                       - Diagnostics retardés
                       - Examens urgents sur systèmes de secours`,
          points: 35,
          expertInsight: 'L\'impact en cascade montre l\'interdépendance critique des systèmes hospitaliers et justifie les rançons élevées.'
        }
      ],
      realWorldExample: `Cas inspiré de : CHU de Düsseldorf (2020)
                        - Premier décès lié à une cyberattaque
                        - Patiente transférée vers autre hôpital
                        - Retard de traitement fatal
                        - Enquête pour homicide involontaire
                        - Révélateur de l'impact vital des cyberattaques`,
      learningObjectives: [
        'Analyser une attaque complexe multi-phases',
        'Identifier les vulnérabilités exploitées en cascade',
        'Évaluer l\'impact opérationnel par service',
        'Comprendre les enjeux vitaux des cyberattaques santé'
      ],
      anssiCompliance: [
        'Méthodologie EBIOS RM - Analyse d\'incident',
        'Guide ANSSI gestion de crise cyber',
        'Procédures CERT-FR notification incidents'
      ]
    };
  }

  // 🎯 EXERCICE 5 - ÉVALUATION CAPACITÉS SOURCES SANTÉ
  static getExercise5_CapabilityAssessment(): HealthcareExercise {
    return {
      id: 'hte_005_capability_assessment',
      title: 'Évaluation des capacités - Sources spécialisées santé',
      category: 'capability_assessment',
      difficulty: 'expert',
      duration: 20,
      description: 'Évaluez et comparez les capacités techniques des sources de risques spécialisées dans le secteur santé',
      context: `Analysez les capacités spécifiques développées par les sources de risques pour cibler efficacement le secteur hospitalier.
                Certaines techniques sont spécialement adaptées aux environnements médicaux.`,
      questions: [
        {
          id: 'q1_ransomware_capabilities',
          type: 'risk_matrix',
          question: 'Évaluez les capacités des groupes ransomware spécialisés santé (1-10)',
          context: `Évaluez pour chaque groupe :
                   - Conti Healthcare
                   - LockBit Medical
                   - BlackCat/ALPHV
                   - Ryuk Legacy

                   Critères : Techniques, Évasion, Négociation, Adaptation secteur`,
          explanation: `**Matrice des capacités ransomware santé :**

                       | Groupe | Techniques | Évasion | Négociation | Adaptation | Global |
                       |--------|------------|---------|-------------|------------|--------|
                       | **Conti Healthcare** | 9/10 | 8/10 | 10/10 | 10/10 | **9.25/10** |
                       | **LockBit Medical** | 10/10 | 9/10 | 8/10 | 9/10 | **9/10** |
                       | **BlackCat/ALPHV** | 10/10 | 10/10 | 7/10 | 8/10 | **8.75/10** |
                       | **Ryuk Legacy** | 7/10 | 6/10 | 9/10 | 9/10 | **7.75/10** |

                       **Justifications :**

                       **Conti Healthcare :**
                       - Négociateurs formés au vocabulaire médical
                       - Outils spécifiques systèmes hospitaliers
                       - Éthique professionnelle (épargne réanimation)
                       - Support 24h/24 pendant négociations

                       **LockBit Medical :**
                       - RaaS avec modules dédiés IoMT
                       - Techniques d'évasion anti-EDR hospitaliers
                       - Chiffrement optimisé gros volumes (PACS)
                       - Moins d'expertise négociation secteur

                       **BlackCat/ALPHV :**
                       - Techniques les plus sophistiquées (Rust)
                       - Évasion comportementale avancée
                       - Mais moins spécialisé secteur santé
                       - Négociation généraliste

                       **Ryuk Legacy :**
                       - Pionnier attaques hôpitaux (2018-2020)
                       - Expertise négociation acquise
                       - Techniques vieillissantes
                       - Adaptation secteur excellente`,
          points: 30,
          expertInsight: 'La spécialisation secteur santé devient un avantage concurrentiel majeur entre groupes ransomware.'
        },
        {
          id: 'q2_apt_healthcare_techniques',
          type: 'multiple_select',
          question: 'Quelles techniques spécifiques les groupes APT utilisent-ils contre le secteur santé ?',
          options: [
            'Compromission d\'équipements IoMT (pompes, moniteurs)',
            'Exploitation des protocoles DICOM (imagerie médicale)',
            'Ciblage des systèmes de gestion des laboratoires (LIMS)',
            'Infiltration des réseaux de télémédecine',
            'Manipulation des systèmes de dosage automatique',
            'Exploitation des API HL7 (échange données santé)',
            'Compromission des systèmes de stérilisation',
            'Attaques sur les réseaux de recherche clinique'
          ],
          correctAnswers: [0, 1, 2, 3, 5, 7], // Techniques réellement utilisées
          explanation: `**Techniques APT spécifiques santé :**

                       ✅ **IoMT (Internet of Medical Things)**
                       - Pompes à perfusion avec mots de passe par défaut
                       - Moniteurs patients connectés non sécurisés
                       - Vecteur d'entrée privilégié dans réseaux médicaux

                       ✅ **Protocoles DICOM**
                       - Standard imagerie médicale peu sécurisé
                       - Exploitation pour exfiltration images
                       - Injection de malware dans métadonnées

                       ✅ **Systèmes LIMS (Laboratory Information Management)**
                       - Gestion résultats analyses biologiques
                       - Cible privilégiée pour corruption données
                       - Accès aux données de recherche

                       ✅ **Télémédecine**
                       - Explosion post-COVID mal sécurisée
                       - Interception consultations à distance
                       - Compromission données patients

                       ✅ **API HL7 (Health Level 7)**
                       - Standard échange données santé
                       - Souvent non chiffrées ou mal authentifiées
                       - Interception flux de données patients

                       ✅ **Réseaux recherche clinique**
                       - Données d'essais cliniques précieuses
                       - Souvent moins sécurisés que production
                       - Cible privilégiée espionnage industriel

                       ❌ **Systèmes dosage/stérilisation**
                       - Rarement ciblés (risques vitaux)
                       - Techniques trop spécialisées
                       - Peu d'intérêt pour espionnage`,
          points: 25,
          expertInsight: 'Les APT exploitent les spécificités techniques du secteur santé que les défenses traditionnelles ne couvrent pas.'
        }
      ],
      realWorldExample: `Cas réel : Lazarus vs laboratoires COVID (2020-2021)
                        - Ciblage spécifique laboratoires développant vaccins
                        - Exploitation protocoles de recherche
                        - Techniques adaptées environnements scientifiques
                        - Vol de données sur traitements expérimentaux`,
      learningObjectives: [
        'Évaluer les capacités spécialisées secteur santé',
        'Comprendre l\'adaptation des techniques aux environnements médicaux',
        'Analyser la sophistication des groupes spécialisés',
        'Identifier les techniques émergentes IoMT et télémédecine'
      ],
      anssiCompliance: [
        'Référentiel capacités cyberattaquants ANSSI',
        'Guide sécurité objets connectés santé',
        'Recommandations télémédecine ANSSI'
      ]
    };
  }

  // 🎯 MÉTHODE POUR OBTENIR TOUS LES EXERCICES
  static getAllHealthcareExercises(): HealthcareExercise[] {
    return [
      this.getExercise1_ThreatLandscape(),
      this.getExercise2_HealthcareSpecificSources(),
      this.getExercise3_HealthcareMotivations(),
      this.getExercise4_CHUCaseStudy(),
      this.getExercise5_CapabilityAssessment()
    ];
  }

  // 🎯 ÉVALUATION DES RÉPONSES
  static evaluateAnswer(exerciseId: string, questionId: string, userAnswer: any): ExerciseResult {
    const exercises = this.getAllHealthcareExercises();
    const exercise = exercises.find(e => e.id === exerciseId);
    const question = exercise?.questions.find(q => q.id === questionId);

    if (!exercise || !question) {
      throw new Error(`Exercise ${exerciseId} or question ${questionId} not found`);
    }

    let isCorrect = false;
    let pointsEarned = 0;
    let feedback = '';
    let improvementSuggestions: string[] = [];

    // Logique d'évaluation selon le type de question
    switch (question.type) {
      case 'multiple_choice':
        isCorrect = question.correctAnswers?.includes(userAnswer) || false;
        pointsEarned = isCorrect ? question.points : 0;
        feedback = isCorrect ? 'Excellente réponse !' : 'Réponse incorrecte. ' + question.explanation;
        break;

      case 'multiple_select':
        const correctSet = new Set(question.correctAnswers);
        const userSet = new Set(userAnswer);
        const intersection = new Set([...correctSet].filter(x => userSet.has(x)));
        const accuracy = intersection.size / correctSet.size;

        isCorrect = accuracy >= 0.8; // 80% de bonnes réponses minimum
        pointsEarned = Math.round(question.points * accuracy);
        feedback = `Score: ${Math.round(accuracy * 100)}%. ${question.explanation}`;
        break;

      case 'open_text':
      case 'scenario_analysis':
      case 'threat_modeling':
      case 'risk_matrix':
        // Évaluation basique pour les questions ouvertes (à améliorer avec IA)
        const wordCount = userAnswer.toString().split(' ').length;
        isCorrect = wordCount >= 50; // Au moins 50 mots
        pointsEarned = isCorrect ? Math.round(question.points * 0.8) : Math.round(question.points * 0.3);
        feedback = `Réponse ${isCorrect ? 'détaillée' : 'trop courte'}. ${question.explanation}`;
        break;
    }

    // Suggestions d'amélioration
    if (!isCorrect) {
      improvementSuggestions = [
        'Relisez la section sur l\'écosystème de menaces santé',
        'Consultez les références ANSSI mentionnées',
        'Analysez les exemples concrets fournis'
      ];

      if (question.hints) {
        improvementSuggestions.push(...question.hints.map(hint => `Indice: ${hint}`));
      }
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

  // 🎯 CALCUL DU SCORE GLOBAL
  static calculateOverallScore(results: ExerciseResult[]): {
    totalPoints: number;
    maxPoints: number;
    percentage: number;
    level: string;
    feedback: string;
  } {
    const totalPoints = results.reduce((sum, result) => sum + result.pointsEarned, 0);
    const maxPoints = this.getAllHealthcareExercises()
      .flatMap(ex => ex.questions)
      .reduce((sum, q) => sum + q.points, 0);

    const percentage = Math.round((totalPoints / maxPoints) * 100);

    let level = '';
    let feedback = '';

    if (percentage >= 90) {
      level = 'Expert';
      feedback = 'Excellente maîtrise de l\'écosystème de menaces santé ! Vous êtes prêt pour les ateliers suivants.';
    } else if (percentage >= 75) {
      level = 'Avancé';
      feedback = 'Bonne compréhension des menaces santé. Quelques points à approfondir.';
    } else if (percentage >= 60) {
      level = 'Intermédiaire';
      feedback = 'Compréhension correcte mais des lacunes subsistent. Revoyez les concepts clés.';
    } else {
      level = 'Débutant';
      feedback = 'Compréhension insuffisante. Reprenez la formation depuis le début.';
    }

    return {
      totalPoints,
      maxPoints,
      percentage,
      level,
      feedback
    };
  }
}

export default HealthcareThreatEcosystemExercises;