/**
 * 🎯 EXERCICES PRATIQUES MODES OPÉRATOIRES
 * Exercices spécialisés pour maîtriser l'analyse technique des modes opératoires
 */

// 🎯 TYPES POUR LES EXERCICES MODES OPÉRATOIRES
export interface OperationalModeExercise {
  id: string;
  title: string;
  category: 'technical_analysis' | 'mitre_mapping' | 'ioc_identification' | 'timeline_construction' | 'incident_simulation';
  difficulty: 'intermediate' | 'advanced' | 'expert';
  duration: number; // minutes
  description: string;
  context: string;
  questions: OperationalQuestion[];
  realWorldExample: string;
  learningObjectives: string[];
  anssiCompliance: string[];
}

export interface OperationalQuestion {
  id: string;
  type: 'technical_decomposition' | 'mitre_selection' | 'ioc_analysis' | 'timeline_ordering' | 'incident_response';
  question: string;
  context?: string;
  options?: string[];
  correctAnswers?: any;
  explanation: string;
  points: number;
  mitreMapping?: string[];
  iocExamples?: IOCExample[];
  timelineEvents?: TimelineEvent[];
  incidentScenario?: IncidentScenario;
  hints?: string[];
  expertInsight: string;
  anssiReference: string;
}

export interface IOCExample {
  type: 'file_hash' | 'ip_address' | 'domain' | 'registry' | 'process' | 'network' | 'behavioral';
  value: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  phase: string;
  detectionTool: string;
}

export interface TimelineEvent {
  timestamp: string;
  phase: string;
  technique: string;
  description: string;
  iocs: string[];
  detectionPossible: boolean;
}

export interface IncidentScenario {
  title: string;
  description: string;
  evidences: Evidence[];
  timeline: TimelineEvent[];
  expectedAnalysis: string[];
}

export interface Evidence {
  type: 'log' | 'file' | 'network' | 'memory' | 'registry';
  source: string;
  content: string;
  timestamp: string;
  relevance: 'high' | 'medium' | 'low';
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
 * 🎓 GÉNÉRATEUR D'EXERCICES MODES OPÉRATOIRES
 */
export class OperationalModesExercises {

