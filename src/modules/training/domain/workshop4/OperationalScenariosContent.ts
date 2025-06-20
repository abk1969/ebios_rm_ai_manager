/**
 * 🎯 CONTENU DÉTAILLÉ ATELIER 4 - SCÉNARIOS OPÉRATIONNELS
 * Contenu spécialisé pour la transformation des scénarios stratégiques en modes opératoires techniques
 */

// 🎯 TYPES POUR LE CONTENU ATELIER 4
export interface OperationalScenarioStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'validation';
  duration: number;
  content: string;
  mitreMapping?: MitreTechnique[];
  iocs?: IOCIndicator[];
  exercises?: OperationalExercise[];
  completed: boolean;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  description: string;
  procedures: string[];
  detection: string[];
  mitigation: string[];
}

export interface IOCIndicator {
  type: 'file_hash' | 'ip_address' | 'domain' | 'registry' | 'process' | 'network' | 'behavioral';
  value: string;
  description: string;
  confidence: 'low' | 'medium' | 'high';
  context: string;
}

export interface OperationalExercise {
  id: string;
  question: string;
  type: 'technical_analysis' | 'mitre_mapping' | 'ioc_identification' | 'timeline_construction';
  options?: string[];
  correctAnswer?: any;
  explanation: string;
  points: number;
}

/**
 * 🎓 GÉNÉRATEUR DE CONTENU ATELIER 4
 */
export class OperationalScenariosContent {