  // 🎯 EXERCICE 1 - DÉCOMPOSITION TECHNIQUE RANSOMWARE
  static getExercise1_TechnicalDecomposition(): OperationalModeExercise {
    return {
      id: 'ome_001_technical_decomposition',
      title: 'Décomposition technique mode opératoire Ransomware',
      category: 'technical_analysis',
      difficulty: 'advanced',
      duration: 35,
      description: 'Analysez et décomposez techniquement le mode opératoire Ransomware SIH étape par étape',
      context: `Incident réel CHU Métropolitain - Analyse post-incident
                
                **Contexte :** Le CHU a subi une attaque ransomware sophistiquée. L'équipe CERT doit analyser 
                le mode opératoire pour comprendre comment l'attaque s'est déroulée techniquement.
                
                **Données disponibles :**
                - Logs SIEM sur 6 semaines
                - Images forensiques des postes compromis
                - Captures réseau des communications C&C
                - Témoignages équipes IT et médicales
                
                **Objectif :** Reconstituer le mode opératoire technique complet`,
      questions: [
        {
          id: 'q1_phase_identification',
          type: 'technical_decomposition',
          question: 'Identifiez les 7 phases principales du mode opératoire Ransomware selon la Cyber Kill Chain',
          context: `Analyse des logs sur 6 semaines révèle plusieurs activités suspectes :
                   - Semaine 1-3 : Scans DNS externes, tentatives de connexion
                   - Semaine 4 : Email de phishing reçu par Dr. Martin
                   - Semaine 5 : Activités internes anormales, propagation
                   - Semaine 6 : Chiffrement massif et message de rançon`,
          options: [
            'Reconnaissance → Weaponization → Delivery → Exploitation → Installation → Command & Control → Actions',
            'Scanning → Enumeration → Gaining Access → Escalation → Persistence → Covering Tracks → Impact',
            'Reconnaissance → Accès initial → Persistance → Escalade → Mouvement latéral → Collecte → Impact',
            'OSINT → Phishing → Backdoor → Privilege Escalation → Lateral Movement → Exfiltration → Encryption'
          ],
          correctAnswers: [2],
          explanation: `**Phases EBIOS RM adaptées Cyber Kill Chain :**
                       
                       **Phase 1 - Reconnaissance (Semaines 1-3) :**
                       • OSINT sur le CHU (site web, LinkedIn, publications)
                       • Reconnaissance technique (DNS, ports, certificats)
                       • Ingénierie sociale passive
                       • Préparation infrastructure d'attaque
                       
                       **Phase 2 - Accès initial (Semaine 4) :**
                       • Spear-phishing Dr. Martin avec pièce jointe malveillante
                       • Exploitation macro VBA + PowerShell
                       • Installation backdoor Cobalt Strike
                       
                       **Phase 3 - Persistance :**
                       • Modification registry Run keys
                       • Création tâches programmées
                       • Installation services Windows
                       
                       **Phase 4 - Escalade de privilèges :**
                       • Exploitation CVE Windows
                       • Kerberoasting pour obtenir hash
                       • Pass-the-hash vers comptes admin
                       
                       **Phase 5 - Mouvement latéral (Semaine 5) :**
                       • PsExec vers serveurs critiques
                       • WMI remote execution
                       • Propagation via partages SMB
                       
                       **Phase 6 - Collecte et préparation :**
                       • Énumération des données critiques
                       • Identification serveurs SIH
                       • Préparation du chiffrement sélectif
                       
                       **Phase 7 - Impact (Semaine 6) :**
                       • Désactivation des sauvegardes
                       • Chiffrement sélectif LockBit
                       • Message de rançon et négociation`,
          points: 25,
          mitreMapping: [
            'T1590 - Gather Victim Network Information',
            'T1566.001 - Spearphishing Attachment',
            'T1547.001 - Registry Run Keys',
            'T1068 - Exploitation for Privilege Escalation',
            'T1021.002 - SMB/Windows Admin Shares',
            'T1486 - Data Encrypted for Impact'
          ],
          expertInsight: 'La décomposition en phases permet d\'identifier les points de détection et les mesures préventives à chaque étape.',
          anssiReference: 'EBIOS RM - Modes opératoires techniques'
        },
        {
          id: 'q2_complexity_assessment',
          type: 'technical_decomposition',
          question: 'Évaluez la complexité technique de ce mode opératoire sur 10 et justifiez',
          context: `Éléments techniques identifiés :
                   - Infrastructure C&C professionnelle avec domaines légitimes
                   - Techniques d'évasion EDR (process injection, living off the land)
                   - Spear-phishing contextualisé secteur santé
                   - Chiffrement sélectif (épargne réanimation)
                   - Timeline d'attaque de 6 semaines`,
          options: [
            '6/10 - Complexité modérée avec outils standards',
            '8/10 - Complexité élevée avec techniques avancées',
            '9/10 - Complexité très élevée avec spécialisation secteur',
            '10/10 - Complexité maximale avec techniques inédites'
          ],
          correctAnswers: [2],
          explanation: `**Complexité 9/10 - Très élevée :**
                       
                       **Facteurs de complexité élevée :**
                       • **Spécialisation secteur** : Connaissance approfondie environnement hospitalier
                       • **Infrastructure professionnelle** : C&C robuste, domaines légitimes, certificats SSL
                       • **Techniques d'évasion** : Process injection, LOLBAS, anti-sandbox
                       • **Chiffrement sélectif** : Épargne réanimation (éthique relative)
                       • **Timeline longue** : 6 semaines de préparation minutieuse
                       
                       **Techniques APT-level :**
                       • Cobalt Strike (framework professionnel)
                       • Kerberoasting et Pass-the-hash
                       • Living off the Land Binaries (PowerShell, WMI)
                       • Reconnaissance OSINT approfondie
                       
                       **Spécialisation santé :**
                       • Connaissance systèmes hospitaliers (SIH, PACS)
                       • Timing adapté (éviter urgences vitales)
                       • Vocabulaire médical dans phishing
                       • Compréhension enjeux vitaux
                       
                       **Seul élément manquant pour 10/10 :**
                       • Pas de 0-day exploité
                       • Pas de techniques complètement inédites
                       
                       Cette complexité justifie des mesures de détection avancées (EDR comportemental, SIEM spécialisé).`,
          points: 20,
          expertInsight: 'La complexité technique détermine le niveau des mesures de protection nécessaires.',
          anssiReference: 'Guide ANSSI - Évaluation de la sophistication des attaques'
        }
      ],
      realWorldExample: `CHU de Rouen (2019) - Analyse technique post-incident
                        Mode opératoire Ryuk similaire : 6 semaines reconnaissance → 3 semaines impact
                        Complexité 8/10, coût récupération 10M€, 6000 postes chiffrés`,
      learningObjectives: [
        'Maîtriser la décomposition technique des modes opératoires',
        'Identifier les phases d\'attaque selon la Cyber Kill Chain',
        'Évaluer la complexité technique des attaques',
        'Comprendre les spécificités secteur santé'
      ],
      anssiCompliance: [
        'EBIOS RM - Modes opératoires techniques',
        'Guide ANSSI - Analyse d\'incidents',
        'Méthodologie - Décomposition des attaques'
      ]
    };
  }