  // 📚 ÉTAPE 1 - MÉTHODOLOGIE MODES OPÉRATOIRES
  static getStep1_Methodology(): OperationalScenarioStep {
    return {
      id: "w4-methodology",
      title: "1. Méthodologie modes opératoires",
      description: "Maîtrisez la méthodologie EBIOS RM pour décomposer les scénarios en modes opératoires techniques",
      type: "theory",
      duration: 25,
      content: `⚙️ **MÉTHODOLOGIE MODES OPÉRATOIRES EBIOS RM**

**📚 DÉFINITION OFFICIELLE ANSSI :**
Un mode opératoire décrit **COMMENT** une source de risque met en œuvre concrètement un scénario stratégique. Il détaille les **techniques**, **outils** et **procédures** utilisés pour atteindre l'objectif malveillant.

**🔄 TRANSFORMATION STRATÉGIQUE → OPÉRATIONNEL :**

**📊 NIVEAU STRATÉGIQUE (Atelier 3) :**
\`\`\`
Vision : MACRO - Vue d'ensemble
Focus : QUI attaque QUOI pour obtenir QUOI
Détail : Faible - Grandes lignes
Public : Direction, COMEX, RSSI
Objectif : Priorisation des risques

Exemple : "Un cybercriminel spécialisé santé compromet 
le SIH pour paralyser les urgences et extorquer une rançon"
\`\`\`

**⚙️ NIVEAU OPÉRATIONNEL (Atelier 4) :**
\`\`\`
Vision : MICRO - Détails techniques
Focus : COMMENT l'attaque se déroule concrètement
Détail : Élevé - Étapes précises
Public : Équipes techniques, SOC, CERT
Objectif : Mesures de protection concrètes

Exemple : "Phishing Dr.Martin → Backdoor Cobalt Strike 
→ Escalade CVE-2023-XXXX → Propagation VLAN → LockBit"
\`\`\`

**🎯 COMPOSANTS ESSENTIELS D'UN MODE OPÉRATOIRE :**

**1. 📋 PHASES D'ATTAQUE (Kill Chain)**
\`\`\`
Méthodologie : Cyber Kill Chain + MITRE ATT&CK

Phase 1 - Reconnaissance :
• Collecte d'informations (OSINT, ingénierie sociale)
• Identification des cibles et vulnérabilités
• Préparation de l'infrastructure d'attaque

Phase 2 - Accès initial :
• Exploitation des vulnérabilités identifiées
• Techniques d'intrusion (phishing, exploit, etc.)
• Établissement du premier point d'entrée

Phase 3 - Persistance :
• Installation de backdoors et implants
• Création de comptes fantômes
• Modification de la configuration système

Phase 4 - Escalade de privilèges :
• Exploitation de vulnérabilités locales
• Vol de credentials privilégiés
• Contournement des contrôles d'accès

Phase 5 - Mouvement latéral :
• Propagation dans le réseau interne
• Compromission d'autres systèmes
• Cartographie de l'infrastructure

Phase 6 - Collecte et exfiltration :
• Identification et collecte des données cibles
• Préparation pour l'exfiltration
• Transfert des données vers l'extérieur

Phase 7 - Impact :
• Exécution de l'objectif final
• Destruction, chiffrement, sabotage
• Maintien de l'accès pour persistance
\`\`\`

**2. 🛠️ TECHNIQUES MITRE ATT&CK**
\`\`\`
Framework : MITRE ATT&CK for Enterprise

Tactiques (14 catégories) :
• TA0001 - Initial Access
• TA0002 - Execution  
• TA0003 - Persistence
• TA0004 - Privilege Escalation
• TA0005 - Defense Evasion
• TA0006 - Credential Access
• TA0007 - Discovery
• TA0008 - Lateral Movement
• TA0009 - Collection
• TA0010 - Exfiltration
• TA0011 - Command and Control
• TA0040 - Impact

Techniques (200+ techniques détaillées) :
• T1566.001 - Spearphishing Attachment
• T1055 - Process Injection
• T1547.001 - Registry Run Keys
• T1068 - Exploitation for Privilege Escalation
• T1021.002 - SMB/Windows Admin Shares
• T1486 - Data Encrypted for Impact
\`\`\`

**3. 🔍 INDICATEURS DE COMPROMISSION (IOCs)**
\`\`\`
Types d'indicateurs :

IOCs Techniques :
• Hash de fichiers malveillants (MD5, SHA256)
• Adresses IP et domaines C&C
• URLs malveillantes et patterns
• Signatures réseau et protocoles

IOCs Comportementaux :
• Patterns d'accès anormaux
• Commandes système suspectes
• Trafic réseau inhabituel
• Modifications de configuration

IOCs Temporels :
• Accès hors horaires habituels
• Pics d'activité anormaux
• Séquences d'événements suspectes
• Durée d'exécution inhabituelle

IOCs Contextuels :
• Géolocalisation incohérente
• Comptes utilisés anormalement
• Privilèges élevés inattendus
• Ressources accédées inhabituellement
\`\`\`

**4. ⏱️ TIMELINE D'ATTAQUE**
\`\`\`
Métriques temporelles :

Dwell Time (Temps de résidence) :
• Temps entre intrusion et détection
• Moyenne industrie : 200+ jours
• Objectif CHU : < 24 heures

Breakout Time (Temps d'évasion) :
• Temps entre accès initial et mouvement latéral
• Moyenne observée : 1h 58min
• Seuil critique : < 4 heures

Time to Impact (Temps jusqu'impact) :
• Temps entre intrusion et objectif final
• Ransomware : 3-15 jours typiques
• Objectif détection : < 1 heure

MTTD (Mean Time To Detection) :
• Temps moyen de détection
• Objectif CHU : < 15 minutes

MTTR (Mean Time To Response) :
• Temps moyen de réponse
• Objectif CHU : < 30 minutes
\`\`\`

**🎯 MÉTHODOLOGIE DE DÉCOMPOSITION :**

**Étape 1 - Analyse du scénario stratégique :**
• Identifier la source, le bien et l'événement redouté
• Comprendre la motivation et les capacités
• Évaluer les contraintes et opportunités

**Étape 2 - Décomposition en phases :**
• Appliquer la Cyber Kill Chain
• Détailler chaque phase avec techniques précises
• Estimer les durées et difficultés

**Étape 3 - Mapping MITRE ATT&CK :**
• Associer chaque action à une technique MITRE
• Documenter les procédures spécifiques
• Identifier les mesures de détection

**Étape 4 - Identification des IOCs :**
• Lister les indicateurs par phase
• Classer par type et niveau de confiance
• Prioriser selon la criticité

**Étape 5 - Construction de la timeline :**
• Séquencer les actions dans le temps
• Identifier les points de détection possibles
• Estimer les fenêtres d'intervention

Cette méthodologie nous permet de décomposer précisément les scénarios stratégiques en modes opératoires techniques exploitables par les équipes de sécurité.`,
      completed: false
    };
  }