  // 🛠️ EXERCICE 2 - MAPPING MITRE ATT&CK
  static getExercise2_MitreMapping(): OperationalModeExercise {
    return {
      id: 'ome_002_mitre_mapping',
      title: 'Mapping MITRE ATT&CK complet mode opératoire',
      category: 'mitre_mapping',
      difficulty: 'expert',
      duration: 40,
      description: 'Mappez systématiquement toutes les techniques MITRE ATT&CK du mode opératoire Ransomware',
      context: `Exercice de mapping MITRE ATT&CK pour l'équipe SOC du CHU
                
                **Objectif :** Créer le mapping MITRE ATT&CK complet du mode opératoire Ransomware 
                pour configurer les règles de détection SIEM et EDR.
                
                **Framework :** MITRE ATT&CK for Enterprise v13
                **Scope :** Techniques, sous-techniques et procédures
                **Livrable :** Matrice de mapping complète avec justifications`,
      questions: [
        {
          id: 'q1_reconnaissance_mapping',
          type: 'mitre_selection',
          question: 'Sélectionnez les techniques MITRE ATT&CK pour la phase de reconnaissance externe',
          context: `Phase de reconnaissance (2-4 semaines) :
                   • OSINT sur le CHU (site web, LinkedIn, publications scientifiques)
                   • Scan DNS pour identifier sous-domaines et services
                   • Reconnaissance des technologies utilisées
                   • Identification du personnel clé (médecins chefs)
                   • Surveillance passive des communications externes`,
          options: [
            'T1590 - Gather Victim Network Information',
            'T1589 - Gather Victim Identity Information',
            'T1598 - Phishing for Information',
            'T1595 - Active Scanning',
            'T1596 - Search Open Technical Databases',
            'T1597 - Search Closed Sources of Information',
            'T1591 - Gather Victim Org Information'
          ],
          correctAnswers: [0, 1, 2, 4, 6], // Indices des bonnes réponses
          explanation: `**Techniques MITRE ATT&CK - Phase Reconnaissance :**
                       
                       **T1590 - Gather Victim Network Information ✓**
                       • Scan DNS pour sous-domaines CHU
                       • Identification services exposés (VPN, RDP)
                       • Reconnaissance infrastructure réseau
                       
                       **T1589 - Gather Victim Identity Information ✓**
                       • Profils LinkedIn médecins et administrateurs
                       • Organigramme depuis site web CHU
                       • Identification personnel clé par service
                       
                       **T1598 - Phishing for Information ✓**
                       • Emails de reconnaissance (faux sondages)
                       • Appels téléphoniques d'ingénierie sociale
                       • Collecte d'informations via prétextes
                       
                       **T1596 - Search Open Technical Databases ✓**
                       • Recherche certificats SSL dans CT logs
                       • Consultation bases WHOIS
                       • Analyse DNS publiques (Shodan, Censys)
                       
                       **T1591 - Gather Victim Org Information ✓**
                       • Publications scientifiques du CHU
                       • Rapports d'activité publics
                       • Informations sur prestataires IT
                       
                       **Techniques NON applicables :**
                       • T1595 (Active Scanning) : Trop détectable en phase initiale
                       • T1597 (Closed Sources) : Pas d'accès sources fermées`,
          points: 30,
          mitreMapping: ['T1590', 'T1589', 'T1598', 'T1596', 'T1591'],
          expertInsight: 'Le mapping précis des techniques permet de configurer les règles de détection adaptées à chaque phase.',
          anssiReference: 'MITRE ATT&CK Framework - Tactics and Techniques'
        }
      ],
      realWorldExample: `Mapping MITRE ATT&CK - Incident Anthem (2015)
                        78.8M dossiers compromis : 15 techniques identifiées post-incident
                        Amélioration détection : +40% efficacité SOC après mapping`,
      learningObjectives: [
        'Maîtriser le framework MITRE ATT&CK',
        'Mapper systématiquement les techniques par phase',
        'Comprendre les procédures spécifiques par technique',
        'Configurer les règles de détection basées sur MITRE'
      ],
      anssiCompliance: [
        'MITRE ATT&CK Framework officiel',
        'Guide ANSSI - Détection des menaces',
        'Standards SOC - Règles de corrélation'
      ]
    };
  }

  // 🔍 EXERCICE 3 - IDENTIFICATION IOCs
  static getExercise3_IOCIdentification(): OperationalModeExercise {
    return {
      id: 'ome_003_ioc_identification',
      title: 'Identification et analyse des IOCs par phase',
      category: 'ioc_identification',
      difficulty: 'advanced',
      duration: 30,
      description: 'Identifiez et analysez les indicateurs de compromission pour chaque phase du mode opératoire',
      context: `Formation équipe SOC CHU - Identification des IOCs

                **Objectif :** Créer la base de signatures et règles de détection basées sur les IOCs
                identifiés dans le mode opératoire Ransomware.

                **Livrables :**
                - Liste IOCs par phase avec niveau de confiance
                - Règles SIEM correspondantes
                - Configuration EDR adaptée`,
      questions: [
        {
          id: 'q1_ioc_classification',
          type: 'ioc_analysis',
          question: 'Classifiez ces IOCs selon leur type et niveau de confiance',
          context: `IOCs extraits de l'analyse forensique :
                   1. chu-metropolitain-urgences.com
                   2. powershell.exe -EncodedCommand UwB0AGEAcgB0AC0AUwBsAGUAZQBwACAALQBzACAAMQAwAA==
                   3. 185.220.101.42:443
                   4. HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SecurityUpdate
                   5. Protocole_Etude_Cardiaque_2024.docm
                   6. Connexions SQL hors horaires (23h45 dimanche)`,
          iocExamples: [
            {
              type: 'domain',
              value: 'chu-metropolitain-urgences.com',
              description: 'Domaine typosquatting utilisé pour C&C',
              confidence: 'high',
              phase: 'Command & Control',
              detectionTool: 'DNS monitoring'
            },
            {
              type: 'process',
              value: 'powershell.exe -EncodedCommand',
              description: 'PowerShell avec commande encodée suspecte',
              confidence: 'high',
              phase: 'Execution',
              detectionTool: 'EDR process monitoring'
            },
            {
              type: 'ip_address',
              value: '185.220.101.42:443',
              description: 'Serveur C&C externe',
              confidence: 'medium',
              phase: 'Command & Control',
              detectionTool: 'Network monitoring'
            },
            {
              type: 'registry',
              value: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\SecurityUpdate',
              description: 'Clé de persistance malveillante',
              confidence: 'high',
              phase: 'Persistence',
              detectionTool: 'Registry monitoring'
            },
            {
              type: 'file',
              value: 'Protocole_Etude_Cardiaque_2024.docm',
              description: 'Document Office avec macro malveillante',
              confidence: 'high',
              phase: 'Initial Access',
              detectionTool: 'Email security gateway'
            },
            {
              type: 'behavioral',
              value: 'SQL queries outside normal hours',
              description: 'Requêtes base de données hors horaires',
              confidence: 'medium',
              phase: 'Collection',
              detectionTool: 'Database activity monitoring'
            }
          ],
          explanation: `**Classification des IOCs par type et confiance :**

                       **IOCs Haute confiance (High) :**
                       • **Domain** : chu-metropolitain-urgences.com
                         → Typosquatting évident, domaine malveillant confirmé
                       • **Process** : powershell.exe -EncodedCommand
                         → Pattern typique d'obfuscation malveillante
                       • **Registry** : Run key avec nom trompeur "SecurityUpdate"
                         → Technique de persistance classique
                       • **File** : Document .docm avec macro VBA
                         → Vecteur d'infection confirmé par analyse

                       **IOCs Confiance moyenne (Medium) :**
                       • **IP Address** : 185.220.101.42:443
                         → IP suspecte mais pourrait être légitime
                       • **Behavioral** : Requêtes SQL hors horaires
                         → Pourrait être activité légitime exceptionnelle

                       **Utilisation pour détection :**
                       • IOCs High → Alertes immédiates, blocage automatique
                       • IOCs Medium → Surveillance renforcée, corrélation

                       **Configuration outils :**
                       • DNS monitoring : Blocage domaines typosquatting
                       • EDR : Détection PowerShell encodé + Registry monitoring
                       • SIEM : Corrélation multi-IOCs pour réduire faux positifs`,
          points: 25,
          expertInsight: 'La classification précise des IOCs permet d\'optimiser les règles de détection et réduire les faux positifs.',
          anssiReference: 'Guide ANSSI - Indicateurs de compromission'
        }
      ],
      realWorldExample: `IOCs Ransomware WannaCry (2017) - NHS
                        Domaine kill-switch : iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com
                        Hash : db349b97c37d22f5ea1d1841e3c89eb4
                        Détection post-incident : 99% efficacité avec IOCs`,
      learningObjectives: [
        'Identifier les IOCs par phase d\'attaque',
        'Classifier les IOCs selon type et confiance',
        'Configurer les outils de détection basés sur IOCs',
        'Optimiser les règles pour réduire les faux positifs'
      ],
      anssiCompliance: [
        'Guide ANSSI - Indicateurs de compromission',
        'CERT-FR - Gestion des IOCs',
        'Standards SOC - Détection basée sur IOCs'
      ]
    };
  }