  // 🥇 ÉTAPE 2 - MODE OPÉRATOIRE RANSOMWARE SIH
  static getStep2_RansomwareMode(): OperationalScenarioStep {
    return {
      id: "w4-ransomware-mode",
      title: "2. Mode opératoire Ransomware SIH",
      description: "Décomposez le scénario 'Ransomware SIH Urgences' en mode opératoire technique détaillé",
      type: "exercise",
      duration: 45,
      content: `🥇 **MODE OPÉRATOIRE "RANSOMWARE SIH URGENCES" - ANALYSE TECHNIQUE DÉTAILLÉE**

**📋 CONTEXTE DU MODE OPÉRATOIRE :**
Transformation du scénario stratégique "Cybercriminel spécialisé santé → Urgences vitales + SIH → Arrêt urgences + Paralysie SI" en mode opératoire technique précis.

**⚙️ CARACTÉRISTIQUES TECHNIQUES :**
- **Complexité** : 9/10 (Très élevée)
- **Sophistication** : APT-level avec spécialisation santé
- **Durée totale** : 3-6 semaines (reconnaissance → impact)
- **Techniques MITRE** : 15 techniques mappées
- **Détection** : 8/10 (Très difficile sans EDR avancé)

**🎯 PHASE 1 - RECONNAISSANCE EXTERNE (2-4 SEMAINES)**

**Objectif :** Collecter un maximum d'informations sur le CHU pour préparer l'attaque

**Techniques MITRE ATT&CK :**
- **T1590** - Gather Victim Network Information
- **T1589** - Gather Victim Identity Information  
- **T1598** - Phishing for Information

**Activités détaillées :**
\`\`\`
1. OSINT (Open Source Intelligence) :
   • Site web CHU : Organigramme, services, personnel
   • LinkedIn : Profils médecins, administrateurs IT
   • Réseaux sociaux : Informations personnelles staff
   • Publications : Articles, conférences, recherches
   • Annuaires : Pages jaunes, registres professionnels

2. Reconnaissance technique :
   • Scan DNS : Sous-domaines, enregistrements MX
   • Scan ports externes : Services exposés (VPN, RDP, etc.)
   • Certificats SSL : Infrastructure, prestataires
   • Emails : Formats, conventions de nommage
   • Technologies : CMS, frameworks, versions

3. Ingénierie sociale passive :
   • Appels téléphoniques reconnaissance
   • Emails de phishing informatif
   • Surveillance physique (parking, entrées)
   • Identification des prestataires IT
   • Cartographie des relations externes

4. Infrastructure d'attaque :
   • Enregistrement domaines typosquatting
   • Certificats SSL légitimes
   • Serveurs C&C (Command & Control)
   • Proxies et redirecteurs
   • Comptes emails jetables
\`\`\`

**IOCs Phase 1 :**
- Requêtes DNS anormales vers domaines CHU
- Tentatives de connexion sur services exposés
- Emails de reconnaissance (phishing informatif)
- Enregistrements de domaines similaires au CHU

Cette décomposition technique détaillée permet aux équipes SOC/CERT de comprendre précisément comment l'attaque se déroule et quels indicateurs surveiller.`,
      mitreMapping: [
        {
          id: "T1590",
          name: "Gather Victim Network Information",
          tactic: "Reconnaissance",
          description: "Collecte d'informations sur l'infrastructure réseau de la victime",
          procedures: [
            "Scan DNS pour identifier sous-domaines",
            "Énumération des services exposés",
            "Identification des technologies utilisées"
          ],
          detection: [
            "Monitoring des requêtes DNS anormales",
            "Détection des scans de ports externes",
            "Analyse des logs de connexion"
          ],
          mitigation: [
            "Limitation de l'exposition des services",
            "Masquage des informations techniques",
            "Monitoring proactif des tentatives de reconnaissance"
          ]
        }
      ],
      iocs: [
        {
          type: "domain",
          value: "chu-metropolitain-urgences.com",
          description: "Domaine typosquatting utilisé pour phishing",
          confidence: "high",
          context: "Enregistré 2 semaines avant l'attaque"
        },
        {
          type: "ip_address",
          value: "185.220.101.42",
          description: "Serveur C&C utilisé pour la reconnaissance",
          confidence: "medium",
          context: "Multiples connexions depuis cette IP"
        }
      ],
      completed: false
    };
  }

  // 🥈 ÉTAPE 3 - MODE OPÉRATOIRE ABUS PRIVILÈGES
  static getStep3_InsiderMode(): OperationalScenarioStep {
    return {
      id: "w4-insider-mode",
      title: "3. Mode opératoire Abus privilèges",
      description: "Analysez les techniques d'abus de privilèges par un administrateur interne",
      type: "exercise",
      duration: 30,
      content: `🥈 **MODE OPÉRATOIRE "ABUS PRIVILÈGES ADMINISTRATEUR" - ANALYSE TECHNIQUE**

**📋 CONTEXTE DU MODE OPÉRATOIRE :**
Transformation du scénario "Administrateur IT mécontent → Données patients + Systèmes → Fuite données + Paralysie partielle"

**⚙️ CARACTÉRISTIQUES TECHNIQUES :**
- **Complexité** : 4/10 (Modérée)
- **Sophistication** : Utilisation d'outils légitimes
- **Durée** : Action immédiate possible
- **Techniques MITRE** : 8 techniques mappées
- **Détection** : 7/10 (Difficile - accès légitime)

**🎯 PHASE 1 - PRÉPARATION (PLANIFICATION)**

**Objectif :** Planifier l'action malveillante en exploitant la connaissance interne

**Techniques MITRE ATT&CK :**
- **T1078.002** - Valid Accounts: Domain Accounts
- **T1087.002** - Account Discovery: Domain Account

**Activités détaillées :**
\`\`\`
1. Identification fenêtres temporelles :
   • Horaires de surveillance réduite (nuits, week-ends)
   • Périodes de congés équipes sécurité
   • Maintenance programmée systèmes
   • Événements perturbateurs (urgences, crises)

2. Reconnaissance cibles internes :
   • Bases de données patients accessibles
   • Systèmes critiques administrés
   • Comptes privilégiés disponibles
   • Partages réseau sensibles

3. Préparation exfiltration :
   • Identification canaux sortants autorisés
   • Préparation supports amovibles
   • Configuration comptes cloud personnels
   • Test capacités de transfert

4. Motivation déclenchante :
   • Annonce de licenciement
   • Conflit hiérarchique majeur
   • Sanctions disciplinaires
   • Opportunisme financier
\`\`\`

**🎯 PHASE 2 - EXÉCUTION (ACTION DIRECTE)**

**Techniques MITRE ATT&CK :**
- **T1005** - Data from Local System
- **T1222** - File and Directory Permissions Modification
- **T1562.002** - Disable or Modify Tools: Disable Windows Event Logging

**Activités détaillées :**
\`\`\`
1. Accès direct bases données :
   • Connexion SQL Management Studio
   • Requêtes d'extraction massives
   • Export tables patients sensibles
   • Contournement restrictions applicatives

2. Contournement logs audit :
   • Désactivation temporaire logging
   • Modification niveaux de logs
   • Suppression traces d'activité
   • Utilisation comptes de service

3. Requêtes SQL anormales :
   • SELECT * FROM patients WHERE...
   • Export vers fichiers CSV/Excel
   • Requêtes hors périmètre habituel
   • Volumes de données inhabituels

4. Modification permissions :
   • Élévation privilèges temporaires
   • Accès dossiers restreints
   • Modification ACL fichiers
   • Création comptes fantômes
\`\`\`

**IOCs Phase 2 :**
- Connexions SQL hors horaires habituels
- Requêtes d'extraction volumineuses
- Désactivation temporaire des logs
- Accès à des ressources inhabituelles

L'analyse révèle que la menace interne reste l'une des plus difficiles à détecter malgré sa simplicité technique.`,
      mitreMapping: [
        {
          id: "T1078.002",
          name: "Valid Accounts: Domain Accounts",
          tactic: "Initial Access, Persistence, Privilege Escalation, Defense Evasion",
          description: "Utilisation de comptes de domaine valides pour l'accès",
          procedures: [
            "Utilisation des credentials administrateur légitimes",
            "Accès via comptes de service privilégiés",
            "Exploitation des droits d'administration"
          ],
          detection: [
            "Monitoring des connexions hors horaires",
            "Analyse des patterns d'accès utilisateur",
            "Détection d'activités anormales sur comptes privilégiés"
          ],
          mitigation: [
            "Principe du moindre privilège",
            "Rotation régulière des mots de passe",
            "Monitoring comportemental (UEBA)"
          ]
        }
      ],
      iocs: [
        {
          type: "behavioral",
          value: "SQL queries outside normal hours",
          description: "Requêtes SQL d'extraction massive hors horaires habituels",
          confidence: "high",
          context: "Administrateur connecté à 23h45 un dimanche"
        },
        {
          type: "process",
          value: "sqlcmd.exe -S server -Q \"SELECT * FROM patients\"",
          description: "Commande d'extraction directe base de données",
          confidence: "high",
          context: "Exécution depuis poste administrateur"
        }
      ],
      completed: false
    };
  }