  // ⏱️ EXERCICE 4 - CONSTRUCTION TIMELINE
  static getExercise4_TimelineConstruction(): OperationalModeExercise {
    return {
      id: 'ome_004_timeline_construction',
      title: 'Construction timeline d\'attaque détaillée',
      category: 'timeline_construction',
      difficulty: 'expert',
      duration: 25,
      description: 'Construisez la timeline précise de l\'attaque avec fenêtres de détection',
      context: `Analyse forensique post-incident CHU

                **Mission :** Reconstituer la timeline complète de l'attaque pour :
                - Identifier les fenêtres de détection manquées
                - Optimiser les temps de réponse futurs
                - Documenter l'incident pour les assurances`,
      questions: [
        {
          id: 'q1_timeline_ordering',
          type: 'timeline_ordering',
          question: 'Ordonnez chronologiquement ces événements de l\'attaque',
          timelineEvents: [
            {
              timestamp: 'J-21 08:30',
              phase: 'Reconnaissance',
              technique: 'T1590',
              description: 'Premier scan DNS externe vers chu-metropolitain.fr',
              iocs: ['DNS queries from 185.220.101.42'],
              detectionPossible: true
            },
            {
              timestamp: 'J-14 14:15',
              phase: 'Reconnaissance',
              technique: 'T1589',
              description: 'Collecte profils LinkedIn équipe médicale',
              iocs: ['Unusual LinkedIn activity'],
              detectionPossible: false
            },
            {
              timestamp: 'J-7 09:45',
              phase: 'Initial Access',
              technique: 'T1566.001',
              description: 'Email spear-phishing envoyé à Dr.Martin',
              iocs: ['Protocole_Etude_Cardiaque_2024.docm'],
              detectionPossible: true
            },
            {
              timestamp: 'J-7 10:12',
              phase: 'Execution',
              technique: 'T1204.002',
              description: 'Dr.Martin ouvre la pièce jointe malveillante',
              iocs: ['winword.exe spawning powershell.exe'],
              detectionPossible: true
            },
            {
              timestamp: 'J-7 10:13',
              phase: 'Persistence',
              technique: 'T1547.001',
              description: 'Création clé registry pour persistance',
              iocs: ['Registry key: HKCU\\...\\Run\\SecurityUpdate'],
              detectionPossible: true
            },
            {
              timestamp: 'J-5 02:30',
              phase: 'Privilege Escalation',
              technique: 'T1068',
              description: 'Exploitation CVE-2023-21674 pour élévation',
              iocs: ['Unusual process privileges'],
              detectionPossible: true
            },
            {
              timestamp: 'J-3 23:45',
              phase: 'Lateral Movement',
              technique: 'T1021.002',
              description: 'Propagation vers serveur SIH via SMB',
              iocs: ['SMB connections to SIH-PROD-01'],
              detectionPossible: true
            },
            {
              timestamp: 'J-0 03:15',
              phase: 'Impact',
              technique: 'T1486',
              description: 'Début chiffrement LockBit des serveurs SIH',
              iocs: ['Mass file encryption', 'LockBit ransom note'],
              detectionPossible: true
            }
          ],
          explanation: `**Timeline d'attaque reconstituée (21 jours) :**

                       **Phase 1 - Reconnaissance (J-21 à J-8) :**
                       • J-21 08:30 : Premier scan DNS (Détectable ✓)
                       • J-14 14:15 : OSINT LinkedIn (Non détectable ✗)

                       **Phase 2 - Accès initial (J-7) :**
                       • J-7 09:45 : Spear-phishing envoyé (Détectable ✓)
                       • J-7 10:12 : Ouverture pièce jointe (Détectable ✓)
                       • J-7 10:13 : Persistance registry (Détectable ✓)

                       **Phase 3 - Escalade (J-5) :**
                       • J-5 02:30 : Exploitation CVE (Détectable ✓)

                       **Phase 4 - Mouvement latéral (J-3) :**
                       • J-3 23:45 : Propagation SMB (Détectable ✓)

                       **Phase 5 - Impact (J-0) :**
                       • J-0 03:15 : Chiffrement LockBit (Détectable ✓)

                       **Fenêtres de détection manquées :**
                       • 7 points de détection possibles sur 8
                       • Délai moyen de détection : 0 (non détecté)
                       • Temps de résidence : 21 jours (trop long)

                       **Améliorations nécessaires :**
                       • Monitoring DNS externe actif
                       • Détection PowerShell en temps réel
                       • Surveillance SMB inter-VLAN
                       • Alertes chiffrement anormal`,
          points: 30,
          expertInsight: 'La timeline précise révèle les fenêtres de détection manquées et guide l\'amélioration des capacités SOC.',
          anssiReference: 'Guide ANSSI - Analyse forensique et timeline'
        }
      ],
      realWorldExample: `Timeline Incident Maersk (NotPetya 2017)
                        J-0 10:30 : Infection initiale Ukraine
                        J-0 11:45 : Propagation globale (76 pays)
                        J-0 12:00 : Paralysie complète IT Maersk
                        Coût : 300M$ - Timeline critique pour assurances`,
      learningObjectives: [
        'Construire des timelines d\'attaque précises',
        'Identifier les fenêtres de détection',
        'Calculer les métriques temporelles (MTTD, MTTR)',
        'Optimiser les capacités de détection'
      ],
      anssiCompliance: [
        'Guide ANSSI - Analyse forensique',
        'CERT-FR - Gestion d\'incidents',
        'Standards SOC - Timeline reconstruction'
      ]
    };
  }