  // 📊 ÉTAPE 4 - ÉVALUATION GRAVITÉ ANSSI
  static getStep4_GravityEvaluation(): OperationalScenarioStep {
    return {
      id: "w4-gravity-evaluation",
      title: "4. Évaluation gravité ANSSI",
      description: "Évaluez la gravité des modes opératoires selon la grille officielle ANSSI",
      type: "validation",
      duration: 20,
      content: `📊 **ÉVALUATION GRAVITÉ SELON GRILLE ANSSI**

**🎯 GRILLE DE GRAVITÉ ANSSI ADAPTÉE CHU :**

**CRITIQUE (4/4) - Impact vital immédiat :**
• Arrêt urgences vitales > 4h
• Décès patients liés à l'incident
• Paralysie SIH > 24h
• Fuite données > 100k patients

**MAJEUR (3/4) - Impact grave :**
• Perturbation urgences < 4h
• Retard soins non vitaux
• Paralysie services non critiques
• Fuite données < 100k patients

**MINEUR (2/4) - Impact modéré :**
• Ralentissement activités
• Gêne opérationnelle
• Services dégradés
• Fuite données < 1k patients

**NÉGLIGEABLE (1/4) - Impact faible :**
• Impact technique uniquement
• Pas d'impact patient
• Services maintenus
• Pas de fuite données

**📋 ÉVALUATION DES MODES OPÉRATOIRES :**

**🥇 Ransomware SIH Urgences : CRITIQUE (4/4)**
\`\`\`
Justification :
• Paralysie complète SIH > 24h
• Arrêt urgences vitales imminent
• Risque vital patients en cours de traitement
• Impact cascade sur tous les services
• Coût récupération : 5-15M€

Facteurs aggravants :
• Impossibilité de contournement manuel
• Pression temporelle vitale
• Médiatisation importante
• Responsabilité pénale dirigeants
\`\`\`

**🥈 Abus privilèges administrateur : MAJEUR (3/4)**
\`\`\`
Justification :
• Fuite données 50k patients
• Impact RGPD : amendes 4% CA
• Atteinte réputation CHU
• Perturbation services administratifs
• Coût récupération : 1-3M€

Facteurs limitants :
• Pas d'impact vital immédiat
• Services médicaux maintenus
• Possibilité de contournement
• Détection possible si monitoring
\`\`\`

Cette grille adaptée au contexte hospitalier permet une évaluation précise de la gravité selon l'impact sur les soins.`,
      completed: false
    };
  }

  // 🔍 ÉTAPE 5 - MESURES DE DÉTECTION
  static getStep5_DetectionMeasures(): OperationalScenarioStep {
    return {
      id: "w4-detection-measures",
      title: "5. Mesures de détection",
      description: "Identifiez les mesures de détection adaptées aux modes opératoires analysés",
      type: "validation",
      duration: 10,
      content: `🔍 **MESURES DE DÉTECTION ADAPTÉES**

**🎯 DÉTECTION RANSOMWARE SIH :**

**Mesures préventives :**
• EDR avancé avec détection comportementale
• SIEM avec règles spécialisées santé
• Monitoring chiffrement anormal
• Alertes sur désactivation sauvegardes

**Indicateurs de détection :**
• Processus PowerShell avec paramètres encodés
• Connexions HTTPS vers domaines suspects
• Modification massive de fichiers
• Désactivation services de sécurité

**🎯 DÉTECTION ABUS PRIVILÈGES :**

**Mesures préventives :**
• UEBA (User Entity Behavior Analytics)
• PAM (Privileged Access Management)
• Monitoring accès hors horaires
• DLP (Data Loss Prevention)

**Indicateurs de détection :**
• Requêtes SQL volumineuses hors horaires
• Accès à des ressources inhabituelles
• Désactivation temporaire des logs
• Transferts de données anormaux

Ces mesures permettent une détection précoce adaptée aux spécificités de chaque mode opératoire.`,
      completed: false
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllSteps(): OperationalScenarioStep[] {
    return [
      this.getStep1_Methodology(),
      this.getStep2_RansomwareMode(),
      this.getStep3_InsiderMode(),
      this.getStep4_GravityEvaluation(),
      this.getStep5_DetectionMeasures()
    ];
  }

  static getStepById(stepId: string): OperationalScenarioStep | undefined {
    return this.getAllSteps().find(step => step.id === stepId);
  }

  static getTotalDuration(): number {
    return this.getAllSteps().reduce((sum, step) => sum + step.duration, 0);
  }

  static getMitreMapping(): MitreTechnique[] {
    return this.getAllSteps()
      .filter(step => step.mitreMapping)
      .flatMap(step => step.mitreMapping || []);
  }

  static getAllIOCs(): IOCIndicator[] {
    return this.getAllSteps()
      .filter(step => step.iocs)
      .flatMap(step => step.iocs || []);
  }
}

export default OperationalScenariosContent;