  // 🚨 EXERCICE 5 - SIMULATION D'INCIDENT
  static getExercise5_IncidentSimulation(): OperationalModeExercise {
    return {
      id: 'ome_005_incident_simulation',
      title: 'Simulation d\'analyse d\'incident en temps réel',
      category: 'incident_simulation',
      difficulty: 'expert',
      duration: 45,
      description: 'Analysez un incident en cours avec preuves forensiques réelles',
      context: `🚨 INCIDENT EN COURS - CHU MÉTROPOLITAIN

                **ALERTE SOC :** Activité suspecte détectée sur le réseau
                **STATUT :** Investigation en cours
                **URGENCE :** Critique (services vitaux potentiellement impactés)

                Vous êtes l'analyste SOC de garde. Analysez les preuves et déterminez
                la nature de l'incident et les actions à prendre.`,
      questions: [
        {
          id: 'q1_incident_analysis',
          type: 'incident_response',
          question: 'Analysez ces preuves forensiques et déterminez le type d\'incident',
          incidentScenario: {
            title: 'Incident CHU-2024-001 - Activité réseau anormale',
            description: 'Alertes multiples SIEM - Trafic réseau inhabituel détecté',
            evidences: [
              {
                type: 'log',
                source: 'SIEM - Firewall',
                content: '2024-01-15 03:42:17 DENY TCP 10.10.50.23:445 -> 10.10.60.15:445 [SMB]',
                timestamp: '2024-01-15 03:42:17',
                relevance: 'high'
              },
              {
                type: 'log',
                source: 'EDR - Endpoint',
                content: 'Process: powershell.exe -WindowStyle Hidden -EncodedCommand UwB0AGEAcgB0AC0AUwBsAGUAZQBwACAALQBzACAAMQAwAA==',
                timestamp: '2024-01-15 03:41:55',
                relevance: 'high'
              },
              {
                type: 'network',
                source: 'Network Monitor',
                content: 'DNS Query: chu-metropolitain-urgences.com -> 185.220.101.42',
                timestamp: '2024-01-15 03:41:30',
                relevance: 'high'
              },
              {
                type: 'file',
                source: 'Antivirus',
                content: 'Suspicious file detected: C:\\Users\\dr.martin\\AppData\\Local\\Temp\\update.exe',
                timestamp: '2024-01-15 03:41:45',
                relevance: 'medium'
              }
            ],
            timeline: [
              {
                timestamp: '03:41:30',
                phase: 'Command & Control',
                technique: 'T1071.001',
                description: 'Communication C&C via DNS',
                iocs: ['chu-metropolitain-urgences.com'],
                detectionPossible: true
              },
              {
                timestamp: '03:41:45',
                phase: 'Defense Evasion',
                technique: 'T1027',
                description: 'Fichier obfusqué détecté',
                iocs: ['update.exe'],
                detectionPossible: true
              },
              {
                timestamp: '03:41:55',
                phase: 'Execution',
                technique: 'T1059.001',
                description: 'PowerShell encodé exécuté',
                iocs: ['powershell.exe -EncodedCommand'],
                detectionPossible: true
              },
              {
                timestamp: '03:42:17',
                phase: 'Lateral Movement',
                technique: 'T1021.002',
                description: 'Tentative propagation SMB bloquée',
                iocs: ['SMB connection denied'],
                detectionPossible: true
              }
            ],
            expectedAnalysis: [
              'Incident de type Ransomware en cours',
              'Poste Dr.Martin compromis (patient zéro)',
              'Tentative de propagation vers serveurs bloquée',
              'Communication C&C active',
              'Actions immédiates requises'
            ]
          },
          explanation: `**Analyse d'incident - Ransomware actif :**

                       **🔍 Preuves analysées :**

                       **1. Communication C&C (03:41:30) :**
                       • DNS vers chu-metropolitain-urgences.com (typosquatting)
                       • Résolution vers 185.220.101.42 (IP suspecte)
                       • Technique : T1071.001 (Application Layer Protocol)

                       **2. Fichier malveillant (03:41:45) :**
                       • update.exe dans %TEMP% (nom générique suspect)
                       • Détection antivirus (signature inconnue)
                       • Technique : T1027 (Obfuscated Files)

                       **3. PowerShell encodé (03:41:55) :**
                       • Commande encodée Base64 (Start-Sleep -s 10)
                       • Exécution cachée (-WindowStyle Hidden)
                       • Technique : T1059.001 (PowerShell)

                       **4. Propagation bloquée (03:42:17) :**
                       • Tentative SMB 10.10.50.23 → 10.10.60.15
                       • Firewall a bloqué (DENY)
                       • Technique : T1021.002 (SMB/Windows Admin Shares)

                       **🚨 Conclusion :**
                       • **Type :** Ransomware en phase active
                       • **Patient zéro :** Poste Dr.Martin (10.10.50.23)
                       • **Statut :** Propagation tentée mais bloquée
                       • **Urgence :** Critique - Isolation immédiate requise

                       **⚡ Actions immédiates :**
                       1. Isoler poste Dr.Martin du réseau
                       2. Bloquer domaine chu-metropolitain-urgences.com
                       3. Analyser autres postes VLAN médical
                       4. Activer plan de réponse ransomware
                       5. Notifier équipe de crise`,
          points: 40,
          expertInsight: 'L\'analyse rapide et précise des preuves forensiques est cruciale pour contenir un incident en cours.',
          anssiReference: 'Guide ANSSI - Réponse aux incidents de sécurité'
        }
      ],
      realWorldExample: `Simulation incident - CHU Düsseldorf (2020)
                        Ransomware détecté en cours → Isolation en 15 minutes
                        Analyse forensique temps réel → Propagation stoppée
                        Résultat : Services vitaux préservés`,
      learningObjectives: [
        'Analyser des incidents en temps réel',
        'Interpréter les preuves forensiques',
        'Prendre des décisions rapides sous pression',
        'Appliquer les procédures de réponse d\'incident'
      ],
      anssiCompliance: [
        'Guide ANSSI - Réponse aux incidents',
        'CERT-FR - Gestion de crise cyber',
        'Standards SOC - Analyse forensique'
      ]
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllOperationalModesExercises(): OperationalModeExercise[] {
    return [
      this.getExercise1_TechnicalDecomposition(),
      this.getExercise2_MitreMapping(),
      this.getExercise3_IOCIdentification(),
      this.getExercise4_TimelineConstruction(),
      this.getExercise5_IncidentSimulation()
    ];
  }

  static getExercisesByDifficulty(difficulty: 'intermediate' | 'advanced' | 'expert'): OperationalModeExercise[] {
    return this.getAllOperationalModesExercises().filter(ex => ex.difficulty === difficulty);
  }

  static getExercisesByCategory(category: string): OperationalModeExercise[] {
    return this.getAllOperationalModesExercises().filter(ex => ex.category === category);
  }

  static getTotalDuration(): number {
    return this.getAllOperationalModesExercises().reduce((sum, ex) => sum + ex.duration, 0);
  }

  static getTotalPoints(): number {
    return this.getAllOperationalModesExercises().reduce((sum, ex) => 
      sum + ex.questions.reduce((qSum, q) => qSum + q.points, 0), 0
    );
  }

  static validateExerciseAnswer(exerciseId: string, questionId: string, userAnswer: any): ExerciseResult {
    const exercise = this.getAllOperationalModesExercises().find(ex => ex.id === exerciseId);
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
      case 'technical_decomposition':
        if (question.correctAnswers && Array.isArray(userAnswer)) {
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswer);
          isCorrect = correctSet.size === userSet.size && 
                     [...correctSet].every(x => userSet.has(x));
        } else if (question.correctAnswers && typeof userAnswer === 'number') {
          isCorrect = question.correctAnswers.includes(userAnswer);
        }
        break;

      case 'mitre_selection':
        if (question.correctAnswers && Array.isArray(userAnswer)) {
          const correctSet = new Set(question.correctAnswers);
          const userSet = new Set(userAnswer);
          // Score proportionnel pour sélections multiples
          const correctCount = [...userSet].filter(x => correctSet.has(x)).length;
          const incorrectCount = userSet.size - correctCount;
          const missedCount = correctSet.size - correctCount;
          
          if (correctCount === correctSet.size && incorrectCount === 0) {
            isCorrect = true;
          } else {
            // Score partiel basé sur la précision
            const precision = correctCount / (correctCount + incorrectCount || 1);
            const recall = correctCount / correctSet.size;
            pointsEarned = Math.floor(question.points * (precision + recall) / 2);
          }
        }
        break;

      default:
        isCorrect = true; // Validation par défaut pour autres types
    }

    if (isCorrect) {
      pointsEarned = question.points;
    } else if (pointsEarned === 0) {
      pointsEarned = Math.floor(question.points * 0.2); // Points minimum
      improvementSuggestions = question.hints || [
        'Relisez la méthodologie EBIOS RM',
        'Consultez le framework MITRE ATT&CK',
        'Analysez les cas réels d\'incidents',
        'Approfondissez les spécificités secteur santé'
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

export default OperationalModesExercises;
